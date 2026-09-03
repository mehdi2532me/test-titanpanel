"""Build client connection links (vless://, vmess://, trojan://, ss://) and
subscription payloads for a user."""
import base64
import json
from urllib.parse import quote

SS_METHODS = [
    "aes-128-gcm", "aes-256-gcm", "chacha20-ietf-poly1305", "2022-blake3-aes-128-gcm",
]


def _fragment_params(settings: dict) -> dict:
    """Extra ?params used by v2rayNG's fragment feature when enabled."""
    if not settings.get("fragment_enabled"):
        return {}
    return {
        "fp_len": settings.get("fragment_length", "10-30"),
        "fp_int": settings.get("fragment_interval", "10-20"),
    }


def _host_params(host: str, path: str, sni: str, fp: str, alpn: str, settings: dict) -> str:
    parts = [
        f"type={quote(settings.get('default_transport', 'ws'), safe='')}",
        f"host={quote(host, safe='')}",
        f"path={quote(path, safe='/')}",
        f"sni={quote(sni, safe='')}",
        f"fp={quote(fp, safe='')}",
    ]
    if alpn:
        parts.append(f"alpn={quote(alpn, safe=',/')}")
    for k, v in _fragment_params(settings).items():
        parts.append(f"{k}={quote(str(v), safe='')}")
    return "&".join(parts)


def build_vless_link(host: str, port: int, user: dict, settings: dict) -> str:
    uuid = user["uuid"]
    transport = user.get("transport") or settings.get("default_transport", "ws")
    security = user.get("security", "tls")
    fp = user.get("fingerprint") or settings.get("default_fingerprint", "chrome")
    alpn = user.get("alpn", settings.get("default_alpn", "http/1.1"))
    sni = settings.get("sni_override") or host

    if security == "reality":
        pk = quote(user.get("public_key", ""), safe="")
        sid = quote(user.get("short_id", ""), safe="")
        sx = quote(user.get("spider_x", "") or sni, safe="")
        return (
            f"vless://{uuid}@{host}:{port}?encryption=none&security=reality&"
            f"pbk={pk}&sid={sid}&sni={sni}&spx={sx}&fp={fp}&type=tcp&"
            f"headerType=none&flow=xtls-rprx-vision#{quote('TiTaN-' + user['name'] + '-VLESS-Reality')}"
        )

    # TLS or plain WebSocket/XHTTP/gRPC.
    common = f"vless://{uuid}@{host}:{port}?encryption=none"
    params = _host_params(host, _path_for("vless", transport), sni, fp, alpn, settings)
    if transport in ("ws", "xhttp", "grpc"):
        if transport == "grpc":
            # gRPC uses serviceName instead of path.
            params = (
                f"type=grpc&serviceName={quote(_grpc_service(user), safe='')}&"
                f"sni={quote(sni, safe='')}&fp={quote(fp, safe='')}"
            )
        sec = "tls" if security == "tls" else "none"
        return f"{common}&security={sec}&{params}#{quote('TiTaN-' + user['name'] + '-VLESS-' + transport.upper())}"
    # plain tcp
    return f"{common}&security=none&type=tcp&headerType=none#{quote('TiTaN-' + user['name'] + '-VLESS-TCP')}"


def build_vmess_link(host: str, port: int, user: dict, settings: dict) -> str:
    uuid = user["uuid"]
    transport = user.get("transport") or settings.get("default_transport", "ws")
    security = user.get("security", "tls")
    fp = user.get("fingerprint") or settings.get("default_fingerprint", "chrome")
    alpn = user.get("alpn", settings.get("default_alpn", "http/1.1"))
    sni = settings.get("sni_override") or host

    vm = {
        "v": "2",
        "ps": "TiTaN-" + user["name"] + "-VMess-" + transport.upper(),
        "add": host,
        "port": str(port),
        "id": uuid,
        "aid": "0",
        "scy": "auto",
        "net": transport if transport in ("ws", "grpc") else "tcp",
        "type": "none",
        "host": host,
        "path": _path_for("vmess", transport) if transport == "ws" else "",
        "tls": "tls" if security == "tls" else "none",
        "sni": sni,
        "alpn": alpn,
        "fp": fp,
    }
    if transport == "grpc":
        vm["path"] = _grpc_service(user)
    b64 = base64.b64encode(json.dumps(vm, separators=(",", ":")).encode()).decode()
    return "vmess://" + b64


def build_trojan_link(host: str, port: int, user: dict, settings: dict) -> str:
    password = user["uuid"]
    transport = user.get("transport") or settings.get("default_transport", "ws")
    sni = settings.get("sni_override") or host
    alpn = user.get("alpn", settings.get("default_alpn", "http/1.1"))
    fp = user.get("fingerprint") or settings.get("default_fingerprint", "chrome")

    if transport == "ws":
        return (
            f"trojan://{quote(password, safe='')}@{host}:{port}?"
            f"security=tls&type=ws&host={quote(host, safe='')}&path={quote('/tr-ws', safe='/')}"
            f"&sni={quote(sni, safe='')}&alpn={quote(alpn, safe=',/')}&fp={fp}#"
            f"{quote('TiTaN-' + user['name'] + '-Trojan-WS')}"
        )
    return (
        f"trojan://{quote(password, safe='')}@{host}:{port}?security=tls&type=tcp&"
        f"sni={quote(sni, safe='')}&fp={fp}#{quote('TiTaN-' + user['name'] + '-Trojan-TCP')}"
    )


def build_ss_link(host: str, port: int, user: dict, settings: dict) -> str:
    method = SS_METHODS[0]
    # Derive a stable 16-byte key from the uuid (works for aes-128-gcm).
    key = base64.urlsafe_b64encode(user["uuid"].encode()[:16]).decode().rstrip("=")
    raw = f"{method}:{key}"
    b64 = base64.urlsafe_b64encode(raw.encode()).decode().rstrip("=")
    return f"ss://{b64}@{host}:{port}#{quote('TiTaN-' + user['name'] + '-SS')}"


def build_links(host: str, port: int, user: dict, settings: dict) -> dict:
    """Return {"main": link, "all": [links], "info": [dummy status links]}."""
    out = {}
    if user["protocol"] == "vless":
        out["vless"] = build_vless_link(host, port, user, settings)
    elif user["protocol"] == "vmess":
        out["vmess"] = build_vmess_link(host, port, user, settings)
    elif user["protocol"] == "trojan":
        out["trojan"] = build_trojan_link(host, port, user, settings)
    elif user["protocol"] == "shadowsocks":
        out["shadowsocks"] = build_ss_link(host, port, user, settings)

    all_links = list(out.values())

    # Info "dummy" links so the client's remark shows live usage/expiry info.
    quota_gb = (user.get("quota_bytes") or 0) / (1024 ** 3)
    used_gb = ((user.get("used_up") or 0) + (user.get("used_down") or 0)) / (1024 ** 3)
    days_left = ""
    if user.get("expire_at"):
        days_left = f"{max(0, int((user['expire_at'] - __import__('time').time()) // 86400))}d"
    remark = f"TiTaN {user['name']} | {used_gb:.2f}/{quota_gb:g}GB | {days_left or '∞'}"
    dummy = (
        f"vless://00000000-0000-0000-0000-000000000001@127.0.0.1:10001?"
        f"encryption=none&security=none&type=tcp&headerType=none#{quote(remark)}"
    )
    info = [{"remark": remark, "link": dummy, "kind": "status"}]
    return {"main": all_links[0] if all_links else "", "all": all_links, "info": info}


def subscription_text(links: list[str]) -> str:
    return base64.b64encode("\n".join(links).encode()).decode()


def _path_for(protocol: str, transport: str) -> str:
    if transport == "ws":
        return {"vless": "/vl-ws", "vmess": "/vm-ws", "trojan": "/tr-ws"}.get(protocol, "/ws")
    if transport == "xhttp":
        return "/xhttp"
    return "/ws"


def _grpc_service(user: dict) -> str:
    return "titan"
