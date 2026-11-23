const publicRobots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /system/
Disallow: /ajax/
Disallow: /novostalentos/
Disallow: /concurso-beatles-sinfonico-pitagoras/
Sitemap: https://cafecomletras.com.br/sitemap-index.xml
`;

export function robotsResponse(indexable: boolean) {
 return new Response(indexable ? publicRobots : 'User-agent: *\nDisallow: /\n', {
  headers: { 'Content-Type': 'text/plain; charset=utf-8' },
 });
}
