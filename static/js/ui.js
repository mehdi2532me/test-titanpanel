/* ============================================================
   TiTaN — UI core: icons, helpers, api, components, router, shell
   ============================================================ */
window.UI = (() => {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ---------------- icons (stroke = currentColor) ----------------
  const ICONS = {
    dashboard: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
    users: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.87"/></svg>',
    configs: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3"/><path d="M1 14h6M9 8h6M17 16h6"/></svg>',
    nodes: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/></svg>',
    subscriptions: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    reports: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/></svg>',
    settings: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    admins: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
    tools: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    logout: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>',
    search: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>',
    bell: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
    activity: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
    message: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    menu: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>',
    collapse: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    plus: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
    close: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    edit: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>',
    trash: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',
    refresh: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6"/></svg>',
    power: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><path d="M12 2v10"/></svg>',
    eye: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    copy: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    qr: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14h1M14 20h1M18 18h3"/></svg>',
    link: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    download: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
    upload: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>',
    globe: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    cpu: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/></svg>',
    shield: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    check: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    arrow: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
    wrench: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    server: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/></svg>',
    key: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.6 7.6a5.5 5.5 0 1 1-7.8 7.8 5.5 5.5 0 0 1 7.8-7.8zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
  };

  // ---------------- API ----------------
  async function api(path, opts = {}) {
    const r = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...opts });
    if (r.status === 401) { location.href = '/login'; throw new Error('unauthorized'); }
    return r;
  }
  async function apiJson(path, opts = {}) {
    const r = await api(path, opts);
    if (!r.ok) {
      let d = null;
      try { d = await r.json(); } catch (_) { /* ignore */ }
      throw new Error((d && d.detail) || ('HTTP ' + r.status));
    }
    return r.json();
  }

  // ---------------- toasts / modal / confirm ----------------
  function toast(msg, type = '') {
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.textContent = msg;
    $('#toasts').appendChild(el);
    setTimeout(() => el.remove(), 3400);
  }

  let modalEl = null;
  function modal(opts) {
    closeModal();
    const { title, body, foot, lg } = opts;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal ${lg ? 'lg' : ''}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
        <div class="m-head"><h3>${esc(title)}</h3><button class="icon-btn" data-close>${ICONS.close}</button></div>
        <div class="m-body">${body}</div>
        ${foot ? `<div class="m-foot">${foot}</div>` : ''}
      </div>`;
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('[data-close]')) closeModal();
    });
    overlay.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    document.body.appendChild(overlay);
    modalEl = overlay;
    const first = overlay.querySelector('input, select, textarea, button');
    if (first) setTimeout(() => first.focus(), 30);
    return {
      el: overlay,
      close: closeModal,
      query: (s) => overlay.querySelector(s),
      queryAll: (s) => Array.from(overlay.querySelectorAll(s)),
    };
  }
  function closeModal() {
    if (modalEl) { modalEl.remove(); modalEl = null; }
  }

  function confirmDlg(title, message) {
    return new Promise((resolve) => {
      const m = modal({
        title,
        body: `<p style="margin:0;color:var(--text-2)">${esc(message)}</p>`,
        foot: `<button class="btn" data-close>${I18N.t('cancel')}</button>
               <button class="btn danger" data-ok>${I18N.t('confirm')}</button>`,
      });
      m.query('[data-ok]').addEventListener('click', () => { closeModal(); resolve(true); });
      m.el.addEventListener('click', (e) => { if (e.target.dataset.close) resolve(false); });
    });
  }

  // ---------------- states ----------------
  function skeleton(h) {
    return `<div style="display:flex;flex-direction:column;gap:10px;padding:4px">
      ${Array.from({ length: h }).map((_, i) =>
        `<div class="skeleton" style="height:${46 - (i % 3) * 4}px"></div>`).join('')}</div>`;
  }
  function empty(icon, title, sub, actionHtml = '') {
    return `<div class="empty">
      <div class="big">${icon}</div>
      <div class="ttl">${esc(title)}</div>
      <div class="sub">${esc(sub)}</div>
      ${actionHtml ? `<div style="margin-top:14px">${actionHtml}</div>` : ''}
    </div>`;
  }

  // ---------------- formatters ----------------
  function fmtBytes(n) {
    n = Number(n || 0);
    if (n >= 1024 ** 4) return (n / 1024 ** 4).toFixed(2) + ' TB';
    if (n >= 1024 ** 3) return (n / 1024 ** 3).toFixed(2) + ' GB';
    if (n >= 1024 ** 2) return (n / 1024 ** 2).toFixed(1) + ' MB';
    if (n >= 1024) return (n / 1024).toFixed(1) + ' KB';
    return n + ' B';
  }
  function fmtDate(ts) {
    if (!ts) return '—';
    return new Date(ts * 1000).toLocaleDateString(I18N.lang === 'fa' ? 'fa-IR' : 'en-US');
  }
  function fmtDateTime(ts) {
    if (!ts) return '—';
    const d = new Date(ts * 1000);
    const date = d.toLocaleDateString(I18N.lang === 'fa' ? 'fa-IR' : 'en-US');
    const time = d.toLocaleTimeString(I18N.lang === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    return date + ' ' + time;
  }
  function fmtUptime(s) {
    s = Math.floor(s || 0);
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }
  function debounce(fn, ms) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); toast(I18N.t('copied'), 'ok'); }
    catch (_) { window.prompt(I18N.t('copy'), text); }
  }

  // ---------------- user status helpers ----------------
  function userStatusLabel(u) {
    const st = u.status || {};
    if (st.expired) return { text: I18N.t('expired'), cls: 'warn' };
    if (!u.enabled) return { text: I18N.t('inactive'), cls: 'bad' };
    if (st.live_enabled) return { text: I18N.t('enabled'), cls: 'ok' };
    return { text: I18N.t('disabled'), cls: 'bad' };
  }
  function usageBar(u) {
    const st = u.status || {};
    const quota = u.quota_bytes || 0;
    if (!quota) return '';
    const pct = clamp((st.used / quota) * 100, 0, 100);
    const cls = pct >= 100 ? 'bad' : pct >= 85 ? 'warn' : '';
    return `<div class="progress" style="margin-top:6px"><i class="${cls}" style="width:${pct}%"></i></div>`;
  }

  // ---------------- chart ----------------
  function drawChart(container, data, opts = {}) {
    // data: [{t, up, down}]; opts.colors {up, down}, opts.labels bool
    const wrap = typeof container === 'string' ? document.querySelector(container) : container;
    if (!wrap) return;
    wrap._chartData = data;
    wrap._chartOpts = opts || {};
    wrap.innerHTML = '';
    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas);
    const tip = document.createElement('div');
    tip.className = 'chart-tip';
    wrap.appendChild(tip);

    const dpr = window.devicePixelRatio || 1;
    const W = wrap.clientWidth, H = wrap.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const P = 8, PB = 26;
    const max = Math.max(1, ...data.map(h => Math.max(h.up || 0, h.down || 0)));
    const colUp = (opts.colors && opts.colors.up) || '#a855f7';
    const colDown = (opts.colors && opts.colors.down) || '#38bdf8';
    const css = getComputedStyle(document.documentElement);
    const gridCol = css.getPropertyValue('--border').trim() || 'rgba(158,130,255,0.13)';
    const textCol = css.getPropertyValue('--text-3').trim() || '#6f6794';

    ctx.clearRect(0, 0, W, H);

    const stepX = data.length > 1 ? (W - P * 2) / (data.length - 1) : 0;
    const plotH = H - P - PB;

    // grid lines
    ctx.strokeStyle = gridCol; ctx.lineWidth = 1;
    ctx.fillStyle = textCol; ctx.font = '10px Vazirmatn';
    for (let i = 0; i <= 3; i++) {
      const y = P + (plotH * i) / 3;
      ctx.beginPath(); ctx.moveTo(P, y); ctx.lineTo(W - P, y); ctx.stroke();
      ctx.fillText(fmtBytes(max * (1 - i / 3)), 2, y - 3);
    }

    const xAt = (i) => P + i * stepX;
    const yAt = (v) => P + plotH - (v / max) * plotH;

    const series = (key, color) => {
      ctx.strokeStyle = color; ctx.lineWidth = 2;
      ctx.beginPath();
      data.forEach((h, i) => { i === 0 ? ctx.moveTo(xAt(i), yAt(h[key] || 0)) : ctx.lineTo(xAt(i), yAt(h[key] || 0)); });
      ctx.stroke();
      ctx.lineTo(xAt(data.length - 1), H - PB);
      ctx.lineTo(P, H - PB);
      ctx.closePath();
      ctx.fillStyle = color + '26';
      ctx.fill();
    };
    series('down', colDown);
    series('up', colUp);

    // x labels (first / middle / last)
    if (data.length) {
      const idxs = [0, Math.floor((data.length - 1) / 2), data.length - 1];
      const shown = new Set();
      idxs.forEach(i => {
        if (shown.has(i) || i >= data.length) return;
        shown.add(i);
        const d = new Date(data[i].t * 1000);
        let lbl;
        if (opts.daily) lbl = d.toLocaleDateString(I18N.lang === 'fa' ? 'fa-IR' : 'en-US', { month: 'short', day: 'numeric' });
        else lbl = d.toLocaleTimeString(I18N.lang === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
        ctx.fillText(lbl, xAt(i) - 14, H - 8);
      });
    }

    // tooltip
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const i = Math.round((x - P) / stepX);
      if (i < 0 || i >= data.length) { tip.style.display = 'none'; return; }
      const h = data[i];
      const d = new Date(h.t * 1000);
      const label = opts.daily
        ? d.toLocaleDateString(I18N.lang === 'fa' ? 'fa-IR' : 'en-US', { weekday: 'long', day: 'numeric' })
        : d.toLocaleTimeString(I18N.lang === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
      tip.innerHTML =
        `<b>${label}</b><br>` +
        `<span style="color:${colUp}">▲ ${I18N.t('chart_upload')}: ${fmtBytes(h.up || 0)}</span><br>` +
        `<span style="color:${colDown}">▼ ${I18N.t('chart_download')}: ${fmtBytes(h.down || 0)}</span>`;
      tip.style.display = 'block';
      const tx = clamp(xAt(i) + 12, 0, W - 170);
      const ty = clamp(e.clientY - rect.top - 40, 0, H - 90);
      tip.style.left = tx + 'px';
      tip.style.top = ty + 'px';
    };
    canvas.onmousemove = onMove;
    canvas.onmouseleave = () => { tip.style.display = 'none'; };
  }

  // ---------------- router & shell ----------------
  const ROUTES = {
    dashboard: { title: 'nav_dashboard' },
    users: { title: 'nav_users' },
    configs: { title: 'nav_configs' },
    nodes: { title: 'nav_nodes' },
    subscriptions: { title: 'nav_subscriptions' },
    reports: { title: 'nav_reports' },
    settings: { title: 'nav_settings' },
    admins: { title: 'nav_admins' },
    tools: { title: 'nav_tools' },
  };

  let currentRoute = 'dashboard';
  let pages = {}; // populated by pages.js

  function route() {
    const h = location.hash.replace(/^#\/?/, '');
    currentRoute = ROUTES[h] ? h : 'dashboard';
  }

  function renderSidebar() {
    const nav = $('#sidebarNav');
    if (!nav) return;
    const group1 = ['dashboard', 'users', 'configs', 'nodes', 'subscriptions', 'reports'];
    const group2 = ['settings', 'admins', 'tools'];
    const item = (r) => `
      <a class="nav-item ${currentRoute === r ? 'active' : ''}" href="#/${r}" data-route="${r}">
        ${ICONS[r]}<span data-i18n="nav_${r}"></span>
      </a>`;
    nav.innerHTML = `
      <div class="nav-label" data-i18n="nav_section_main"></div>
      ${group1.map(item).join('')}
      <div class="nav-label" data-i18n="nav_section_manage"></div>
      ${group2.map(item).join('')}`;
    // logout item
    const foot = $('#sidebarFoot');
    foot.innerHTML = `
      <a class="nav-item logout-item" id="logoutLink" href="#">
        ${ICONS.logout}<span data-i18n="logout"></span>
      </a>`;
    $('#logoutLink').addEventListener('click', async (e) => {
      e.preventDefault();
      try { await apiJson('/api/logout', { method: 'POST' }); } catch (_) { /* noop */ }
      location.href = '/login';
    });
  }

  function renderTopbar(me) {
    const search = $('#globalSearch');
    search.setAttribute('placeholder', I18N.t('search_placeholder'));
    $('#adminName').textContent = me.username || I18N.t('admin');
    $('#adminRole').textContent = I18N.t('role_super');
    const initial = (me.username || 'A').charAt(0).toUpperCase();
    $('#adminAvatar').textContent = initial;
  }

  async function render() {
    route();
    renderSidebar();
    const page = pages[currentRoute];
    const view = $('#view');
    view.innerHTML = '';
    if (page) {
      try { await page(view); } catch (err) {
        view.innerHTML = empty('⚠️', I18N.t('error'), err.message || '');
      }
    }
    I18N.apply();
    document.title = 'TiTaN — ' + I18N.t(ROUTES[currentRoute].title);
  }

  function boot() {
    // shell is in dashboard.html already; wire events
    $('#menuBtn').addEventListener('click', () => document.querySelector('.app-shell').classList.toggle('nav-open'));
    $('#collapseBtn').addEventListener('click', () => {
      if (window.innerWidth > 960) document.querySelector('.app-shell').classList.toggle('collapsed');
    });
    document.addEventListener('click', (e) => {
      if (e.target.closest('#scrim')) document.querySelector('.app-shell').classList.remove('nav-open');
    });

    // global search → routes to users page with query
    const search = $('#globalSearch');
    search.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        location.hash = '#/users';
        setTimeout(() => {
          const box = $('#usersSearch');
          if (box) { box.value = search.value; box.dispatchEvent(new Event('input')); }
        }, 60);
      }
    });
    // Ctrl+K focuses search
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); search.focus();
      }
    });

    // bell → admins audit log
    $('#bellBtn').addEventListener('click', () => { location.hash = '#/admins'; });
    $('#statusBtn').addEventListener('click', () => { location.hash = '#/tools'; });

    window.addEventListener('hashchange', render);
    // resize closes mobile nav + redraws charts
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth > 960) document.querySelector('.app-shell').classList.remove('nav-open');
      $$('.chart-wrap').forEach((w) => {
        if (w._chartData) drawChart(w, w._chartData, w._chartOpts);
      });
    }, 180));

    render();
    // poll header stats (badge) every 30s
    setInterval(async () => {
      try {
        const s = await apiJson('/api/stats');
        const badge = $('#bellDot');
        if (badge) {
          badge.textContent = s.events_today || 0;
          badge.style.display = (s.events_today || 0) > 0 ? 'flex' : 'none';
        }
      } catch (_) { /* noop */ }
    }, 30000);
  }

  function setPages(p) { pages = p; }

  return {
    $, $$, esc, ICONS, api, apiJson, toast, modal, closeModal, confirmDlg,
    skeleton, empty, fmtBytes, fmtDate, fmtDateTime, fmtUptime, debounce, clamp,
    copyText, userStatusLabel, usageBar, drawChart,
    ROUTES, setPages, boot, render,
    get current() { return currentRoute; },
  };
})();
