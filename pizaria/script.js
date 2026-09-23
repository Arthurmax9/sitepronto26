document.documentElement.classList.remove('no-js');

// ===== Fade-in das imagens ao carregar =====
document.querySelectorAll('.img-placeholder img').forEach(img => {
  const show = () => img.classList.add('loaded');
  if (img.complete && img.naturalWidth) show();
  else {
    img.addEventListener('load', show, { once: true });
    img.addEventListener('error', show, { once: true });
  }
});

// ===== Menu mobile =====
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (menuToggle && nav) {
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', open);
    menuToggle.textContent = open ? '✕' : '☰';
  };

  menuToggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
}

// ===== Link ativo conforme a seção visível =====
const links = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];
const sections = links
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
}

// ===== Newsletter via fetch =====
document.querySelector('.newsletter-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const original = btn?.textContent;

  if (btn) { btn.disabled = true; btn.textContent = 'enviando...'; }

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    alert(res.ok ? 'Cadastro enviado com sucesso!' : 'Erro ao enviar. Tente novamente.');
    if (res.ok) form.reset();
  } catch {
    alert('Erro ao enviar. Tente novamente.');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = original; }
  }
});
