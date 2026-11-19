import type { APIRoute } from 'astro';
import {production} from '../lib/data';
export const GET:APIRoute=()=>new Response(production?`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /system/\nDisallow: /ajax/\nDisallow: /novostalentos/\nDisallow: /concurso-beatles-sinfonico-pitagoras/\nSitemap: https://cafecomletras.com.br/sitemap-index.xml\n`:'User-agent: *\nDisallow: /\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}});
