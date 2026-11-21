export function eventState(start:string,end?:string,now=new Date()):string {
 const beginning=new Date(start);if(!Number.isFinite(beginning.getTime()))return 'Data a confirmar';
 if(end&&Number.isFinite(Date.parse(end))){if(now.getTime()>=Date.parse(end))return 'Encerrado';if(now>=beginning)return 'Em andamento';}
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
 if(start.slice(0,10)<today)return 'Data passada';
 if(now>=beginning)return 'Iniciado · término não informado';
 return start.slice(0,10)===today?'Hoje · ainda não começou':'Futuro';
}
