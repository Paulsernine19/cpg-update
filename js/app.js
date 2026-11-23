function shuffleOpts(q){
  const idx=q.options.map((_,i)=>i).sort(()=>Math.random()-.5);
  return {...q,options:idx.map(i=>q.options[i]),answer:idx.indexOf(q.answer),fb:q.fb?idx.map(i=>q.fb[i]):undefined};
}
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const vsHTML=s=>s.was?`<div class="vs"><span><small>v2.5</small>${s.was}</span><i aria-hidden="true">→</i><span class="now"><small>v2.6</small>${s.now}</span></div>`:"";
function stepsFor(l){
  if(l.bank==="diag") return shuffle(DQ).map(q=>({type:"choice",label:"Still true or changed? · "+MODS[q.mod],...q}));
  if(l.bank==="all") return shuffle(FINAL_BANK).map(q=>({type:"choice",label:"Question",...shuffleOpts(q)}));
  if(l.bank) return QB.filter(q=>q.mod===l.bank).map(q=>({type:"choice",label:"Check · "+q.id,...shuffleOpts(q)}));
  return l.steps;
}
const stepCount=l=>l.bank==="diag"?DQ.length:l.bank==="all"?FINAL_BANK.length:l.bank?QB.filter(q=>q.mod===l.bank).length:l.steps.length;

/* ============================ STATE ============================ */
const KEY="stepwise-cpg26-v1";
const blank=()=>({done:{},xp:0,streak:0,last:null,days:[],current:"intro",results:{},video:false,lookups:{},conf:{},cards:{},sim:null,tourDone:false,refItem:null,refView:"books",fixed:{}});
let S=blank();
try{const raw=localStorage.getItem(KEY); if(raw) S={...blank(),...JSON.parse(raw)};}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const ymd=d=>d.toLocaleDateString("en-CA");
const today=()=>ymd(new Date());

const allLessons=c=>c.units.flatMap(u=>u.lessons);
const courseById=id=>COURSES.find(c=>c.id===id)||COURSES[0];
const lessonById=id=>{for(const c of COURSES){const l=allLessons(c).find(x=>x.id===id);if(l)return {c,l}}return null};
const doneCount=c=>allLessons(c).filter(l=>S.done[l.id]).length;
const courseDone=c=>doneCount(c)===allLessons(c).length;
const nextLesson=c=>allLessons(c).find(l=>!S.done[l.id]);
const reqMet=c=>(c.requires||[]).every(id=>courseDone(courseById(id)));
function isUnlocked(c,l){ if(!reqMet(c)) return false; const ls=allLessons(c);const i=ls.indexOf(l);return i===0||S.done[ls[i-1].id]||S.done[l.id];}
let homeOverride=null; // set by the app tour to show a specific course's path on Learn
function activeCourse(){ if(homeOverride) return courseById(homeOverride); const c=courseById(S.current); if(reqMet(c)&&nextLesson(c)) return c; return COURSES.find(x=>reqMet(x)&&nextLesson(x))||c; }
const lessonsAll=()=>COURSES.flatMap(allLessons);
const lessonsDone=()=>lessonsAll().filter(l=>S.done[l.id]).length;
const coursePct=()=>Math.round(lessonsDone()/lessonsAll().length*100);
const minsLeft=()=>Math.round(COURSES.reduce((a,c)=>a+(c.minutes||0)*(1-doneCount(c)/allLessons(c).length),0)/5)*5;
const fmtMins=m=>m<=0?"Done":m<60?m+" min":Math.floor(m/60)+" h"+(m%60?" "+m%60+" min":"");
const PASS="Pass mark: 100% in the final assessment.";

/* ============================ ICONS ============================ */
const I={
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  courses:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>',
  profile:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" stroke-linecap="round"/></svg>',
  flame:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 1.5-5 3-6 0 2 1 3 2 3-1-3 0-6 1-9z"/></svg>',
  bolt:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
  quiz:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M9.2 9a3 3 0 1 1 4.3 2.7c-.9.4-1.5 1.2-1.5 2.1v.4"/><circle cx="12" cy="18" r=".8" fill="currentColor"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  left:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  warn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5" stroke-linecap="round"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M9 8h6"/></svg>',
  flag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>',
  award:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 21l5-2.5 5 2.5-1.5-7"/></svg>',
  trauma:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z"/><path d="M12 8.5v7M8.5 12h7" stroke-linecap="round" stroke-width="2.6"/></svg>',
  newborn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="13" r="7.5"/><path d="M12 5.5c0-1.5 1.2-2.5 2.5-2.5"/><circle cx="9.3" cy="12" r=".6" fill="currentColor"/><circle cx="14.7" cy="12" r=".6" fill="currentColor"/><path d="M9.8 15.5c1.3 1 3.1 1 4.4 0"/></svg>',
  cardiac:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M12 20.5S3.5 15 3.5 9A4.5 4.5 0 0 1 12 6.6 4.5 4.5 0 0 1 20.5 9c0 6-8.5 11.5-8.5 11.5z"/><path d="M6 12h3l1.5-2.5 2 5 1.5-2.5h4"/></svg>',
  stroke:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5.5a3 3 0 0 0-5.6-1.2A3 3 0 0 0 4 8.5a3.2 3.2 0 0 0 .6 5.6A3 3 0 0 0 9 18.5a3 3 0 0 0 3 1.5z"/><path d="M12 5.5a3 3 0 0 1 5.6-1.2A3 3 0 0 1 20 8.5a3.2 3.2 0 0 1-.6 5.6A3 3 0 0 1 15 18.5a3 3 0 0 1-3 1.5z"/><path d="M14.5 8l-1.5 3h2.5l-2 3.5"/></svg>'
};
const BRAND=`<img class="bmark" src="brand/hmcas-mark.webp" alt="" width="32" height="32"><span>CPG v2.6<small>HMCAS UPDATE</small></span>`;
I.reference=I.book;
I.sound='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
I.mute='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M22 9l-6 6M16 9l6 6"/></svg>';
I.cards='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="7" y="3" width="13" height="16" rx="2.5"/><path d="M4 7v12a2 2 0 0 0 2 2h10"/></svg>';
I.syringe='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2l4 4M20 4l-9.5 9.5M8 8l8 8M14.5 5.5l4 4L9 19H5v-4z"/><path d="M5 19l-3 3"/></svg>';
I.clock='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
const CONF=[["guess","Guessing"],["fair","Fairly sure"],["sure","Certain"]];
// module icons: full-colour tiles in brand/modules/<course id>.svg (shown as <img> so their internal gradient ids never clash)
const MOD_ICONS=["intro","trauma","newborn","cardiac","stroke","final"];
const iconBox=(c,size)=>MOD_ICONS.includes(c.id)?`<div class="icon mod" style="${size?`width:${size}px;height:${size}px`:''}"><img src="brand/modules/${c.id}.svg" alt="" draggable="false"></div>`
  :`<div class="icon" style="background:var(${c.hue});${size?`width:${size}px;height:${size}px`:''}">${I[c.icon]}</div>`;
const GLOSS=[["AP","Ambulance Paramedic"],["CCP","Critical Care Paramedic"],["CPG","Clinical Practice Guideline"],["TXA","Tranexamic acid"],["TBI","Traumatic brain injury"],["GCS","Glasgow Coma Scale"],["PPH","Postpartum haemorrhage"],["SMR","Spinal motion restriction"],["MAP","Mean arterial pressure"],["PEEP","Positive end-expiratory pressure"],["BVM","Bag-valve-mask"],["ROSC","Return of spontaneous circulation"],["DSED","Dual sequential external defibrillation"],["SGA","Supraglottic airway"],["e-CPR","Extracorporeal cardiopulmonary resuscitation"],["HOTT","Hypovolaemia, oxygenation, tension pneumothorax, tamponade"],["BEFAST","Balance, Eyes, Face, Arm, Speech, Time"],["RACE","Rapid Arterial oCclusion Evaluation scale"],["RBS","Random blood sugar"],["HGH","Hamad General Hospital"],["ED","Emergency department"],["ETA","Estimated time of arrival"]];

/* ============================ VIEWS ============================ */
const NAV=[["home","Learn"],["courses","Modules"],["profile","Progress"]];
let view="home", courseView=null, filter="All", confirmReset=false, refMod="trauma", refGrp="trauma", refBack=null;

// filled versions of the menu icons, shown on the active tab
const NAV_FILL={
  home:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path fill-rule="evenodd" d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  courses:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>',
  reference:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" fill="currentColor"/><path d="M4 21V5"/><path d="M9 8h6" stroke="var(--nav-cut,#fff)"/></svg>',
  profile:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6z" stroke-linejoin="round"/></svg>'};
const navActive=k=>view===k||(view==="course"&&k==="courses");
const navBadge=k=>{const n=k==="profile"?reviewCount():0;return n?`<b class="tab-badge" aria-hidden="true">${n>9?"9+":n}</b>`:""};
const navLabel=(k,t)=>{const n=k==="profile"?reviewCount():0;return n?`${t}, ${n} question${n>1?"s":""} to review`:t};
const tabHTML=(k,t)=>`<button class="tab" data-go="${k}" aria-label="${navLabel(k,t)}" ${navActive(k)?'aria-current="page"':''}><i class="tab-ic"><span class="ic-o">${I[k]}</span><span class="ic-f">${NAV_FILL[k]}</span>${navBadge(k)}</i><span class="tab-t">${t}</span></button>`;
function renderNav(){
  document.getElementById("sideTabs").innerHTML=NAV.map(([k,t])=>tabHTML(k,t)).join("");
  // bottom menu (phone/tablet): built once, then updated in place so the highlight slides between tabs
  const bt=document.getElementById("bottomTabs");
  if(!bt.querySelector(".tab-ind")){bt.innerHTML=`<i class="tab-ind" aria-hidden="true"></i>`+NAV.map(([k,t])=>tabHTML(k,t)).join("");
    bt.addEventListener("pointerdown",e=>{if(e.target.closest(".tab")&&navigator.vibrate)try{navigator.vibrate(8)}catch(x){}},{passive:true});}
  else NAV.forEach(([k,t])=>{const b=bt.querySelector(`[data-go="${k}"]`);if(navActive(k))b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");
    b.setAttribute("aria-label",navLabel(k,t));const ic=b.querySelector(".tab-ic"),old=ic.querySelector(".tab-badge"),nb=navBadge(k);if(old)old.remove();if(nb)ic.insertAdjacentHTML("beforeend",nb);});
  const ai=NAV.findIndex(([k])=>navActive(k));bt.style.setProperty("--i",ai);bt.classList.toggle("noind",ai<0);
  document.getElementById("sideBrand").innerHTML=BRAND;
}
function topbar(){
  return `<div class="topbar"><div class="brand">${BRAND}</div>
  <div class="pills"><span class="pill" title="Course completed" style="color:var(--good)">${I.check}${coursePct()}%<span class="pill-x"> done</span></span><span class="pill" title="Estimated time left" style="color:var(--accent)">${I.clock}${minsLeft()>0?fmtMins(minsLeft())+`<span class="pill-x"> left</span>`:"Finished"}</span></div></div>`;
}
function nodeIcon(l,done,open,isNext){
  if(done) return I.check; if(!open) return I.lock;
  if(isNext) return I.play; return l.mode?I.quiz:I.star;
}
function nodeSub(l,done,open){
  const r=S.results[l.id];
  if(done&&r&&r.n) return l.mode==="diag"?"Done":`${r.r}/${r.n} correct`;
  if(done) return "Completed"; if(!open) return "Locked";
  return l.mode==="exit"?"Module check":l.mode==="final"?FINAL_BANK.length+" questions":l.mode==="diag"?"Ungraded":stepCount(l)+" steps";
}
function pathHTML(c,compact){
  const offs=[0,48,72,48,0,-48,-72,-48];let n=0;const nxt=reqMet(c)?nextLesson(c):null;
  const nodes=u=>u.lessons.map(l=>{
    const done=S.done[l.id],open=isUnlocked(c,l),isNext=nxt&&nxt.id===l.id;const off=offs[n++%offs.length];
    const cls=done?"done":open?(isNext?"next":""):"locked";
    return `<button class="node ${cls}" style="--hue:var(${c.hue});transform:translateX(${off}px)" data-lesson="${l.id}" ${open?"":'aria-disabled="true"'}>
      <span class="disc">${nodeIcon(l,done,open,isNext)}</span><span class="t">${l.title}</span><span class="s">${nodeSub(l,done,open)}</span></button>`}).join("");
  const name=(u,ui)=>(c.units.length>1?"Part "+(ui+1)+" · ":"")+u.title;
  // current part: the one holding the next lesson (or the first unfinished one)
  const cur=c.units.findIndex(u=>u.lessons.some(l=>nxt&&l.id===nxt.id));
  return `<div class="path">`+c.units.map((u,ui)=>{
    if(!compact||ui===cur||cur<0) return `<div class="unit"><span class="label">${name(u,ui)}</span></div>`+nodes(u);
    const d=u.lessons.filter(l=>S.done[l.id]).length,t=u.lessons.length,fin=d===t,k="path-"+c.id+"-"+ui,op=FOLD.has(k)?FOLD.get(k):false;
    const body=nodes(u);
    return `<details class="pfold ${fin?"fin":""}" data-fold="${k}"${op?" open":""}><summary><span class="pf-ic">${fin?I.check:I.lock}</span><span class="pf-t">${name(u,ui)}</span><span class="pf-m">${fin?"Completed":d?d+" of "+t+" done":t+" lesson"+(t>1?"s":"")}</span>${FOLD_CHEV}</summary><div class="pf-b">${body}</div></details>`;}).join("")+`</div>`;
}
function lockText(c){const m=(c.requires||[]).filter(id=>!courseDone(courseById(id))).map(id=>courseById(id).title);return m.length?"Complete "+(m.length>2?"all four modules":m.join(" and "))+" first":"";}
const reviewCard=()=>{const n=reviewCount();return n?`<div class="revcard"><div class="icon" style="background:var(--bad)">${I.warn}</div><div><div class="label">Review</div><h3>${n} question${n>1?"s":""} to review</h3><p>Questions answered incorrectly on the first try. Each one clears when answered correctly.</p></div><button class="btn" data-act="review">Start review</button></div>`:""};
function homeView(){
  const c=activeCourse(),nl=nextLesson(c),h=new Date().getHours(),d=doneCount(c),t=allLessons(c).length;
  const greet=h<12?"Good morning":h<18?"Good afternoon":"Good evening";
  const cv=typeof MOD_COVERS!=="undefined"&&MOD_COVERS[c.id],dm=CHANGES[c.id]?c.id:"trauma",rv=reviewCount();
  const hero=`<div class="ccard ${cv?"pic":""}">${cv?`<img class="hero-img" src="${cv.img}" alt="" style="object-position:${cv.pos||"50% 50%"}">`:""}
    <div class="hero-in"><span class="label">${c.category} · ${c.title}</span><h2>${nl?nl.title:"All modules complete"}</h2>
    <div class="hero-prog"><div class="bar"><i style="width:${t?d/t*100:0}%"></i></div><span>${d} of ${t} lessons</span></div>
    ${nl?`<button class="btn" data-lesson="${nl.id}">${I.play.replace('<svg','<svg width="18" height="18"')} ${d?"Continue":"Start"}</button>`:`<button class="btn" data-go="profile">See your results</button>`}</div></div>`;
  const tile=(on,attrs,icon,title,sub)=>`<button class="stile ${on?"on":""}" ${attrs}>${icon}<b>${title}</b><small>${sub}</small></button>`;
  const tiles=`<div class="stiles">${tile(rv,rv?'data-act="review"':'aria-disabled="true"',I.warn,"Review",rv?rv+" to review":"Nothing to review")}
    ${tile(false,`data-ask="${dm}"`,I.ask,"Ask CPG","Questions on v2.6")}</div>`;
  const path=`<div class="section"><div class="section-head"><h2>${c.title}</h2><button class="link" data-course-open="${c.id}">Module overview</button></div>${pathHTML(c,true)}</div>`;
  return topbar()+`<div class="hello compact"><h1>${greet}</h1></div>
  <div class="homegrid"><div class="hg-main">${hero}<div class="hg-mob">${tiles}</div>${path}</div><aside class="hg-side">${tiles}</aside></div>`;
}
function courseCard(c){
  const d=doneCount(c),t=allLessons(c).length,locked=!reqMet(c);
  return `<button class="course ${locked?"locked":""}" data-course-open="${c.id}">${iconBox(c)}<div><div class="label">${c.category} · ${c.minutes} min</div><h3 style="margin-top:4px">${c.title}</h3><p style="margin-top:6px">${c.desc}</p></div>
  ${locked?`<div class="lockline">${I.lock}${lockText(c)}</div>`:`<div><div class="meta"><span>${d===t?"Completed":d?"In progress":"Not started"}</span><span>${d}/${t}</span></div><div class="bar" style="margin-top:6px"><i style="width:${t?d/t*100:0}%"></i></div></div>`}</button>`;
}
// Modules tab: 3D card carousel over the orientation photo. The centre card holds the details and actions; side cards show title only and bring themselves to the centre when tapped.
let cfIdx=null;
const cfState=c=>{const d=doneCount(c),t=allLessons(c).length;return !reqMet(c)?"Locked":d===0?"Not started":d===t?"Completed":"In progress"};
function coursesView(){
  const cats=["All","Not started","In progress","Completed"];
  const list=COURSES.filter(c=>filter==="All"||(cfState(c)==="Locked"?"Not started":cfState(c))===filter);
  if(cfIdx===null||cfIdx>=list.length){const k=list.findIndex(c=>c.id===(S.lastMod||activeCourse().id));cfIdx=k<0?0:k;}
  const cv=c=>typeof MOD_COVERS!=="undefined"&&MOD_COVERS[c.id];
  return topbar()+`<div class="cf-page">
  <div class="cf-filter glass" role="group" aria-label="Filter by status">${cats.map(k=>`<button class="chip" data-filter="${k}" aria-pressed="${filter===k}">${k}</button>`).join("")}</div>
  ${list.length?`<div class="cf-stage" id="cfStage" tabindex="0" aria-roledescription="carousel" aria-label="Modules. Use the arrow keys to move between them.">${list.map((c,i)=>cfCard(c,i,list.length)).join("")}</div>
  <div class="cf-dock glass"><button class="cf-nav" data-cf="-1" aria-label="Previous module">${I.left}</button><div class="cf-cur" id="cfCur" aria-live="polite"></div><button class="cf-nav next" data-cf="1" aria-label="Next module">${I.left}</button></div>
  ${list.length>1?`<div class="cf-dots" id="cfDots">${list.map((c,i)=>`<button aria-label="Show ${c.title}" data-cfi="${i}"></button>`).join("")}</div>`:""}`:`<p class="cf-empty glass">No modules here yet.</p>`}</div>`;
}
function cfCard(c,i,n){
  const d=doneCount(c),t=allLessons(c).length,locked=!reqMet(c),nl=nextLesson(c),cv=typeof MOD_COVERS!=="undefined"&&MOD_COVERS[c.id],last=c.id===(S.lastMod||"");
  const act=locked?"":nl?`<button class="btn sm" data-lesson="${nl.id}">${d?"Continue":"Start"}</button>`:`<button class="btn sm" data-course-open="${c.id}">Review</button>`;
  return `<article class="cf-card ${locked?"locked":""}" data-cfi="${i}" aria-label="${c.title}, module ${i+1} of ${n}">
   ${cv?`<img class="cf-bgimg" src="${cv.img}" alt="" draggable="false"><img class="cf-img" src="${cv.img}" alt="" style="object-position:${cv.pos||"50% 50%"}" draggable="false">`:`<div class="cf-ico">${iconBox(c,96)}</div>`}
   <div class="cf-top"><button class="cf-pill" data-course-open="${c.id}" tabindex="-1">${I.book} Overview</button>${last?`<span class="cf-pill tag">Last visited</span>`:""}</div>
   <div class="cf-glass"><span class="cf-cat">${c.category}</span>
    <div class="cf-h"><h3>${c.title}</h3><span class="cf-n">${i+1} / ${n}</span></div>
    <div class="cf-more"><p>${c.desc}</p>
     <div class="cf-stats"><span>${I.check} ${d} / ${t} lessons</span><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg> ${c.minutes} min</span></div>
     ${locked?`<div class="lockline">${I.lock}${lockText(c)}</div>`:`<div class="bar"><i style="width:${t?d/t*100:0}%"></i></div><div class="cf-btns">${act}</div>`}</div></div></article>`;
}
// layout: each card is placed by its offset from the centre (translate, rotateY, scale); swipe, drag, arrow keys, dots and the dock buttons move it
function modsMount(){const st=document.getElementById("cfStage");if(!st)return;const cards=[...st.children],n=cards.length,dots=document.getElementById("cfDots"),cur=document.getElementById("cfCur");
  const lay=()=>{const w=st.clientWidth,cw=cards[0].offsetWidth,gap=Math.min(cw*.62,w*.3);
    cards.forEach((el,i)=>{const o=i-cfIdx,a=Math.abs(o),s=Math.sign(o);el.classList.toggle("on",o===0);el.setAttribute("aria-hidden",o!==0);
      el.querySelectorAll("button").forEach(b=>b.tabIndex=o===0?0:-1);
      el.style.transform=o===0?"translateX(-50%)":`translateX(calc(-50% + ${s*(gap+(a-1)*gap*.55)}px)) translateZ(${-120*a}px) rotateY(${-s*28}deg) scale(${1-a*.12})`;
      el.style.zIndex=10-a;el.style.opacity=a>2?0:1;el.style.pointerEvents=a>2?"none":"";});
    if(dots)[...dots.children].forEach((d,i)=>{d.classList.toggle("on",i===cfIdx);d.setAttribute("aria-current",i===cfIdx?"true":"false")});
    const c=COURSES.find(x=>x.id===cards[cfIdx].querySelector("[data-course-open]").dataset.courseOpen),cv=typeof MOD_COVERS!=="undefined"&&MOD_COVERS[c.id];
    cur.innerHTML=`${cv?`<img src="${cv.img}" alt="" style="object-position:${cv.pos||"50% 50%"}">`:iconBox(c,44)}<div><b>${c.title}</b><small>${cfState(c)} · ${c.minutes} min</small></div>`;
    document.querySelectorAll("[data-cf]").forEach(b=>b.disabled=b.dataset.cf<0?cfIdx<=0:cfIdx>=n-1);};
  const to=k=>{k=Math.max(0,Math.min(n-1,k));if(k===cfIdx)return;cfIdx=k;lay();const c=cards[k].querySelector("[data-course-open]").dataset.courseOpen;if(S.lastMod!==c){S.lastMod=c;save()}};
  lay();requestAnimationFrame(()=>st.classList.add("ready"));
  if(modsMount.rz)removeEventListener("resize",modsMount.rz);modsMount.rz=lay;addEventListener("resize",lay,{passive:true});
  document.querySelectorAll("[data-cf]").forEach(b=>b.onclick=()=>to(cfIdx+ +b.dataset.cf));if(dots)dots.onclick=e=>{const b=e.target.closest("[data-cfi]");if(b)to(+b.dataset.cfi)};
  st.addEventListener("keydown",e=>{if(e.key==="ArrowRight"){e.preventDefault();to(cfIdx+1)}else if(e.key==="ArrowLeft"){e.preventDefault();to(cfIdx-1)}});
  // swipe/drag: horizontal movement over 40px moves one card; a tap on a side card centres it
  let p=null,moved=0;st.addEventListener("pointerdown",e=>{if(e.button)return;p={x:e.clientX,y:e.clientY};moved=0});
  st.addEventListener("pointermove",e=>{if(!p)return;const dx=e.clientX-p.x;if(Math.abs(dx)>Math.abs(e.clientY-p.y)&&Math.abs(dx)>40){to(cfIdx+(dx<0?1:-1));p=null;moved=Date.now()}},{passive:true});
  addEventListener("pointerup",()=>{p=null},{passive:true});
  st.addEventListener("click",e=>{if(Date.now()-moved<350){e.stopPropagation();e.preventDefault();return}const card=e.target.closest(".cf-card");if(card&&!card.classList.contains("on")){e.stopPropagation();e.preventDefault();to(+card.dataset.cfi)}},true);}
function courseDetail(){
  const c=courseById(courseView),d=doneCount(c),t=allLessons(c).length,nl=nextLesson(c),locked=!reqMet(c);
  return topbar()+`<button class="back" data-go="courses">${I.left} Modules</button>
  <div class="hero">${iconBox(c,72)}<div style="display:grid;gap:8px"><span class="label">${c.category} · about ${c.minutes} min</span><h1>${c.title}</h1><p>${c.desc}</p>${c.coverage?`<p class="coverage"><b>Covers:</b> ${c.coverage}</p>`:""}</div>
  <div class="stats"><span><b>${t}</b> lessons</span><span><b>${Math.round(d/t*100)}%</b> complete</span>${S.results[c.id[0]+"-x"]?"":""}</div>
  <div class="bar"><i style="width:${d/t*100}%"></i></div>
  <div class="danger">${locked?`<div class="lockline">${I.lock}${lockText(c)}</div>`:nl?`<button class="btn" data-lesson="${nl.id}">${d?"Continue":"Start"}</button>`:""}${CHANGES[c.id]?`<button class="btn ghost" data-ask="${c.id}">${I.ask.replace('<svg','<svg width="18" height="18"')} Ask CPG</button>`:""}</div></div>
  ${pathHTML(c)}`;
}
// Foldable sections (Progress tab, Reference list view). FOLD remembers the learner's open/closed choice across re-renders;
// sections they have not touched follow `auto` (opened when something needs attention).
const FOLD=new Map();
const FOLD_CHEV='<svg class="fold-chev" viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4l6 6-6 6"/></svg>';
const foldD=(k,title,body,o={})=>`<details class="gloss" data-fold="${k}"${(FOLD.has(k)?FOLD.get(k):o.auto)?" open":""}><summary><span class="fold-t">${title}</span>${o.meta?`<span class="fold-m${o.alert?" alert":""}">${o.meta}</span>`:""}${FOLD_CHEV}</summary><div class="fold-b">${body}</div></details>`;
const fold=(k,title,body,o)=>`<div class="section">${foldD(k,title,body,o)}</div>`;
// one progress row; with `act` (data attributes) it becomes a button that goes to that check / module
const pRow=(icon,title,note,right,act)=>act?`<button class="row go" ${act}>${icon}<div style="min-width:0"><b>${title}</b><div class="note">${note}</div></div><small>${right}</small></button>`
  :`<div class="row">${icon}<div style="min-width:0"><b>${title}</b><div class="note">${note}</div></div><small>${right}</small></div>`;
const hueIcon=(hue,ic)=>`<div class="icon" style="background:var(${hue})">${I[ic]||""}</div>`;
function profileView(){
  const f=S.results["fa-1"],open=id=>{const L=lessonById(id);return L&&isUnlocked(L.c,L.l)};
  const chk=["tr-x","nb-x","ca-x","st-x"].map(id=>({id,r:S.results[id],L:lessonById(id)}));
  const review=chk.filter(x=>x.r&&x.r.r<x.r.n).length;
  const rx=k=>S.rx&&S.rx[k];
  const done=[...chk.map(x=>!!x.r),!!(f&&f.met),!!S.video,!!(S.sim&&S.sim.done),!!(S.thermo&&S.thermo.done),!!rx("nbr"),!!rx("code")];
  const nDone=done.filter(Boolean).length;
  const nRev=reviewCount();
  const rows=(nRev?pRow(hueIcon("--bad","warn"),"Review queue","Questions answered incorrectly on the first try, asked again until correct",nRev,`data-act="review"`):"")+chk.map(({id,r,L})=>pRow(iconBox(L.c),L.l.title,r?(r.r===r.n?"All correct":(r.n-r.r)+" to review before the final"):open(id)?"Not taken yet":"Unlocks after the module lessons",r?r.r+"/"+r.n:"–",open(id)?`data-lesson="${id}"`:"")).join("")
   +pRow(iconBox(courseById("final")),"Final assessment",f?(f.met?"Passed":"Not passed yet · 100% needed to pass"):"Unlocks after all four modules · 100% needed to pass",f?f.pct+"%":"–",open("fa-1")?`data-lesson="fa-1"`:"")
   +pRow(iconBox(courseById("stroke")),"Required RACE video",S.video?"Marked as watched":"Not yet watched",S.video?"Done":"–",`data-course-open="stroke"`)
   +pRow(hueIcon("--c-trauma","syringe"),"TXA hands-on: solo run",S.sim&&S.sim.done?(S.sim.mode==="pressure"?"Pressure run":"Independent run")+" · "+(S.sim.comp?"Competent":"Needs review"):"Not completed yet",S.sim&&S.sim.done?(S.sim.score!=null?S.sim.score+"%":"Done"):"–",`data-course-open="trauma"`)
   +pRow(hueIcon("--c-newborn","newborn"),"Thermal care: solo round",S.thermo&&S.thermo.done?S.thermo.errors+" incorrect · "+S.thermo.hints+" hints":"Not completed yet",S.thermo&&S.thermo.done?S.thermo.first+"/"+S.thermo.of:"–",`data-course-open="newborn"`)
   +[["nbr","Newborn resuscitation: solo run","--c-newborn","newborn","newborn"],["code","Code clock: solo run","--c-cardiac","cardiac","cardiac"]].map(([k,t,hue,ic,c])=>{const r=rx(k);
     return pRow(hueIcon(hue,ic),t,r?r.errors+" errors · "+r.hints+" hints"+(r.label?" · "+r.label:""):"Not completed yet",r?r.first+"/"+r.of:"–",`data-course-open="${c}"`)}).join("");
  const mods=COURSES.map(c=>{const d=doneCount(c),t=allLessons(c).length;
    return `<button class="row go" data-course-open="${c.id}">${iconBox(c)}<div style="min-width:0"><b>${c.title}</b><div class="bar"><i style="width:${d/t*100}%"></i></div></div><small>${d}/${t}</small></button>`}).join("");
  return topbar()+`<div class="hello"><h1>Your progress</h1><p>Saved in this browser only. This is not an official training record.</p></div>
  <div class="section"><div class="tiles"><div class="tile"><b style="color:var(--good)">${coursePct()}%</b><span>Course completed</span></div><div class="tile"><b style="color:var(--accent)">${fmtMins(minsLeft())}</b><span>Time left (approx.)</span></div><div class="tile"><b>${lessonsDone()}/${lessonsAll().length}</b><span>Lessons done</span></div></div></div>
  ${fold("assess","Assessments",`<div class="rows">${rows}</div>`,{meta:`${nDone} of ${done.length} done${review?` · ${review} to review`:""}`,alert:review>0,auto:review>0})}
  ${fold("mods","Modules",`<div class="rows">${mods}</div>`,{meta:`${lessonsDone()}/${lessonsAll().length} lessons`})}
${confSection()}
  ${fold("abbr","Abbreviations",`<dl class="terms">${GLOSS.map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join("")}</dl>`,{meta:`${GLOSS.length} terms`})}
  <div class="section settings">${foldD("set","Settings",`<div class="danger">
    ${confirmReset?`<span class="note">Erase all progress in this browser?</span><button class="btn bad" data-act="reset-yes">Yes, reset</button><button class="btn ghost" data-act="reset-no">Cancel</button>`
      :`<button class="btn ghost" data-act="reset">Reset progress</button><button class="btn ghost" data-act="theme">Switch theme</button>`}</div>`)}</div>`;
}
// Books view: the shelf is built by rsMount() in js/refshelf.js after render. List view: every book as a foldable row.
const RV_ICON={books:'<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="2.5" y="3" width="3.5" height="14" rx=".8"/><rect x="7.5" y="3" width="3.5" height="14" rx=".8"/><path d="M12.6 4.2l3.3-.9 2.6 13.2-3.3.9z"/></svg>',
  list:'<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M7 5h10M7 10h10M7 15h10"/><circle cx="3.5" cy="5" r=".9" fill="currentColor"/><circle cx="3.5" cy="10" r=".9" fill="currentColor"/><circle cx="3.5" cy="15" r=".9" fill="currentColor"/></svg>'};
const refBooksList=()=>Object.keys(REF_BOOKS).map(g=>`<div class="section"><h2 style="font-size:1.2rem">${BOOK_GROUPS[g]}</h2><div class="rvgroup">${RS_ITEMS.filter(b=>b.m===g).map(b=>
  foldD("rb-"+b.key,`<span class="rvdot" style="background:${RS_COL[g]}"></span>${b.title}`,`${b.visual?`<div class="visual">${V[b.visual]}</div>`:""}<ul class="rsd-body" style="--g:${RS_COL[g]}">${b.its.map(rsItemHTML).join("")}</ul>`,{meta:`${b.its.length} key point${b.its.length>1?"s":""}`})).join("")}</div></div>`).join("");
function referenceView(){const list=S.refView==="list";
  return topbar()+`<button class="link rvback" data-refback="1">${I.left} Back</button><div class="hello rvhead"><div><h1>Quick reference</h1><p>Key v2.6 changes grouped by topic. Available at any time, including on shift.</p></div>
   <div class="vtog" role="group" aria-label="Reference layout">${["books","list"].map(k=>`<button data-refview="${k}" aria-label="${k==="books"?"Books":"List"} view" aria-pressed="${(k==="list")===list}" title="${k==="books"?"Books":"List"} view">${RV_ICON[k]}</button>`).join("")}</div></div>
  ${list?refBooksList():`<div class="rs" id="rs" tabindex="-1"></div>`}
  <div class="section">${list?"":`<div class="danger"><button class="btn ghost" id="rsMod" data-course-open="${refMod}">Open module</button></div>`}</div>`;
}
function confSection(){
  const E=Object.values(S.conf).filter(e=>e.c);
  if(!E.length) return fold("conf","Confidence check",`<p class="note">Module checks and the final assessment ask how sure you are of each answer. Your results will show here, including any answers you were certain of but got wrong.</p>`,{meta:"No answers rated yet"});
  const fx=S.fixed||{},open=Object.keys(S.conf).filter(k=>S.conf[k].c==="sure"&&S.conf[k].ok===false&&!fx[k]).map(k=>S.conf[k]);
  const sureOk=E.filter(e=>e.c==="sure"&&e.ok).length, sureNo=E.filter(e=>e.c==="sure"&&!e.ok), guess=E.filter(e=>e.c==="guess").length;
  return fold("conf","Confidence check",`<div class="confgrid"><div class="tile"><b style="color:var(--good)">${sureOk}</b><span>Certain and right</span></div><div class="tile"><b style="color:var(--bad)">${sureNo.length}</b><span>Certain but wrong</span></div><div class="tile"><b style="color:var(--sun)">${guess}</b><span>Guessed</span></div></div>
   ${open.length?`<div class="rows">${open.map(e=>`<div class="row"><div class="icon" style="background:var(--bad)">${I.warn}</div><div style="min-width:0"><b>${e.label}</b><div class="note">You were certain, but this was wrong</div></div><button class="btn ghost sm" data-revisit="${e.lesson}">Revisit</button></div>`).join("")}</div>`:`<p class="note">No confident errors so far.</p>`}`,
   {meta:open.length?`${open.length} certain but wrong`:`${E.length} answers rated`,alert:open.length>0,auto:open.length>0});
}
const GATE_AMB="<svg class=\"amb\" viewBox=\"0 0 340 170\" aria-hidden=\"true\"><defs><clipPath id=\"ambClip\"><path d=\"M14 30Q14 20 24 20H222V128H14Z\"/><path d=\"M222 44H268Q278 44 284 52L312 92Q318 98 318 106V128H222Z\"/></clipPath><filter id=\"ambGlow\" x=\"-50%\" y=\"-200%\" width=\"200%\" height=\"500%\"><feGaussianBlur stdDeviation=\"6\"/></filter></defs>\n<ellipse cx=\"170\" cy=\"154\" rx=\"152\" ry=\"7\" fill=\"rgba(19,25,51,.16)\"/>\n<g class=\"amb-body\">\n <g class=\"amb-glow\" filter=\"url(#ambGlow)\"><rect class=\"l1\" x=\"122\" y=\"6\" width=\"36\" height=\"16\" rx=\"6\" fill=\"#2D7BFF\"/><rect class=\"l2\" x=\"162\" y=\"6\" width=\"36\" height=\"16\" rx=\"6\" fill=\"#2D7BFF\"/></g>\n <rect x=\"118\" y=\"10\" width=\"84\" height=\"11\" rx=\"4\" fill=\"#DCE3EE\"/><rect class=\"l1\" x=\"122\" y=\"11\" width=\"36\" height=\"9\" rx=\"3\" fill=\"#2D7BFF\"/><rect class=\"l2\" x=\"162\" y=\"11\" width=\"36\" height=\"9\" rx=\"3\" fill=\"#2D7BFF\"/>\n <path d=\"M14 30Q14 20 24 20H222V128H14Z\" fill=\"#fff\"/><path d=\"M222 44H268Q278 44 284 52L312 92Q318 98 318 106V128H222Z\" fill=\"#fff\"/>\n <g clip-path=\"url(#ambClip)\"><rect x=\"14\" y=\"84\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"14\" y=\"100\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/><rect x=\"30\" y=\"84\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/><rect x=\"30\" y=\"100\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"46\" y=\"84\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"46\" y=\"100\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/><rect x=\"62\" y=\"84\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/><rect x=\"62\" y=\"100\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"78\" y=\"84\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"78\" y=\"100\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/><rect x=\"94\" y=\"84\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/><rect x=\"94\" y=\"100\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"110\" y=\"84\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"110\" y=\"100\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/><rect x=\"126\" y=\"84\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/><rect x=\"126\" y=\"100\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"142\" y=\"84\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"142\" y=\"100\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/><rect x=\"158\" y=\"84\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/><rect x=\"158\" y=\"100\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"174\" y=\"84\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"174\" y=\"100\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/><rect x=\"190\" y=\"84\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/><rect x=\"190\" y=\"100\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"206\" y=\"84\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"206\" y=\"100\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/><rect x=\"222\" y=\"84\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/><rect x=\"222\" y=\"100\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"238\" y=\"84\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"238\" y=\"100\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/><rect x=\"254\" y=\"84\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/><rect x=\"254\" y=\"100\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"270\" y=\"84\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"270\" y=\"100\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/><rect x=\"286\" y=\"84\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/><rect x=\"286\" y=\"100\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"302\" y=\"84\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"302\" y=\"100\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/></g>\n <path d=\"M14 30Q14 20 24 20H222V128H14Z\" fill=\"none\" stroke=\"#C9D2E3\" stroke-width=\"1.5\"/><path d=\"M222 44H268Q278 44 284 52L312 92Q318 98 318 106V128H222Z\" fill=\"none\" stroke=\"#C9D2E3\" stroke-width=\"1.5\"/>\n <path d=\"M232 54H264Q270 54 274 60L294 90H232Z\" fill=\"#BFD8F2\"/><rect x=\"232\" y=\"54\" width=\"10\" height=\"36\" fill=\"#fff\" opacity=\".35\"/>\n <rect x=\"170\" y=\"32\" width=\"44\" height=\"30\" rx=\"4\" fill=\"#BFD8F2\"/>\n <text x=\"122\" y=\"76\" text-anchor=\"middle\" font-family=\"system-ui,Segoe UI,Arial,sans-serif\" font-weight=\"800\" font-size=\"14\" letter-spacing=\"1.5\" fill=\"#0F8A4B\">AMBULANCE</text>\n <rect x=\"20\" y=\"28\" width=\"46\" height=\"94\" rx=\"3\" fill=\"#1E2638\"/>\n <g class=\"amb-door\"><rect x=\"20\" y=\"28\" width=\"46\" height=\"94\" rx=\"3\" fill=\"#fff\" stroke=\"#C9D2E3\" stroke-width=\"1.5\"/><rect x=\"28\" y=\"36\" width=\"30\" height=\"20\" rx=\"3\" fill=\"#BFD8F2\"/><path d=\"M43 64v12M37 70h12\" stroke=\"#2D7BFF\" stroke-width=\"4\" stroke-linecap=\"round\"/><rect x=\"20\" y=\"84\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"20\" y=\"100\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/><rect x=\"36\" y=\"84\" width=\"16\" height=\"16\" fill=\"#E5EE2A\"/><rect x=\"36\" y=\"100\" width=\"16\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"52\" y=\"84\" width=\"14\" height=\"16\" fill=\"#0F8A4B\"/><rect x=\"52\" y=\"100\" width=\"14\" height=\"16\" fill=\"#E5EE2A\"/></g>\n <rect x=\"10\" y=\"94\" width=\"6\" height=\"14\" rx=\"2\" fill=\"#E5484D\"/><rect x=\"312\" y=\"98\" width=\"8\" height=\"10\" rx=\"2\" fill=\"#FFE29A\"/>\n <rect x=\"10\" y=\"122\" width=\"312\" height=\"9\" rx=\"4\" fill=\"#2B3445\"/>\n</g>\n<g class=\"amb-wheel\" style=\"transform-origin:72px 132px\"><circle cx=\"72\" cy=\"132\" r=\"21\" fill=\"#1E2638\"/><circle cx=\"72\" cy=\"132\" r=\"11\" fill=\"#C9D2E3\"/><path d=\"M61 132h22M72 121v22M64 124l16 16M80 124l-16 16\" stroke=\"#8E9AB3\" stroke-width=\"2\"/><circle cx=\"72\" cy=\"132\" r=\"4\" fill=\"#5B667E\"/></g><g class=\"amb-wheel\" style=\"transform-origin:262px 132px\"><circle cx=\"262\" cy=\"132\" r=\"21\" fill=\"#1E2638\"/><circle cx=\"262\" cy=\"132\" r=\"11\" fill=\"#C9D2E3\"/><path d=\"M251 132h22M262 121v22M254 124l16 16M270 124l-16 16\" stroke=\"#8E9AB3\" stroke-width=\"2\"/><circle cx=\"262\" cy=\"132\" r=\"4\" fill=\"#5B667E\"/></g></svg>";
// first-launch screen: full-bleed fleet photo with the title and start button on it.
// GATE_INTRO (the ambulance arrival, GATE_AMB above) is paused until an intro is chosen.
const GATE_INTRO=false;
const GATE_ARROW='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';
const gateHTML=()=>`<div class="gate-hero">
  <div class="gh-top"><span class="gh-brand"><img src="brand/hmcas-wordmark.webp" alt="Hamad Medical Corporation Ambulance Service"></span></div>
  <div class="gh-main"><span class="gh-kicker">HMCAS Training Department · eLearning</span>
   <h1 id="gateT">CPG v2.6 UPDATE</h1>
   <p class="gh-sub">Ambulance Paramedics and Critical Care Paramedics</p>
   <button class="gh-cta" data-lesson="in-1"><span class="gh-pill">Start the course</span><span class="gh-circ">${GATE_ARROW}</span></button>
   <ul class="gh-steps"><li><b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="8" r="3.6"/><path d="M5 20c1-3.6 3.8-5.4 7-5.4s6 1.8 7 5.4"/></svg></b>Learner focused</li><li><b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3 16 5-5 4 4 3-3 6 6"/></svg></b>Realistic scenarios</li><li><b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg></b>Meaningful practice</li></ul></div>
  <p class="gh-note gh-quote">“Every guideline learned today is a better decision on tomorrow’s call.”</p></div>`;
// "Start the course": the photo screen shrinks into the CPG book and swings open as its cover (a copy of the screen is the turning cover, with a back),
// real CPG pages (brand/cpg/) turn with a paper sound. The last page is a copy of the lesson's first slide (the lesson opens hidden at the start); it zooms to fill the screen and the real lesson shows in its place.
// Full run once (S.bookSeen), short run after. A tap or Esc/Enter/Space skips
const CPG_PAGES=["cover","contents","cardiac-arrest","newborn","txa"];
const CBK_T=[[.35,.85],[.95,.7],[1.3,.58],[1.56,.5],[1.78,.45],[1.97,.42]],CBK_SHORT=[[.35,.7]];// [start, duration] in s of each turn (0 = photo cover): slow first, then faster
function gateBook(id){const g=document.getElementById("gate");if(!g||g.classList.contains("opening")||matchMedia("(prefers-reduced-motion: reduce)").matches){openLesson(id);return}
  const short=!!S.bookSeen;S.bookSeen=true;save();
  const vw=innerWidth,vh=innerHeight,bw=Math.min(vw-28,(vh-48)*.707),bh=bw*1.415,k=Math.min(bw/vw,bh/vh),pages=short?[]:CPG_PAGES,T=short?CBK_SHORT:CBK_T,n=pages.length+2,tm=[];
  g.style.setProperty("--ct",(vh-bh)/2+"px");g.style.setProperty("--cl",(vw-bw)/2+"px");
  const pg=(i,html)=>{const t=T[i],s=T[i-1];return `<div class="cbk-pg${t?" turn":""}" style="--z:${n-i};--zt:${10+i}${t?`;animation-delay:${t[0]}s;animation-duration:${t[1]}s`:""}"><div class="cbk-f${t?"":" cbk-last"}">${html}${s?`<i class="cbk-sh" style="animation-delay:${s[0]}s;animation-duration:${s[1]}s"></i>`:""}</div>${t?`<div class="cbk-b"></div>`:""}</div>`};
  const b=document.createElement("div");b.className="cbk-wrap";b.setAttribute("aria-hidden","true");
  b.innerHTML=`<div class="cbk-book" style="width:${bw}px;--zs:${1/k};--lt:${T[0][0]+T[0][1]*.45}s"><i class="cbk-gut"></i>${pg(0,"")}${pages.map((p,i)=>pg(i+1,`<img src="brand/cpg/${p}.webp" alt="">`)).join("")}${pg(n-1,"")}</div>`;
  const strip=e=>{e.removeAttribute("id");e.querySelectorAll("[id]").forEach(x=>x.removeAttribute("id"));return e};
  const cv=strip(g.cloneNode(true));cv.removeAttribute("style");cv.className="gate cbk-gclone";b.querySelector(".cbk-f").prepend(cv);
  openLesson(id);const pl=document.getElementById("player");
  const sl=strip(pl.cloneNode(true));sl.classList.add("cbk-pclone");sl.style.cssText=`width:${vw}px;height:${vh}px;transform:translate(-50%,-50%) scale(${k})`;b.querySelector(".cbk-last").prepend(sl);pl.classList.add("cbk-wait");
  document.body.appendChild(b);g.classList.add("opening");tm.push(setTimeout(()=>g.classList.add("cbk-hide"),T[0][0]*1000));
  const snd=s=>{if(typeof txSound==="function")txSound(s)};T.forEach((t,i)=>tm.push(setTimeout(()=>snd(i?"page":"cover"),(t[0]+t[1]*(i?.35:.25))*1000)));
  let done=false;const key=e=>{if(["Escape","Enter"," "].includes(e.key)){e.preventDefault();e.stopPropagation();fin(true)}};
  const fin=skip=>{if(done)return;done=true;tm.forEach(clearTimeout);document.removeEventListener("keydown",key,true);
    const show=()=>{pl.classList.remove("cbk-wait");g.classList.remove("opening","cbk-hide");g.style.removeProperty("--ct");g.style.removeProperty("--cl")};if(skip){show();b.classList.add("skip");setTimeout(()=>b.remove(),320)}else{b.classList.add("zoom");setTimeout(()=>{show();b.remove()},700)}};
  b.addEventListener("pointerdown",()=>fin(true));document.addEventListener("keydown",key,true);
  const z=T[T.length-1];tm.push(setTimeout(()=>fin(false),(z[0]+z[1]+.2)*1000));}
function render(){
  renderNav();
  const mn=document.getElementById("main");mn.classList.toggle("wide",view==="reference");mn.classList.toggle("homewide",view==="home");
  mn.innerHTML=view==="reference"?referenceView():view==="courses"?coursesView():view==="profile"?profileView():view==="course"?courseDetail():homeView();
  if(typeof rsMount==="function"){if(view==="reference")rsMount();else rsUnmount();}
  const bc=document.body.classList;bc.toggle("photo-bg",["courses","profile","home"].includes(view));bc.toggle("mods-on",view==="courses");bc.toggle("prog-on",view==="profile");bc.toggle("home-on",view==="home");if(view==="courses")modsMount();
  // first-launch gate: until Welcome is done, the only way in is Start Here (the player sits above it)
  let g=document.getElementById("gate");const need=!S.done["in-1"];
  if(need&&!g){g=document.createElement("div");g.id="gate";g.className="gate";g.setAttribute("role","dialog");g.setAttribute("aria-modal","true");g.setAttribute("aria-labelledby","gateT");document.body.appendChild(g);}
  if(need&&!g.dataset.built){g.dataset.built=1;g.innerHTML=gateHTML();CPG_PAGES.forEach(p=>{new Image().src=`brand/cpg/${p}.webp`});let seen=false;try{seen=sessionStorage.getItem("cpg26-gate")==="1";sessionStorage.setItem("cpg26-gate","1")}catch(e){}
    if(GATE_INTRO&&!seen&&!matchMedia("(prefers-reduced-motion: reduce)").matches){g.classList.add("intro");const end=()=>g.classList.remove("intro");g.addEventListener("pointerdown",e=>{if(!e.target.closest(".gh-cta"))end()});setTimeout(end,3200);}
    if(!P)g.querySelector(".gh-cta").focus({preventScroll:true});}
  else if(!need&&g)g.remove();
}
function go(v,cid){view=v;courseView=cid||null;confirmReset=false;if(v==="course"&&cid&&S.lastMod!==cid){S.lastMod=cid;save();}
  const h=v==="course"?"module-"+cid:v; if(location.hash!=="#"+h){try{history.replaceState(null,"","#"+h)}catch(e){}} render(); window.scrollTo(0,0);}
function fromHash(){const h=location.hash.slice(1);
  if(h.startsWith("reference/")&&typeof RS_ITEMS!=="undefined"){const i=RS_ITEMS.findIndex(x=>x.key===h.slice(10));view="reference";if(i>=0){refGrp=RS_ITEMS[i].m;refMod=RS_ITEMS[i].mod;RS.pendingIdx=i;RS.openOnMount=true;S.refView="books"}}
  else if(h.startsWith("module-")&&COURSES.some(c=>c.id===h.slice(7))){view="course";courseView=h.slice(7)}
  else if(["home","courses","reference","profile"].includes(h)) view=h; else view="home"; render();}

/* ============================ PLAYER ============================ */
let P=null;
/* ---------- review queue: questions answered incorrectly on the first try, asked again until answered correctly ---------- */
const missedKeys=()=>Object.keys(S.conf).filter(k=>S.conf[k].ok===false&&!(S.fixed||{})[k]);
function reviewStep(k){
  if(k.includes("@")){const [b,node]=k.split("@"),[lid,i]=b.split("#"),L=lessonById(lid),s=L&&L.l.steps&&L.l.steps[+i],n=s&&s.type==="walk"&&s.nodes[node];if(!n||!n.opts)return null;
    const ord=shuffle(n.opts.map((_,j)=>j)),ok=n.opts.find(x=>x.to);return {type:"choice",label:"Review · "+(s.title||"Algorithm"),scope:s.scope,intro:`<b>Case:</b> ${s.case}`,prompt:n.q,options:ord.map(j=>n.opts[j].t),answer:ord.findIndex(j=>n.opts[j].to),fb:ord.map(j=>n.opts[j].why||null),explain:ok?ok.t+".":"",src:s.src,_key:k};}
  if(k.includes("#")){const [lid,i]=k.split("#"),L=lessonById(lid);if(!L||L.l.bank)return null;const s=L.l.steps[+i];return s&&QTYPES.includes(s.type)?{...s,_key:k}:null;}
  const q=[...QB,...FQ].find(x=>x.id===k);return q?{type:"choice",label:"Review · "+MODS[q.mod],...shuffleOpts(q),_key:k}:null;}
function openReview(){const steps=missedKeys().map(reviewStep).filter(Boolean).slice(0,5);if(!steps.length)return;
  P={c:null,l:{id:"review",title:"Review"},mode:"review",steps,i:0,answers:[],right:0,asked:0};resetStep();
  document.getElementById("player").hidden=false;document.body.style.overflow="hidden";drawPlayer();}
const reviewCount=()=>missedKeys().filter(k=>reviewStep(k)).length;
function openLesson(lid,opts={}){
  const f=lessonById(lid);if(!f||!isUnlocked(f.c,f.l))return;
  S.current=f.c.id;S.lastMod=f.c.id;save();
  P={c:f.c,l:f.l,mode:f.l.mode||"practice",steps:stepsFor(f.l),i:0,answers:[],watched:S.video,right:0,asked:0};
  if(f.l.scene){P.txMode=opts.txMode||(f.l.txRun||f.l.thRun||f.l.rxRun?"independent":"guided");P.thTemp=null;P.thHints={};P.thHintKeys={};P.t0=Date.now();P.txEvents=[];P.runCase=f.l.txRun?txRunCase():null;P.lab=null;txStartRunTimer();}
  benchResume(f);resetStep();
  document.getElementById("player").hidden=false;document.body.style.overflow="hidden";drawPlayer();
}
function resetStep(){P.usI=0;P.usSeen=[0];P.watchDone=false;P.vfold=undefined;P.pinOpen=false;P.spBig=false;P.sx=null;P.chartOpen=false;P.sel=null;P.val="";P.multi=[];P.sort={};P.match={};P.matchSel=null;P.matchOrd=null;P.sortOrd=null;P.ord=[];P.ordMix=null;P.status="idle";P.firstTry=true;P.conf=null;P.tries=0;P.cur=null;P.trail=[];P.why=null;P.whyIdx=null;P.walkMiss=false;P.wOrd={};P.wMiss=[];P.wRun=1;P.sv=null;P.scC=null;P.goalMet=false;P.rb=null;P.rbPick={};P.ci=0;P.chainMiss=false;P.scRes=null;P.scMiss=false;}
let simOpen=false;
function openSim(){
  const w=document.getElementById("simwrap");simOpen=true;w.hidden=false;
  w.innerHTML=`<div class="simbar"><button class="btn ghost sm" data-act="sim-close">${I.left} Back to lesson</button><b>Paediatric TXA preparation</b></div><div id="simmsg"></div><iframe id="simframe" src="txa-sim/index.html" title="Paediatric TXA preparation and administration simulation" allow="autoplay"></iframe>`;
  w.querySelector('[data-act="sim-close"]').focus();
}
function closeSim(){const w=document.getElementById("simwrap");w.hidden=true;w.innerHTML="";simOpen=false;if(P&&P.steps)drawPlayer();}
window.addEventListener("message",e=>{
  const f=document.getElementById("simframe");
  if(!f||e.source!==f.contentWindow||!e.data||e.data.type!=="complete")return;
  const record=()=>{let score=null;try{const m=(f.contentDocument.body.innerText||"").match(/Score:\s*(\d+)%/);if(m)score=+m[1];}catch(err){}
    const prev=S.sim&&S.sim.score;S.sim={done:true,date:today(),score:score!=null?(prev!=null?Math.max(prev,score):score):prev??null};save();
    const m=document.getElementById("simmsg");if(m)m.innerHTML=`<div class="simdone" role="status">${I.check}Completion recorded${score!=null?" · score "+score+"%":""}. You can go back to the lesson.</div>`;};
  setTimeout(record,400);
});
// flip cards: S.cards[key] is true (got it) or false (still learning, remembered between sessions); still-learning cards come first, then unseen, then known
const deckKey=(m,c)=>m+":"+c.f;
const deckCards=m=>(CHANGES[m]||[]).filter(c=>c.kind==="habit");
const deckDue=m=>deckCards(m).filter(c=>S.cards[deckKey(m,c)]===false).length;
function openDeck(mod){const rank=c=>{const v=S.cards[deckKey(mod,c)];return v===false?0:v===undefined?1:2};
  P={mode:"deck",mod,cards:deckCards(mod).map(c=>({...c,key:deckKey(mod,c)})).map((c,i)=>({c,i})).sort((a,b)=>rank(a.c)-rank(b.c)||a.i-b.i).map(x=>x.c),ci:0,flipped:false,known:0,again:[]};document.getElementById("player").hidden=false;document.body.style.overflow="hidden";drawPlayer();}
function closeLesson(){if(P){clearInterval(P.tick);clearInterval(P.infT);}txHush();const pl=document.getElementById("player");pl.classList.remove("scene","prepbench");document.getElementById("player").hidden=true;document.body.style.overflow="";P=null;render();}
const assessMode=()=>P.mode==="diag"||P.mode==="final"||(P.mode==="exit"&&!hasFinalQs(P.l.bank)); // no per-question feedback; a module check gets feedback only once the final no longer reuses its questions

function badges(s){
  const b=[];
  if(s.pop) b.push(`<span class="badge pop">${s.pop}</span>`);
  if(s.type==="blocked") b.push(`<span class="badge pend">Pending approved source</span>`);
  if(s.id&&CRITICAL.includes(s.id)&&P.mode!=="final") b.push(`<span class="badge crit">Critical item</span>`);
  return b.length?`<div class="badges">${b.join("")}</div>`:"";
}
const pendingBox=list=>list&&list.length?`<div class="pending"><b>Pending verification</b><ul>${list.map(x=>`<li>${x}</li>`).join("")}</ul></div>`:"";
const srcLine=s=>s.src&&!assessMode()&&!(P&&locked())?`<div class="src">Source: ${s.src}</div>`:"";
const locked=()=>P.status==="right"||P.status==="revealed";

function stepBody(s){
  const lab=s.label?`<span class="label">${s.label}</span>`:"";
  if(s.type==="read"&&s.stepper) return `${badges(s)}<h2>${s.title}</h2>${s.body?`<p>${s.body}</p>`:""}${stepperHTML(s)}${srcLine(s)}`;
  if(s.type==="read") return `${badges(s)}${s.top&&s.visual?`<div class="visual">${V[s.visual]}</div>`:""}<h2>${s.title}</h2>${s.body?`<p>${s.body}</p>`:""}${s.ptitle?`<span class="label">${s.ptitle}</span>`:""}${s.points?`<${s.ol?"ol":"ul"}>${s.points.map(p=>`<li>${p}</li>`).join("")}</${s.ol?"ol":"ul"}>`:""}${s.visual&&!s.top?`<div class="visual">${V[s.visual]}</div>`:""}${s.foot?`<p class="note">${s.foot}</p>`:""}${pendingBox(s.pending)}${srcLine(s)}`;
  if(s.type==="choice") return `${badges(s)}${s.intro?`<div class="info">${s.intro}</div>`:""}${lab}<h2>${s.prompt}</h2>${s.visual?vfold(s.visual):""}<div class="opts" role="radiogroup" aria-label="Answer options">${s.options.map((o,i)=>{
      const L=locked(),rv=P.status==="revealed"&&P.sel!==null&&P.sel!==s.answer;if(L&&i!==s.answer&&!(rv&&i===P.sel))return ""; // after answering, keep only the correct option (and the learner's wrong pick when revealed)
      let cls="";if(L&&i===s.answer)cls="right";else if((P.status==="wrong"||P.status==="revealed")&&i===P.sel)cls="wrong";
      const tag=rv?`<em class="otag">${i===s.answer?"Correct answer":"Your answer"}</em>`:"";
      return `<button class="opt ${cls}" role="radio" aria-checked="${P.sel===i}" data-opt="${i}" ${L?"disabled":""}><span class="k">${String.fromCharCode(65+i)}</span><span class="ot">${o}${tag}</span></button>`}).join("")}</div>${srcLine(s)}`;
  if(s.type==="multi"){const L=locked(),rv=P.status==="revealed";
    return `${badges(s)}${lab}<h2>${s.prompt}</h2>${L?"":`<p class="note">Select all that apply.</p>`}<div class="opts">${s.options.map((o,i)=>{
      const on=P.multi.includes(i),inKey=s.answer.includes(i);if(L&&!inKey&&!(rv&&on))return ""; // after answering, keep the correct set (plus wrong picks when revealed)
      let cls="",tag="";
      if(L){cls=inKey?"right":"wrong";if(rv)tag=inKey&&!on?"Missed":!inKey?"Not correct":"";} else if(P.status==="wrong"&&on!==inKey) cls="wrong";
      return `<button class="opt ${cls}${tag==="Missed"?" miss":""}" role="checkbox" aria-checked="${L?inKey:on}" data-multi="${i}" ${L?"disabled":""}><span class="k">${(L?inKey:on)?I.check:""}</span><span class="ot">${o}${tag?`<em class="otag">${tag}</em>`:""}</span></button>`}).join("")}</div>${srcLine(s)}`;}
  if(s.type==="order"){const L=locked(),mix=P.ordMix||(P.ordMix=shuffle(s.items.map((_,i)=>i))),seq=L?s.items.map((_,i)=>i):P.ord; // items are stored in the correct order
    return `${badges(s)}${lab}<h2>${s.prompt}</h2><p class="note">Select in order.</p><ol class="ord">${seq.map((i,k)=>`<li><button class="opt ${L?"right":P.status==="wrong"?(i===k?"right":"wrong"):""}" data-unord="${k}" ${L?"disabled":""}><span class="k">${k+1}</span>${s.items[i]}</button></li>`).join("")}</ol>
     ${L?"":`<div class="opts">${mix.filter(i=>!P.ord.includes(i)).map(i=>`<button class="opt" data-ord="${i}"><span class="k"></span>${s.items[i]}</button>`).join("")}</div>`}${srcLine(s)}`;}
  if(s.type==="sort"){if(!P.sortOrd)P.sortOrd=shuffle(s.cards.map((_,i)=>i));} // cards appear in a random order (authored order groups them by answer)
  if(s.type==="sort") return `${badges(s)}${lab}<h2>${s.prompt}</h2><div class="sort">${P.sortOrd.map(ci=>{const cd=s.cards[ci];
      const pick=locked()?cd.b:P.sort[ci];let cls="";if(locked())cls="right";else if(P.status==="wrong")cls=P.sort[ci]===cd.b?"right":"wrong";
      const why=cd.why&&(locked()||cls==="wrong")?`<div class="swhy">${cd.why}</div>`:"";
      return `<div class="srow ${cls}"><div class="ct">${cd.t}${why}</div><div class="bins" role="group" aria-label="${cd.t}">${s.bins.map((bn,bi)=>`<button class="bin" data-card="${ci}" data-bin="${bi}" aria-pressed="${pick===bi}" ${locked()?"disabled":""}>${bn}</button>`).join("")}</div></div>`}).join("")}</div>${srcLine(s)}`;
  if(s.type==="match"){if(!P.matchOrd)P.matchOrd=shuffle(s.pairs.map((_,i)=>i));const L=locked(),card=(i,on)=>`<button class="mcard ${on?"on":""} ${P.matchSel===i?"sel":""}" data-mcard="${i}" aria-pressed="${P.matchSel===i}" ${L?"disabled":""}>${s.pairs[i].def}</button>`,pool=L?[]:P.matchOrd.filter(i=>!Object.values(P.match).includes(i));
    return `${badges(s)}${lab}<h2>${s.prompt}</h2><p class="note">Drag each definition onto its term, or tap a definition and then a term.</p>${pool.length?`<div class="mpool">${pool.map(i=>card(i)).join("")}</div>`:""}<div class="sort">${s.pairs.map((p,k)=>{const at=L?k:P.match[k],has=at!==undefined,cls=L?"right":P.status==="wrong"&&has?(at===k?"right":"wrong"):"";return `<div class="srow mslot ${cls}" data-k="${k}"><div class="ct">${p.term}</div>${has?card(at,true):`<button class="mdrop" data-mslot="${k}" aria-label="Place definition on ${p.term}">Drop here</button>`}</div>`}).join("")}</div>${srcLine(s)}`;}
  if(s.type==="input") return `${badges(s)}${lab}<h2>${s.prompt}</h2>${s.visual?vfold(s.visual):""}<div class="ans"><input id="ansInput" inputmode="decimal" autocomplete="off" aria-label="Your answer" value="${locked()?s.answer:P.val}" ${locked()?"disabled":""}>${s.unit?`<span>${s.unit}</span>`:""}</div>${srcLine(s)}`;
  if(s.type==="watch") return `${badges(s)}<span class="label">Watch first</span><h2>${s.title}</h2><p>${s.body}</p>${s.src?`<div class="vid"><video id="watchvid" src="${s.src}" ${s.poster?`poster="${s.poster}"`:""} controls playsinline preload="metadata" aria-label="${s.title}"></video></div><p class="note" id="watchnote">${P.watchDone?"Video watched.":"Watch to the end to continue."}</p>`:`<div class="pending"><b>Video to be added</b><span>Your video will play here, before the hands-on practice. Until it is added you can continue.</span></div>`}${srcLine(s)}`;
  if(s.type==="lookup") return `${badges(s)}<span class="label">Source lookup</span><h2>${s.title}</h2><p>${s.body}</p><div class="lookup">${I.book}<div><span class="label">Find</span><b>${s.find}</b></div></div>${srcLine(s)}`;
  if(s.type==="blocked") return `${badges(s)}<h2>${s.title}</h2><p>${s.body}</p><div class="pending"><b>Waiting for</b><ul>${s.needs.map(x=>`<li>${x}</li>`).join("")}</ul></div>${srcLine(s)}`;
  if(s.type==="video") return `${badges(s)}<h2>${s.title}</h2><p>${s.body}</p><div class="watch"><a class="btn" href="${s.url}" target="_blank" rel="noopener">${I.play.replace('<svg','<svg width="18" height="18"')} Open video</a>
      <button class="tog" data-act="watched" aria-pressed="${P.watched}"><i>${P.watched?I.check:""}</i>I've watched the full video</button></div>${pendingBox(s.pending)}${srcLine(s)}`;
  if(s.type==="sim"){const d=S.sim&&S.sim.done;
    return `${badges(s)}<span class="label">Simulation</span><h2>${s.title}</h2><p>${s.body}</p>
    <ul class="modes">${s.modes.map((m,i)=>`<li><b class="n">${i+1}</b><span>${m}</span></li>`).join("")}</ul>
    <div class="simcard"><div class="icon" style="background:var(--c-trauma)">${I.syringe}</div><div style="display:grid;gap:10px">
      <div class="simstat ${d?"ok":"no"}">${d?I.check+"Completed"+(S.sim.score!=null?" · score "+S.sim.score+"%":"")+" · "+S.sim.date:"Not completed yet"}</div>
      <div><button class="btn" data-act="sim-open">${I.play.replace('<svg','<svg width="18" height="18"')} ${d?"Open simulation again":"Start simulation"}</button></div></div></div>
    <div class="simalt"><span>Prefer a full browser window? <a href="txa-sim/index.html" target="_blank" rel="noopener">Open the simulation in a new tab</a>. Completion in a new tab can't be detected automatically, so mark it below.</span>
      ${d?"":`<button class="tog" data-act="sim-manual" aria-pressed="${!!P.simManual}" style="justify-self:start"><i>${P.simManual?I.check:""}</i>I completed independent mode in a new tab</button>`}</div>${srcLine(s)}`;}
  if(s.type==="scrub"){const D=SCRUB[s.scrub],C=scrubC(D),v=scrubV(C);if(D.goal&&!D.confirm&&D.goal.test(v,C))P.goalMet=true;
    return `${badges(s)}<span class="label">${s.label||"Explore"}</span><h2>${D.title}</h2><p>${D.intro}</p>${D.goal?goalHTML(D):""}
    <div class="scrub">${C.map(c=>`<label class="sc-c"><span>${c.label}<b id="scv-${c.k}">${c.fmt(v[c.k])}</b></span><input type="range" min="${c.min}" max="${c.max}" step="${c.step}" value="${v[c.k]}" data-scrub="${c.k}" aria-valuetext="${c.fmt(v[c.k])}"></label>`).join("")}
    <div class="sc-out" id="scOut">${D.view(v,C,P.scRes)}</div>${D.confirm&&!P.goalMet?`<button class="btn sc-confirm" data-scconfirm="1">Confirm</button>`:""}</div>${srcLine({src:D.src})}`;}
  if(s.type==="racebench") return raceBody(s);
  if(s.type==="chartpick") return chartpickBody(s);
  if(s.type==="chain") return chainBody(s);
  if(s.type==="walk"){const cur=P.cur||s.start,n=s.nodes[cur],ord=n.opts?(P.wOrd[cur]||(P.wOrd[cur]=shuffle(n.opts.map((_,i)=>i)))):[];
    const asked=P.trail.length,miss=P.wMiss.length,firstOk=asked-miss,again=walkNeedsRerun(s),ev=P.why&&n.opts?n.opts[P.whyIdx].ev:undefined;
    const caseBox=s.facts?`<div class="case wcase"><span class="label wc-l">${WIC.clip} Case</span><div class="wfacts">${s.facts.map((t,i)=>`<span class="wfact ${ev===i?"hl":""}">${t}</span>`).join("")}</div></div>`:`<div class="case"><span class="label">Case</span><p>${s.case}</p></div>`;
    return `${badges(s)}<span class="label">${s.label}</span><h2>${s.title}</h2>${s.group?walkSet(s):""}${caseBox}
    ${P.wRun>1?`<p class="note wrun">Second run</p>`:""}
    ${s.vis?walkVis(s,cur):""}<div class="wgrid ${n.end?"ended":""}"><div class="wmapcol">${walkMap(s,!!n.end)}</div><div class="wqcol">
    ${n.end?`${s.group?`<div class="wend wone mk-${n.mk}" role="status"><span class="wone-ic" aria-hidden="true">${WICX(n.ic)}</span><span class="label">Outcome</span><b>${n.end}</b>`:`<div class="wend ${n.tone}" role="status"><span class="label">Outcome</span><b>${n.end}</b></div>`}
      <div class="wsum ${miss?(again?"bad":"mid"):"good"}${s.group?" in":""}" role="status"><span class="label">${P.wRun>1?"Second run":"Result"}</span><b>${firstOk} of ${asked} steps correct first time</b>
      ${miss?`<ul>${P.wMiss.map(m=>`<li><span>${m.q}</span><b>${m.a}</b></li>`).join("")}</ul>${P.mode==="practice"?`<p class="note">Missed steps are added to the review queue.</p>`:""}`:""}
      ${again?`<p class="note">2 or more steps were missed. Complete one more run to continue.</p>`:""}</div>${s.group?"</div>":""}
      ${s.ref?`<button class="wref" data-refpeek="${s.ref}">${I.book} Open this algorithm in Reference</button>`:""}`
      :`<div class="wq"><span class="label">Step ${walkPath(s).indexOf(cur)+1} of ${walkPath(s).length-1}</span><h3>${n.q}</h3>${P.why?`<div class="why" role="status"><b>Incorrect.</b> <span class="wpick">You chose: ${n.opts[P.whyIdx].t}</span> ${P.why}${ev!==undefined?`<span class="wev">The deciding fact is highlighted in the case.</span>`:""}</div><button class="btn ghost" data-walkretry="1">Try again</button>`
        :`<div class="wopts">${ord.map(i=>{const o=n.opts[i],ic=o.ic&&WIC[o.ic];return `<button class="opt${ic?" has-ic":""}" data-walk="${i}">${ic?`<span class="oic ${o.ic}${WIC_ART[o.ic]?" art":""}" aria-hidden="true">${ic}</span>`:""}<span>${o.t}</span></button>`}).join("")}</div>`}</div>`}</div></div>${srcLine(s)}`;}
  return "";
}
// walk with vis:true: scene (s.media = image/video path, otherwise a neutral drawing) and, once a node states a heart rate (node.mon={hr}), a monitor.
// The monitor shows only values the case states: SpO₂ stays "--" unless a node sets mon.spo2.
// two-tone icons: soft fill (currentColor at low opacity) + stroke; shown in a round tinted badge
const WIC=(()=>{const w=b=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${b}</svg>`,f='fill="currentColor" fill-opacity=".2"';return {
  lungs:w(`<path d="M12 3.5v7.5"/><path d="M12 11c-1.2 1.1-2.6 1.6-2.6 1.6M12 11c1.2 1.1 2.6 1.6 2.6 1.6"/><path ${f} d="M9.3 6.6C6.3 7 3.8 11 3.8 16c0 2.2 1 3.6 2.6 3.6 2.4 0 3.9-1.8 3.9-5V8.2c0-1-.4-1.6-1-1.6z"/><path ${f} d="M14.7 6.6c3 .4 5.5 4.4 5.5 9.4 0 2.2-1 3.6-2.6 3.6-2.4 0-3.9-1.8-3.9-5V8.2c0-1 .4-1.6 1-1.6z"/>`),
  comp:w(`<path ${f} d="M6.6 12.2V7.3a1.5 1.5 0 0 1 3 0v3.9V5.6a1.5 1.5 0 0 1 3 0v5.6V6.4a1.5 1.5 0 0 1 3 0v5.4-3a1.5 1.5 0 0 1 3 0v5.1c0 4.3-2.8 7.1-6.6 7.1-2.9 0-4.6-1.3-5.8-3.3l-2-3.4a1.4 1.4 0 0 1 2.3-1.6z"/><path d="M4 3.5 5.2 5M8 2.2l.3 1.8M2.2 7.4 4 7.8"/>`),
  o2:w(`<circle ${f} cx="12" cy="12" r="9.3"/><text x="12" y="15.7" text-anchor="middle" font-size="9.5" font-weight="800" font-family="system-ui,sans-serif" fill="currentColor" stroke="none">O₂</text>`),
  air:w(`<path d="M3 8.5h10.5a2.8 2.8 0 1 0-2.8-2.8"/><path d="M3 13h14.5a2.8 2.8 0 1 1-2.8 2.8"/><path d="M3 17.5h6"/><circle ${f} stroke="none" cx="17.5" cy="15.8" r="2.8"/>`),
  wait:w(`<path d="M6.5 3h11M6.5 21h11"/><path ${f} d="M8 3c0 4.6 4 5.4 4 9s-4 4.4-4 9h8c0-4.6-4-5.4-4-9s4-4.4 4-9z"/><path d="M9.3 19.6c.8-1.6 2-2.2 2.7-2.2s1.9.6 2.7 2.2z" fill="currentColor" stroke="none"/><path d="M10 7h4" stroke-width="1.4"/>`),
  timer:w(`<circle ${f} cx="12" cy="13.5" r="7.6"/><path d="M12 13.5V9.6M12 13.5l2.6 1.6"/><path d="M10 2.5h4M12 2.5v3.4M18.6 6.6 20.2 5"/>`),
  suction:w(`<ellipse ${f} cx="8.6" cy="15.6" rx="4.8" ry="5.2"/><path d="M12 12 19.6 4.4"/><path d="M18.2 3.2l2.6 2.6"/><path d="M6.6 13.6c.5-1 1.3-1.5 2.2-1.6" stroke-width="1.3"/>`),
  mask:w(`<ellipse ${f} cx="15.6" cy="10" rx="5.6" ry="4.6"/><path d="M10 10H7"/><path ${f} d="M7 7.4v5.2L3.6 15V5z"/>`),
  stop:w(`<path ${f} d="M8.2 2.8h7.6l5.4 5.4v7.6l-5.4 5.4H8.2l-5.4-5.4V8.2z"/><path d="M8.5 12h7" stroke-width="2.2"/>`),
  yes:w(`<circle ${f} cx="12" cy="12" r="9.3"/><path d="m8 12.4 2.7 2.7 5.4-5.6" stroke-width="2.1"/>`),
  no:w(`<circle ${f} cx="12" cy="12" r="9.3"/><path d="m9 9 6 6M15 9l-6 6" stroke-width="2.1"/>`),
  // case + monitor icons, more option icons
  talk:w(`<path ${f} d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v8.5A1.5 1.5 0 0 1 20 17H10l-4.5 3.5V17H4a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 4 5.5z"/><path d="M7 10h10M7 13h6"/>`),
  exit:w(`<path ${f} d="M4 3.5h9v17H4z"/><path d="M10.4 12h.01" stroke-width="2.4"/><path d="M15 12h6.5M18.5 9l3 3-3 3"/>`),
  door:w(`<path ${f} d="M6 3.5h12v17H6z"/><path d="M14.5 12.5h.01" stroke-width="2.6"/><path d="M3.5 20.5h17"/>`),
  move:w(`<path ${f} d="M7.6 3.5c1.8 0 2.8 1.8 2.8 4.3S9.4 12 7.7 12 5 10.4 5 7.7 5.9 3.5 7.6 3.5z"/><path ${f} d="M16.4 8.5c1.8 0 2.7 1.8 2.7 4.2s-1 4.2-2.7 4.2-2.6-1.6-2.6-4.2.9-4.2 2.6-4.2z"/><path d="M6.3 14.6h2.8v1.6a1.4 1.4 0 0 1-2.8 0zM15 19.6h2.8v.4a1.4 1.4 0 0 1-2.8 0z"/>`),
  lift:w(`<path d="M12 3.5v10M8 7.5l4-4 4 4"/><path ${f} d="M4 15.5h16l-1.5 5h-13z"/>`),
  plan:w(`<path ${f} d="M3.5 6.5 9 4l6 2.5L20.5 4v13.5L15 20l-6-2.5L3.5 20z"/><path d="M9 4v13.5M15 6.5V20"/>`),
  stretcher:w(`<path ${f} d="M3 11.5h18v3H3z"/><circle cx="6.5" cy="18.5" r="1.8"/><circle cx="17.5" cy="18.5" r="1.8"/><path d="M6.5 14.5v2.2M17.5 14.5v2.2M3 11.5 4.5 8h4"/>`),
  hospital:w(`<path ${f} d="M4 20.5V6.5h16v14z"/><path d="M12 9.5v6M9 12.5h6M2.5 20.5h19"/>`),
  collar:w(`<path ${f} d="M5 9c2.2 1.6 4.6 2.3 7 2.3s4.8-.7 7-2.3v6c-2.2 1.6-4.6 2.3-7 2.3S7.2 16.6 5 15z"/><path d="M12 11.3v6M9 4.5a3 3 0 0 0 6 0"/>`),
  pull:w(`<path d="M21 12H8.5M12.5 8l-4 4 4 4"/><path ${f} d="M3 7.5h3.2v9H3z"/>`),
  board:w(`<rect ${f} x="2.5" y="8.5" width="19" height="7" rx="3.5"/><path d="M6.5 12h.01M10 12h.01M14 12h.01M17.5 12h.01" stroke-width="2.4"/>`),
  drop:w(`<path ${f} d="M12 3.5s6.5 7 6.5 11.2a6.5 6.5 0 0 1-13 0C5.5 10.5 12 3.5 12 3.5z"/><path d="M9 15a3 3 0 0 0 3 3" stroke-width="1.4"/>`),
  brain:w(`<path ${f} d="M9 4.5a3 3 0 0 0-3 3 3 3 0 0 0-1.8 5.2A3 3 0 0 0 6.5 18a3 3 0 0 0 5.5 1.5V5.8A3 3 0 0 0 9 4.5z"/><path ${f} d="M15 4.5a3 3 0 0 1 3 3 3 3 0 0 1 1.8 5.2 3 3 0 0 1-2.3 5.3 3 3 0 0 1-5.5 1.5V5.8A3 3 0 0 1 15 4.5z"/>`),
  syringe:w(`<path ${f} d="M14.5 4.5l5 5-9.5 9.5H5v-5z"/><path d="M17 2l5 5M19.5 4.5l-2 2M5 19l-2.5 2.5M8.5 11l2 2M11 8.5l2 2"/>`),
  sleep:w(`<path ${f} d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/><path d="M14.5 4h3.5l-3.5 4h3.5"/>`),
  gauge:w(`<path ${f} d="M3.5 16.5a8.5 8.5 0 0 1 17 0z"/><path d="M12 16.5l4-5"/><circle cx="12" cy="16.5" r="1.5" fill="currentColor"/>`),
  clip:w(`<rect ${f} x="5" y="4.5" width="14" height="17" rx="2.4"/><rect x="8.6" y="2.6" width="6.8" height="3.8" rx="1.4" fill="var(--surface)"/><path d="M8.6 11h6.8M8.6 14.5h6.8M8.6 18h4"/>`),
  pulse:w(`<path d="M2.5 12.5h4l2-5 3.5 10 2.6-7.2 1.4 2.2h5.5" stroke-width="2"/>`)}})();
// scene drawing: resuscitation surface (wall outlets, perspective mattress with striped blanket, BVM, folded towel, swaddled baby)
const WSCENE=`<svg viewBox="8 26 304 168" preserveAspectRatio="xMidYMid slice" class="wscene-svg" role="img" aria-label="Newborn on the resuscitation surface, with a neonatal bag-valve-mask and a folded towel">
 <defs><linearGradient id="wsWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8EEF6"/><stop offset="1" stop-color="#D3DDEA"/></linearGradient>
  <linearGradient id="wsBed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F3EEF1"/></linearGradient>
  <linearGradient id="wsBag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6F9BF0"/><stop offset="1" stop-color="#2F5FCB"/></linearGradient>
  <linearGradient id="wsTowel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBE6B0"/><stop offset="1" stop-color="#EBC77A"/></linearGradient>
  <radialGradient id="wsSkin" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#F6D7BE"/><stop offset="1" stop-color="#E2B897"/></radialGradient></defs>
 <rect width="320" height="200" fill="url(#wsWall)"/>
 <rect x="18" y="12" width="64" height="44" rx="6" fill="#C8D3E2"/><rect x="24" y="17" width="52" height="30" rx="3" fill="#2A3550"/><path d="M28 34h10l3-7 4 13 3-9 2 3h22" fill="none" stroke="#3EE08A" stroke-width="1.6"/>
 <rect x="104" y="14" width="120" height="30" rx="8" fill="#CBD6E4"/>
 <g><circle cx="128" cy="29" r="8" fill="#F4F6F9" stroke="#AEB9C9" stroke-width="2"/><circle cx="128" cy="29" r="3" fill="#2F9E5B"/><circle cx="158" cy="29" r="8" fill="#F4F6F9" stroke="#AEB9C9" stroke-width="2"/><circle cx="158" cy="29" r="3" fill="#2F9E5B"/><circle cx="188" cy="29" r="8" fill="#F4F6F9" stroke="#AEB9C9" stroke-width="2"/><circle cx="188" cy="29" r="3" fill="#2B3446"/></g>
 <rect x="244" y="10" width="62" height="50" rx="8" fill="#2B3446"/><rect x="250" y="16" width="50" height="30" rx="4" fill="#3F7FD8" opacity=".55"/><rect x="262" y="48" width="26" height="6" rx="3" fill="#F2C94C"/>
 <path d="M30 78h260l22 112H8z" fill="#BFD7EE" opacity=".45"/>
 <path d="M40 84h240l18 100H22z" fill="url(#wsBed)" stroke="#D9DFEA" stroke-width="1.5"/>
 <path d="M40 84l-18 100M48 84l-17 100M280 84l18 100M272 84l17 100" stroke="#8FB5E8" stroke-width="3"/><path d="M44 84l-17.5 100M276 84l17.5 100" stroke="#F2A0B6" stroke-width="3"/>
 <path d="M20 184h280" stroke="#C9D3E2" stroke-width="3"/>
 <g transform="translate(238 90) rotate(-6) scale(.8)"><rect width="58" height="34" rx="7" fill="url(#wsTowel)"/><path d="M0 12h58M0 23h58" stroke="#D8B266" stroke-width="2"/><path d="M4 4h50" stroke="#FFF3D2" stroke-width="2" stroke-linecap="round"/></g>
 <g transform="translate(30 92) scale(.82)"><path d="M6 8c0-6 6-8 12-6" fill="none" stroke="#C9D6EA" stroke-width="3"/><ellipse cx="36" cy="18" rx="28" ry="15" fill="url(#wsBag)"/><ellipse cx="28" cy="12" rx="11" ry="4.5" fill="#fff" opacity=".35"/><rect x="62" y="12" width="12" height="12" rx="3" fill="#E9B44C"/><rect x="74" y="13" width="9" height="10" rx="2" fill="#DDE3EC"/><path d="M83 10c12-6 22 2 20 12-1 6-8 10-14 9-6-1-8-6-6-10" fill="#EEF4FA" fill-opacity=".85" stroke="#B7C3D3" stroke-width="2"/></g>
 <g transform="translate(142 114)"><ellipse cx="44" cy="52" rx="58" ry="10" fill="#C9C2D6" opacity=".35"/>
  <path d="M14 30c6-20 36-26 64-22 18 3 30 14 30 26 0 14-18 22-44 22C34 56 10 50 14 30z" fill="#EDE7F4" stroke="#CBBFDB" stroke-width="2"/>
  <path d="M34 18c18 6 44 8 70 6M30 46c22 4 50 4 74-4" stroke="#D9CFE6" stroke-width="2" fill="none"/>
  <circle cx="10" cy="30" r="19" fill="url(#wsSkin)" stroke="#D2A584" stroke-width="1.5"/><path d="M-8 26c2-14 16-22 30-16" stroke="#8DB3E2" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M0 32h5M12 32h5" stroke="#8C6A52" stroke-width="2" stroke-linecap="round"/><path d="M5 40h5" stroke="#A9806A" stroke-width="2" stroke-linecap="round"/></g>
</svg>`;
// supplied artwork (full colour, fills the badge): hourglass for wait, stopwatch for time questions (ic/timer.webp), syringe, two-thumb compressions picture (ic/comp.webp)
const WIC_ART=(()=>{const hg=`<svg viewBox="0 0 508 508" aria-hidden="true"><circle fill="#324A5E" cx="254" cy="254" r="254"/><path fill="#FFFFFF" d="M268.8,254c25.6-21.2,74.8-69.2,75.6-125.6H163.6c0.8,56.4,50.4,104.4,75.6,125.6c-25.2,21.2-74.8,69.2-75.6,125.6h180.8C343.6,323.2,294,275.2,268.8,254z"/><path fill="#FF7058" d="M368.8,128.4H139.2c-6.4,0-11.6-5.2-11.6-11.6l0,0c0-6.4,5.2-11.6,11.6-11.6h229.2c6.4,0,11.6,5.2,11.6,11.6l0,0C380,123.2,375.2,128.4,368.8,128.4z"/><path fill="#FF7058" d="M368.8,402.4H139.2c-6.4,0-11.6-5.2-11.6-11.6l0,0c0-6.4,5.2-11.6,11.6-11.6h229.2c6.4,0,11.6,5.2,11.6,11.6l0,0C380,397.2,375.2,402.4,368.8,402.4z"/><path fill="#84DBFF" d="M199.6,196c19.2,26.8,44,47.2,54.4,55.2c10.8-8,35.2-28.4,54.4-55.2H199.6z"/><path fill="#84DBFF" d="M200,311.2c-12,16.8-22,36-25.2,56.4h158c-3.2-20.4-13.2-39.6-25.2-56.4H200z"/><ellipse fill="#84DBFF" cx="254" cy="268.8" rx="6" ry="6.8"/><ellipse fill="#84DBFF" cx="254" cy="288.8" rx="6" ry="6.8"/><rect x="354" y="128.4" fill="#E6E9EE" width="12" height="250.8"/><rect x="142.4" y="128.4" fill="#E6E9EE" width="12" height="250.8"/></svg>`;
  return {wait:hg,timer:`<img src="ic/timer.webp" alt="" draggable="false">`,
  syringe:`<svg viewBox="0 0 512.014 512.014" aria-hidden="true"><polygon fill="#3BAFDA" points="0.007,496.92 138.306,358.605 153.4,373.699 15.085,512.014"/><polygon fill="#E6E9ED" points="184.572,402.857 116.696,395.309 109.149,327.433 350.496,86.085 425.919,161.508"/><polygon fill="#4FC2E9" points="109.149,327.433 116.696,395.309 184.572,402.857 354.059,233.361 203.213,233.361"/><polygon fill="#CCD1D9" points="501.343,55.913 456.092,10.662 350.496,116.25 395.747,161.508"/><path fill="#434A54" d="M293.73,203.196c4.156,4.164,10.923,4.164,15.079,0c4.172-4.164,4.172-10.922,0-15.086l-30.173-30.172l-15.078,15.086L293.73,203.196z"/><path fill="#434A54" d="M248.48,248.447c4.156,4.164,10.906,4.164,15.078,0s4.172-10.922,0-15.086l-30.172-30.165l-15.079,15.079L248.48,248.447z"/><path fill="#434A54" d="M203.229,293.698c4.156,4.156,10.906,4.156,15.078,0c4.156-4.156,4.156-10.906,0-15.078l-30.172-30.173l-15.079,15.094L203.229,293.698z"/><path fill="#E6E9ED" d="M508.89,63.46L448.545,3.123c-4.156-4.164-10.922-4.164-15.078,0c-4.173,4.164-4.173,10.914,0,15.078l60.328,60.337c4.173,4.172,10.923,4.172,15.095,0C513.046,74.374,513.046,67.624,508.89,63.46z"/><path fill="#E6E9ED" d="M425.919,161.508l-75.423-75.423c-4.156-4.164-10.922-4.164-15.078,0c-4.172,4.165-4.172,10.915,0,15.086l75.423,75.416c2.078,2.086,4.812,3.125,7.531,3.125c2.734,0,5.469-1.039,7.547-3.125C430.091,172.423,430.091,165.673,425.919,161.508z"/></svg>`,
  comp:`<img src="ic/comp.webp" alt="" draggable="false">`}})();
Object.assign(WIC,WIC_ART);
function walkVis(s,cur){const ids=walkPath(s),ci=ids.indexOf(cur);let mon=null;ids.slice(0,ci+1).forEach(id=>{if(s.nodes[id].mon)mon=s.nodes[id].mon});
  const scene=s.media?(/\.(mp4|webm)$/.test(s.media)?`<video src="${s.media}" autoplay muted loop playsinline></video>`:`<img src="${s.media}" alt="${s.mediaAlt||""}">`):WSCENE;
  const hr=mon&&mon.hr,beat=hr?(60/hr).toFixed(2):0,sp=hr?Math.max(26,3600/hr):60,a=((sp-24.5)/2).toFixed(1),qrs=`h${a}l2-3 2 3h3l1.5 3 2.5-22 2.5 25 2-6h3l3-3 3 3h${a}`;
  return `<div class="wvis ${mon?"":"solo"}"><figure class="wscene">${scene}</figure>${mon?`<div class="wmon-card"><span class="wmon-h">${WIC.pulse} Patient monitor</span><div class="wmon" role="img" aria-label="Monitor: heart rate ${hr||"not available"}${mon.spo2?", SpO2 "+mon.spo2+"%":""}" style="--beat:${beat}s;--sp:${sp}px">
    <div class="wm-row"><span class="wm-l"><svg class="wm-heart" viewBox="0 0 24 24"><path d="M12 20s-7-4.3-7-9.4A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.6C19 15.7 12 20 12 20z" fill="currentColor"/></svg>HR</span><b class="wm-hr">${hr||"--"}<small>bpm</small></b></div>
    <svg class="wm-ecg" viewBox="0 0 120 40" preserveAspectRatio="none"><g class="wm-trace"><path d="M0 26${qrs.repeat(Math.ceil(120/sp)+2)}"/></g></svg>
    <div class="wm-row"><span class="wm-l">SpO₂</span><b class="wm-sp">${mon.spo2?mon.spo2+"<small>%</small>":"--<small>%</small>"}</b></div></div></div>`:""}</div>`;}
// interactive diagram helpers (content in js/content/scrubs.js)
const scrubC=D=>P.scC||(P.scC=typeof D.controls==="function"?D.controls():D.controls);
const scrubV=C=>P.sv||(P.sv=Object.fromEntries(C.map(c=>[c.k,c.val])));
const goalHTML=D=>`<div class="goal ${P.goalMet?"met":""}" id="scGoal" role="status"><span class="gi">${P.goalMet?I.check:I.flag}</span><div><span class="label">${P.goalMet?"Task complete":"Task"}</span><p>${P.goalMet?D.goal.done:D.goal.text}</p></div></div>`;
function scrubWire(el,s){const D=SCRUB[s.scrub],C=scrubC(D);
  el.querySelectorAll("[data-scrub]").forEach(inp=>inp.addEventListener("input",()=>{const k=inp.dataset.scrub,c=C.find(x=>x.k===k);P.sv[k]=+inp.value;
    const t=c.fmt(P.sv[k]);el.querySelector("#scv-"+k).textContent=t;inp.setAttribute("aria-valuetext",t);if(D.confirm&&!P.goalMet)P.scRes=null;el.querySelector("#scOut").innerHTML=D.view(P.sv,C,P.scRes);
    if(D.goal&&!D.confirm&&!P.goalMet&&D.goal.test(P.sv,C)){P.goalMet=true;el.querySelector("#scGoal").outerHTML=goalHTML(D);const b=el.querySelector(".p-foot .btn");if(b){b.disabled=false;b.textContent="Continue";}}}));}
// scrub with confirm:true: nothing is revealed while the slider moves; Confirm checks the setting
function scrubConfirm(){const s=P.steps[P.i],D=SCRUB[s.scrub],C=scrubC(D),ok=D.goal.test(P.sv,C);P.scRes=ok?"ok":"wrong";if(ok)P.goalMet=true;else P.scMiss=true;drawPlayer(ok?".p-foot .btn":"[data-scconfirm]");}
// case thread: a step with `story` starts (or, with "", ends) a patient that stays on screen for the following steps
const storyHTML=s=>{if(["walk","racebench"].includes(s.type)||!P.steps)return "";let t="";for(let k=0;k<=P.i;k++)if(P.steps[k].story!==undefined)t=P.steps[k].story;
  return t?`<div class="story"><span class="label">Case</span><b>${t}</b></div>`:""};
// scene picture (content in js/content/scenes.js): pic above the question, after + afterCap once answered correctly, walk nodes can set their own
const picHTML=s=>{let k=s.pic,cap="";if(s.type==="walk"){const n=s.nodes[P.cur||s.start];if(n.pic){k=n.pic;cap=n.cap||"";}else if(n.end&&s.after){k=s.after;cap=s.afterCap||"";}}else if(s.after&&locked()){k=s.after;cap=s.afterCap||"";}
  const p=k&&typeof SCENES!=="undefined"&&SCENES[k];if(!p)return "";
  if(SCENE_LAYOUT==="overlay") return `<figure class="scenepic full${P.spBig?" big":""}${cap?" after":""}${locked()&&QTYPES.includes(s.type)?" answered":""}"><img src="${p.img}" alt="${p.alt}" style="object-position:${p.pos||"50% 50%"}" draggable="false">${cap?`<span class="sp-cap">${I.check}${cap}</span>`:""}<figcaption class="sp-txt"></figcaption><button class="sp-zoom" type="button" aria-label="${P.spBig?"Make the picture smaller":"Enlarge the picture"}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg></button></figure>`;
  return `<figure class="scenepic${cap?" after":""}"><img src="${p.img}" alt="${p.alt}" style="object-position:${p.pos||"50% 50%"}" draggable="false">${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`};
// algorithm map: the correct route as a flowchart. Decision nodes (short options, or branch:true) show their label (node.short) and
// the other answers as faint side branches; action steps stay hidden until answered so the map never gives an answer away.
const walkPath=s=>{const ids=[];let id=s.start;while(id&&!ids.includes(id)){ids.push(id);const n=s.nodes[id];if(!n||n.end)break;const o=n.opts.find(x=>x.to);id=o&&o.to;}return ids};
const walkDec=n=>n.branch!==undefined?n.branch:!!n.opts&&n.opts.length>1&&n.opts.every(o=>o.t.length<=24);
// group of walk steps (s.group): one marker per walk, filled with its method colour (s.mk, short name s.gl) once finished
const WICX=k=>k&&WIC[k]?`<span class="oic ${k}${WIC_ART[k]?" art":""}">${WIC[k]}</span>`:"";
function walkSet(s){const g=P.steps.map((x,j)=>[x,j]).filter(([x])=>x.type==="walk"&&x.group===s.group);
  return `<ol class="wset" aria-label="Progress through this set">${g.map(([x,j],k)=>{const done=j<P.i||(j===P.i&&!!x.nodes[P.cur||x.start].end);
    return `<li class="${done?"done mk-"+x.mk:j===P.i?"cur":""}"><b>${k+1}</b><span>${done?x.gl:j===P.i?"Current":""}</span></li>`}).join("")}</ol>`;}
function walkMap(s,full){const ids=walkPath(s),cur=P.cur||s.start,ci=ids.indexOf(cur),miss=new Set(P.wMiss.map(m=>m.node));
  return `<ol class="wmap ${full?"full":""}${s.group?" slim":""}" aria-label="Algorithm progress">${ids.map((id,i)=>{const n=s.nodes[id],st=i<ci?"done":i===ci?"cur":"todo";
    if(n.end&&s.group)return "";if(n.end){const t=n.end.split(/(?<=\.)\s/)[0];return `<li class="wn end ${st} ${n.tone||""}"><span class="wn-b">${st==="cur"?t:"Outcome"}</span></li>`;}
    const ok=n.opts.find(o=>o.to),dec=walkDec(n),lab=n.short?`<b>${n.short}</b>`:"";
    const box=st==="done"?`${lab}<span>${ok?ok.t:""}</span>`:n.short&&!s.hideNext?lab:`<span>Step ${i+1}</span>`;
    const alt=dec?`<span class="wn-alt">${n.opts.filter(o=>!o.to).map(o=>o.alt&&(st==="done"||full)?`<i class="to${o.amk?" mk-"+o.amk:""}">${o.alt}</i>`:`<i>${o.t}</i>`).join("")}</span>`:"";
    return `<li class="wn ${st}${miss.has(id)&&st==="done"?" miss":""}${dec?" dec":""}${st==="done"&&ok&&ok.mk?" mk-"+ok.mk:""}"><span class="wn-b">${box}</span>${alt}</li>`;}).join("")}</ol>`;}
// step-by-step algorithm (walk): a wrong pick shows why and hides the options until "Try again" (then reshuffled);
// each node missed on the first try is counted, listed at the end and added to the review queue; 2+ misses = one more run before Continue
const walkNeedsRerun=s=>P.wRun===1&&P.wMiss.length>=2&&P.mode==="practice"&&!!s.nodes[P.cur||s.start].end;
function walkPick(i){
  const s=P.steps[P.i],cur=P.cur||s.start,n=s.nodes[cur],o=n.opts[i];
  if(o.why){P.why=o.why;P.whyIdx=i;P.walkMiss=true;
    if(!P.wMiss.some(m=>m.node===cur)){const ok=n.opts.find(x=>x.to);P.wMiss.push({node:cur,q:n.q,a:ok?ok.t:""});
      if(P.wRun===1&&P.mode==="practice"&&P.l){S.conf[P.l.id+"#"+P.i+"@"+cur]={c:null,ok:false,lesson:P.l.id,label:P.l.title+" · "+(s.title||"algorithm")};save();}}
    drawPlayer("[data-walkretry]");return;}
  P.trail.push({q:n.q,a:o.t,miss:P.wMiss.some(m=>m.node===cur)});P.cur=o.to;P.why=null;P.whyIdx=null;
  drawPlayer(s.nodes[o.to].end?".p-foot .btn":".wopts .opt");
}
function walkRetry(){const s=P.steps[P.i],cur=P.cur||s.start;P.why=null;P.whyIdx=null;P.wOrd[cur]=shuffle(s.nodes[cur].opts.map((_,i)=>i));drawPlayer(".wopts .opt");}
function walkRerun(){P.cur=null;P.trail=[];P.why=null;P.whyIdx=null;P.wOrd={};P.wMiss=[];P.wRun=2;drawPlayer(".wopts .opt");}
// numeric answers: "24", "24 mL", "1,000" all compare as numbers
const numKey=v=>String(v||"").trim().replace(/,/g,"").replace(/\s*[a-zµ/]+$/i,"");
const numEq=(v,a)=>{const k=numKey(v);return k!==""&&!isNaN(+k)&&Math.abs(+k-(+a))<1e-9};
/* ---------- chartpick: tap the row of the paediatric TXA chart (s.age, s.col = dose | volume | drawOut) ---------- */
const CP_COLS={weight:["Weight","kg"],dose:["Dose","mg"],volume:["Volume","mL"],drawOut:["Draw out","mL"]};
function chartpickBody(s){const L=locked(),rows=TX_CHART.filter(r=>r.age<14),lab=s.label?`<span class="label">${s.label}</span>`:"";
  const cell=(r,c)=>r[c]==null?"–":r[c]+" "+CP_COLS[c][1];
  return `${badges(s)}${lab}<h2>${s.prompt}</h2><div class="cpick" role="radiogroup" aria-label="Paediatric TXA dose chart">
   <div class="cp-row cp-head"><span>Age</span>${Object.keys(CP_COLS).map(c=>`<span class="${c===s.col?"on":""}">${CP_COLS[c][0]}</span>`).join("")}</div>
   <div class="cp-row cp-inf"><span>0–12 mo</span><span class="cp-span">(months × 0.5) + 4 kg · 15 mg/kg · ÷ 10 mg/mL</span></div>
   ${rows.map(r=>{const st=L&&r.age===s.age?"right":(P.status==="wrong"||P.status==="revealed")&&r.age===P.sel?"wrong":"";
     return `<button class="cp-row ${st} ${r.age>=8?"big":""}" role="radio" aria-checked="${P.sel===r.age}" data-cpick="${r.age}" ${L?"disabled":""}><span>${r.age} y</span>${Object.keys(CP_COLS).map(c=>`<span class="${c===s.col?"on":""}">${cell(r,c)}</span>`).join("")}</button>`}).join("")}
  </div><p class="note">From 8 years (or over 30 kg) draw out and discard the chart volume, then give the remainder.</p>${srcLine(s)}`;}
function cpickFb(s){const r=TX_CHART.find(x=>x.age===P.sel);if(s.col==="drawOut"&&r&&r.drawOut==null)return `You chose the ${P.sel}-year row. Under 8 years there is no draw-out volume: the dose is drawn up from the bag. Check the child's age again.`;
  return `You chose the ${P.sel}-year row. Check the child's age in the question and use that row.`;}
/* ---------- chain: a calculation in linked lines; each line opens once the one before it is correct ---------- */
function chainBody(s){const L=locked(),lab=s.label?`<span class="label">${s.label}</span>`:"";
  return `${badges(s)}${s.intro?`<div class="info">${s.intro}</div>`:""}${lab}<h2>${s.prompt}</h2><ol class="chain">${s.fields.map((f,i)=>{
    const done=L||i<P.ci,cur=!L&&i===P.ci,st=done?"ok":cur?(P.status==="wrong"?"wrong":"cur"):"todo";
    return `<li class="ch-l ${st}"><span class="ch-k">${f.lab}</span><span class="ch-e">${f.expr} =</span>
     ${done?`<b class="ch-v">${f.answer} ${f.unit}</b>`:cur?`<span class="ans ch-in"><input id="ansInput" inputmode="decimal" autocomplete="off" aria-label="${f.lab}" value="${P.val}"><span>${f.unit}</span></span>`:`<span class="ch-v ch-q">… ${f.unit}</span>`}</li>`}).join("")}</ol>${srcLine(s)}`;}
const QTYPES=["choice","multi","sort","match","input","order","racebench","chartpick","chain"];
const needConf=()=>P.mode==="exit"||P.mode==="final";
const canCheck=s=>isReady(s)&&(!needConf()||P.conf);
function confNote(ok){
  if(P.tries!==1||!P.conf) return "";
  if(!ok&&P.conf==="sure") return `<p class="cnote bad">Incorrect with high confidence. Confident errors are the most likely to carry into practice.</p>`;
  if(ok&&P.conf==="guess") return `<p class="cnote mid">Correct, but marked as a guess. Review this change in the quick reference.</p>`;
  return "";
}
function cwRow(){
  const w=P.answers.filter(a=>a.conf==="sure"&&!a.ok);
  return w.length?`<div class="resrow"><b>Certain but wrong</b><small class="no">${w.map(a=>a.id).join(", ")}</small><p class="note" style="grid-column:1/-1">Answered with high confidence but incorrect. These are the most likely to carry into practice.</p></div>`:"";
}
function deckHTML(){
  const n=P.cards.length;
  if(P.ci>=n){
    return `<div></div><div class="p-body"><div class="done"><div class="burst">${I.cards}</div><h1 style="font-size:2rem">Deck complete</h1><p class="note">${MODS[P.mod]} · habits to unlearn</p>
     <div class="tiles" style="grid-template-columns:1fr 1fr"><div class="tile"><b style="color:var(--good)">${P.known}</b><span>Got it</span></div><div class="tile"><b style="color:var(--sun)">${P.again.length}</b><span>Still learning</span></div></div>${P.again.length?`<p class="note">Cards marked Still learning come first the next time you open this deck.</p>`:""}</div></div>
     <div class="p-foot"><div class="foot-in"><div class="foot-btns">${P.again.length?`<button class="btn ghost" data-act="deck-again">Review ${P.again.length} again</button>`:""}<button class="btn" data-act="finish">Done</button></div></div></div>`;
  }
  const c=P.cards[P.ci];
  return `<div class="p-top"><button class="x" data-act="close" aria-label="Close">${I.x}</button><div class="bar" role="progressbar" aria-label="Deck progress" aria-valuenow="${Math.round(P.ci/n*100)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${P.ci/n*100}%"></i></div><span class="count">${P.ci+1}/${n}</span></div>
   <div class="p-body"><div class="deck"><span class="label">${MODS[P.mod]} · habits to unlearn</span>
    <div class="card3d ${P.flipped?"flipped":""}"><button class="inner" data-act="flip" aria-label="${P.flipped?"Show the question side":"Flip to see the v2.6 answer"}">
     <div class="face front" aria-hidden="${P.flipped}"><span class="kind ${c.kind}">${KIND[c.kind]}</span><p class="ftxt">${c.f}</p></div>
     <div class="face back" aria-hidden="${!P.flipped}"><span class="kind now">v2.6</span><p class="ftxt">${c.b}</p>${c.pend?`<span class="badge pend" style="justify-self:start">Details pending verification</span>`:""}<span class="src">Source: ${c.src}</span></div>
    </button></div><p class="note">Tap the card or press Space to flip.</p></div></div>
   <div class="p-foot"><div class="foot-in">${P.flipped?`<div class="foot-btns"><button class="btn ghost" data-act="deck-again1">Still learning</button><button class="btn good" data-act="deck-got">Got it</button></div>`:`<button class="btn wide" data-act="flip">Flip card</button>`}</div></div>`;
}
function isReady(s){
  if(s.type==="choice") return P.sel!==null;
  if(s.type==="multi") return P.multi.length>0;
  if(s.type==="sort") return Object.keys(P.sort).length===s.cards.length;
  if(s.type==="match") return Object.keys(P.match).length===s.pairs.length;
  if(s.type==="order") return P.ord.length===s.items.length;
  if(s.type==="input") return P.val.trim()!=="";
  if(s.type==="racebench") return rbReady();
  if(s.type==="chartpick") return P.sel!==null;
  if(s.type==="chain") return P.val.trim()!=="";
  return true;
}
function footHTML(s){
  if(s.type==="read"&&s.stepper){const ok=P.usSeen.length>=stepperItems(s.stepper).length;return `<button class="btn wide" data-act="next" ${ok?"":"disabled"}>${ok?"Continue":"Open every step to continue"}</button>`;}
  if(["read","lookup","blocked"].includes(s.type)) return `<button class="btn wide" data-act="next">${s.type==="lookup"?"I've located it":"Continue"}</button>`;
  if(s.type==="video") return `<button class="btn wide" data-act="next" ${P.watched?"":"disabled"}>Continue</button>`;
  if(s.type==="watch") return `<button class="btn wide" data-act="next" ${!s.src||P.watchDone?"":"disabled"}>Continue</button>`;
  if(s.type==="sim"){const ok=(S.sim&&S.sim.done)||P.simManual;return `<button class="btn wide" data-act="next" ${ok?"":"disabled"}>${ok?"Continue":"Finish independent mode to continue"}</button>`;}
  if(s.type==="scrub"){const D=SCRUB[s.scrub],ok=!D.goal||P.goalMet;return `<button class="btn wide" data-act="next" ${ok?"":"disabled"}>${ok?"Continue":"Complete the task to continue"}</button>`;}
  if(s.type==="walk") return s.nodes[P.cur||s.start].end?(walkNeedsRerun(s)?`<button class="btn wide" data-walkrerun="1">Run it again</button>`:`<button class="btn wide" data-act="next">Continue</button>`):`<button class="btn wide" disabled>Work through the algorithm to continue</button>`;
  if(P.status==="idle"&&P.mode==="diag") return "";
  if(P.status==="idle"){const conf=needConf()&&QTYPES.includes(s.type)?`<div class="conf" role="group" aria-label="How sure are you?"><span class="label">How sure are you?</span>${CONF.map(([k,t])=>`<button class="cbtn" data-conf="${k}" aria-pressed="${P.conf===k}">${t}</button>`).join("")}</div>`:"";
    return `${conf}<button class="btn wide" data-act="check" ${canCheck(s)?"":"disabled"}>${assessMode()?"Submit answer":s.type==="chain"&&P.ci<s.fields.length-1?"Check this line":"Check"}</button>`;}
  const fbv=s.type==="chain"?s.fields[P.ci].fbv:s.fbv,fbKey=numKey(P.val);
  const fbText=s.type==="chartpick"&&P.sel!==null?cpickFb(s):fbv&&fbv[fbKey]?fbv[fbKey]:s.type==="chain"?(s.fields[P.ci].hint||"Have another look at this line and try again."):s.fb&&P.sel!==null&&s.fb[P.sel]?s.fb[P.sel]:s.type==="order"?"Items in red are in the wrong position.":s.type==="match"?"Definitions in red are on the wrong term.":s.type==="racebench"?"Rows in red are scored incorrectly. Check them against the RACE table.":"Have another look and try again.";
  if(P.status==="right") return `<div class="fb"><h3>${I.check.replace('<svg','<svg width="22" height="22"')} Correct</h3>${vsHTML(s)}<p>${s.explain||""}</p>${confNote(true)}${s.src?`<p class="src">Source: ${s.src}</p>`:""}</div><button class="btn good wide" data-act="next">Continue</button>`;
  if(P.status==="wrong") return `<div class="fb"><h3>Incorrect</h3><p>${fbText}</p>${confNote(false)}</div><div class="foot-btns">${P.tries>=2?`<button class="btn ghost" data-act="reveal">Show answer</button>`:""}<button class="btn bad" data-act="retry">Try again</button></div>`;
  if(P.status==="revealed") return `<div class="fb">${P.mode==="diag"?"<h3>Incorrect</h3>":`<h3 style="color:var(--ink)">Answer</h3>`}${vsHTML(s)}<p>${s.explain||""}</p>${s.src?`<p class="src">Source: ${s.src}</p>`:""}</div><button class="btn wide" data-act="next">Continue</button>`;
}
/* ---------- phones: keep cases readable without scrolling back (pinned case, smaller scene photo, folded tables) ---------- */
// read step with stepper:"ustep": one step of the V visual at a time (letter tabs, Next button, stop rule); Continue once every step is opened
const STEPPER={};
function stepperItems(k){if(STEPPER[k])return STEPPER[k];const d=document.createElement("div");d.innerHTML=V[k];
  return STEPPER[k]=[...d.querySelectorAll("li")].map(li=>({l:li.querySelector(".us-l").textContent,ic:li.querySelector(".us-ic").innerHTML,t:li.querySelector(".us-t").textContent,p:li.querySelector("p").innerHTML}));}
function stepperHTML(s){const it=stepperItems(s.stepper),i=P.usI,c=it[i],n=it.length,note=(()=>{const d=document.createElement("div");d.innerHTML=V[s.stepper];const e=d.querySelector(".note");return e?e.innerHTML:""})();
  return `<div class="ustp"><div class="ustp-stop">${WIC.stop||""}<b>Stop at any point if there's a clinical concern or a contraindication.</b></div><div class="ustp-tabs" role="tablist" aria-label="Steps">${it.map((x,k)=>`<button role="tab" aria-selected="${k===i}" class="ustp-tab${k===i?" on":""}${P.usSeen.includes(k)?" seen":""}" data-ustp="${k}"><b>${x.l}</b><span>${x.t}</span></button>`).join("")}</div>
  <div class="ustp-card" role="tabpanel" aria-live="polite"><span class="ustp-ic" aria-hidden="true">${c.ic}</span><div><span class="label">Step ${i+1} of ${n}</span><h3>${c.t}</h3><p>${c.p}</p></div>
  <div class="ustp-nav">${i>0?`<button class="btn ghost sm" data-ustp="${i-1}">← Back</button>`:"<span></span>"}${i<n-1?`<button class="btn sm" data-ustp="${i+1}">Next: ${it[i+1].t} →</button>`:""}</div></div>
  ${note?`<p class="note">${note}</p>`:""}</div>`;}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-ustp]");if(!b||!P)return;e.preventDefault();P.usI=+b.dataset.ustp;if(!P.usSeen.includes(P.usI))P.usSeen.push(P.usI);drawPlayer(`[data-ustp="${P.usI}"].ustp-tab`);});
const PHONE=()=>matchMedia("(max-width:600px)").matches;
// a table inside a question (e.g. the RACE scale): a tap-to-open bar on phones, open on wider screens; remembers its state within the step
const VFOLD={race:"RACE scale"};
const vfold=k=>VFOLD[k]?`<details class="visual vfold"${(P.vfold??!PHONE())?" open":""}><summary>${VFOLD[k]}</summary>${V[k]}</details>`:`<div class="visual">${V[k]}</div>`;
// once the case scrolls out of view, a slim copy stays pinned at the top of the lesson; tap it to show the case in full
let casePinIO=null;
function casePin(el){if(casePinIO){casePinIO.disconnect();casePinIO=null}
  const pb=el.querySelector(".p-body"),st=pb&&pb.querySelector(".step");if(!st||!PHONE()||typeof IntersectionObserver==="undefined")return;
  const src=[...st.querySelectorAll(".story,.case,.info")].find(n=>!n.classList.contains("info")||/^\s*Case\b/.test(n.textContent));if(!src)return;
  const pin=document.createElement("div");pin.className="case-pin"+(P.pinOpen?" open":"");pin.setAttribute("aria-hidden","true");
  pin.innerHTML=`<div class="cp-in">${src.innerHTML}<span class="cp-more">${P.pinOpen?"Less":"Full case"}</span></div>`;st.prepend(pin);
  pin.addEventListener("click",()=>{P.pinOpen=!P.pinOpen;pin.classList.toggle("open",P.pinOpen);pin.querySelector(".cp-more").textContent=P.pinOpen?"Less":"Full case";});
  casePinIO=new IntersectionObserver(([e])=>pin.classList.toggle("on",!e.isIntersecting&&e.boundingClientRect.top<e.rootBounds.top+1),{root:pb,threshold:0});casePinIO.observe(src);}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest(".sp-zoom");if(!b)return;e.preventDefault();P.spBig=!P.spBig;const f=b.closest(".scenepic");f.classList.toggle("big",P.spBig);b.setAttribute("aria-label",P.spBig?"Make the picture smaller":"Enlarge the picture");});
function drawPlayer(keepFocus){
  const el=document.getElementById("player");
  // keep the scroll position when the same step is redrawn (a tap on the tray, a card opening), so the screen does not jump
  const pk=P&&P.l?P.l.id+"#"+P.i+"#"+P.status:null,ob=el.querySelector(".p-body"),keepY=ob&&pk&&el.dataset.pk===pk?ob.scrollTop:0;el.dataset.pk=pk||"";
  if(P.mode==="deck"){el.innerHTML=deckHTML();const f=el.querySelector(keepFocus||".p-foot .btn");if(f)f.focus();return;}
  if(P.status!=="complete"&&P.steps&&P.steps[P.i]&&P.steps[P.i].type==="tour"){finishLesson();closeLesson();go("home");tourStart();return;}
  el.classList.toggle("scene",!!(P.l&&P.l.scene));el.classList.remove("prepbench");
  if(P.status!=="complete"&&P.steps&&P.steps[P.i]&&P.steps[P.i].type==="stage"){
    const s=P.steps[P.i],body=txBody(s),st=P.sx,fc=st.fb?(st.fb.ok?"right":"wrong"):"";
    const bench=benchOn();el.classList.toggle("prepbench",bench);
    el.innerHTML=`<div class="scene-head">${txTopHTML(s)}</div><div class="p-body">${bench?benchHTML(s):""}<div class="step scene-step${bench?" bench-tool":""}" ${keepFocus?'style="animation:none"':""}>${body}</div></div><div class="p-foot ${fc}"><div class="foot-in">${txFoot(s)}</div></div>${txOverlays(s)}`;
    {const nb=el.querySelector(".p-body");if(nb&&keepY)nb.scrollTop=keepY;}
    txAfter(s);
    const ft=keepFocus&&el.querySelector(keepFocus);if(ft)ft.focus({preventScroll:true});else if(st.fb){const b=el.querySelector(".p-foot .btn");if(b)b.focus({preventScroll:true});}
    return;
  }
  if(P.status==="complete"){el.innerHTML=endScreen();const b=el.querySelector(".p-foot .btn");if(b)b.focus();return;}
  const s=P.steps[P.i],pct=(P.i/P.steps.length)*100;
  const fcls=P.status==="right"?"right":P.status==="wrong"||(P.mode==="diag"&&P.status==="revealed")?"wrong":"";
  el.innerHTML=`<div class="p-top"><button class="x" data-act="close" aria-label="Close lesson">${I.x}</button><div class="bar" role="progressbar" aria-label="Lesson progress" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div><span class="count">${P.i+1}/${P.steps.length}</span></div>
    <div class="p-body"><div class="step" ${keepFocus?'style="animation:none"':""}>${storyHTML(s)}${picHTML(s)}${stepBody(s)}</div></div>
    <div class="p-foot ${fcls}"><div class="foot-in">${footHTML(s)}</div></div>`;
  {const nb=el.querySelector(".p-body");if(nb&&keepY)nb.scrollTop=keepY;}
  el.querySelectorAll("details.vfold").forEach(d=>d.addEventListener("toggle",()=>{P.vfold=d.open}));
  const wv=el.querySelector("#watchvid");if(wv)wv.addEventListener("ended",()=>{P.watchDone=true;S.videos=S.videos||{};S.videos[P.l.id]=true;save();const b=el.querySelector(".p-foot .btn");if(b)b.disabled=false;const n=el.querySelector("#watchnote");if(n)n.textContent="Video watched.";});
  if(s.type==="scrub")scrubWire(el,s);
  const wm=el.querySelector(".wmap:not(.full)"),wc=wm&&wm.querySelector(".cur");if(wc&&wm.scrollWidth>wm.clientWidth)wm.scrollLeft=wc.offsetLeft-wm.clientWidth/2+wc.offsetWidth/2;
  const spt=el.querySelector(".sp-txt");if(spt){const st=el.querySelector(".step");[":scope>.badges",":scope>.label",":scope>h2",...(s.type==="read"?[":scope>h2+p"]:[])].map(q=>st.querySelector(q)).filter(Boolean).forEach(n=>spt.appendChild(n));
    // nothing left under the picture (e.g. a scene-setting screen): let the picture fill the screen
    const fig=spt.closest(".scenepic");if(![...st.children].some(c=>c!==fig&&c.textContent.trim()))fig.classList.add("solo");}
  casePin(el);
  const inp=el.querySelector("#ansInput");
  if(inp&&!inp.disabled){inp.focus();inp.setSelectionRange(inp.value.length,inp.value.length);
    inp.addEventListener("input",()=>{P.val=inp.value;const b=el.querySelector("[data-act=check]");if(b)b.disabled=!canCheck(s)});}
  if(keepFocus){const t=el.querySelector(keepFocus);if(t)t.focus();}
  else if(!inp){const b=el.querySelector(".p-foot .btn:not([disabled])");if(P.status!=="idle"&&b)b.focus();}
}
function evaluate(s){
  if(s.type==="choice") return P.sel===s.answer;
  if(s.type==="multi") return P.multi.length===s.answer.length&&s.answer.every(i=>P.multi.includes(i));
  if(s.type==="sort") return s.cards.every((cd,ci)=>P.sort[ci]===cd.b);
  if(s.type==="match") return s.pairs.every((_,k)=>P.match[k]===k);
  if(s.type==="order") return P.ord.every((v,k)=>v===k);
  if(s.type==="racebench") return rbEval();
  if(s.type==="chartpick") return P.sel===s.age;
  if(s.type==="chain") return numEq(P.val,s.fields[P.ci].answer);
  if(s.type==="input"){const v=numKey(P.val);return v===String(s.answer)||numEq(P.val,s.answer);}
  return true;
}
function matchPlace(k,i){for(const x in P.match)if(P.match[x]===i)delete P.match[x];P.match[k]=i;P.matchSel=null;P.status="idle";drawPlayer();}
function check(){
  const s=P.steps[P.i];
  if(s.type==="chain"&&!assessMode()){const ok=evaluate(s);P.tries++;
    if(!ok){if(!P.chainMiss&&P.mode==="practice"&&P.l){S.conf[P.l.id+"#"+P.i]={c:null,ok:false,lesson:P.l.id,label:P.l.title+" · "+(s.label||"question")};save();}P.chainMiss=true;P.status="wrong";drawPlayer();return;}
    if(P.ci<s.fields.length-1){P.ci++;P.val="";P.status="idle";drawPlayer();return;}
    const first=!P.chainMiss;P.asked++;if(first)P.right++;P.firstTry=false;
    if(P.mode==="review"){if(first){S.fixed=S.fixed||{};S.fixed[s._key]=true;}save();}
    else if(first){S.conf[P.l.id+"#"+P.i]={c:null,ok:true,lesson:P.l.id,label:P.l.title+" · "+(s.label||"question")};save();}
    P.status="right";drawPlayer();return;}
  const ok=evaluate(s);
  P.tries++;
  if(P.firstTry){P.asked++;if(ok)P.right++; if(s.id) P.answers.push({id:s.id,mod:s.mod,lesson:s.lesson,ok,conf:P.conf});
    if(P.mode==="review"){if(ok){S.fixed=S.fixed||{};S.fixed[s._key]=true;}save();}
    else if(P.mode!=="diag"){S.conf[s.id&&P.mode!=="practice"?s.id:P.l.id+"#"+P.i]={c:P.conf,ok,lesson:s.lesson||P.l.id,label:s.id?s.id+" · "+MODS[s.mod]:P.l.title+" · "+(s.label||"question")};save();}}
  P.firstTry=false;
  if(P.mode==="diag"){P.status=ok?"right":"revealed";drawPlayer();return;}
  if(assessMode()){nextStep();return;}
  P.status=ok?"right":"wrong";drawPlayer();
}
function nextStep(){
  const s=P.steps[P.i];
  if(s&&s.type==="stage"&&s.stage!=="intro"){P.asked++;if(P.sx&&!P.sx.err)P.right++;}
  if(s&&s.type==="walk"){P.asked++;if(!P.walkMiss)P.right++;}
  if(s&&s.type==="sim"&&P.simManual&&!(S.sim&&S.sim.done)){S.sim={done:true,date:today(),score:null,manual:true};save();}
  if(s&&s.type==="video"&&P.watched){S.video=true;save();}
  if(s&&s.type==="lookup"){S.lookups[P.l.id+"-"+P.i]=true;save();}
  P.i++;if(typeof benchSave==="function")benchSave();resetStep();
  if(P.i>=P.steps.length) finishLesson();
  drawPlayer();
}
function tally(answers){
  const by={};for(const a of answers){(by[a.mod]=by[a.mod]||{r:0,n:0,miss:[]});by[a.mod].n++;if(a.ok)by[a.mod].r++;else by[a.mod].miss.push(a);}
  return by;
}
function finishLesson(){
  if(P.mode==="review"){P.status="complete";save();return;}
  const A=P.answers,r=A.filter(a=>a.ok).length;
  if(P.mode==="exit"){S.results[P.l.id]={r,n:A.length,crit:A.filter(a=>!a.ok&&CRITICAL.includes(a.id)).map(a=>a.id),miss:A.filter(a=>!a.ok).map(a=>a.lesson)};}
  if(P.mode==="diag"){S.results[P.l.id]={by:tally(A)};}
  if(P.l.thRun){P.thRes=thRunResult();const R=P.thRes;S.thermo={done:true,first:R.first,of:R.rows.length,errors:R.errors,hints:R.hints,date:today()};}
  if(P.l.rxRun){P.rxRes=rxRunResult(P.l.rxRun);const R=P.rxRes;S.rx=S.rx||{};S.rx[P.l.rxRun]={done:true,first:R.first,of:R.rows.length,errors:R.errors,hints:R.hints,label:R.label||"",date:today()};}
  if(P.l.txRun){P.runRes=txRunResult();const R=P.runRes;S.sim={done:true,score:R.score,comp:R.comp,mode:P.txMode,date:today()};clearInterval(P.tick);}
  if(P.mode==="final"){const by=tally(A),pct=Math.round(r/A.length*100);const crit=A.filter(a=>!a.ok&&CRITICAL.includes(a.id)).map(a=>a.id);
    S.results[P.l.id]={pct,r,n:A.length,by,crit,met:r===A.length,date:today()};} // pass mark: 100%
  S.done[P.l.id]=true; const t=today();
  if(!S.days.includes(t))S.days.push(t);S.days=S.days.slice(-60);
  if(courseDone(P.c)){const nx=COURSES.find(x=>reqMet(x)&&nextLesson(x));if(nx)S.current=nx.id;}
  save();P.status="complete";
}
// end of a lesson: go on to the next unfinished lesson in this module; once the module is complete, back to the modules
function nextInModule(){if(!P||!P.c||!P.l||courseDone(P.c))return null;const ls=allLessons(P.c),i=ls.findIndex(l=>l.id===P.l.id);return ls.slice(i+1).find(l=>!S.done[l.id])||ls.find(l=>!S.done[l.id])||null;}
function finishBtns(label="Done"){const n=nextInModule();return n?`<button class="btn ghost" data-act="finish">Back to modules</button><button class="btn" data-revisit="${n.id}">Next: ${n.title}</button>`:`<button class="btn" data-act="finish">${label}</button>`;}
function revisitButtons(lessonIds){
  const u=[...new Set(lessonIds)].filter(Boolean);
  return u.length?`<div class="revisit">${u.map(id=>{const L=lessonById(id);return L?`<button class="btn ghost sm" data-revisit="${id}">Revisit: ${L.l.title}</button>`:""}).join("")}</div>`:"";
}
// break suggestion: active time (page visible, input within 2 min) counted in this session; offered on a lesson's end screen after 30 min, then again 30 min later
const BRK={t:0,last:Date.now(),every:(()=>{try{return new URLSearchParams(location.search).get("break")==="1"?60:30*60}catch(e){return 30*60}})()}; // index.html?break=1: every minute, for testing
["pointerdown","keydown"].forEach(e=>addEventListener(e,()=>{BRK.last=Date.now()},{passive:true,capture:true}));
setInterval(()=>{if(document.visibilityState==="visible"&&Date.now()-BRK.last<120000)BRK.t+=15},15000);
function breakCard(){if(P.brk===undefined){P.brk=BRK.t>=BRK.every;if(P.brk)BRK.t=0}if(!P.brk)return "";
  return `<div class="brk"><span class="brk-ic">${I.clock}</span><div><b>Time for a short break</b><p>You have been learning for 30 minutes. A 5 to 10 minute break helps retention. Your progress is saved.</p>
   <button class="btn ghost sm" data-act="finish">Take a break</button></div></div>`}
function endScreen(){
  if(P.l&&P.l.txRun) return txRunEnd();
  if(P.l&&P.l.thRun) return thRunEnd();
  if(P.l&&P.l.rxRun) return rxRunEnd();
  const R=S.results[P.l.id];let inner="",cta="Continue",amber=false,next="";
  if(P.mode==="review"){const left=reviewCount();amber=P.right<P.asked;
    inner=`<h1 style="font-size:2rem">Review complete</h1><p class="note">Cleared ${P.right} of ${P.asked}. ${left?left+" still to review.":"Nothing left to review."}</p>`;
    next=`<button class="btn ${left?"ghost":""}" data-act="finish">Done</button>${left?`<button class="btn" data-act="review-more">Review ${Math.min(5,left)} more</button>`:""}`;}
  if(P.mode==="practice"){next=nextInModule()?finishBtns():"";
    const acc=P.asked?Math.round(P.right/P.asked*100):100;
    inner=`<h1 style="font-size:2rem">Lesson complete</h1><p class="note">${P.l.title}</p><div class="tiles"><div class="tile"><b style="color:var(--good)">${P.asked?acc+"%":"–"}</b><span>First-try accuracy</span></div><div class="tile"><b style="color:var(--accent)">${coursePct()}%</b><span>Course completed</span></div><div class="tile"><b>${fmtMins(minsLeft())}</b><span>Time left (approx.)</span></div></div>`;
  }
  if(P.mode==="exit"){
    const ok=R.r===R.n;amber=!ok;
    inner=`<h1 style="font-size:2rem">${P.l.title}</h1><p class="note">${assessMode()?"":"First-attempt score. "}${PASS} ${ok?"":"Revisit the lessons below before the final assessment."}</p>
     <div class="res"><div class="resrow"><b>${MODS[P.l.bank]}</b><small class="${ok?"ok":"no"}">${R.r}/${R.n} · ${ok?"All correct":"Review needed"}</small><div class="bar"><i style="width:${R.r/R.n*100}%;background:var(${ok?"--good":"--bad"})"></i></div>
     ${R.crit.length?`<p class="note" style="grid-column:1/-1;color:var(--bad)">Critical item missed: ${R.crit.join(", ")}</p>`:""}${revisitButtons(R.miss)}</div>${cwRow()}</div>`;
  }
  if(P.mode==="diag"){
    const by=R.by,tot=Object.values(by).reduce((a,d)=>({r:a.r+d.r,n:a.n+d.n}),{r:0,n:0});
    inner=`<h1 style="font-size:2rem">You got ${tot.r} of ${tot.n}</h1><p class="note">Ungraded. Areas marked for review are covered in the modules.</p>
     <div class="res">${Object.keys(MODS).map(m=>{const d=by[m]||{r:0,n:0};const focus=d.r<d.n;return `<div class="resrow"><b>${MODS[m]}</b><small class="${focus?"no":"ok"}">${d.r}/${d.n} · ${focus?"Review":"Familiar"}</small>${focus?`<p class="note" style="grid-column:1/-1;margin:0"><b>Missed:</b> ${d.miss.map(a=>(DQ.find(q=>q.id===a.id)||{}).short).join(" · ")}<br>Covered in ${courseById(m).category}: ${courseById(m).title}</p>`:""}</div>`}).join("")}</div>`;
    const nx=COURSES.find(x=>x.id!=="intro"&&reqMet(x)&&nextLesson(x));
    if(nx) next=`<button class="btn ghost" data-act="finish">Back to home</button><button class="btn" data-lesson="${nextLesson(nx).id}">Start ${nx.category}: ${nx.title}</button>`;
  }
  if(P.mode==="final"){
    amber=!R.met;
    inner=`<h1 style="font-size:2rem">${R.met?"Passed":"Not passed"}</h1><p class="note">Score ${R.pct}% (${R.r}/${R.n}). ${PASS}</p>
     <div class="res">${Object.keys(MODS).map(m=>{const d=R.by[m],ok=d.r===d.n;
       return `<div class="resrow"><b>${MODS[m]}</b><small class="${ok?"ok":"no"}">${d.r}/${d.n}</small><div class="bar"><i style="width:${d.r/d.n*100}%;background:var(${ok?"--good":"--bad"})"></i></div>${!ok?revisitButtons(d.miss.map(a=>a.lesson)):""}</div>`}).join("")}
     ${cwRow()}</div>
     <p class="note">${R.met?"Your certificate will be issued through eTaleem.":"Revisit the lessons above, then retake the assessment."}</p>`;
    if(!R.met&&reviewCount())next=`<button class="btn ghost" data-act="review-more">Review missed questions</button><button class="btn ghost" data-act="retake">Retake</button><button class="btn" data-act="finish">Done</button>`;
    if(!R.met) cta="Done";
  }
  if(P.mode==="practice")inner+=breakCard();
  // module finished: offer its "habits to unlearn" cards (old practice → v2.6) while the content is fresh
  if(P.c&&(P.mode==="practice"||P.mode==="exit")&&deckCards(P.c.id).length&&courseDone(P.c)){const n=deckCards(P.c.id).length,d=deckDue(P.c.id);
    inner+=`<button class="qbtn deckcta" data-deck="${P.c.id}">${I.cards}<span><b>Habits to unlearn · ${P.c.title}</b><small>${n} cards · about ${Math.max(1,Math.round(n*10/60))} min${d?` · ${d} to revisit`:""}</small></span></button>`;}
  return `<div></div><div class="p-body"><div class="done"><div class="burst ${amber?"amber":""}">${amber?I.warn:I.check}</div>${inner}</div></div>
   <div class="p-foot"><div class="foot-in"><div class="foot-btns">${next||`${(P.mode==="exit"||P.mode==="final")&&amber?`<button class="btn ghost" data-act="retake">Retake</button>`:""}<button class="btn" data-act="finish">${cta}</button>`}</div></div></div>`;
}

