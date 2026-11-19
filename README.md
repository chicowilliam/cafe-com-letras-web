# Café com Letras — migração fiel

Migração do site público recuperado para **Astro + TypeScript estático**, preservando a aparência desktop/mobile do ASP. O redesign anterior foi arquivado privadamente. Nenhum deploy ou alteração em Original, Dev, SQL, produção ou DNS foi realizado.

## Executar localmente

Node utilizado: 24.14.1 (`.nvmrc`); dependências já instaladas neste computador.

```powershell
cd C:\Users\User1\Desktop\CafeComLetras-Web
npm.cmd run check
npm.cmd run build
npm.cmd run test:artifacts
npm.cmd run preview
```

Abrir **http://localhost:4321**. Somente loopback; Ctrl+C encerra. `preview` emula os redirecionamentos Pages e sempre aplica cabeçalho de não indexação local. O build padrão também contém HTML/robots de prévia. `npm.cmd run dev` serve para editar templates, sem a emulação de URLs legadas.

```powershell
npm.cmd run build:production
npm.cmd run test:artifacts
```

Esse comando gera `dist` indexável, **sem publicar**. Em computador novo, `npm ci` instala as versões do lockfile. No Cloudflare, utilizar `npm run build`, com DEPLOY_ENV distinto para Production/Preview, conforme o guia abaixo.

## Organização

- `src/pages`, `src/layouts`: 14 páginas públicas equivalentes e 404.
- `src/data`: somente dados públicos exportados, templates capturados do ASP e metadados de imagens.
- `src/lib`: contratos tipados, renderização de agenda/cardápios, sanitização, URLs e SEO.
- `src/client/fidelity.ts`: navegação, calendário, carrosséis e galeria em JavaScript nativo; sem plugins antigos.
- `public`: CSS, fontes, imagens e PDFs públicos selecionados. Arquivos originais continuam disponíveis nos caminhos recuperados; derivados são adicionais.
- `functions/_middleware.ts`: compatibilidade mínima de URLs; nenhum backend de negócio ou acesso ao banco.
- `scripts/build.mjs`: geração de HTML, dados mensais, sitemap, robots, redirects e cabeçalhos.
- `scripts/serve.mjs`: prévia em 127.0.0.1. `tests/artifacts.mjs`: verificações de saída e middleware.
- `evidencias/fiel`: screenshots e resultados desta migração; evidências anteriores de redesign não são referência de aceite.

Não há MySQL, ODBC, credenciais, SQL, ASP, administração ou documentos privados no pacote publicado. O build não depende do banco local. Dados são um retrato público do acervo recuperado, não uma consulta em tempo real.

## Limites para publicação

O site estático não substitui sozinho envios de contato, reservas e outros serviços externos ainda não homologados. A atualização editorial precisa de um procedimento aprovado de nova exportação/build; não existe painel novo. A unidade Liberdade mantém o aviso de que não está funcionando. Preços, PDFs e agenda precisam de aceite comercial antes do corte.

- [Relatório da migração](docs/RELATORIO-MIGRACAO-FIEL.md)
- [Mapa de URLs e contratos antigos](docs/MAPA-URLS.md)
- [Cloudflare, domínio, DNS e Google Search Console](docs/SEO-GSC-DEPLOY.md)

Não copiar o backup SQL ou o acervo privado para este projeto. Publicação e DNS aguardam autorização separada.