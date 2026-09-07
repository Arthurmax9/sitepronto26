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
document.querySelector('.newsletter-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      alert('Cadastro enviado com sucesso!');
      form.reset();
    } else {
      alert('Erro ao enviar. Tente novamente.');
    }
  } catch (error) {
    alert('Erro ao enviar. Tente novamente.');
  }
});

