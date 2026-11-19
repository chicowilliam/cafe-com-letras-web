import type { UnitName } from './types';
export const origin = 'https://cafecomletras.com.br';
export function unitPath(unit: UnitName, mobile = false) { return mobile ? unit==='Savassi'?'/m/':'/m/liberdade/' : unit==='Savassi'?'/':'/liberdade/'; }
export function catalogPath(unit: UnitName, kind='all') { const prefix=unit==='Savassi'?'':'/liberdade';return prefix+(kind==='wine'?'/carta-de-vinhos/':kind==='dessert'?'/sobremesas/':'/cardapio/'); }
export function pagePath(key: string) {
  if(key==='linktree')return '/linktree/';if(key==='delivery')return '/delivery/';if(key==='prevention')return '/medidas-prevencao/';
  const [slug,kind]=key.split('-');const unit:UnitName=slug==='liberdade'?'Liberdade':'Savassi';
  return kind==='desktop'?unitPath(unit):kind==='mobile'?unitPath(unit,true):kind==='digital'?(unit==='Savassi'?'/cardapiodigital/':'/liberdade/cardapiodigital/'):catalogPath(unit,kind);
}
