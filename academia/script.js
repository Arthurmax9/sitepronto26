document.addEventListener('DOMContentLoaded', () => {

  // Menu mobile
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  menuToggle?.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  nav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    answer.style.display = 'none';
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.display = 'none';
      });
      if (!isOpen) {
        item.classList.add('active');
        answer.style.display = 'block';
      }
    });
  });

  // Formulário de contato
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    formMsg.textContent = 'Recebemos sua mensagem! Em breve entraremos em contato.';
    formMsg.style.color = '#209447';
    form.reset();
  });

  // Cookie banner
  const cookieBox = document.getElementById('cookieBox');
  const accepted = localStorage.getItem('forza_cookies_accepted');
  if (accepted) cookieBox.style.display = 'none';

  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    localStorage.setItem('forza_cookies_accepted', 'true');
    cookieBox.style.display = 'none';
  });
  document.getElementById('cookieClose')?.addEventListener('click', () => {
    cookieBox.style.display = 'none';
  });

  // Header com sombra ao rolar
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    } else {
      header.style.boxShadow = '0 3px 15px rgba(0,0,0,0.2)';
    }
  });

  // Destaque do link ativo no menu conforme a seção visível
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  });

});
