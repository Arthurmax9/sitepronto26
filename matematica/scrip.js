// ============================================================
// PROGRAMA40 — Interações do site (à prova de falhas)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  try {

    // ---------- 1. MENU MOBILE (HAMBURGER) ----------
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    if (hamburger && nav) {
      hamburger.addEventListener('click', () => {
        nav.classList.toggle('nav--open');
        hamburger.classList.toggle('hamburger--active');
      });

      document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
          nav.classList.remove('nav--open');
          hamburger.classList.remove('hamburger--active');
        });
      });
    }

    // ---------- 2. HEADER COM SOMBRA AO ROLAR ----------
    const header = document.getElementById('header');
    if (header) {
      window.addEventListener('scroll', () => {
        header.style.boxShadow = window.scrollY > 20
          ? '0 8px 24px rgba(0, 0, 0, 0.4)'
          : 'none';
      }, { passive: true });
    }

    // ---------- 3. ANO ATUAL NO RODAPÉ ----------
    const anoAtual = document.getElementById('ano-atual');
    if (anoAtual) anoAtual.textContent = new Date().getFullYear();

    // ---------- 4. ANIMAÇÃO DE ENTRADA AO ROLAR ----------
    // O conteúdo já está visível por padrão (definido no CSS).
    // Aqui apenas escondemos momentaneamente via classe, para animar,
    // e sempre garantimos que volte a aparecer.
    const elementosReveal = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && elementosReveal.length) {

      elementosReveal.forEach(el => {
        el.classList.add('reveal--animar', 'reveal--oculto');
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.remove('reveal--oculto');
            }, (index % 4) * 40);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -10px 0px' });

      elementosReveal.forEach(el => observer.observe(el));

      // 🛡️ Rede de segurança: se em 3s algum elemento ainda estiver oculto,
      // força a exibição.
      setTimeout(() => {
        document.querySelectorAll('.reveal--oculto').forEach(el => {
          el.classList.remove('reveal--oculto');
        });
      }, 3000);
    }

  } catch (erro) {
    console.error('[Programa40] Erro no script.js:', erro);
    document.querySelectorAll('.reveal, .reveal--oculto').forEach(el => {
      el.classList.remove('reveal--oculto');
    });
  }

});
