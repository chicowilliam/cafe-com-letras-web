import {eventState} from '../lib/event-state';
const dialog=document.querySelector<HTMLDialogElement>('#cookie-preferences');
let opener:HTMLElement|null=null;
document.querySelectorAll<HTMLButtonElement>('[data-cookie-preferences]').forEach(button=>button.addEventListener('click',()=>{opener=button;if(dialog){dialog.showModal();dialog.scrollTop=0;dialog.querySelector<HTMLElement>('#cookie-title')?.focus({preventScroll:true});}}));
dialog?.addEventListener('close',()=>opener?.focus()); // Native dialog traps focus, handles Escape and inerts the page.
dialog?.addEventListener('keydown',event=>{
 if(event.key!=='Tab')return;
 const controls=Array.from(dialog.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),[tabindex="0"]'));
 const first=controls[0],last=controls.at(-1);if(!first||!last)return;
 if(event.shiftKey&&(document.activeElement===first||document.activeElement===dialog.querySelector('#cookie-title'))){event.preventDefault();last.focus();}
 else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
});
document.querySelector('[data-clear-preferences]')?.addEventListener('click',()=>{
 document.cookie='unity=; Path=/; Max-Age=0; SameSite=Lax'+(location.protocol==='https:'?'; Secure':'');
 let message='Preferência de unidade removida.';
 try{sessionStorage.removeItem('cafe-agenda-filter');message='Preferências locais removidas. Não há consentimentos opcionais ativos.';}catch{message+=' O navegador impediu acesso ao armazenamento da sessão.';}
 const status=document.querySelector('[data-preferences-status]');if(status)status.textContent=message;
});
document.querySelectorAll('[data-current-year]').forEach(node=>node.textContent=String(new Date().getFullYear()));
document.querySelector<HTMLAnchorElement>('[data-skip-content]')?.addEventListener('click',event=>{
 const main=Array.from(document.querySelectorAll<HTMLElement>('main')).find(node=>node.getClientRects().length);
 if(main){event.preventDefault();main.tabIndex=-1;main.focus();main.scrollIntoView();}
});
function updateEvents(){document.querySelectorAll<HTMLElement>('[data-event-start]').forEach(node=>{
 const state=eventState(node.dataset.eventStart!,node.dataset.eventEnd);node.dataset.eventState=state;
 const label=node.querySelector('[data-event-status]');if(label)label.textContent=state;
});}
updateEvents();const timer=window.setInterval(updateEvents,60000);window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});
