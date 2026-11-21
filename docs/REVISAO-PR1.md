# Revisão do PR #1 — DJ Poetry

Revisados os 11 arquivos e os commits e49243e e 7691829.

Correções pontuais: o destaque mobile e o primeiro item da DJ deixam de anunciar “hoje” indefinidamente e mostram 20/11/2026; o destaque desktop inclui o ano. O perfil mostra datas completas e a data de consulta da agenda estática; o botão de reserva deixa de prometer “esta noite”. Fotos, recortes, arquitetura e funcionalidades do Claude foram preservados.

Validação local: npm ci (299 pacotes; zero vulnerabilidades), npm run build e npm run test:programacao aprovados. TypeScript: 27 arquivos sem erros ou avisos. Artefatos: 21 páginas, 17 URLs únicas no sitemap, recursos locais existentes, 17 redirecionamentos e 34 casos de política/rotas aprovados; 3.611 eventos reais preservados.

Playwright: Chromium e WebKit em 320, 375, 390, 414, 768 e 1440 px. Os 12 casos da página /artistas/dj-poetry/ retornam 200, largura do documento igual à viewport e imagens carregadas. Canonical correto, título H1, JSON-LD e links locais conferidos. WebP 440×550 e 800×1000 com srcset, dimensões e alt corretos. Capturas locais em output/pr1/.

A agenda continua estática e precisa de novo build para refletir alterações de dados; a consulta agora tem data explícita. Não foram inventadas apresentações futuras. Nenhum merge ou deploy foi realizado nesta revisão. PR apto à aprovação após estas correções.
