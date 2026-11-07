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
const blank=()=>({done:{},xp:0,streak:0,last:null,days:[],current:"intro",results:{},video:false,lookups:{},conf:{},cards:{},sim:null,tourDone:false});
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
const iconBox=(c,size)=>`<div class="icon" style="background:var(${c.hue});${size?`width:${size}px;height:${size}px`:''}">${I[c.icon]}</div>`;
const GLOSS=[["AP","Ambulance Paramedic"],["CCP","Critical Care Paramedic"],["CPG","Clinical Practice Guideline"],["TXA","Tranexamic acid"],["TBI","Traumatic brain injury"],["GCS","Glasgow Coma Scale"],["PPH","Postpartum haemorrhage"],["SMR","Spinal motion restriction"],["MAP","Mean arterial pressure"],["PEEP","Positive end-expiratory pressure"],["BVM","Bag-valve-mask"],["ROSC","Return of spontaneous circulation"],["DSED","Dual sequential external defibrillation"],["SGA","Supraglottic airway"],["e-CPR","Extracorporeal cardiopulmonary resuscitation"],["HOTT","Hypovolaemia, oxygenation, tension pneumothorax, tamponade"],["BEFAST","Balance, Eyes, Face, Arm, Speech, Time"],["RACE","Rapid Arterial oCclusion Evaluation scale"],["RBS","Random blood sugar"],["HGH","Hamad General Hospital"],["ED","Emergency department"],["ETA","Estimated time of arrival"]];

/* ============================ VIEWS ============================ */
const NAV=[["home","Learn"],["courses","Modules"],["reference","Reference"],["profile","Progress"]];
let view="home", courseView=null, filter="All", confirmReset=false, refMod="trauma";

function renderNav(){
  const html=NAV.map(([k,t])=>{const active=(view===k)||(view==="course"&&k==="courses");return `<button class="tab" data-go="${k}" ${active?'aria-current="page"':''}>${I[k]}<span>${t}</span></button>`}).join("");
  document.getElementById("sideTabs").innerHTML=html;
  document.getElementById("bottomTabs").innerHTML=html;
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
function pathHTML(c){
  const offs=[0,48,72,48,0,-48,-72,-48];let n=0;const nxt=reqMet(c)?nextLesson(c):null;
  return `<div class="path">`+c.units.map((u,ui)=>`<div class="unit"><span class="label">${c.units.length>1?"Part "+(ui+1)+" · ":""}${u.title}</span></div>`+u.lessons.map(l=>{
    const done=S.done[l.id],open=isUnlocked(c,l),isNext=nxt&&nxt.id===l.id;const off=offs[n++%offs.length];
    const cls=done?"done":open?(isNext?"next":""):"locked";
    return `<button class="node ${cls}" style="--hue:var(${c.hue});transform:translateX(${off}px)" data-lesson="${l.id}" ${open?"":'aria-disabled="true"'}>
      <span class="disc">${nodeIcon(l,done,open,isNext)}</span><span class="t">${l.title}</span><span class="s">${nodeSub(l,done,open)}</span></button>`}).join("")).join("")+`</div>`;
}
function lockText(c){const m=(c.requires||[]).filter(id=>!courseDone(courseById(id))).map(id=>courseById(id).title);return m.length?"Complete "+(m.length>2?"all four modules":m.join(" and "))+" first":"";}
function homeView(){
  const c=activeCourse(),nl=nextLesson(c),h=new Date().getHours();
  const greet=h<12?"Good morning":h<18?"Good afternoon":"Good evening";
  const others=COURSES.filter(x=>x.id!==c.id);
  return topbar()+`<div class="org"><img src="brand/hmcas-wordmark.webp" alt="Hamad Medical Corporation Ambulance Service"><span>Clinical Education · CPG v2.6</span></div><div class="hello"><h1>${greet}</h1><p>HMCAS CPG v2.6 update training for Ambulance Paramedics and Critical Care Paramedics. Four modules, about 3 hours in total.</p></div>
  <div class="resume">${iconBox(c)}<div><div class="label">${c.category} · ${c.title}</div>
    <h2>${nl?nl.title:"All modules complete"}</h2><p>${doneCount(c)} of ${allLessons(c).length} lessons done</p>
    ${nl?`<button class="btn" data-lesson="${nl.id}">${I.play.replace('<svg','<svg width="18" height="18"')} ${doneCount(c)?"Continue":"Start"}</button>`:`<button class="btn ghost" data-go="profile">See your results</button>`}</div></div>
  <div class="quick"><button class="qbtn" data-ref="${CHANGES[c.id]?c.id:"trauma"}">${I.book}<span><b>Quick reference</b><small>Every v2.6 change, one screen per module</small></span></button><button class="qbtn" data-deck="${CHANGES[c.id]?c.id:"trauma"}">${I.cards}<span><b>Flip cards</b><small>Habits to unlearn · ${CHANGES[c.id]?c.title:"Trauma"}</small></span></button></div>
  <div class="section"><div class="section-head"><h2>${c.title}</h2><button class="link" data-course-open="${c.id}">Module overview</button></div>${pathHTML(c)}</div>
  <div class="section"><div class="section-head"><h2>All modules</h2><button class="link" data-go="courses">View all</button></div><div class="grid">${others.map(courseCard).join("")}</div></div>`;
}
function courseCard(c){
  const d=doneCount(c),t=allLessons(c).length,locked=!reqMet(c);
  return `<button class="course ${locked?"locked":""}" data-course-open="${c.id}">${iconBox(c)}<div><div class="label">${c.category} · ${c.minutes} min</div><h3 style="margin-top:4px">${c.title}</h3><p style="margin-top:6px">${c.desc}</p></div>
  ${locked?`<div class="lockline">${I.lock}${lockText(c)}</div>`:`<div><div class="meta"><span>${d===t?"Completed":d?"In progress":"Not started"}</span><span>${d}/${t}</span></div><div class="bar" style="margin-top:6px"><i style="width:${t?d/t*100:0}%"></i></div></div>`}</button>`;
}
function coursesView(){
  const cats=["All","Not started","In progress","Completed"];
  const st=c=>{const d=doneCount(c),t=allLessons(c).length;return d===0?"Not started":d===t?"Completed":"In progress"};
  const list=COURSES.filter(c=>filter==="All"||st(c)===filter);
  return topbar()+`<div class="hello"><h1>Modules</h1><p>Start with orientation, then take the four modules in any order. The final assessment unlocks when all four are complete.</p></div>
  <div class="section"><div class="chips" role="group" aria-label="Filter by status">${cats.map(k=>`<button class="chip" data-filter="${k}" aria-pressed="${filter===k}">${k}</button>`).join("")}</div>
  <div class="grid">${list.map(courseCard).join("")||`<p class="note">Nothing here yet.</p>`}</div></div>`;
}
function courseDetail(){
  const c=courseById(courseView),d=doneCount(c),t=allLessons(c).length,nl=nextLesson(c),locked=!reqMet(c);
  return topbar()+`<button class="back" data-go="courses">${I.left} Modules</button>
  <div class="hero">${iconBox(c,72)}<div style="display:grid;gap:8px"><span class="label">${c.category} · about ${c.minutes} min</span><h1>${c.title}</h1><p>${c.desc}</p>${c.coverage?`<p class="coverage"><b>Covers:</b> ${c.coverage}</p>`:""}</div>
  <div class="stats"><span><b>${t}</b> lessons</span><span><b>${Math.round(d/t*100)}%</b> complete</span>${S.results[c.id[0]+"-x"]?"":""}</div>
  <div class="bar"><i style="width:${d/t*100}%"></i></div>
  <div class="danger">${locked?`<div class="lockline">${I.lock}${lockText(c)}</div>`:nl?`<button class="btn" data-lesson="${nl.id}">${d?"Continue":"Start"}</button>`:""}${CHANGES[c.id]?`<button class="btn ghost" data-deck="${c.id}">${I.cards.replace('<svg','<svg width="18" height="18"')} Flip cards</button><button class="btn ghost" data-ref="${c.id}">${I.book.replace('<svg','<svg width="18" height="18"')} Quick reference</button>`:""}</div></div>
  ${pathHTML(c)}`;
}
function profileView(){
  const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],now=new Date(),dow=(now.getDay()+6)%7;
  const week=days.map((n,i)=>{const d=new Date(now);d.setDate(now.getDate()-dow+i);const k=ymd(d);const on=S.days.includes(k);
    return `<div class="day ${on?"on":""} ${i===dow?"today":""}"><i>${on?I.check:""}</i>${n}</div>`}).join("");
  const f=S.results["fa-1"];
  const checks=["tr-x","nb-x","ca-x","st-x"].map(id=>{const r=S.results[id],L=lessonById(id);
    return `<div class="row">${iconBox(L.c)}<div style="min-width:0"><b>${L.l.title}</b><div class="note">${r?(r.r===r.n?"All correct":(r.n-r.r)+" to review before the final"):"Not taken yet"}</div></div><small>${r?r.r+"/"+r.n:"–"}</small></div>`}).join("");
  return topbar()+`<div class="hello"><h1>Your progress</h1><p>Saved in this browser only. This is not an official training record.</p></div>
  <div class="section"><div class="tiles"><div class="tile"><b style="color:var(--good)">${coursePct()}%</b><span>Course completed</span></div><div class="tile"><b style="color:var(--accent)">${fmtMins(minsLeft())}</b><span>Time left (approx.)</span></div><div class="tile"><b>${lessonsDone()}/${lessonsAll().length}</b><span>Lessons done</span></div></div></div>
  <div class="section"><h2 style="font-size:1.2rem">Assessments</h2><div class="rows">${checks}
    <div class="row">${iconBox(courseById("final"))}<div style="min-width:0"><b>Final assessment</b><div class="note">${f?(f.met?"Passed":"Not passed yet · 100% needed to pass"):"Unlocks after all four modules · 100% needed to pass"}</div></div><small>${f?f.pct+"%":"–"}</small></div>
    <div class="row">${iconBox(courseById("stroke"))}<div style="min-width:0"><b>Required RACE video</b><div class="note">${S.video?"Marked as watched":"Not yet watched"}</div></div><small>${S.video?"Done":"–"}</small></div>
    <div class="row"><div class="icon" style="background:var(--c-trauma)">${I.syringe}</div><div style="min-width:0"><b>TXA hands-on: solo run</b><div class="note">${S.sim&&S.sim.done?(S.sim.mode==="pressure"?"Pressure run":"Independent run")+" · "+(S.sim.comp?"Competent":"Needs review"):"Not completed yet"}</div></div><small>${S.sim&&S.sim.done?(S.sim.score!=null?S.sim.score+"%":"Done"):"–"}</small></div>
    <div class="row"><div class="icon" style="background:var(--c-newborn)">${I.newborn}</div><div style="min-width:0"><b>Thermal care: solo round</b><div class="note">${S.thermo&&S.thermo.done?S.thermo.errors+" incorrect · "+S.thermo.hints+" hints":"Not completed yet"}</div></div><small>${S.thermo&&S.thermo.done?S.thermo.first+"/"+S.thermo.of:"–"}</small></div>
    ${[["nbr","Newborn resuscitation: solo run","--c-newborn","newborn"],["code","Code clock: solo run","--c-cardiac","cardiac"]].map(([k,t,col,ic])=>{const r=S.rx&&S.rx[k];return `<div class="row"><div class="icon" style="background:var(${col})">${I[ic]||""}</div><div style="min-width:0"><b>${t}</b><div class="note">${r?r.errors+" errors · "+r.hints+" hints"+(r.label?" · "+r.label:""):"Not completed yet"}</div></div><small>${r?r.first+"/"+r.of:"–"}</small></div>`;}).join("")}
    <div class="row"><div class="icon" style="background:var(--accent)">${I.cards}</div><div style="min-width:0"><b>Flip cards marked "Got it"</b><div class="note">Across all four modules</div></div><small>${Object.values(S.cards).filter(Boolean).length}/${Object.values(CHANGES).flat().length}</small></div>
  </div></div>
${confSection()}
  <div class="section"><h2 style="font-size:1.2rem">This week</h2><div class="week">${week}</div></div>
  <div class="section"><h2 style="font-size:1.2rem">Modules</h2><div class="rows">${COURSES.map(c=>{const d=doneCount(c),t=allLessons(c).length;
    return `<div class="row">${iconBox(c)}<div style="min-width:0"><b>${c.title}</b><div class="bar"><i style="width:${d/t*100}%"></i></div></div><small>${d}/${t}</small></div>`}).join("")}</div></div>
  <div class="section"><details class="gloss"><summary>Abbreviations</summary><dl class="terms">${GLOSS.map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join("")}</dl></details></div>
  <div class="section"><h2 style="font-size:1.2rem">Settings</h2><div class="danger">
    ${confirmReset?`<span class="note">Erase all progress in this browser?</span><button class="btn bad" data-act="reset-yes">Yes, reset</button><button class="btn ghost" data-act="reset-no">Cancel</button>`
      :`<button class="btn ghost" data-act="reset">Reset progress</button><button class="btn ghost" data-act="theme">Switch theme</button>`}</div></div>`;
}
const docLinks=()=>`<div class="quick docs">${DOCS.map(d=>`<a class="qbtn" href="${d.href}" target="_blank" rel="noopener">${I.book}<span><b>${d.t}</b><small>${d.d}</small></span></a>`).join("")}</div>`;
function referenceView(){
  const R=REF[refMod],c=courseById(refMod);
  const sc=x=>x==="AP"?`<span class="badge ap">AP &amp; CCP</span>`:x==="CCP"?`<span class="badge ccp">CCP only</span>`:`<span class="badge pend">Scope to verify</span>`;
  return topbar()+`<div class="hello"><h1>Quick reference</h1><p>The v2.6 changes on one screen per module. Open it any time, including on shift.</p>${docLinks()}</div>
  <div class="section"><div class="chips" role="group" aria-label="Choose module">${Object.keys(MODS).map(k=>`<button class="chip" data-refmod="${k}" aria-pressed="${refMod===k}">${MODS[k]}</button>`).join("")}</div>
  <div class="section-head" style="margin-top:6px"><h2>${c.title}</h2><span class="label">${c.category}</span></div>
  ${R.visual?`<div class="visual">${V[R.visual]}</div>`:""}
  <div class="refrows">${R.items.map(it=>`<div class="refrow"><p>${it.t}</p><div class="badges">${sc(it.scope)}${it.pend?`<span class="badge pend">Details pending</span>`:""}</div><div class="src">Source: ${it.src}</div></div>`).join("")}</div>
  <div class="danger"><button class="btn" data-deck="${refMod}">${I.cards.replace('<svg','<svg width="18" height="18"')} Flip cards (${CHANGES[refMod].length})</button><button class="btn ghost" data-course-open="${refMod}">Open module</button></div></div>`;
}
function confSection(){
  const E=Object.values(S.conf).filter(e=>e.c);
  if(!E.length) return `<div class="section"><h2 style="font-size:1.2rem">Confidence check</h2><p class="note">Rate how sure you are when you answer. Your results will show here, including any answers you were certain of but got wrong.</p></div>`;
  const sureOk=E.filter(e=>e.c==="sure"&&e.ok).length, sureNo=E.filter(e=>e.c==="sure"&&!e.ok), guess=E.filter(e=>e.c==="guess").length;
  return `<div class="section"><h2 style="font-size:1.2rem">Confidence check</h2>
   <div class="confgrid"><div class="tile"><b style="color:var(--good)">${sureOk}</b><span>Certain and right</span></div><div class="tile"><b style="color:var(--bad)">${sureNo.length}</b><span>Certain but wrong</span></div><div class="tile"><b style="color:var(--sun)">${guess}</b><span>Guessed</span></div></div>
   ${sureNo.length?`<div class="rows">${sureNo.map(e=>`<div class="row"><div class="icon" style="background:var(--bad)">${I.warn}</div><div style="min-width:0"><b>${e.label}</b><div class="note">You were certain, but this was wrong</div></div><button class="btn ghost sm" data-revisit="${e.lesson}">Revisit</button></div>`).join("")}</div>`:`<p class="note">No confident errors so far.</p>`}</div>`;
}
const gateHTML=()=>`<div class="gate-card"><div class="visual">${V.org}</div>
  <h1 id="gateT">CPG v2.6 Update</h1><p>Ambulance Paramedics and Critical Care Paramedics</p>
  <span class="label">Orientation · 5 min</span><ol class="gate-steps"><li><b>1</b>Welcome</li><li><b>2</b>App tour</li><li><b>3</b>Warm-up</li></ol>
  <button class="btn wide" data-lesson="in-1">${I.play.replace('<svg','<svg width="18" height="18"')} Begin orientation</button>
  <p class="note">4 modules and a final assessment · approx. 3 hours · progress is saved automatically</p></div>`;
function render(){
  renderNav();
  document.getElementById("main").innerHTML=view==="reference"?referenceView():view==="courses"?coursesView():view==="profile"?profileView():view==="course"?courseDetail():homeView();
  // first-launch gate: until Welcome is done, the only way in is Start Here (the player sits above it)
  let g=document.getElementById("gate");const need=!S.done["in-1"];
  if(need&&!g){g=document.createElement("div");g.id="gate";g.className="gate";g.setAttribute("role","dialog");g.setAttribute("aria-modal","true");g.setAttribute("aria-labelledby","gateT");document.body.appendChild(g);}
  if(need){g.innerHTML=gateHTML();if(!P)g.querySelector(".btn").focus();}else if(g)g.remove();
}
function go(v,cid){view=v;courseView=cid||null;confirmReset=false;
  const h=v==="course"?"module-"+cid:v; if(location.hash!=="#"+h){try{history.replaceState(null,"","#"+h)}catch(e){}} render(); window.scrollTo(0,0);}
function fromHash(){const h=location.hash.slice(1);
  if(h.startsWith("module-")&&COURSES.some(c=>c.id===h.slice(7))){view="course";courseView=h.slice(7)}
  else if(["home","courses","reference","profile"].includes(h)) view=h; else view="home"; render();}

/* ============================ PLAYER ============================ */
let P=null;
function openLesson(lid,opts={}){
  const f=lessonById(lid);if(!f||!isUnlocked(f.c,f.l))return;
  S.current=f.c.id;save();
  P={c:f.c,l:f.l,mode:f.l.mode||"practice",steps:stepsFor(f.l),i:0,answers:[],watched:S.video,right:0,asked:0};
  if(f.l.scene){P.txMode=opts.txMode||(f.l.txRun||f.l.thRun||f.l.rxRun?"independent":"guided");P.thTemp=["th-4","th-5"].includes(f.l.id)?36.0:null;P.thHints={};P.thHintKeys={};P.t0=Date.now();P.txEvents=[];P.runCase=txCase();P.lab=null;txStartRunTimer();}
  resetStep();
  document.getElementById("player").hidden=false;document.body.style.overflow="hidden";drawPlayer();
}
function resetStep(){P.watchDone=false;P.sx=null;P.chartOpen=false;P.sel=null;P.val="";P.multi=[];P.sort={};P.ord=[];P.ordMix=null;P.status="idle";P.firstTry=true;P.conf=null;P.tries=0;P.cur=null;P.trail=[];P.why=null;P.whyIdx=null;P.walkMiss=false;}
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
function openDeck(mod){P={mode:"deck",mod,cards:CHANGES[mod].map((c,i)=>({...c,key:mod+i})),ci:0,flipped:false,known:0,again:[]};document.getElementById("player").hidden=false;document.body.style.overflow="hidden";drawPlayer();}
function closeLesson(){if(P){clearInterval(P.tick);clearInterval(P.infT);}txHush();const pl=document.getElementById("player");pl.classList.remove("scene");document.getElementById("player").hidden=true;document.body.style.overflow="";P=null;render();}
const assessMode=()=>P.mode==="diag"||P.mode==="final"||(P.mode==="exit"&&!hasFinalQs(P.l.bank)); // no per-question feedback; a module check gets feedback only once the final no longer reuses its questions

function badges(s){
  const b=[];
  if(s.pop) b.push(`<span class="badge pop">${s.pop}</span>`);
  if(s.scope==="AP") b.push(`<span class="badge ap">AP &amp; CCP</span>`);
  if(s.scope==="CCP") b.push(`<span class="badge ccp">CCP only</span>`);
  if(s.scope==="verify") b.push(`<span class="badge pend">Scope to verify</span>`);
  if(s.type==="blocked") b.push(`<span class="badge pend">Pending approved source</span>`);
  if(s.id&&CRITICAL.includes(s.id)&&P.mode!=="final") b.push(`<span class="badge crit">Critical item</span>`);
  return b.length?`<div class="badges">${b.join("")}</div>`:"";
}
const pendingBox=list=>list&&list.length?`<div class="pending"><b>Pending verification</b><ul>${list.map(x=>`<li>${x}</li>`).join("")}</ul></div>`:"";
const srcLine=s=>s.src&&!assessMode()?`<div class="src">Source: ${s.src}</div>`:"";
const locked=()=>P.status==="right"||P.status==="revealed";

function stepBody(s){
  const lab=s.label?`<span class="label">${s.label}</span>`:"";
  if(s.type==="read") return `${badges(s)}${s.top&&s.visual?`<div class="visual">${V[s.visual]}</div>`:""}<h2>${s.title}</h2>${s.body?`<p>${s.body}</p>`:""}${s.ptitle?`<span class="label">${s.ptitle}</span>`:""}${s.points?`<ul>${s.points.map(p=>`<li>${p}</li>`).join("")}</ul>`:""}${s.visual&&!s.top?`<div class="visual">${V[s.visual]}</div>`:""}${s.docs?docLinks():""}${s.foot?`<p class="note">${s.foot}</p>`:""}${pendingBox(s.pending)}${srcLine(s)}`;
  if(s.type==="choice") return `${badges(s)}${s.intro?`<div class="info">${s.intro}</div>`:""}${lab}<h2>${s.prompt}</h2>${s.visual?`<div class="visual">${V[s.visual]}</div>`:""}<div class="opts" role="radiogroup" aria-label="Answer options">${s.options.map((o,i)=>{
      let cls="";if(locked()&&i===s.answer)cls="right";else if((P.status==="wrong"||P.status==="revealed")&&i===P.sel)cls="wrong";
      return `<button class="opt ${cls}" role="radio" aria-checked="${P.sel===i}" data-opt="${i}" ${locked()?"disabled":""}><span class="k">${String.fromCharCode(65+i)}</span>${o}</button>`}).join("")}</div>${srcLine(s)}`;
  if(s.type==="multi") return `${badges(s)}${lab}<h2>${s.prompt}</h2><p class="note">Select all that apply.</p><div class="opts">${s.options.map((o,i)=>{
      const on=P.multi.includes(i),inKey=s.answer.includes(i);let cls="";
      if(locked()) cls=inKey?"right":""; else if(P.status==="wrong"&&on!==inKey) cls="wrong";
      return `<button class="opt ${cls}" role="checkbox" aria-checked="${locked()?inKey:on}" data-multi="${i}" ${locked()?"disabled":""}><span class="k">${(locked()?inKey:on)?I.check:""}</span>${o}</button>`}).join("")}</div>${srcLine(s)}`;
  if(s.type==="order"){const L=locked(),mix=P.ordMix||(P.ordMix=shuffle(s.items.map((_,i)=>i))),seq=L?s.items.map((_,i)=>i):P.ord; // items are stored in the correct order
    return `${badges(s)}${lab}<h2>${s.prompt}</h2><p class="note">Select in order.</p><ol class="ord">${seq.map((i,k)=>`<li><button class="opt ${L?"right":P.status==="wrong"?(i===k?"right":"wrong"):""}" data-unord="${k}" ${L?"disabled":""}><span class="k">${k+1}</span>${s.items[i]}</button></li>`).join("")}</ol>
     ${L?"":`<div class="opts">${mix.filter(i=>!P.ord.includes(i)).map(i=>`<button class="opt" data-ord="${i}"><span class="k"></span>${s.items[i]}</button>`).join("")}</div>`}${srcLine(s)}`;}
  if(s.type==="sort") return `${badges(s)}${lab}<h2>${s.prompt}</h2><div class="sort">${s.cards.map((cd,ci)=>{
      const pick=locked()?cd.b:P.sort[ci];let cls="";if(locked())cls="right";else if(P.status==="wrong")cls=P.sort[ci]===cd.b?"right":"wrong";
      return `<div class="srow ${cls}"><div class="ct">${cd.t}</div><div class="bins" role="group" aria-label="${cd.t}">${s.bins.map((bn,bi)=>`<button class="bin" data-card="${ci}" data-bin="${bi}" aria-pressed="${pick===bi}" ${locked()?"disabled":""}>${bn}</button>`).join("")}</div></div>`}).join("")}</div>${srcLine(s)}`;
  if(s.type==="input") return `${badges(s)}${lab}<h2>${s.prompt}</h2>${s.visual?`<div class="visual">${V[s.visual]}</div>`:""}<div class="ans"><input id="ansInput" inputmode="decimal" autocomplete="off" aria-label="Your answer" value="${locked()?s.answer:P.val}" ${locked()?"disabled":""}>${s.unit?`<span>${s.unit}</span>`:""}</div>${srcLine(s)}`;
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
  if(s.type==="walk"){const cur=P.cur||s.start,n=s.nodes[cur];
    return `${badges(s)}<span class="label">${s.label}</span><h2>${s.title}</h2><div class="case"><span class="label">Case</span><p>${s.case}</p></div>
    ${P.trail.length?`<div class="trail">${P.trail.map(t=>`<div class="crumb">${I.check}<span>${t.q}</span><b>${t.a}</b></div>`).join("")}</div>`:""}
    ${n.end?`<div class="wend ${n.tone}" role="status"><span class="label">Outcome</span><b>${n.end}</b></div>`
      :`<div class="wq"><h3>${n.q}</h3><div class="wopts">${n.opts.map((o,i)=>`<button class="opt ${P.whyIdx===i?"wrong":""}" data-walk="${i}">${o.t}</button>`).join("")}</div>${P.why?`<div class="why" role="status"><b>Incorrect.</b> ${P.why}</div>`:""}</div>`}${srcLine(s)}`;}
  return "";
}
function walkPick(i){
  const s=P.steps[P.i],n=s.nodes[P.cur||s.start],o=n.opts[i];
  if(o.why){P.why=o.why;P.whyIdx=i;P.walkMiss=true;drawPlayer(`[data-walk="${i}"]`);return;}
  P.trail.push({q:n.q,a:o.t});P.cur=o.to;P.why=null;P.whyIdx=null;
  drawPlayer(s.nodes[o.to].end?".p-foot .btn":'[data-walk="0"]');
}
const QTYPES=["choice","multi","sort","input","order"];
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
    return `<div></div><div class="p-body"><div class="done"><div class="burst">${I.cards}</div><h1 style="font-size:2rem">Deck complete</h1><p class="note">${MODS[P.mod]} · what changed in v2.6</p>
     <div class="tiles" style="grid-template-columns:1fr 1fr"><div class="tile"><b style="color:var(--good)">${P.known}</b><span>Got it</span></div><div class="tile"><b style="color:var(--sun)">${P.again.length}</b><span>Still learning</span></div></div></div></div>
     <div class="p-foot"><div class="foot-in"><div class="foot-btns">${P.again.length?`<button class="btn ghost" data-act="deck-again">Review ${P.again.length} again</button>`:""}<button class="btn" data-act="finish">Done</button></div></div></div>`;
  }
  const c=P.cards[P.ci];
  return `<div class="p-top"><button class="x" data-act="close" aria-label="Close flip cards">${I.x}</button><div class="bar" role="progressbar" aria-label="Deck progress" aria-valuenow="${Math.round(P.ci/n*100)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${P.ci/n*100}%"></i></div><span class="count">${P.ci+1}/${n}</span></div>
   <div class="p-body"><div class="deck"><span class="label">${MODS[P.mod]} · what changed</span>
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
  if(s.type==="order") return P.ord.length===s.items.length;
  if(s.type==="input") return P.val.trim()!=="";
  return true;
}
function footHTML(s){
  if(["read","lookup","blocked"].includes(s.type)) return `<button class="btn wide" data-act="next">${s.type==="lookup"?"I've located it":"Continue"}</button>`;
  if(s.type==="video") return `<button class="btn wide" data-act="next" ${P.watched?"":"disabled"}>Continue</button>`;
  if(s.type==="watch") return `<button class="btn wide" data-act="next" ${!s.src||P.watchDone?"":"disabled"}>Continue</button>`;
  if(s.type==="sim"){const ok=(S.sim&&S.sim.done)||P.simManual;return `<button class="btn wide" data-act="next" ${ok?"":"disabled"}>${ok?"Continue":"Finish independent mode to continue"}</button>`;}
  if(s.type==="walk") return s.nodes[P.cur||s.start].end?`<button class="btn wide" data-act="next">Continue</button>`:`<button class="btn wide" disabled>Work through the algorithm to continue</button>`;
  if(P.status==="idle"&&P.mode==="diag") return "";
  if(P.status==="idle"){const conf=P.mode!=="diag"&&QTYPES.includes(s.type)?`<div class="conf" role="group" aria-label="How sure are you?"><span class="label">How sure are you?${needConf()?"":" · optional"}</span>${CONF.map(([k,t])=>`<button class="cbtn" data-conf="${k}" aria-pressed="${P.conf===k}">${t}</button>`).join("")}</div>`:"";
    return `${conf}<button class="btn wide" data-act="check" ${canCheck(s)?"":"disabled"}>${assessMode()?"Submit answer":"Check"}</button>`;}
  const fbText=s.fb&&P.sel!==null&&s.fb[P.sel]?s.fb[P.sel]:s.type==="order"?"Items in red are in the wrong position.":"Have another look and try again.";
  if(P.status==="right") return `<div class="fb"><h3>${I.check.replace('<svg','<svg width="22" height="22"')} Correct</h3>${vsHTML(s)}<p>${s.explain||""}</p>${confNote(true)}${s.src?`<p class="src">Source: ${s.src}</p>`:""}</div><button class="btn good wide" data-act="next">Continue</button>`;
  if(P.status==="wrong") return `<div class="fb"><h3>Incorrect</h3><p>${fbText}</p>${confNote(false)}</div><div class="foot-btns">${P.tries>=2?`<button class="btn ghost" data-act="reveal">Show answer</button>`:""}<button class="btn bad" data-act="retry">Try again</button></div>`;
  if(P.status==="revealed") return `<div class="fb">${P.mode==="diag"?"<h3>Incorrect</h3>":`<h3 style="color:var(--ink)">Answer</h3>`}${vsHTML(s)}<p>${s.explain||""}</p>${s.src?`<p class="src">Source: ${s.src}</p>`:""}</div><button class="btn wide" data-act="next">Continue</button>`;
}
function drawPlayer(keepFocus){
  const el=document.getElementById("player");
  if(P.mode==="deck"){el.innerHTML=deckHTML();const f=el.querySelector(keepFocus||".p-foot .btn");if(f)f.focus();return;}
  if(P.status!=="complete"&&P.steps&&P.steps[P.i]&&P.steps[P.i].type==="tour"){finishLesson();closeLesson();go("home");tourStart();return;}
  el.classList.toggle("scene",!!(P.l&&P.l.scene));
  if(P.status!=="complete"&&P.steps&&P.steps[P.i]&&P.steps[P.i].type==="stage"){
    const s=P.steps[P.i],body=txBody(s),st=P.sx,fc=st.fb?(st.fb.ok?"right":"wrong"):"";
    el.innerHTML=`<div class="scene-head">${txTopHTML(s)}</div><div class="p-body"><div class="step scene-step" ${keepFocus?'style="animation:none"':""}>${body}</div></div><div class="p-foot ${fc}"><div class="foot-in">${txFoot(s)}</div></div>${txOverlays(s)}`;
    txAfter(s);
    const ft=keepFocus&&el.querySelector(keepFocus);if(ft)ft.focus();else if(st.fb){const b=el.querySelector(".p-foot .btn");if(b)b.focus();}
    return;
  }
  if(P.status==="complete"){el.innerHTML=endScreen();const b=el.querySelector(".p-foot .btn");if(b)b.focus();return;}
  const s=P.steps[P.i],pct=(P.i/P.steps.length)*100;
  const fcls=P.status==="right"?"right":P.status==="wrong"||(P.mode==="diag"&&P.status==="revealed")?"wrong":"";
  el.innerHTML=`<div class="p-top"><button class="x" data-act="close" aria-label="Close lesson">${I.x}</button><div class="bar" role="progressbar" aria-label="Lesson progress" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div><span class="count">${P.i+1}/${P.steps.length}</span></div>
    <div class="p-body"><div class="step" ${keepFocus?'style="animation:none"':""}>${stepBody(s)}</div></div>
    <div class="p-foot ${fcls}"><div class="foot-in">${footHTML(s)}</div></div>`;
  const wv=el.querySelector("#watchvid");if(wv)wv.addEventListener("ended",()=>{P.watchDone=true;S.videos=S.videos||{};S.videos[P.l.id]=true;save();const b=el.querySelector(".p-foot .btn");if(b)b.disabled=false;const n=el.querySelector("#watchnote");if(n)n.textContent="Video watched.";});
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
  if(s.type==="order") return P.ord.every((v,k)=>v===k);
  if(s.type==="input"){const v=P.val.trim().replace(/,/g,"").replace(/\s*[a-zµ]+$/i,"");return v===String(s.answer)||(v!==""&&!isNaN(+v)&&Math.abs(+v-(+s.answer))<1e-9);}
  return true;
}
function check(){
  const s=P.steps[P.i],ok=evaluate(s);
  P.tries++;
  if(P.firstTry){P.asked++;if(ok)P.right++; if(s.id) P.answers.push({id:s.id,mod:s.mod,lesson:s.lesson,ok,conf:P.conf});
    if(P.mode!=="diag"){S.conf[s.id&&P.mode!=="practice"?s.id:P.l.id+"#"+P.i]={c:P.conf,ok,lesson:s.lesson||P.l.id,label:s.id?s.id+" · "+MODS[s.mod]:P.l.title+" · "+(s.label||"question")};save();}}
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
  P.i++;resetStep();
  if(P.i>=P.steps.length) finishLesson();
  drawPlayer();
}
function tally(answers){
  const by={};for(const a of answers){(by[a.mod]=by[a.mod]||{r:0,n:0,miss:[]});by[a.mod].n++;if(a.ok)by[a.mod].r++;else by[a.mod].miss.push(a);}
  return by;
}
function finishLesson(){
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
function revisitButtons(lessonIds){
  const u=[...new Set(lessonIds)].filter(Boolean);
  return u.length?`<div class="revisit">${u.map(id=>{const L=lessonById(id);return L?`<button class="btn ghost sm" data-revisit="${id}">Revisit: ${L.l.title}</button>`:""}).join("")}</div>`:"";
}
function endScreen(){
  if(P.l&&P.l.txRun) return txRunEnd();
  if(P.l&&P.l.thRun) return thRunEnd();
  if(P.l&&P.l.rxRun) return rxRunEnd();
  const R=S.results[P.l.id];let inner="",cta="Continue",amber=false,next="";
  if(P.mode==="practice"){
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
    if(!R.met) cta="Done";
  }
  return `<div></div><div class="p-body"><div class="done"><div class="burst ${amber?"amber":""}">${amber?I.warn:I.check}</div>${inner}</div></div>
   <div class="p-foot"><div class="foot-in"><div class="foot-btns">${next||`${(P.mode==="exit"||P.mode==="final")&&amber?`<button class="btn ghost" data-act="retake">Retake</button>`:""}<button class="btn" data-act="finish">${cta}</button>`}</div></div></div>`;
}

