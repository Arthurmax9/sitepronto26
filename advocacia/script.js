document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const header = $('#header');
  const progressBar = $('#progressBar');
  const menuToggle = $('#menuToggle');
  const navLinks = $('#navLinks');
  const overlay = $('#navOverlay');
  const form = $('#formContato');
  const formSucesso = $('#formSucesso');

  /* ---------- Scroll: header + progresso (1x por frame) ---------- */
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('scrolled', y > 30);
    progressBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  const setMenu = (open) => {
    navLinks.classList.toggle('open', open);
    overlay.classList.toggle('show', open);
    menuToggle.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', open);
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', open);
  };

  menuToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  overlay.addEventListener('click', () => setMenu(false));
  navLinks.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Scrollspy ---------- */
  const navAnchors = $$('.nav-links a[data-nav]');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('section[id]').forEach(s => spy.observe(s));

  /* ---------- Reveal com delay em sequência ---------- */
  const revealEls = $$('[data-reveal]');
  revealEls.forEach(el => {
    const siblings = $$(':scope > [data-reveal]', el.parentElement);
    el.style.setProperty('--d', `${Math.min(siblings.indexOf(el), 5) * 0.08}s`);
  });
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  /* ---------- Contadores ---------- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const isDecimal = el.dataset.decimal === 'true';
    const suffix = el.dataset.suffix || '';
    const format = (v) => (isDecimal ? v.toFixed(1) : Math.round(v).toLocaleString('pt-BR')) + suffix;
    if (reduceMotion) { el.textContent = format(target); return; }

    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = format(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      counterObs.unobserve(entry.target);
      animateCounter(entry.target);
    });
  }, { threshold: 0.6 });
  $$('.stat-num[data-count]').forEach(c => { c.textContent = '0'; counterObs.observe(c); });

  /* ---------- FAQ ---------- */
  const faqItems = $$('[data-faq]');
  faqItems.forEach(item => {
    $('.faq-q', item).addEventListener('click', () => {
      const willOpen = !item.classList.contains('active');
      faqItems.forEach(i => {
        i.classList.remove('active');
        $('.faq-q', i).setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('active');
        $('.faq-q', item).setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Máscara de telefone ---------- */
  const tel = $('#telefone');
  tel?.addEventListener('input', () => {
    let v = tel.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    else if (v.length) v = v.replace(/^(\d{0,2})/, '($1');
    tel.value = v;
  });

  /* ---------- Validação do formulário ---------- */
  const fields = $$('input, select, textarea', form);

  const validate = (field) => {
    const value = field.value.trim();
    let ok = value !== '';
    if (ok && field.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    if (ok && field.type === 'tel') ok = value.replace(/\D/g, '').length >= 10;
    field.closest('.field').classList.toggle('show-error', !ok);
    field.classList.toggle('invalid', !ok);
    field.setAttribute('aria-invalid', !ok);
    return ok;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const invalid = fields.filter(f => !validate(f));
    if (invalid.length) { invalid[0].focus(); return; }

    const btn = $('button[type="submit"]', form);
    const txt = $('.btn-text', btn);
    const original = txt.textContent;
    btn.disabled = true;
    txt.textContent = 'Enviando...';

    // Simulação de envio — troque por fetch() para seu backend/Formspree
    await new Promise(r => setTimeout(r, 900));

    btn.disabled = false;
    txt.textContent = original;
    form.reset();
    formSucesso.hidden = false;
    formSucesso.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => { formSucesso.hidden = true; }, 6000);
  });

  fields.forEach(field => {
    const evt = field.tagName === 'SELECT' ? 'change' : 'input';
    field.addEventListener(evt, () => {
      if (field.classList.contains('invalid')) validate(field);
    });
    field.addEventListener('blur', () => { if (field.value) validate(field); });
  });
});
