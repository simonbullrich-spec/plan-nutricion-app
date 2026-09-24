import { F, P, W, TRAIN, WATER, it } from "./data.js";

export const KEY = "plan-recomp-v2";

// ---------- estado persistido ----------
export function loadState() {
  let S = { v:{}, done:{}, tr:{}, wa:{}, sel:(new Date().getDay()+6)%7 };
  try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) {}
  S.tr=S.tr||{}; S.wa=S.wa||{}; S.skip=S.skip||{}; S.eat=S.eat||{}; S.cdone=S.cdone||{}; S.closed=S.closed||{};
  return S;
}
export function saveState(S) { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

// ---------- cálculos ----------
export function macros(items){let k=0,p=0,c=0,g=0;items.forEach(({k:f,q})=>{const d=F[f];k+=d[2]*q;p+=d[3]*q;c+=d[4]*q;g+=d[5]*q;});return {k:Math.round(k),p:Math.round(p),c:Math.round(c),g:Math.round(g)};}
export function qty({k,q}){const u=F[k][1];if(u==="u")return q+(q===1?" unidad":" unidades");if(u==="g")return q+" g";if(u==="ml")return q+" ml";if(u==="cdita")return q+" cdita";return q+" "+u;}
export const fmt=n=>n.toLocaleString("es-AR");
export const name=k=>F[k][0];

export function dayPlan(S,d){
  return W[d].s.map((s,i)=>{const pool=P[s[2]],key=d+"-"+i;const idx=(S.v[key]!==undefined?S.v[key]:s[3])%pool.length;
    return {key,t:s[0],n:s[1],pn:s[2],pool,idx,opt:pool[idx],m:macros(pool[idx].items)};});
}
export function total(S,plan,onlyDone){return plan.reduce((a,x)=>{if(onlyDone&&!S.done[x.key])return a;a.k+=x.m.k;a.p+=x.m.p;a.c+=x.m.c;a.g+=x.m.g;return a;},{k:0,p:0,c:0,g:0});}

export function timeline(S,d){
  const items=dayPlan(S,d).map(x=>({type:"meal",t:x.t,key:x.key,x}));
  TRAIN[d].forEach((g,i)=>items.push({type:"gym",t:g[0],key:"g-"+d+"-"+i,title:g[1],note:g[2]}));
  WATER[d].forEach((w,i)=>items.push({type:"water",t:w[0],key:"w-"+d+"-"+i,i,n:WATER[d].length}));
  return items.sort((a,b)=>a.t.localeCompare(b.t)||(a.type==="water"?-1:1));
}

export function eaten(S,x){if(!S.done[x.key])return null;const e=S.eat[x.key];return x.opt.items.map((_,i)=>e&&e.length===x.opt.items.length?!!e[i]:true);}
export function missing(S,x){const e=eaten(S,x);return e?x.opt.items.filter((_,i)=>!e[i]):[];}
export function consumed(S,x){const e=eaten(S,x);return macros(e?x.opt.items.filter((_,i)=>e[i]):[]);}

// ---------- comida salteada: cómo recuperarla ----------
const PROT=["bife","milapollo","milacarne","yogcol","huevo"], CARB=["arroz","fideos","granola","tostada","banana"];
function addFor(meal,list,idx,need,fallback){
  const found=list.find(k=>meal.opt.items.some(i=>i.k===k))||fallback;
  const per=F[found][idx], u=F[found][1];
  let q=need/per;
  q=u==="u"?Math.max(1,Math.round(q)):Math.max(20,Math.round(q/10)*10);
  if(found==="granola") q=Math.min(q,40);
  return it(found,q);
}
export function compensation(S,d){
  const plan=dayPlan(S,d);
  const gaps=[];
  plan.forEach(x=>{
    if(S.skip[x.key]) gaps.push({x,full:true,items:x.opt.items,m:x.m});
    else{const mi=missing(S,x);if(mi.length)gaps.push({x,full:false,items:mi,m:macros(mi)});}
  });
  if(!gaps.length) return null;
  const last=gaps.map(g=>g.x.t).sort().pop();
  const rem=plan.filter(x=>!S.skip[x.key]&&!missing(S,x).length&&x.t>last);
  const defP=gaps.reduce((a,g)=>a+g.m.p,0), defC=gaps.reduce((a,g)=>a+g.m.c,0);
  const training=TRAIN[d].some(g=>g[0]>last)||d===4;
  const needC=defC*(training?1:0.7);
  const res={gaps,defP,defC,training,byKey:{},extra:null,rem,small:false};
  if(defP<5&&defC<12){res.small=true;return res;}
  let gotP=0,gotC=0;
  if(rem.length){
    // se concentra en hasta 3 comidas: primero almuerzo/cena, nunca proteína justo antes de entrenar
    const pr=x=>/^(ALM|TUP|CEN)/.test(x.pn)?0:(["PRE_KICK","ENTRE","DES_PARTIDO"].includes(x.pn)?2:1);
    const n=defP<15&&defC<40?1:3;
    const pick=rem.slice().sort((a,b)=>pr(a)-pr(b)||a.t.localeCompare(b.t)).slice(0,n);
    const protMeals=pick.filter(x=>pr(x)<2);
    const sp=protMeals.length?Math.min(defP/protMeals.length,25):0, sc=Math.min(needC/pick.length,60);
    pick.sort((a,b)=>a.t.localeCompare(b.t)).forEach(x=>{
      const adds=[];
      if(sp>=4&&pr(x)<2) adds.push(addFor(x,PROT,3,sp,"yogcol"));
      if(sc>=8) adds.push(addFor(x,CARB,4,sc,"banana"));
      if(adds.length){const m=macros(adds);gotP+=m.p;gotC+=m.c;res.byKey[x.key]={adds,m};}
    });
  }
  const leftP=defP-gotP;
  if(leftP>=12){
    const q=Math.min(250,Math.max(100,Math.round(leftP/0.09/10)*10));
    const adds=[it("yogcol",q)]; if(needC-gotC>=25) adds.push(it("banana",1));
    res.extra={adds,m:macros(adds),key:d+"-extra",t:rem.length?"Snack extra":"Antes de dormir"};
  }
  return res;
}
export const addsText=adds=>adds.map(a=>qty(a)+" de "+name(a.k).toLowerCase()).join(" + ");

// ---------- cierre del día ----------
// Devuelve los datos; el componente DayClose los dibuja.
export function dayClose(S,d,comp,OPEN){
  const plan=dayPlan(S,d);
  const pendMeals=plan.filter(x=>!S.done[x.key]&&!S.skip[x.key]&&x.pn!=="NOCHE");
  const closed=!!S.closed[d]||(!pendMeals.length&&!plan.some(x=>OPEN.has(x.key)));
  const tl=timeline(S,d);
  const plan0=total(S,plan.filter(x=>x.pn!=="NOCHE"||S.done[x.key])); // lo opcional cuenta solo si lo comiste
  let got={p:0,c:0,k:0};
  plan.forEach(x=>{if(S.done[x.key]){const m=consumed(S,x);got.p+=m.p;got.c+=m.c;got.k+=m.k;}});
  const pend=[];
  if(comp&&!comp.small){
    Object.keys(comp.byKey).forEach(k=>{const cp=comp.byKey[k];if(S.cdone[k+"-c"]){got.p+=cp.m.p;got.c+=cp.m.c;got.k+=cp.m.k;}else pend.push(addsText(cp.adds));});
    if(comp.extra){if(S.cdone[comp.extra.key]){got.p+=comp.extra.m.p;got.c+=comp.extra.m.c;got.k+=comp.extra.m.k;}else pend.push(addsText(comp.extra.adds));}
  }
  const w=tl.filter(i=>i.type==="water"), wOk=w.filter(i=>S.done[i.key]).length;
  const g=tl.filter(i=>i.type==="gym"), gMiss=g.filter(i=>!S.done[i.key]);
  const row=(label,a,b,unit)=>{const pct=b?Math.round(a/b*100):100, st=pct>=90?"ok":pct>=75?"mid":"low";return {label,a,b,unit,pct,st};};
  // cada ítem: {b: texto en negrita, t: resto, ok: marcado como compensado}
  const items=[];
  plan.forEach(x=>{if(!S.done[x.key]&&!S.skip[x.key]){if(closed&&x.pn!=="NOCHE")items.push({b:x.n,t:"sin marcar"});}else if(S.skip[x.key])items.push({b:x.n,t:"salteada"});else{const mi=missing(S,x);if(mi.length)items.push({b:x.n,t:mi.map(i=>name(i.k).toLowerCase()).join(", ")});}});
  const compOk=comp&&!comp.small&&!pend.length&&(Object.keys(comp.byKey).length||comp.extra);
  if(compOk) items.forEach(i=>{i.ok=true;});
  pend.forEach(t=>items.push({b:"Compensación sin hacer",t}));
  if(wOk<w.length) items.push({b:"Agua",t:(w.length-wOk)+(w.length-wOk>1?" termos":" termo")+" sin terminar ("+((w.length-wOk)*0.94).toFixed(1).replace(".",",")+" L)"});
  gMiss.forEach(i=>items.push({b:i.title,t:"sin marcar"}));
  const rows=[row("Calorías",got.k,plan0.k,"kcal"),row("Proteínas",got.p,plan0.p,"g"),row("Carbohidratos",got.c,plan0.c,"g")];
  return {closed,manual:!!S.closed[d],rows,pendMeals,items};
}
