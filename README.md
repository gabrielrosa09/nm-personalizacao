# NM Personalização — site

Site-vitrine da NM Personalização (Recanto das Emas, Brasília-DF). HTML/CSS/JS puro, sem build obrigatório. Contato pelo WhatsApp e e-mail.

## Estrutura

```
index.html              página principal (editada à mão)
produtos/*.html         uma página por produto (GERADAS por gerar.js)
css/estilo.css          estilos
js/principal.js         menu mobile, animações
img/                    logo, favicon, og.svg (imagem de compartilhamento)
img/produtos/           fotos dos produtos (SVG placeholder até ter foto real)
dados/config.json       nome, WhatsApp, e-mail, endereço, URL do site
dados/produtos.json     textos de cada produto
gerar.js                gera produtos/*.html, sitemap.xml, robots.txt e placeholders
```

## Trocar as fotos placeholder por fotos reais

1. Salve a foto como `img/produtos/<slug>.jpg` (ou `.png`/`.webp`).
   Slugs: `camisetas`, `canecas`, `copos`, `toalhinhas`, `sacochilas`, `jogo-americano`, `banners`, `peliculas-envelopamento`, `lembrancinhas`.
2. Redimensione para ~1200×900 px (proporção 4:3) e comprima (squoosh.app funciona bem). Foto pesada = site lento = Google penaliza.
3. Rode `node gerar.js`. As páginas de produto passam a usar a foto.
4. No `index.html`, troque manualmente `img/produtos/<slug>.svg` por `<slug>.jpg` nos cards.

## Editar textos

- Textos dos produtos: `dados/produtos.json` → rode `node gerar.js`.
- Textos da página principal: direto no `index.html`.
- WhatsApp, e-mail, endereço: `dados/config.json` → rode `node gerar.js`. No `index.html` troque à mão (busque por `5561991104744`).

## Antes de publicar

1. **Domínio.** Registre um `.com.br` no registro.br (~R$ 40/ano). Sugestão: `nmpersonalizacao.com.br`.
   Depois troque `https://nmpersonalizacaodf.com.br` em `dados/config.json` e em `index.html`, e rode `node gerar.js`.
2. **Hospedagem gratuita.** Qualquer um destes serve para site estático:
   - Netlify (arrasta a pasta em app.netlify.com/drop)
   - Vercel
   - GitHub Pages
   - Cloudflare Pages
   Todos dão HTTPS grátis. Aponte o domínio para o serviço escolhido.
3. **Coordenadas do mapa.** `geo` no `dados/config.json` e no JSON-LD do `index.html` está com um ponto aproximado do Recanto das Emas. Abra o Google Maps, clique com o botão direito na casa, copie lat/lng e substitua.

## Aparecer no Google (o que pesa de verdade)

O site sozinho não ranqueia. A combinação abaixo é o que faz uma loja local aparecer nos primeiros resultados:

1. **Perfil da Empresa no Google (gratuito, o mais importante).**
   business.google.com → criar perfil "NM Personalização", categoria "Loja de brindes personalizados" ou "Serviço de impressão", endereço, telefone, horário, link do site, fotos dos produtos. O Google manda um código por correio/telefone para confirmar. Depois disso a loja aparece no Google Maps e no bloco de "empresas locais" da busca.
2. **Avaliações.** Peça a cada cliente satisfeito para avaliar no Google (o perfil gera um link curto para isso). Quantidade e recência de avaliações é o fator nº 1 do ranking local.
3. **Google Search Console.** search.google.com/search-console → adicionar o domínio → enviar `sitemap.xml`. Mostra em que buscas o site aparece e avisa de erros.
4. **Fotos reais.** Substitua os placeholders. Fotos de trabalhos reais convertem muito mais e o Google indexa imagens.
5. **Postar no Instagram e linkar o site na bio.** Cada post de trabalho novo = prova social + tráfego.
6. **Consistência de dados.** Nome, endereço e telefone devem ser idênticos no site, no Perfil da Empresa e no Instagram.
7. **Paciência.** Um site novo leva de 2 a 6 meses para consolidar posição. O Perfil da Empresa aparece muito antes.

## O que já está feito no código para SEO

- Título e descrição únicos por página, com "Recanto das Emas" e "Brasília-DF"
- Uma página por produto (cada busca "caneca personalizada Recanto das Emas" tem uma página que responde)
- Dados estruturados (JSON-LD): `LocalBusiness`, `Service`, `FAQPage`, `BreadcrumbList`
- `sitemap.xml`, `robots.txt`, `canonical`, Open Graph para compartilhar no WhatsApp/Instagram
- Mobile-first, fontes com `display=swap`, imagens com `loading="lazy"` e dimensões declaradas
- Sem framework, sem JS pesado — carrega rápido em 4G

## Testar localmente

```
npx serve .
```

ou abra o `index.html` direto no navegador (o mapa e as fontes precisam de internet).
