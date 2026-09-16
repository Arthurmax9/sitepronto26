// ===== MENU MOBILE =====
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');
menuToggle.addEventListener('click', () => nav.classList.toggle('open'));

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
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      nav.classList.remove('open');
    }
  });
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll(
  '.skill-card, .card-projeto, .depo-card, .faq-item, .sobre-texto, .sobre-img'
);
revealElements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => observer.observe(el));

// ===== CARROSSEL DE PROJETOS =====
function initCarrossel(carrosselId, setaEsqId, setaDirId) {
  const carrossel = document.getElementById(carrosselId);
  const setaEsq = document.getElementById(setaEsqId);
  const setaDir = document.getElementById(setaDirId);

  const scrollAmount = 320; // ajuste conforme a largura do seu card

  setaDir.addEventListener('click', () => {
    carrossel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  setaEsq.addEventListener('click', () => {
    carrossel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
}

// Inicializa os dois carrosséis
initCarrossel('carrosselSites', 'setaEsqSites', 'setaDirSites');
initCarrossel('carrosselOutros', 'setaEsqOutros', 'setaDirOutros');


function getScrollAmount() {
  const card = carrossel.querySelector('.card-projeto');
  if (!card) return 320;
  const gap = 30;
  return card.offsetWidth + gap;
}

setaEsq?.addEventListener('click', () => {
  carrossel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
});

setaDir?.addEventListener('click', () => {
  carrossel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
});

// Newsletter/Contato - envio via Formspree (AJAX)
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
