#!/usr/bin/env node
/**
 * gerar.js — gera as páginas de produto, o sitemap e as imagens placeholder.
 *
 * Uso:  node gerar.js
 *
 * Fontes de dados:
 *   dados/config.json    → nome, WhatsApp, endereço, URL do site
 *   dados/produtos.json  → um item por produto (vira produtos/<slug>.html)
 *
 * Fotos reais: coloque img/produtos/<slug>.jpg (ou .png/.webp) e rode de novo.
 * O script usa a foto se existir; senão gera um SVG placeholder.
 *
 * O index.html é escrito à mão e NÃO é tocado por este script.
 */

const fs = require('fs');
const path = require('path');

const raiz = __dirname;
const cfg = JSON.parse(fs.readFileSync(path.join(raiz, 'dados/config.json'), 'utf8'));
const produtos = JSON.parse(fs.readFileSync(path.join(raiz, 'dados/produtos.json'), 'utf8'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const zap = (msg) => `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(msg)}`;
const enderecoLinha = `${cfg.endereco.rua} – ${cfg.endereco.bairro}, ${cfg.endereco.cidade}-${cfg.endereco.uf}`;

/* ---------------- ícones SVG (inline) ---------------- */
const icones = {
  zap: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.6 1.1 2.8.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s7-7.1 7-12a7 7 0 1 0-14 0c0 4.9 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  insta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
};

const marcaSvg = `<svg viewBox="0 0 64 64" aria-hidden="true">
  <g style="mix-blend-mode:multiply"><circle cx="24" cy="27" r="19" fill="#00a3e0"/><circle cx="40" cy="27" r="19" fill="#e11d74"/><circle cx="32" cy="41" r="19" fill="#ffd100"/></g>
  <g fill="none" stroke="#17123a" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 49V19l15 30V19"/><path d="M35 49V19l8 17 8-17v30"/></g>
</svg>`;

/* ---------------- cabeçalho / rodapé compartilhados ---------------- */
function cabecalho(base) {
  const msg = 'Olá! Vi o site da NM Personalização e quero um orçamento.';
  return `
<header class="cabecalho">
  <div class="container">
    <a class="marca" href="${base}index.html" aria-label="${esc(cfg.nome)} — início">
      ${marcaSvg}
      <span>NM<small>Personalização</small></span>
    </a>
    <nav class="nav" aria-label="Principal">
      <a href="${base}index.html#produtos">Produtos</a>
      <a href="${base}index.html#como-funciona">Como funciona</a>
      <a href="${base}index.html#sobre">Sobre</a>
      <a href="${base}index.html#contato">Contato</a>
    </nav>
    <a class="btn btn--zap" href="${zap(msg)}" target="_blank" rel="noopener">${icones.zap}<span>Pedir orçamento</span></a>
    <button class="menu-btn" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav-mobile">${icones.menu}</button>
  </div>
  <nav class="nav-mobile" id="nav-mobile" aria-label="Menu">
    <a href="${base}index.html#produtos">Produtos</a>
    <a href="${base}index.html#como-funciona">Como funciona</a>
    <a href="${base}index.html#sobre">Sobre</a>
    <a href="${base}index.html#contato">Contato</a>
  </nav>
</header>`;
}

function rodape(base) {
  const links = produtos.map((p) => `<li><a href="${base}produtos/${p.slug}.html">${esc(p.nome)}</a></li>`).join('\n        ');
  return `
<footer class="rodape">
  <div class="container">
    <div>
      <a class="marca" href="${base}index.html">${marcaSvg}<span>NM<small>Personalização</small></span></a>
      <p style="margin-top:1rem">Personalização de camisetas, canecas, copos e lembrancinhas no Recanto das Emas, Brasília-DF.</p>
      <p>${esc(enderecoLinha)}</p>
    </div>
    <div>
      <h4>Produtos</h4>
      <ul>
        ${links}
      </ul>
    </div>
    <div>
      <h4>Contato</h4>
      <ul>
        <li><a href="${zap('Olá! Vi o site da NM Personalização e quero um orçamento.')}" target="_blank" rel="noopener">WhatsApp ${esc(cfg.whatsappExibir)}</a></li>
        <li><a href="mailto:${cfg.email}">${cfg.email}</a></li>
        <li><a href="${cfg.instagram}" target="_blank" rel="noopener">Instagram @nm.personalizacao</a></li>
      </ul>
    </div>
    <div class="barra">© <span data-ano>2026</span> ${esc(cfg.nome)} · Recanto das Emas, Brasília-DF</div>
  </div>
</footer>
<a class="zap-flutuante" href="${zap('Olá! Vi o site da NM Personalização e quero um orçamento.')}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${icones.zap}<span>Falar no WhatsApp</span></a>
<script src="${base}js/principal.js" defer></script>`;
}

function head({ titulo, meta, canonical, imagem, extra = '' }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(meta)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow">
<meta name="theme-color" content="#17123a">
<link rel="icon" href="../img/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${esc(cfg.nome)}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(meta)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${imagem}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Figtree:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/estilo.css">
${extra}
</head>`;
}

/* ---------------- placeholders SVG ---------------- */
const glifos = {
  camiseta: '<path d="M32 22 42 16h16l10 6 8 16-10 5v37H34V43l-10-5z"/><path d="M42 16c2 6 14 6 16 0"/>',
  caneca: '<path d="M26 26h44v42a8 8 0 0 1-8 8H34a8 8 0 0 1-8-8z"/><path d="M70 36h6a10 10 0 0 1 0 20h-6"/><path d="M36 40h24M36 50h16"/>',
  copo: '<path d="M30 20h40l-5 60H35z"/><path d="M33 40h34M35 56h30"/>',
  toalha: '<rect x="22" y="24" width="56" height="56" rx="6"/><path d="M22 40c8 4 12-4 20 0s12-4 20 0 12-4 16 0M22 56c8 4 12-4 20 0s12-4 20 0 12-4 16 0"/>',
  sacochila: '<path d="M30 34h40l4 46H26z"/><path d="M36 34c0-14 28-14 28 0"/><path d="M36 34 30 80M64 34l6 46"/>',
  'jogo-americano': '<rect x="14" y="30" width="72" height="44" rx="6"/><circle cx="50" cy="52" r="14"/><path d="M26 42v20M74 42v20"/>',
  banner: '<rect x="18" y="30" width="64" height="44" rx="3"/><path d="M18 30 30 18M82 30 70 18M30 18h40"/><path d="M32 50h36M32 60h24"/>',
  pelicula: '<rect x="20" y="30" width="52" height="40" rx="4"/><circle cx="76" cy="50" r="10"/><path d="M28 40l36 20M28 60l36-20"/>',
  presente: '<rect x="20" y="42" width="60" height="38" rx="4"/><path d="M16 30h68v12H16z"/><path d="M50 30v50M50 30c-8-2-16-12-8-14s8 10 8 14c0-4 0-16 8-14s0 12-8 14"/>',
};

function placeholder(p) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" role="img" aria-label="${esc(p.nome)} — foto em breve">
  <rect width="800" height="600" fill="#f4f2fa"/>
  <circle cx="660" cy="120" r="170" fill="#ffd100" opacity=".22"/>
  <circle cx="140" cy="520" r="150" fill="#00a3e0" opacity=".16"/>
  <circle cx="420" cy="560" r="120" fill="#e11d74" opacity=".12"/>
  <g transform="translate(260 140) scale(2.8)" fill="none" stroke="#17123a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">${glifos[p.icone] || glifos.presente}</g>
</svg>`;
}

function imagemDe(p) {
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    if (fs.existsSync(path.join(raiz, 'img/produtos', `${p.slug}.${ext}`))) return `img/produtos/${p.slug}.${ext}`;
  }
  const alvo = path.join(raiz, 'img/produtos', `${p.slug}.svg`);
  fs.writeFileSync(alvo, placeholder(p));
  return `img/produtos/${p.slug}.svg`;
}

/* ---------------- página de produto ---------------- */
function paginaProduto(p, imagem) {
  const base = '../';
  const canonical = `${cfg.url}/produtos/${p.slug}.html`;
  const tituloTag = `${p.titulo} – Brasília DF | ${cfg.nome}`;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: p.titulo,
        description: p.meta,
        serviceType: p.nome,
        image: `${cfg.url}/${imagem}`,
        url: canonical,
        areaServed: cfg.regioes.map((r) => ({ '@type': 'Place', name: r })),
        provider: { '@id': `${cfg.url}/#negocio` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: `${cfg.url}/` },
          { '@type': 'ListItem', position: 2, name: 'Produtos', item: `${cfg.url}/#produtos` },
          { '@type': 'ListItem', position: 3, name: p.nome, item: canonical },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: p.faq.map((f) => ({
          '@type': 'Question',
          name: f.p,
          acceptedAnswer: { '@type': 'Answer', text: f.r },
        })),
      },
    ],
  };

  const relacionados = p.relacionados
    .map((slug) => produtos.find((x) => x.slug === slug))
    .filter(Boolean)
    .map((r) => {
      const img = imagemDe(r);
      return `<a class="card" href="${r.slug}.html">
          <img src="${base}${img}" alt="${esc(r.nome)}" loading="lazy" width="800" height="600">
          <div class="corpo"><h3>${esc(r.nome)}</h3><p>${esc(r.resumo)}</p><span class="ver">Ver detalhes</span></div>
        </a>`;
    })
    .join('\n        ');

  return `${head({
    titulo: tituloTag,
    meta: p.meta,
    canonical,
    imagem: `${cfg.url}/${imagem}`,
    extra: `<script type="application/ld+json">${JSON.stringify(schema)}</script>`,
  })}
<body>
${cabecalho(base)}

<main>
  <section class="secao" style="padding-top:2.5rem">
    <div class="container">
      <nav class="migalhas" aria-label="Você está em">
        <a href="${base}index.html">Início</a><span>›</span><a href="${base}index.html#produtos">Produtos</a><span>›</span>${esc(p.nome)}
      </nav>
      <div class="produto-topo">
        <div>
          <p class="eyebrow">Recanto das Emas · Brasília-DF</p>
          <h1>${esc(p.titulo)}</h1>
          ${p.intro.map((t) => `<p class="intro">${esc(t)}</p>`).join('\n          ')}
          <div class="acoes">
            <a class="btn btn--zap" href="${zap(p.msg)}" target="_blank" rel="noopener">${icones.zap}Pedir orçamento no WhatsApp</a>
            <a class="btn btn--contorno" href="${base}index.html#produtos">Ver outros produtos</a>
          </div>
        </div>
        <img src="${base}${imagem}" alt="${esc(p.nome)} — ${esc(cfg.nome)}, Recanto das Emas" width="800" height="600">
      </div>
    </div>
  </section>

  <section class="secao secao--alt">
    <div class="container">
      <div class="colunas">
        <div>
          <h2>Ideal para</h2>
          <ul>
            ${p.ideal.map((i) => `<li>${esc(i)}</li>`).join('\n            ')}
          </ul>
        </div>
        <div>
          <h2>O que você escolhe</h2>
          <ul>
            ${p.detalhes.map((i) => `<li>${esc(i)}</li>`).join('\n            ')}
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="secao">
    <div class="container">
      <p class="eyebrow">Passo a passo</p>
      <h2>Como pedir</h2>
      <ol class="passos">
        <li><h3>Mande a ideia</h3><p>Chame no WhatsApp com foto, texto, tema ou referência. Diga a quantidade e para quando precisa.</p></li>
        <li><h3>Aprove a arte e o valor</h3><p>Montamos a arte e enviamos o orçamento. Você ajusta o que quiser antes de produzir.</p></li>
        <li><h3>Retire ou combine a entrega</h3><p>Pronto, é só buscar no Recanto das Emas ou combinar a entrega.</p></li>
      </ol>
    </div>
  </section>

  <section class="secao secao--alt">
    <div class="container">
      <h2>Perguntas frequentes</h2>
      <div class="faq">
        ${p.faq.map((f) => `<details><summary>${esc(f.p)}</summary><p>${esc(f.r)}</p></details>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="secao">
    <div class="container relacionados">
      <h2>Veja também</h2>
      <div class="grade">
        ${relacionados}
      </div>
    </div>
  </section>

  <section class="faixa-cta">
    <div class="container">
      <h2>Quer ${esc(p.nome.toLowerCase())}?</h2>
      <p>Manda a ideia no WhatsApp e receba o orçamento com a arte para aprovar.</p>
      <a class="btn btn--zap" href="${zap(p.msg)}" target="_blank" rel="noopener">${icones.zap}Chamar no WhatsApp</a>
    </div>
  </section>
</main>
${rodape(base)}
</body>
</html>
`;
}

/* ---------------- sitemap / robots ---------------- */
function sitemap() {
  const hoje = new Date().toISOString().slice(0, 10);
  const urls = [{ loc: `${cfg.url}/`, pri: '1.0' }].concat(
    produtos.map((p) => ({ loc: `${cfg.url}/produtos/${p.slug}.html`, pri: '0.8' }))
  );
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${hoje}</lastmod><priority>${u.pri}</priority></url>`).join('\n')}
</urlset>
`;
}

/* ---------------- executa ---------------- */
for (const p of produtos) {
  const imagem = imagemDe(p);
  fs.writeFileSync(path.join(raiz, 'produtos', `${p.slug}.html`), paginaProduto(p, imagem));
  console.log(`✔ produtos/${p.slug}.html  (${imagem})`);
}
fs.writeFileSync(path.join(raiz, 'sitemap.xml'), sitemap());
fs.writeFileSync(path.join(raiz, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${cfg.url}/sitemap.xml\n`);
console.log('✔ sitemap.xml, robots.txt');
console.log('\nLembrete: index.html é editado à mão. Cabeçalho/rodapé lá devem bater com os daqui.');
