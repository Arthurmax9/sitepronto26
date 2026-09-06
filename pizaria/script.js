// Menu mobile toggle
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});

// Fecha menu ao clicar em um link (mobile)
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
  });
});

// Newsletter - exemplo de submit
document.querySelector('.newsletter-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Cadastro enviado com sucesso!');
  e.target.reset();
});
