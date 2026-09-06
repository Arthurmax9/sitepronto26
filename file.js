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

    // Fecha todos
    document.querySelectorAll('.faq-item').forEach(el => {
      el.classList.remove('active');
      el.querySelector('.faq-answer').style.maxHeight = null;
    });

    // Abre o clicado (se não estava aberto)
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
      nav.classList.remove('open'); // fecha menu mobile ao clicar
    }
  });
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll(
  '.skill-card, .card, .depo-card, .plano-card, .faq-item, .sobre-texto, .sobre-img'
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
document.querySelectorAll('[data-plano]').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const plano = this.getAttribute('data-plano');
    const numero = '5551993776060';
    const mensagem = `Olá! Quero o plano ${plano}.`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  });
});
