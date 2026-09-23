document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP = '5555555555';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Ano no rodapé
  $('#year').textContent = new Date().getFullYear();

  // Header com sombra ao rolar
  const header = $('#header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu mobile
  const burger = $('#burger');
  const nav = $('#nav');
  const toggleMenu = (open) => {
    burger.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
  };
  burger.addEventListener('click', () => toggleMenu(!nav.classList.contains('is-open')));
  $$('.nav a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  // Destaca o link ativo no menu
  const links = $$('.nav a');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${e.target.id}`));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  // Animação ao rolar
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    revealObs.observe(el);
  });

  // Contadores
  const countObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const end = +el.dataset.count;
      const start = end > 1000 ? end - 60 : 0;
      const dur = 1400;
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(start + (end - start) * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => countObs.observe(el));

  // Abas de especialidades (com navegação por teclado)
  const tabs = $$('.tab');
  const activateTab = (tab) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      const panel = $(`#${t.dataset.tab}`);
      panel.hidden = !on;
      panel.classList.toggle('is-active', on);
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', e => {
      if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      next.focus();
      activateTab(next);
    });
  });

  // Personalização por campanha (?servico=implante ou utm_content=implante)
  const params = new URLSearchParams(location.search);
  const pre = params.get('servico') || params.get('utm_content');
  if (pre) {
    const t = tabs.find(t => t.dataset.tab === pre.toLowerCase());
    if (t) activateTab(t);
  }

  // Preenche o formulário a partir do CTA da especialidade
  const servicoSelect = $('#servico');
  $$('[data-service]').forEach(btn => {
    btn.addEventListener('click', () => {
      servicoSelect.value = btn.dataset.service;
      servicoSelect.closest('.field').classList.add('is-valid');
    });
  });

  // Slider de depoimentos
  const track = $('.slider__track');
  const slides = $$('.quote');
  const dotsWrap = $('#dots');
  let idx = 0, timer;

  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.setAttribute('aria-label', `Depoimento ${i + 1}`);
    d.addEventListener('click', () => go(i));
    dotsWrap.appendChild(d);
  });
  const dots = $$('button', dotsWrap);

  const go = (i) => {
    idx = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d, j) => d.classList.toggle('is-active', j === idx));
    restart();
  };
  const restart = () => { clearInterval(timer); timer = setInterval(() => go(idx + 1), 6000); };
  $$('.slider__btn').forEach(b => b.addEventListener('click', () => go(idx + +b.dataset.dir)));

  // Arrastar no celular
  let x0 = null;
  track.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
  track.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1));
    x0 = null;
  });
  go(0);

  // Máscara de telefone
  const tel = $('#tel');
  tel.addEventListener('input', () => {
    let v = tel.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    else if (v.length) v = v.replace(/(\d{0,2})/, '($1');
    tel.value = v;
  });

  // Validação do formulário com retorno imediato
  const form = $('#form');
  const rules = {
    nome: v => v.trim().split(/\s+/).length >= 2 || 'Informe nome e sobrenome.',
    tel: v => v.replace(/\D/g, '').length >= 10 || 'Informe um telefone válido com DDD.',
    servico: v => !!v || 'Selecione um tratamento.'
  };

  const validate = (input) => {
    const rule = rules[input.name];
    if (!rule) return true;
    const res = rule(input.value);
    const field = input.closest('.field');
    const ok = res === true;
    field.classList.toggle('is-invalid', !ok);
    field.classList.toggle('is-valid', ok);
    $('.error', field).textContent = ok ? '' : res;
    input.setAttribute('aria-invalid', !ok);
    return ok;
  };

  Object.keys(rules).forEach(name => {
    const el = form.elements[name];
    el.addEventListener('blur', () => validate(el));
    el.addEventListener('input', () => el.closest('.field').classList.contains('is-invalid') && validate(el));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const valid = Object.keys(rules).map(n => validate(form.elements[n])).every(Boolean);
    const lgpd = $('#lgpd');
    $('#lgpdError').textContent = lgpd.checked ? '' : 'É necessário aceitar para continuar.';
    if (!valid || !lgpd.checked) {
      const firstError = $('.is-invalid input, .is-invalid select', form) || lgpd;
      firstError.focus();
      return;
    }

    const d = Object.fromEntries(new FormData(form));
    const msg = `Olá! Gostaria de agendar uma avaliação.%0A%0A*Nome:* ${encodeURIComponent(d.nome)}%0A*Telefone:* ${encodeURIComponent(d.tel)}%0A*Tratamento:* ${encodeURIComponent(d.servico)}%0A*Período:* ${encodeURIComponent(d.periodo)}`;

    // Evento para o GA4 / Tag Manager
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'lead_agendamento', servico: d.servico });

    const btn = $('button[type="submit"]', form);
    btn.textContent = 'Redirecionando…';
    btn.disabled = true;

    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank', 'noopener');

    setTimeout(() => {
      form.reset();
      $$('.field', form).forEach(f => f.classList.remove('is-valid', 'is-invalid'));
      btn.textContent = 'Solicitação enviada ✓';
      setTimeout(() => { btn.textContent = 'Solicitar agendamento'; btn.disabled = false; }, 3000);
    }, 800);
  });

  // Registra cliques nos CTAs (GA4)
  $$('a[href*="wa.me"], a[href^="tel:"]').forEach(a => {
    a.addEventListener('click', () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: a.href.includes('wa.me') ? 'click_whatsapp' : 'click_telefone' });
    });
  });
});
