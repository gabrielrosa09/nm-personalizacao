// NM Personalização — principal.js
// Menu mobile, revelar ao rolar e ano do rodapé. Sem dependências.

(function () {
  // Menu mobile
  var btn = document.querySelector('.menu-btn');
  var nav = document.querySelector('.nav-mobile');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var aberto = nav.classList.toggle('aberto');
      btn.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('aberto');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Revelar ao rolar (respeita prefers-reduced-motion via CSS)
  var itens = document.querySelectorAll('.revelar');
  if ('IntersectionObserver' in window && itens.length) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('visivel');
          obs.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    itens.forEach(function (el) { obs.observe(el); });
  } else {
    itens.forEach(function (el) { el.classList.add('visivel'); });
  }

  // Ano atual no rodapé
  var ano = document.querySelector('[data-ano]');
  if (ano) ano.textContent = new Date().getFullYear();
})();
