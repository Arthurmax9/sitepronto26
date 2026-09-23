// ===== MENU MOBILE =====
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');

menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(el => {
      el.classList.remove('active');
      el.querySelector('.faq-answer').style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ===== NAVEGAÇÃO SUAVE =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      nav.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    }
  });
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll(
  '.skill-card, .card-projeto, .depo-card, .faq-item, .sobre-texto, .sobre-img, .area-card'
);
revealElements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => observer.observe(el));

// ===== CARROSSEL DE PROJETOS =====
function initCarrossel(carrosselId, setaEsqId, setaDirId) {
  const carrossel = document.getElementById(carrosselId);
  const setaEsq = document.getElementById(setaEsqId);
  const setaDir = document.getElementById(setaDirId);
  if (!carrossel) return;

  function getScrollAmount() {
    const card = carrossel.querySelector('.card-projeto');
    if (!card) return 320;
    const gap = parseFloat(getComputedStyle(carrossel).gap) || 30;
    return card.offsetWidth + gap;
  }

  setaDir?.addEventListener('click', () => {
    carrossel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });

  setaEsq?.addEventListener('click', () => {
    carrossel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });
}

initCarrossel('carrosselSites', 'setaEsqSites', 'setaDirSites');
initCarrossel('carrosselOutros', 'setaEsqOutros', 'setaDirOutros');

// ===== FORMULÁRIO - ENVIO VIA FORMSPREE (AJAX) =====
document.querySelector('.newsletter-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const button = form.querySelector('button[type="submit"]');
  const originalText = button.textContent;

  button.disabled = true;
  button.textContent = 'Enviando...';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      form.reset();
    } else {
      alert('Ocorreu um erro ao enviar. Tente novamente.');
    }
  } catch (error) {
    alert('Erro de conexão. Verifique sua internet e tente novamente.');
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
});

// ===== ANIMAÇÃO DAS BARRAS DE SKILL =====
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const percent = parseFloat(entry.target.dataset.percent) || 0;
      entry.target.style.transform = `scaleX(${percent / 100})`;
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.10 });
skillFills.forEach(f => skillObserver.observe(f));
