/* =============================================
   FC BATYR — app.js v3
   ============================================= */

// ── YEAR
document.querySelectorAll('.js-year').forEach(el => el.textContent = new Date().getFullYear());

// ── PRELOADER
setTimeout(() => {
  const pre = document.getElementById('preloader');
  if (pre) pre.classList.add('hidden');
}, 2000);

// ── PARTICLES
(function() {
  const el = document.getElementById('particles');
  if (!el) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const s = (Math.random() * 4 + 2).toFixed(1);
    const o = (Math.random() * 0.16 + 0.04).toFixed(3);
    const d = (Math.random() * 10 + 8).toFixed(1);
    const dl = (Math.random() * 14).toFixed(1);
    const l = (Math.random() * 100).toFixed(1);
    p.style.cssText = `--s:${s}px;--o:${o};--d:${d}s;--dl:-${dl}s;left:${l}%`;
    el.appendChild(p);
  }
})();

// ── HEADER — scroll + hide on scroll down, show on scroll up
(function() {
  const hdr = document.getElementById('site-header');
  if (!hdr) return;
  let lastY = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        hdr.classList.toggle('scrolled', y > 50);
        if (y > 200) {
          hdr.classList.toggle('hide-up', y > lastY);
        } else {
          hdr.classList.remove('hide-up');
        }
        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ── BURGER NAV
(function() {
  const btn = document.getElementById('burger-btn');
  const nav = document.getElementById('slide-nav');
  const ovl = document.getElementById('nav-overlay');
  if (!btn || !nav || !ovl) return;

  const open = () => {
    nav.classList.add('open');
    ovl.classList.add('open');
    btn.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    nav.classList.remove('open');
    ovl.classList.remove('open');
    btn.classList.remove('open');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', () => nav.classList.contains('open') ? close() : open());
  ovl.addEventListener('click', close);
  document.querySelectorAll('.nav-close').forEach(a => a.addEventListener('click', close));
})();

// ── SCROLL REVEAL
(function() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
})();

// ── FORM VALIDATION + SUBMIT
(function() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const rules = {
    name:    { required: true, min: 2, label: 'Введите имя (минимум 2 символа)' },
    phone:   { required: false, pattern: /^[\d\s\+\-\(\)]{7,}$/, label: 'Введите корректный номер' },
    email:   { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: 'Введите корректный Email' },
    group:   { required: true, label: 'Выберите возрастную группу' },
    message: { required: false },
  };

  function validate(name, value) {
    const r = rules[name];
    if (!r) return true;
    if (r.required && !value.trim()) return r.label;
    if (value.trim() && r.min && value.trim().length < r.min) return r.label;
    if (value.trim() && r.pattern && !r.pattern.test(value.trim())) return r.label;
    return true;
  }

  function setField(input, result) {
    const wrap = input.closest('.field');
    if (!wrap) return;
    const errEl = wrap.querySelector('.field-error');
    if (result === true) {
      wrap.classList.remove('invalid');
      wrap.classList.add('valid');
      if (errEl) errEl.textContent = '';
    } else {
      wrap.classList.add('invalid');
      wrap.classList.remove('valid');
      if (errEl) errEl.textContent = result;
    }
  }

  // Live validation on blur
  form.querySelectorAll('input,select,textarea').forEach(inp => {
    inp.addEventListener('blur', () => {
      const r = validate(inp.name, inp.value);
      setField(inp, r);
    });
    inp.addEventListener('input', () => {
      const wrap = inp.closest('.field');
      if (wrap && wrap.classList.contains('invalid')) {
        const r = validate(inp.name, inp.value);
        setField(inp, r);
      }
    });
  });

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Validate all
    let ok = true;
    form.querySelectorAll('input[name],select[name],textarea[name]').forEach(inp => {
      const r = validate(inp.name, inp.value);
      setField(inp, r);
      if (r !== true) ok = false;
    });
    if (!ok) return;

    const btn = document.getElementById('sendBtn');
    const status = document.getElementById('formStatus');
    btn.textContent = 'Отправка…'; btn.disabled = true;
    status.className = 'form-status';
    status.textContent = '';

    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(this) });
      const data = await res.json();
      if (data.success) {
        status.className = 'form-status ok';
        status.textContent = '✓ Заявка отправлена! Мы свяжемся с вами в ближайшее время.';
        this.reset();
        form.querySelectorAll('.field').forEach(f => f.classList.remove('valid','invalid'));
      } else { throw new Error(); }
    } catch {
      status.className = 'form-status err';
      status.textContent = '✗ Ошибка отправки. Попробуйте ещё раз.';
    }

    btn.textContent = 'Отправить заявку';
    btn.disabled = false;
  });
})();
