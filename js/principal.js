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

  // Galeria com lightbox
  var itensGaleria = [].slice.call(document.querySelectorAll('.galeria-item'));
  if (!itensGaleria.length) return;

  var caixa = document.createElement('div');
  caixa.className = 'lightbox';
  caixa.setAttribute('role', 'dialog');
  caixa.setAttribute('aria-modal', 'true');
  caixa.setAttribute('aria-label', 'Foto ampliada');
  caixa.innerHTML =
    '<button class="lightbox-fechar" type="button" aria-label="Fechar">&times;</button>' +
    '<button class="lightbox-nav" type="button" data-dir="-1" aria-label="Foto anterior">&#8249;</button>' +
    '<button class="lightbox-nav" type="button" data-dir="1" aria-label="Próxima foto">&#8250;</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(caixa);

  var img = caixa.querySelector('img');
  var legenda = caixa.querySelector('figcaption');
  var fechar = caixa.querySelector('.lightbox-fechar');
  var atual = 0;
  var origem = null;

  function mostrar(i) {
    atual = (i + itensGaleria.length) % itensGaleria.length;
    var alvo = itensGaleria[atual];
    img.src = alvo.getAttribute('data-full');
    img.alt = alvo.getAttribute('data-legenda') || '';
    legenda.textContent =
      (alvo.getAttribute('data-legenda') || '') + ' (' + (atual + 1) + ' de ' + itensGaleria.length + ')';
  }

  function abrir(i, botao) {
    origem = botao;
    mostrar(i);
    caixa.classList.add('aberto');
    document.body.classList.add('sem-rolagem');
    fechar.focus();
  }

  function esconder() {
    caixa.classList.remove('aberto');
    document.body.classList.remove('sem-rolagem');
    img.src = '';
    if (origem) origem.focus();
  }

  itensGaleria.forEach(function (el, i) {
    el.addEventListener('click', function () { abrir(i, el); });
  });

  fechar.addEventListener('click', esconder);
  caixa.addEventListener('click', function (e) { if (e.target === caixa) esconder(); });
  caixa.querySelectorAll('.lightbox-nav').forEach(function (b) {
    b.addEventListener('click', function () { mostrar(atual + Number(b.getAttribute('data-dir'))); });
  });

  // Tab circula entre os botões do lightbox, sem escapar para a página atrás
  var focaveis = [].slice.call(caixa.querySelectorAll('button'));

  document.addEventListener('keydown', function (e) {
    if (!caixa.classList.contains('aberto')) return;
    if (e.key === 'Escape') esconder();
    else if (e.key === 'ArrowLeft') mostrar(atual - 1);
    else if (e.key === 'ArrowRight') mostrar(atual + 1);
    else if (e.key === 'Tab') {
      e.preventDefault();
      var i = focaveis.indexOf(document.activeElement);
      focaveis[(i + (e.shiftKey ? -1 : 1) + focaveis.length) % focaveis.length].focus();
    }
  });

  // Arrastar para trocar de foto no celular
  var x0 = null;
  caixa.addEventListener('touchstart', function (e) { x0 = e.changedTouches[0].clientX; }, { passive: true });
  caixa.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var d = e.changedTouches[0].clientX - x0;
    if (Math.abs(d) > 50) mostrar(atual + (d < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });
})();
