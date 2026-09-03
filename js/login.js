/* ============================================================
   TiTaN — Login page interactions
   Auth logic is isolated from the visual components: the form
   only talks to the backend via the API layer below.
   ============================================================ */
(() => {
  'use strict';

  // ---- config (swap these when real URLs are available) ----
  const TELEGRAM_URL = ''; // e.g. https://t.me/yourchannel
  const SUPPORT_URL = '';  // e.g. https://t.me/yoursupport
  const DASHBOARD_URL = '/dashboard';

  // ---- element refs ----
  const form = document.getElementById('loginForm');
  const usernameEl = document.getElementById('username');
  const passwordEl = document.getElementById('password');
  const togglePass = document.getElementById('togglePass');
  const rememberEl = document.getElementById('remember');
  const loginBtn = document.getElementById('loginBtn');
  const formError = document.getElementById('formError');
  const toastEl = document.getElementById('toast');
  const forgotLink = document.getElementById('forgotLink');
  const eyeOpen = togglePass.querySelector('.eye-open');
  const eyeOff = togglePass.querySelector('.eye-off');

  // ================= API layer =================
  const API = {
    async login(body) {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      let data = null;
      try { data = await res.json(); } catch (_) { /* non-JSON */ }
      return { ok: res.ok, status: res.status, data };
    },
  };

  // ================= UI helpers =================
  let toastTimer = null;
  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('visible'), 3200);
  }

  function showError(message) {
    formError.textContent = message;
    formError.classList.add('visible');
  }
  function clearError() {
    formError.textContent = '';
    formError.classList.remove('visible');
  }

  function setInvalid(el, invalid) {
    el.setAttribute('aria-invalid', String(invalid));
  }

  function setLoading(loading) {
    loginBtn.classList.toggle('loading', loading);
    loginBtn.disabled = loading;
    loginBtn.setAttribute('aria-busy', String(loading));
  }

  function setSuccess() {
    loginBtn.classList.add('success');
    loginBtn.querySelector('.btn-label').textContent = 'ورود موفق';
    const arrow = loginBtn.querySelector('.btn-arrow');
    if (arrow) arrow.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  }

  // ================= password visibility =================
  togglePass.addEventListener('click', () => {
    const show = passwordEl.type === 'password';
    passwordEl.type = show ? 'text' : 'password';
    togglePass.setAttribute('aria-pressed', String(show));
    togglePass.setAttribute('aria-label', show ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور');
    eyeOpen.hidden = show;
    eyeOff.hidden = !show;
    passwordEl.focus();
  });

  // ================= validation =================
  function validate() {
    let ok = true;
    const username = usernameEl.value.trim();
    const password = passwordEl.value;

    if (!username) {
      setInvalid(usernameEl, true);
      showError('نام کاربری را وارد کنید');
      ok = false;
    } else {
      setInvalid(usernameEl, false);
    }
    if (!password) {
      setInvalid(passwordEl, true);
      showError('رمز عبور را وارد کنید');
      ok = false;
    } else {
      setInvalid(passwordEl, false);
    }
    if (ok) clearError();
    return ok;
  }

  [usernameEl, passwordEl].forEach((el) => {
    el.addEventListener('input', () => {
      setInvalid(el, false);
      clearError();
    });
  });

  // ================= submit =================
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    clearError();

    try {
      const res = await API.login({
        username: usernameEl.value.trim(),
        password: passwordEl.value,
        remember: rememberEl.checked,
      });

      if (res.ok) {
        setLoading(false);
        setSuccess();
        setTimeout(() => { window.location.href = DASHBOARD_URL; }, 650);
        return;
      }

      setLoading(false);

      const detail = (res.data && res.data.detail) || '';
      if (detail.startsWith('locked:')) {
        const s = detail.split(':')[1];
        showError(`به دلیل تلاش‌های ناموفق، حساب برای ${s} ثانیه قفل شد`);
      } else if (res.status === 429) {
        showError('تعداد تلاش‌های ناموفق زیاد است؛ کمی بعد دوباره امتحان کنید');
      } else {
        showError('نام کاربری یا رمز عبور اشتباه است');
        passwordEl.value = '';
        passwordEl.focus();
      }
    } catch (_) {
      setLoading(false);
      showError('خطا در ارتباط با سرور؛ لطفاً دوباره تلاش کنید');
    }
  });

  // ================= forgot password =================
  forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('برای بازیابی رمز عبور با تیم پشتیبانی در ارتباط باشید');
  });

  // ================= quick access =================
  document.querySelectorAll('.quick-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      const action = card.dataset.action;
      const url = action === 'telegram' ? TELEGRAM_URL : SUPPORT_URL;
      if (url) {
        window.open(url, '_blank', 'noopener');
        return;
      }
      e.preventDefault();
      showToast(
        action === 'telegram'
          ? 'آدرس کانال تلگرام به‌زودی فعال می‌شود'
          : 'آدرس پشتیبانی به‌زودی فعال می‌شود'
      );
    });
  });

  // ================= ambient particles =================
  const particles = document.getElementById('particles');
  if (particles && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const COUNT = 26;
    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const size = (Math.random() * 2.4 + 1.2).toFixed(1);
      p.style.left = (Math.random() * 100).toFixed(2) + '%';
      p.style.top = (15 + Math.random() * 85).toFixed(2) + '%';
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.setProperty('--d', (Math.random() * 9 + 7).toFixed(2) + 's');
      p.style.animationDelay = (-Math.random() * 10).toFixed(2) + 's';
      particles.appendChild(p);
    }
  }
})();
