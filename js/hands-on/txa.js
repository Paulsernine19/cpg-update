/* ============================ TXA HANDS-ON (native, immersive) ============================
   Content and logic come from the HMCAS paediatric TXA preparation activity; the order follows
   the HMCAS Paediatric IV TXA poster (draw out 10 mL → add 1 g → label → mix → draw → give). */
const TXM=n=>"tx/"+n;
const TX_CHART=[{age:1,weight:10,dose:150,volume:15},{age:2,weight:12,dose:180,volume:18},{age:3,weight:14,dose:210,volume:21},{age:4,weight:16,dose:240,volume:24},{age:5,weight:18,dose:270,volume:27},{age:6,weight:25,dose:370,volume:37},{age:7,weight:28,dose:420,volume:42},{age:8,weight:31,dose:460,volume:46,drawOut:44},{age:9,weight:34,dose:500,volume:50,drawOut:40},{age:10,weight:37,dose:550,volume:55,drawOut:35},{age:11,weight:40,dose:600,volume:60,drawOut:30},{age:12,weight:43,dose:640,volume:64,drawOut:26},{age:13,weight:46,dose:700,volume:70,drawOut:20},{age:14,weight:49,dose:730,volume:73,drawOut:17}];
const TX_NAMES=["Liam","Noor","Omar","Sara","Yousef","Mia","Adam","Layla","Zayd","Hana"];
const TX_GIVE=[{mechanism:"Pedestrian struck by car at 40 km/h",findings:"Pale, mottled, tender distended abdomen, cap refill 4 s",gcs:14},{mechanism:"Fall from 2nd-floor balcony",findings:"Open femur fracture, active bleeding, cool peripheries",gcs:13},{mechanism:"Unrestrained rear passenger in high-speed RTC",findings:"Isolated head injury, unequal pupils, scalp haematoma",gcs:9},{mechanism:"Deep laceration to thigh from glass door",findings:"Pulsatile bleeding controlled by tourniquet, tachycardic, pale",gcs:15}];
const TX_WITHHOLD=[{mechanism:"Fall from scooter 5 hours ago, parents called late",findings:"Abdominal bruising, mild tachycardia",gcs:15,injuryMins:300,allergy:"Nil known",reason:"Injury is more than 3 hours old."},{mechanism:"Bicycle fall onto outstretched hand",findings:"Closed wrist deformity, minor abrasions, haemodynamically normal",gcs:15,injuryMins:30,allergy:"Nil known",reason:"Significant blood loss is unlikely."},{mechanism:"Struck by motorbike in car park",findings:"Pelvic tenderness, pale, tachycardic",gcs:14,injuryMins:40,allergy:"Tranexamic acid (previous anaphylaxis)",reason:"Hypersensitivity to TXA."}];
const TX_CRITERIA=[{id:"bleeding",text:"Major trauma within 3 hours with suspected major haemorrhage"},{id:"tbi",text:"Major trauma within 3 hours with isolated TBI and GCS ≤12"},{id:"late",text:"The injury occurred more than 3 hours ago"},{id:"minor",text:"Significant blood loss is unlikely"},{id:"allergy",text:"The patient has a hypersensitivity to TXA"}];
const TX_MISSED={bleeding:"Withholding TXA from a bleeding child loses its benefit — the effect falls with every minute of delay and is gone after 3 hours.",tbi:"Withholding TXA in a head injury with GCS ≤12 loses the chance to limit bleeding inside the skull while it can still help.",late:"More than 3 hours after injury TXA no longer helps and may increase the risk of death from bleeding.",minor:"Without significant blood loss the child takes on the drug’s risks, such as clotting problems, with no expected benefit.",allergy:"After previous anaphylaxis to TXA, giving it again risks a repeat life-threatening allergic reaction."};
const TX_NEXT=[{text:"Draw out 10 mL of NSS from the bag",ok:true},{text:"Add 10 mL of NSS to the bag",outcome:"The bag would hold 110 mL before the TXA goes in, so it would no longer be 10 mg/mL and every dose drawn from the chart would be wrong."},{text:"Draw up TXA from the ampoules",outcome:"Adding 10 mL TXA without first making room gives 1 g in 110 mL (about 9 mg/mL) — every chart volume would under-dose the child."}];
const TX_KIT=[{id:"bag",name:"0.9% NaCl 100 mL bag",ok:true,img:"eq-nacl-100ml-bag"},{id:"amp2",name:"TXA 500 mg/5 mL × 2 ampoules",ok:true,img:"eq-txa-two-ampoules"},{id:"s10",name:"10 mL syringe + drawing-up needle",ok:false,img:"eq-10ml-syringe-needle"},{id:"s50",name:"50 mL syringe",ok:true,img:"eq-50ml-syringe"},{id:"set",name:"IV giving set",ok:true,img:"eq-iv-giving-set"},{id:"stop",name:"Three-way stopcock",ok:true,img:"eq-three-way-stopcock"},{id:"label",name:"Medication additive label",ok:true,img:"eq-additive-label"},{id:"kidney",name:"Kidney basin",ok:true,img:"eq-kidney-basin"},{id:"sharps",name:"Sharps container",ok:true,img:"eq-sharps-container"},{id:"bag500",name:"0.9% NaCl 500 mL bag",ok:false,img:"eq-nacl-500ml-bag"},{id:"adr",name:"Adrenaline 1 mg/10 mL",ok:false,img:"eq-adrenaline"},{id:"amp1",name:"TXA 500 mg/5 mL × 1 ampoule only",ok:false,img:"eq-txa-one-ampoule"},{id:"glu",name:"Glucose 10% 250 mL",ok:false,img:"eq-glucose-10"}];
const TX_KITWHY={bag500:"1 g in a 500 mL bag is only 2 mg/mL — every chart volume would deliver a fifth of the dose.",amp1:"One ampoule adds only 500 mg — the bag would be 5 mg/mL and every chart dose would be half strength.",adr:"A second drug ampoule on the tray is a classic set-up for a drug selection error."};
const TX_DISCARD=[{text:"Discard it",ok:true},{text:"Inject it back into the bag later",outcome:"Putting the 10 mL back makes 1 g in 110 mL (about 9 mg/mL) — every dose drawn from the chart would be about 9% low."},{text:"Keep it to flush the line",outcome:"An unlabelled syringe of fluid left on the tray can be mistaken for a drug and given in error."}];
const TX_DQ=[{ok:true,text:"Tranexamic acid, 500 mg in 5 mL. Clear and colourless with no particles. In date."},{text:"Tranexamic acid, 1 g in 5 mL. Clear and colourless with no particles. In date.",why:"Each TXA ampoule is 500 mg in 5 mL (100 mg/mL). If you expect the wrong strength, a wrong ampoule will not be noticed.",outcome:"An unnoticed strength mismatch gives the child the wrong dose."},{text:"Tranexamic acid, 500 mg in 5 mL. Slightly cloudy but still usable. In date.",why:"The solution must be clear and colourless with no particles. Never use a cloudy or discoloured ampoule.",outcome:"A contaminated or degraded solution could be given to the child."},{text:"Tranexamic acid, 500 mg in 5 mL. Clear and colourless with no particles. Expired last month, acceptable in an emergency.",why:"Never use an expired ampoule, even in an emergency. Take another ampoule from the kit.",outcome:"An expired drug may not work as expected."},{text:"Tranexamic acid. Clear. In date.",why:"The read-back must confirm the drug name AND strength, clarity and expiry. Strength is missing here.",outcome:"Without checking the strength, the wrong concentration could be drawn up."}];
const TX_LINE=[{t:"Spike the bag & prime the giving set",img:"eq-iv-giving-set"},{t:"Attach the three-way stopcock to the line",img:"eq-three-way-stopcock"},{t:"Connect to the patient’s IV cannula & flush check",img:null}];
const TX_RATE={1:"A rapid push of TXA can drop the child’s blood pressure.",30:"Running it in this slowly delays the drug while the child keeps bleeding.",60:"Running it in over an hour delays the drug while the child keeps bleeding."};
const TX_BINS=[{id:"n",name:"Drawing-up needle",sharp:true,img:"eq-10ml-syringe-needle"},{id:"s50",name:"50 mL syringe",sharp:true,img:"eq-50ml-syringe"},{id:"a",name:"Empty glass ampoules",sharp:true,img:"eq-txa-two-ampoules"},{id:"w",name:"Wrapper packaging",sharp:false,img:null}];
const TX_INTERRUPT=[{q:"Crew mate: “What concentration is the bag once the TXA is in?”",opts:["1 mg/mL","10 mg/mL","100 mg/mL"],a:1},{q:"Crew mate hands you a 500 mL bag: “Use this one, it’s closer.”",opts:["Accept the 500 mL bag","Decline — protocol uses a 100 mL bag"],a:1},{q:"Parent: “What is that medicine for?”",opts:["It helps reduce bleeding by stopping clots breaking down","It is a painkiller","It raises blood pressure"],a:0},{q:"Crew mate: “How fast are we running this in?”",opts:["Push over 1 minute","Slowly over 10 minutes","Over 1 hour"],a:1},{q:"Crew mate: “Just bin the glass ampoules in the general bag.”",opts:["OK, general waste","No — glass ampoules go in the sharps bin"],a:1}];
const TX_LABEL=[{key:"conc",left:50.6,top:31.6,w:8.6,h:5.8,ans:()=>10,name:"Final concentration",unit:"mg/mL"},{key:"date",left:27.6,top:45.2,w:13,ans:()=>/\S{4,}/,name:"Date",ph:"dd/mm/yyyy"},{key:"time",left:45.2,top:45.2,w:10.8,ans:()=>/\d/,name:"Time",ph:"hh:mm"},{key:"weight",left:62.2,top:45.2,w:14,ans:c=>c.row.weight,name:"Patient weight",unit:"kg"},{key:"supplied",left:43.6,top:53.4,w:4.8,ans:()=>100,name:"Supplied as",unit:"mg/mL"},{key:"addMg",left:58,top:53.4,w:5.6,ans:()=>1000,name:"Add",unit:"mg"},{key:"addMl",left:67.8,top:53.4,w:5.6,ans:()=>10,name:"Add",unit:"mL"},{key:"toMl",left:26.4,top:62.4,w:6.6,ans:()=>90,name:"To … mL of solution",unit:"mL"},{key:"sol",left:38.4,top:62.4,w:7,ans:()=>/nacl|saline|sodium|nss|^\s*ns\s*$|0\.9/i,name:"Solution",ph:"e.g. 0.9% NaCl"},{key:"total",left:62.8,top:62.4,w:10.4,ans:()=>100,name:"Total volume",unit:"mL"}];
const TX_RIGHTS=["Right patient","Right drug","Right dose","Right route","Right time"];
const TX_TECH=[["Calculated the dose from the chart",/Dose calculation error|Wrong chart row/],["Drew out exactly 10 mL of saline",/Wrong volume drawn out/],["Discarded the drawn saline",/NSS not discarded/],["Double-checked the ampoules before opening",/before double-checking|double-check read-back/],["Added all 10 mL TXA to the bag",/Incorrect action after drawing TXA/],["Labelled the bag and cross-checked the 5 Rights",/label|5 Rights/i],["Mixed gently: slow turns, no shaking",/Shook the bag|Inadequate mixing/],["Drew the correct volume from the bag",/^Wrong volume drawn$/],["Set up the line in order",/Line set-up/],["Gave it over 10 minutes",/administration rate/],["Documented the time given",/not documented/]];
const TX_CRIT=/despite|Withheld TXA|before double-checking|Wrong volume|Dose calculation error|Wrong chart row|administration rate|Shook the bag|Inadequate mixing|NSS not discarded|5 Rights|wrong bin/;
const TX_STAGE_NAMES={elig:"Eligibility",equip:"Equipment",room:"Make room",drawup:"Check & draw up",label:"Label the bag",mix:"Mix",dose:"Dose calc",give:"5 Rights & administer"};
const TX_STAGE_LESSON={elig:"tx-1",equip:"tx-2",dose:"tx-3",room:"tx-4",drawup:"tx-5",label:"tx-6",mix:"tx-7",give:"tx-8",dispose:"tx-9"};
const TX_TARGET=480;
const TX_GUIDE={
 intro:[["welcome","Welcome. I’ll be your crew mate through this case."],["pointing","Your objective: safely prepare and give tranexamic acid (TXA) to the right paediatric patient, the way the poster sets it out."]],
 eligW:[["thinking","First, a quick one. Check this child against the AP criteria before you reach for the drug kit."]],
 elig:[["thinking","Here’s our patient. Review the case and decide whether TXA is indicated."]],
 equip:[["pointing","Gather your equipment. Select only what you need from the drug kit."]],
 dose:[["thinking","The bag is ready at 10 mg/mL. Now work out this child’s dose and volume from the chart."]],
 room:[["thinking","Equipment’s ready. What do you do before adding TXA to the bag?"]],
 drawup:[["ampoule","Time to prepare the TXA. Double-check the ampoules with me first, then draw up 1 g and add it to the bag."]],
 label:[["pointing","Label the bag immediately, before you mix it: an unlabelled bag is an unknown drug."]],
 mix:[["thinking","Now mix: turn the bag slowly a few times. Never shake it."]],
 give:[["pointing","Before you draw the dose, let’s cross-check the 5 Rights."],["syringe","Then give it over 10 minutes. Never faster: a rapid push can drop the child’s blood pressure."]],
 dispose:[["pointing","Last step: dispose of your sharps and waste safely."]],
 independent:[["neutral","Independent mode: no hints or guidance this time. Start by reviewing the case."]],
 pressure:[["urgent","Pressure mode: work quickly and accurately, and expect interruptions. Target time is 8 minutes."]]
};
const TX_HINT={
 elig:"<b>Indications:</b> under 14, major trauma under 3 h AND suspected or confirmed major haemorrhage OR isolated TBI with GCS ≤12. <b>Contraindications:</b> TXA hypersensitivity, injury over 3 h, significant blood loss unlikely.",
 equip:"You need: 100 mL 0.9% NaCl, 2 × TXA 500 mg/5 mL, 50 mL syringe, giving set, three-way stopcock, medication label, kidney basin and sharps container. The 10 mL syringe is not used.",
  dose:c=>c.ageMonths!==undefined?"Infant weight = (age in months × 0.5) + 4. Dose 15 mg/kg. Volume = dose ÷ 10 mg/mL.":`Find ${c.row.age} years on the chart. Dose = weight × 15 mg/kg; volume = dose ÷ 10 mg/mL.${c.large?" For 8 years and over, also note the draw-out volume.":""}`,
 room:"Attach the 50 mL syringe to the 100 mL bag, draw out exactly 10 mL of NSS, then discard it.",
 drawup:"Double-check the medication first, open both ampoules, draw up 1 g (10 mL) with the 50 mL syringe and inject it into the bag (90 mL → 100 mL).",
 label:"Label immediately: concentration, date, time, weight (from the chart for the child’s age), amount added, diluent and total volume.",
 mix:"Turn the bag slowly at least 3 times. Fast, jerky movement counts as shaking.",
 give:c=>`Tick all 5 Rights and confirm the read-back. Then ${c.large?`draw out and discard ${c.row.drawOut} mL and give the remaining volume`:`draw ${c.row.volume} mL (${c.row.dose} mg) from the bag and give it`} over 10 minutes.`,
 dispose:"Needles, syringes and glass ampoules go into the yellow sharps bin. Packaging goes in general waste."
};

const txShuffle=a=>{const t=[...a];for(let i=t.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[t[i],t[j]]=[t[j],t[i]]}return t};
const txPick=a=>a[Math.floor(Math.random()*a.length)];
const txKn=(v,t,n=.5)=>String(v??"").trim()!==""&&Math.abs(Number(v)-t)<=n;
const txNs=(a,b)=>{const n=Math.round(Math.abs(a-b)/b*100);return`The child would receive ${Math.round(a)} mg instead of ${b} mg — a ${n}% ${a>b?"overdose":"underdose"}.`};
const txFmt=s=>{s=Math.max(0,Math.round(s));return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")};
const txEsc=v=>String(v??"").replace(/[&<>"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));
function txInfant(m){const w=m*.5+4,d=Math.round(w*15);return{age:0,weight:w,dose:d,volume:d/10,infant:true}}
function txCase(o={}){
  const withhold=o.indicated===false||(o.indicated===undefined&&Math.random()<.25);
  const infant=!withhold&&!o.young&&Math.random()<.12;
  let row,ageLabel,ageMonths;
  if(infant){ageMonths=txPick([4,6,8,10]);row=txInfant(ageMonths);ageLabel=`${ageMonths} months`;}
  else{const pool=o.young?TX_CHART.filter(r=>r.age>=3&&r.age<=7):withhold?TX_CHART:TX_CHART.filter(r=>r.age<14);row=txPick(pool);ageLabel=`${row.age} year${row.age>1?"s":""}`;}
  const base={name:txPick(TX_NAMES),ageLabel,ageMonths,row,large:row.age>=8,hr:120+Math.floor(Math.random()*40),sbp:70+Math.floor(Math.random()*15)};
  if(withhold){const u=txPick(TX_WITHHOLD),cr=u.injuryMins>180?"late":u.allergy!=="Nil known"?"allergy":"minor";
    return{...base,...u,hr:cr==="minor"?100:base.hr,sbp:cr==="minor"?100:base.sbp,indicated:false,criterion:cr};}
  const g=txPick(TX_GIVE);
  return{...base,...g,injuryMins:15+Math.floor(Math.random()*60),allergy:"Nil known",indicated:true,reason:g.gcs<=12?"Major trauma under 3 h with isolated TBI and GCS ≤12.":"Major trauma under 3 h with suspected major haemorrhage.",criterion:g.gcs<=12?"tbi":"bleeding"};
}
function txGuidedCase(){ if(!S.txcase||!S.txcase.row){S.txcase=txCase({indicated:true,young:true});save();} return S.txcase; }
function txCaseFor(s){ if(["nbr","code","smr"].includes(P.l.scene)) return rxCase(s); return s.case==="withhold"?P.wcase:s.case==="run"?P.runCase:txGuidedCase(); }
function txLabelData(c){ if(P.lab) return P.lab; if(P.txMode==="guided"&&S.txLabel) return S.txLabel; const d=new Date(),p=x=>String(x).padStart(2,"0");
  return {conc:"10",date:`${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()}`,time:`${p(d.getHours())}:${p(d.getMinutes())}`,weight:String(c.row.weight),supplied:"100",addMg:"1000",addMl:"10",toMl:"90",sol:"0.9% NaCl",total:"100"}; }

/* ---------- sound, haptics, voice ---------- */
let txAC=null;
const txSoundOn=()=>S.txSound!==false;
function txTone(f,d,type,g,delay=0){const c=txAC,o=c.createOscillator(),gn=c.createGain(),t=c.currentTime+delay;o.type=type;o.frequency.setValueAtTime(f,t);gn.gain.setValueAtTime(g,t);gn.gain.exponentialRampToValueAtTime(1e-4,t+d);o.connect(gn).connect(c.destination);o.start(t);o.stop(t+d);}
function txNoise(d,freq,g){const c=txAC,b=c.createBuffer(1,Math.floor(c.sampleRate*d),c.sampleRate),ch=b.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=(Math.random()*2-1)*(1-i/ch.length);const s=c.createBufferSource(),f=c.createBiquadFilter(),gn=c.createGain();s.buffer=b;f.type="lowpass";f.frequency.value=freq;gn.gain.value=g;s.connect(f).connect(gn).connect(c.destination);s.start();}
function txSound(k){
  if(!txSoundOn())return;
  const vib={err:[70,50,70],snap:35,alert:[40,40,40],bin:25}[k];
  try{vib&&navigator.vibrate&&navigator.vibrate(vib)}catch(e){}
  try{txAC=txAC||new (window.AudioContext||window.webkitAudioContext)();if(txAC.state==="suspended")txAC.resume();
    if(k==="ok"){txTone(660,.12,"sine",.13);txTone(990,.18,"sine",.13,.1)}
    if(k==="err")txTone(190,.28,"square",.07);
    if(k==="click")txTone(1400,.04,"triangle",.07);
    if(k==="snap"){txNoise(.06,6000,.45);txTone(2400,.05,"triangle",.09)}
    if(k==="slosh")txNoise(.35,700,.3);
    if(k==="alert"){txTone(880,.12,"square",.06);txTone(880,.12,"square",.06,.18)}
    if(k==="bin")txNoise(.12,1800,.35);
  }catch(e){}
}
let txVoice=null;
function txPickVoice(){try{const v=speechSynthesis.getVoices().filter(x=>/^en/i.test(x.lang));txVoice=v.find(x=>/en-GB/i.test(x.lang)&&/male|ryan|george|thomas|daniel/i.test(x.name))||v.find(x=>/en-GB/i.test(x.lang))||v[0]||null}catch(e){}}
try{if(window.speechSynthesis){txPickVoice();speechSynthesis.addEventListener("voiceschanged",txPickVoice)}}catch(e){}
function txHush(){try{window.speechSynthesis&&speechSynthesis.cancel()}catch(e){}}
function txSay(text){
  if(!txSoundOn()||!window.speechSynthesis)return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text).replace(/<[^>]+>/g,""));if(txVoice){u.voice=txVoice;u.lang=txVoice.lang}else u.lang="en-GB";u.rate=1.02;speechSynthesis.speak(u)}catch(e){}
}

/* ---------- engine ---------- */
function txLog(ok,text){(P.txEvents=P.txEvents||[]).push({t:Math.round((Date.now()-P.t0)/1000),ok,text,stage:P.sx?(P.sx.tag||P.sx.key):"-"});}
function txInit(s){
  const st={key:s.stage,sid:s.stage+"#"+P.i,phase:TXS[s.stage].phases[0],fb:null,err:false,hint:false};
  TXS[s.stage].init&&TXS[s.stage].init(st,txCaseFor(s),s);
  const G=TXS[s.stage].guide;
  const g=G?G(s):P.txMode==="guided"?(s.stage==="elig"&&s.case==="withhold"?TX_GUIDE.eligW:TX_GUIDE[s.stage]):(P.i===0?TX_GUIDE[P.txMode]:null);
  st.guide=g; st.mood=g?g[g.length-1][0]:"neutral";
  if(g) setTimeout(()=>{ if(P&&P.sx===st) txSay(g.map(x=>x[1]).join(" ")); },250);
  return st;
}
function txSx(s){ if(!P.sx||P.sx.sid!==s.stage+"#"+P.i) P.sx=txInit(s); return P.sx; }
function txOk(msg,o={}){
  txLog(true,msg); txSound(o.quiet?"click":"ok");
  if(o.quiet){ txGo(o.next); return; }
  P.sx.fb={ok:true,msg,next:o.next}; P.sx.mood="happy";
  if(P.txMode==="guided") txSay(msg);
  drawPlayer();
}
function txErr(title,why,outcome,o={}){
  txLog(false,title); P.sx.err=true; txSound("err");
  const guided=P.txMode==="guided";
  P.sx.fb={ok:false,title,msg:guided||o.always?(why||title):"Incorrect — review and try again.",outcome};
  P.sx.mood=TX_CRIT.test(title)?"warning":"sad";
  if(guided||o.always) txSay(P.sx.fb.msg);
  drawPlayer();
}
function txNote(title){ txLog(false,title); P.sx.err=true; }
function txGo(next){
  if(!next||next==="END"){ txEndStage(); return; }
  P.sx.phase=next; P.sx.fb=null; drawPlayer();
}
function txEndStage(){
  const s=P.steps[P.i];
  if(s.stage==="elig"&&s.case==="run"&&!P.runCase.indicated){ P.runCase=txCase({indicated:true}); P.sx=null; drawPlayer(); return; }
  nextStep();
}
const txBust=m=>TXM(`avatar${m&&m!=="neutral"?"-"+(m==="encourage"?"happy":m):""}-bust.webp`);

/* ---------- shared UI ---------- */
function txGuideHTML(st){
  if(!st.guide) return "";
  return `<div class="mate"><img src="${txBust(st.mood)}" alt="Crew mate" width="64" height="64"><div class="bubble">${st.guide.map(x=>`<p>${x[1]}</p>`).join("")}</div></div>`;
}
function txOptsHTML(act,items,st){
  return `<div class="opts">${items.map((it,i)=>`<button class="opt" data-tx="${act}" data-i="${i}"><span class="k">${String.fromCharCode(65+i)}</span>${it.text}</button>`).join("")}</div>`;
}
function txHero(img,label,title){
  return `<div class="scn"><img src="${TXM(img)}" alt="" loading="lazy"><div class="scn-t"><span class="label">${label}</span><h2>${title}</h2></div></div>`;
}
function txSyringeSVG(id,cap,v,fluid){
  const x0=48,W=260,xs=x0+Math.min(cap,v)/cap*W;let ticks="";
  for(let i=0;i<=cap;i++){const x=x0+i/cap*W,maj=i%10===0,mid=i%5===0;ticks+=`<line x1="${x}" x2="${x}" y1="26" y2="${maj?42:mid?37:32}" stroke="var(--ink)" stroke-opacity="${maj?.9:.55}" stroke-width="${maj?1.4:1}"/>`;if(maj)ticks+=`<text x="${x}" y="20" text-anchor="middle" font-size="10" fill="var(--muted)">${i}</text>`;}
  return `<svg class="syr" id="${id}" viewBox="0 0 640 100" role="img" aria-label="${cap} mL syringe">
   <line x1="4" y1="50" x2="34" y2="50" stroke="var(--muted)" stroke-width="2"/><rect x="32" y="43" width="16" height="14" rx="3" fill="var(--sunken)" stroke="var(--muted)"/>
   <rect x="${x0}" y="24" width="${W}" height="52" rx="8" fill="var(--glass)" stroke="var(--muted)" stroke-width="1.5"/>
   <rect id="${id}-fl" x="${x0+1}" y="26" width="${Math.max(0,xs-x0-1)}" height="48" rx="6" fill="${fluid}"/>
   ${ticks}
   <rect x="${x0+W}" y="12" width="9" height="76" rx="3" fill="var(--sunken)" stroke="var(--muted)"/>
   <g id="${id}-pl" transform="translate(${xs-x0} 0)"><rect x="${x0}" y="26" width="10" height="48" rx="2" fill="#1f2433"/><rect x="${x0+10}" y="44" width="${W+20}" height="12" fill="var(--plunger)"/><rect x="${x0+W+28}" y="18" width="14" height="64" rx="4" fill="var(--plunger)"/></g>
  </svg>`;
}
function txBagCard(vol,extra=""){
  return `<div class="bagcard"><img src="${TXM("eq-nacl-100ml-bag.webp")}" alt="100 mL 0.9% sodium chloride bag"><span class="chip big" id="txbag">${vol.toFixed(1)} mL</span>${extra}</div>`;
}
function txSyrControls(max){
  return `<div class="syrctl"><button class="iconbtn" data-tx="nudge" data-d="-0.1" aria-label="Nudge minus 0.1 mL">−</button>
   <input type="range" id="txrange" min="0" max="${max}" step="0.1" value="${P.sx.v}" aria-label="Pull the syringe plunger">
   <button class="iconbtn" data-tx="nudge" data-d="0.1" aria-label="Nudge plus 0.1 mL">+</button></div>
   <p class="note" style="text-align:center">Drag the plunger, use the slider, or nudge 0.1 mL at a time.</p>`;
}
function txSetV(v,limit){
  const st=P.sx;limit=limit??(st.rig?st.rig.max:st.cap);v=Math.max(0,Math.min(limit,Math.round(v*10)/10));
  if(Math.floor(v)!==Math.floor(st.v)){txSound("click");try{navigator.vibrate&&navigator.vibrate(6)}catch(e){}}
  st.v=v;txRigUpdate(st);
  TXS[st.key].onV&&TXS[st.key].onV(st,v);
}
function txBindSyringe(limitFn){
  const svg=document.getElementById("txsyr");if(!svg)return;
  const st=P.sx,toV=e=>{const r=svg.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*640;return (x-48)/260*st.cap;};
  let drag=false;
  svg.addEventListener("pointerdown",e=>{drag=true;try{svg.setPointerCapture(e.pointerId)}catch(_){}txSetV(toV(e),limitFn&&limitFn());});
  svg.addEventListener("pointermove",e=>{if(drag)txSetV(toV(e),limitFn&&limitFn());});
  ["pointerup","pointercancel"].forEach(k=>svg.addEventListener(k,()=>drag=false));
  const r=document.getElementById("txrange");
  if(r){r.addEventListener("input",()=>txSetV(Number(r.value),limitFn&&limitFn()));}
}
function txChartHTML(st,c){
  const mask=true,sel=st.row;
  const cell=v=>mask?`<span class="q">?</span>`:v;
  const tr=(r,label,w)=>{const id=r.infant?"0":String(r.age);return `<tr class="${sel===id?"sel":""}"><td><button class="rowbtn" data-tx="row" data-row="${id}" ${st.phase!=="row"?"disabled":""} aria-label="${label} row">${label}</button></td><td>${w}</td><td>${cell(r.dose+" mg")}</td><td>${cell(r.volume+" mL")}</td><td>${r.drawOut?`<span class="out">Draw out ${r.drawOut} mL</span>`:"–"}</td></tr>`;};
  return `<div class="visual"><table class="txc"><thead><tr><th>Age</th><th>Est. weight</th><th>Dose (15 mg/kg)</th><th>Volume (10 mg/mL)</th><th>≥8 years</th></tr></thead><tbody>
   ${tr({infant:true,dose:"?",volume:"?"},"0–12 months","(months × 0.5) + 4")}
   ${TX_CHART.filter(r=>r.age<8).map(r=>tr(r,r.age+" y",r.weight+" kg")).join("")}
   <tr class="band"><td colspan="5"><b>≥8 years or &gt;30 kg:</b> add 1 g, draw out and discard the volume shown, give the remaining volume over 10 minutes (includes 10 mL administration-set compensation).</td></tr>
   ${TX_CHART.filter(r=>r.age>=8).map(r=>tr(r,r.age+" y",r.weight+" kg")).join("")}
  </tbody></table></div>`;
}

/* ---------- bench: hanging bag + vertical syringe on its port ---------- */
const RIG={top:302,ml:5,bagBottom:232,bagScale:1.5,H:700};
const BAGP="M30 32 Q30 14 48 14 H172 Q190 14 190 32 V220 Q190 238 172 238 H48 Q30 238 30 220 Z";
function txRigSVG(st,o){
  const v=st.v,guided=P.txMode==="guided",fl=o.fluid==="txa"?"#B9D6FA":"#9EC3F2";let g="";
  if(o.mode!=="needle"){
    const bv=o.bagOf(v),ly=RIG.bagBottom-bv*RIG.bagScale,lab=o.label;
    let ticks="";for(let m=20;m<=100;m+=10){const y=RIG.bagBottom-m*RIG.bagScale;ticks+=`<line x1="176" x2="${m%50?183:188}" y1="${y}" y2="${y}" stroke="#4A5878" stroke-width="1.2"/><text x="173" y="${y+3}" font-size="7" text-anchor="end" fill="#4A5878">${m}</text>`;}
    g+=`<defs><clipPath id="rigbag"><path d="${BAGP}"/></clipPath></defs>
     <path d="${BAGP}" fill="rgba(226,236,248,.65)" stroke="#8EA3C0" stroke-width="1.6"/>
     <rect id="rig-bagfl" x="30" y="${ly}" width="160" height="${240-ly}" fill="${o.fluid==="txa"&&o.label?"#B9D6FA":"#A9CCF3"}" opacity=".75" clip-path="url(#rigbag)"/>
     ${o.streakOf?`<g id="rig-streak" opacity="${o.streakOf(v)}" clip-path="url(#rigbag)" fill="none" stroke="#2F6FD8" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="5 5"><path d="M110 238 C94 205 128 178 104 140"/><path d="M110 238 C126 210 92 186 118 152"/><path d="M110 238 C104 214 122 200 98 172"/></g>`:""}
     <ellipse cx="110" cy="26" rx="13" ry="6" fill="#fff" stroke="#8EA3C0"/>
     <text x="96" y="56" font-size="10" font-weight="700" text-anchor="middle" fill="#1E2A44">0.9% Sodium Chloride</text>
     <text x="96" y="68" font-size="6.5" text-anchor="middle" fill="#3A4766">Intravenous Infusion BP</text>
     <text x="96" y="86" font-size="13" font-weight="800" text-anchor="middle" fill="#1E2A44">100 mL</text>
     ${ticks}
     ${lab?`<g><rect x="46" y="104" width="118" height="62" rx="3" fill="#fff" stroke="#C9CFDA"/><rect x="46" y="104" width="118" height="9" fill="#D03A43"/><text x="105" y="111" font-size="6.5" font-weight="800" text-anchor="middle" fill="#fff">TRANEXAMIC ACID</text>
       <text x="105" y="133" font-size="16" text-anchor="middle" fill="#1D3B8A" font-family="Caveat,cursive">${txEsc(lab.conc||"10")} mg/mL</text><text x="105" y="150" font-size="10" text-anchor="middle" fill="#1D3B8A" font-family="Caveat,cursive">${txEsc(lab.date||"")} ${txEsc(lab.time||"")}</text><text x="105" y="161" font-size="10" text-anchor="middle" fill="#1D3B8A" font-family="Caveat,cursive">${txEsc(lab.weight||"")} kg</text></g>`:""}
     <rect x="64" y="238" width="16" height="22" rx="3" fill="#EEF2F8" stroke="#9AA9C2"/>
     <rect x="102" y="238" width="16" height="24" rx="2" fill="#EEF2F8" stroke="#9AA9C2"/><rect x="100" y="246" width="20" height="6" rx="2" fill="#2A6BE0"/>
     <rect x="106" y="252" width="8" height="12" fill="${fl}"/>`;
  } else {
    const amp=(i,cx)=>{const rem=st.rem[i],act=st.amp===i,h=rem/5*92;return `<g><path d="M${cx-15} 118 Q${cx-15} 106 ${cx-8} 102 L${cx-8} 84 L${cx+8} 84 L${cx+8} 102 Q${cx+15} 106 ${cx+15} 118 L${cx+15} 206 Q${cx+15} 212 ${cx+9} 212 L${cx-9} 212 Q${cx-15} 212 ${cx-15} 206Z" fill="rgba(226,236,248,.7)" stroke="${act?"#2F5BFF":"#8EA3C0"}" stroke-width="${act?2.4:1.4}"/>
      <rect id="rig-a${i}" x="${cx-14}" y="${210-h}" width="28" height="${h}" fill="#B9D6FA"/><rect x="${cx-15}" y="150" width="30" height="20" fill="#fff" opacity=".9"/><text x="${cx}" y="160" font-size="5.5" text-anchor="middle" fill="#1E2A44">TXA</text><text x="${cx}" y="167" font-size="5" text-anchor="middle" fill="#1E2A44">500 mg/5 mL</text>
      <text x="${cx}" y="232" font-size="9" text-anchor="middle" font-weight="700" fill="${act?"#2F5BFF":"#4A5878"}">Ampoule ${i+1}</text></g>`;};
    const ax=st.amp===0?62:158;
    g+=`${amp(0,62)}${amp(1,158)}<line x1="110" y1="262" x2="${ax}" y2="196" stroke="#8F98AA" stroke-width="2"/><circle cx="${ax}" cy="196" r="2" fill="#8F98AA"/>`;
  }
  let ticks="";for(let i=0;i<=50;i++){const y=RIG.top+i*RIG.ml,maj=i%10===0,mid=i%5===0;ticks+=`<line x1="82" x2="${82+(maj?22:mid?15:9)}" y1="${y}" y2="${y}" stroke="#11151F" stroke-width="${maj?1.6:1}"/>`;if(maj&&i)ticks+=`<text x="108" y="${y+4}" font-size="11" font-weight="700" fill="#11151F">${i}</text>`;}
  const tgt=guided&&o.target!=null&&o.target>0?`<path d="M141 ${RIG.top+o.target*RIG.ml} l9 -5 v10z" fill="#2F5BFF"/>`:"";
  g+=`<rect x="104" y="262" width="12" height="30" rx="2" fill="#E7EBF2" stroke="#9AA9C2"/><rect x="96" y="290" width="28" height="12" rx="3" fill="#E7EBF2" stroke="#9AA9C2"/>
   <rect x="82" y="302" width="56" height="250" rx="5" fill="rgba(232,239,247,.75)"/>
   <rect id="rig-fl" x="83" y="302" width="54" height="${v*RIG.ml}" fill="${fl}"/>
   <g id="rig-pl" transform="translate(0 ${v*RIG.ml})"><rect x="91" y="316" width="38" height="268" fill="rgba(244,246,250,.85)" stroke="#C3CAD8"/><rect x="104" y="316" width="12" height="268" fill="#FBFCFE" stroke="#C3CAD8"/>
     <rect x="83" y="302" width="54" height="14" rx="3" fill="#2B2F3A"/><line x1="85" x2="135" y1="307" y2="307" stroke="#4A4F5C"/><line x1="85" x2="135" y1="311" y2="311" stroke="#4A4F5C"/>
     <rect x="72" y="584" width="76" height="13" rx="6" fill="#E9ECF2" stroke="#AEB7C8"/></g>
   <rect x="82" y="302" width="56" height="250" rx="5" fill="none" stroke="#8193AE" stroke-width="1.6"/><rect x="128" y="306" width="4" height="242" rx="2" fill="#fff" opacity=".6"/>
   ${ticks}${tgt}
   <rect x="54" y="552" width="112" height="11" rx="5" fill="#E2E7EF" stroke="#9AA9C2"/>`;
  return `<svg class="rig2" id="txrig" viewBox="0 0 220 ${RIG.H}" tabindex="0" role="slider" aria-label="${o.push?"Syringe plunger: push up to inject":"Syringe plunger: drag down to draw"}" aria-valuemin="0" aria-valuemax="${o.max}" aria-valuenow="${v}" ${guided?`aria-valuetext="${v.toFixed(1)} mL"`:""}>${g}</svg>`;
}
function txLoupe(v,o){
  const f=o.fluid==="txa"?"#B9D6FA":"#9EC3F2";let t="";
  for(let i=Math.floor(v)-4;i<=Math.ceil(v)+4;i++){if(i<0||i>50)continue;const y=60+(i-v)*16,L=i%10===0?42:i%5===0?30:18;
    t+=`<line x1="14" x2="${14+L}" y1="${y}" y2="${y}" stroke="#0B0E16" stroke-width="${i%5===0?2.4:1.4}"/>`;if(i%5===0)t+=`<text x="${20+L}" y="${y+5}" font-size="14" font-weight="800" fill="#0B0E16">${i}</text>`;}
  return `<svg viewBox="0 0 120 120" aria-hidden="true"><defs><clipPath id="lpc"><circle cx="60" cy="60" r="55"/></clipPath></defs><g clip-path="url(#lpc)"><rect width="120" height="120" fill="#EEF3FA"/><rect width="120" height="60" fill="${f}"/><rect y="60" width="120" height="60" fill="#7B8190"/>${t}<path d="M118 60 l-9 -6 v12z" fill="#2F5BFF"/></g><circle cx="60" cy="60" r="55" fill="none" stroke="#8C99B5" stroke-width="3"/></svg>`;
}
function txGaugeHTML(gs){ return `<div class="gbar"><span class="gz" style="left:${gs.zone??47}%"></span><i style="left:${Math.max(0,Math.min(100,gs.pct))}%"></i></div><p class="${gs.ok?"gok":""}">${gs.t}</p>`; }
function txBench(st,o){
  st.rig=o;if(st.vr==null)st.vr=st.v;const guided=P.txMode==="guided";
  return `<div class="bench"><div class="rigcard">${txRigSVG(st,o)}</div>
   <div class="benchside">
    ${guided?`<div class="readout2"><span class="label">Syringe</span><b id="txsv">${st.v.toFixed(1)} mL</b>${o.mg?`<span id="txmg">${o.mg(st.v)}</span>`:""}${o.mode!=="needle"?`<span id="txbag">Bag ${o.bagOf(st.v).toFixed(1)} mL</span>`:""}</div>`:`<p class="note">Read the volume on the syringe scale. The magnifier shows the edge of the plunger.</p>`}
    ${guided&&o.gauge?`<div class="gauge" id="txgauge">${txGaugeHTML(o.gauge(st.v))}</div>`:""}
    <div class="loupe"><span class="label">Magnifier</span><div id="txloupe">${txLoupe(st.v,o)}</div></div>
    <p class="note">${o.push?"Drag the plunger <b>up</b> to push.":"Drag the plunger <b>down</b> to draw."} Keyboard: focus the syringe and use the arrow keys.</p>
    <button class="btn ghost sm" data-tx="fine" style="justify-self:start">${st.fine?"Hide fine adjust":"Fine adjust"}</button>
    ${st.fine?txSyrControls(o.max):""}
   </div></div>`;
}
function txRigUpdate(st){
  const o=st.rig;if(!o)return;const v=st.v,guided=P.txMode==="guided",$=id=>document.getElementById(id);
  const fl=$("rig-fl");if(fl)fl.setAttribute("height",v*RIG.ml);
  const pl=$("rig-pl");if(pl)pl.setAttribute("transform",`translate(0 ${v*RIG.ml})`);
  if(o.mode!=="needle"){const bv=o.bagOf(v),ly=RIG.bagBottom-bv*RIG.bagScale,b=$("rig-bagfl");if(b){b.setAttribute("y",ly);b.setAttribute("height",240-ly);}
    const ch=$("txbag");if(ch)ch.textContent=`Bag ${bv.toFixed(1)} mL`;const sk=$("rig-streak");if(sk&&o.streakOf)sk.setAttribute("opacity",o.streakOf(v));}
  const svg=$("txrig");if(svg){svg.setAttribute("aria-valuenow",v);if(guided)svg.setAttribute("aria-valuetext",v.toFixed(1)+" mL");}
  const sv=$("txsv");if(sv)sv.textContent=v.toFixed(1)+" mL";const mg=$("txmg");if(mg&&o.mg)mg.innerHTML=o.mg(v);
  const ga=$("txgauge");if(ga&&o.gauge)ga.innerHTML=txGaugeHTML(o.gauge(v));
  const lp=$("txloupe");if(lp)lp.innerHTML=txLoupe(v,o);
  const r=$("txrange");if(r&&document.activeElement!==r)r.value=v;
  const cf=$("txconfirm");if(cf){cf.textContent=st.confirmLabel?st.confirmLabel(v):(guided?`Confirm ${v.toFixed(1)} mL`:"Confirm volume");cf.disabled=st.confirmDisabled?st.confirmDisabled(v):false;}
}
function txBindRig(limitFn){
  const svg=document.getElementById("txrig");if(!svg)return;const st=P.sx;let lastY=null;
  const sy=e=>{const r=svg.getBoundingClientRect();return (e.clientY-r.top)/r.height*RIG.H;};
  const lim=()=>limitFn?limitFn():st.rig.max;
  svg.addEventListener("pointerdown",e=>{lastY=sy(e);st.vr=st.v;try{svg.setPointerCapture(e.pointerId)}catch(_){}});
  svg.addEventListener("pointermove",e=>{if(lastY==null)return;const y=sy(e);let dv=(y-lastY)/RIG.ml;lastY=y;const o=st.rig;
    if(P.txMode==="guided"&&o.target!=null&&o.target>0&&Math.abs(st.v-o.target)<1.5)dv*=.35;
    st.vr=Math.max(0,Math.min(lim(),st.vr+dv));txSetV(st.vr,lim());});
  ["pointerup","pointercancel"].forEach(k=>svg.addEventListener(k,()=>lastY=null));
  svg.addEventListener("keydown",e=>{const m={ArrowDown:.1,ArrowRight:.1,ArrowUp:-.1,ArrowLeft:-.1,PageDown:1,PageUp:-1}[e.key];if(m==null)return;e.preventDefault();txSetV(st.v+m,lim());st.vr=st.v;});
  const r=document.getElementById("txrange");if(r)r.addEventListener("input",()=>{txSetV(Number(r.value),lim());st.vr=st.v;});
}

/* ---------- stages ---------- */
const TXS={
 intro:{phases:["intro"],
  body:(st,c)=>`${txHero("hero-ambulance-prep.webp","Paediatric TXA · hands-on","Prepare and give it right")}
   <div class="mate big"><img src="${TXM("avatar-welcome-half.webp")}" alt="Your crew mate" width="150"><div class="bubble">${TX_GUIDE.intro.map(x=>`<p>${x[1]}</p>`).join("")}<p>We’ll follow the HMCAS poster, one stage at a time.</p></div></div>
   <ol class="stages">${Object.values(TX_STAGE_NAMES).map((n,i)=>`<li><b>${i+1}</b>${n}</li>`).join("")}</ol>`,
  foot:()=>`<button class="btn wide" data-tx="intro-go">Start the case</button>`},

 elig:{phases:["decide","why"],
  init:(st)=>{st.crit=txShuffle(TX_CRITERIA);},
  body:(st,c)=>`<div class="dispatch"><span class="label">Dispatch · P1 paediatric trauma</span><h2>${c.mechanism}</h2></div>
   <div class="monitor"><div class="mon-v hr"><span>HR</span><b>${c.hr}</b><i class="beat" style="animation-duration:${(60/c.hr).toFixed(2)}s"></i></div><div class="mon-v sbp"><span>SBP</span><b>${c.sbp}</b></div><div class="mon-v gcs"><span>GCS</span><b>${c.gcs}</b></div></div>
   <dl class="casegrid"><dt>Patient</dt><dd>${c.name}, ${c.ageLabel}</dd><dt>Time since injury</dt><dd>${c.injuryMins>=60?Math.floor(c.injuryMins/60)+" h "+(c.injuryMins%60?c.injuryMins%60+" min":""):c.injuryMins+" min"}</dd><dt>Allergies</dt><dd>${c.allergy}</dd><dt>Findings</dt><dd>${c.findings}</dd></dl>
   ${st.phase==="decide"?`<h3 class="q3">Using the AP scope criteria, is IV tranexamic acid indicated?</h3><div class="two"><button class="btn good" data-tx="decide" data-v="1">Indicated · prepare TXA</button><button class="btn bad" data-tx="decide" data-v="0">Contraindicated · withhold</button></div>`
     :`<h3 class="q3">${c.indicated?"Which indication does this patient meet?":"Why is TXA withheld?"}</h3>${txOptsHTML("crit",st.crit,st)}`}`},

 equip:{phases:["pick"],
  init:(st)=>{st.order=txShuffle(TX_KIT);st.sel=[];},
  body:(st)=>`<p class="lead">Tap equipment to put it on your tray. Tap again to put it back.</p>
   <div class="kit">${st.order.map(k=>`<button class="kitem ${st.sel.includes(k.id)?"on":""}" data-tx="kit" data-id="${k.id}" aria-pressed="${st.sel.includes(k.id)}"><img src="${TXM(k.img+".webp")}" alt="" loading="lazy"><span>${k.name}</span><i>${I.check}</i></button>`).join("")}</div>
   <div class="tray"><span class="label">Your tray · ${st.sel.length} item${st.sel.length===1?"":"s"}</span><div class="trayrow">${st.sel.length?st.sel.map(id=>{const k=TX_KIT.find(x=>x.id===id);return `<img src="${TXM(k.img+".webp")}" alt="${k.name}" title="${k.name}">`}).join(""):`<span class="note">Empty. Choose from the kit above.</span>`}</div></div>`,
  foot:()=>`<button class="btn wide" data-tx="kit-confirm">Confirm equipment</button>`},

 dose:{phases:["row","calc"],
  init:(st)=>{st.row=null;st.vals={w:"",d:"",v:"",o:""};},
  body:(st,c)=>{const inf=c.ageMonths!==undefined,f=(k,l,u)=>`<label class="fld">${l}<span><input type="number" inputmode="decimal" data-txin="${k}" value="${txEsc(st.vals[k])}"><em>${u}</em></span></label>`;
   return `<div class="info">The bag you prepared holds 1 g in 100 mL: <b>10 mg/mL</b>. Dose = <b>15 mg/kg</b>.${inf?" Babies 0–12 months: weight = (age in months × 0.5) + 4.":""}</div>
   <h3 class="q3">${st.phase==="row"?`Find ${c.name}’s age (${c.ageLabel}) on the chart and tap the row.`:st.rowMsg}</h3>
   <p class="note">Dose and volume are hidden. Work them out from the weight.</p>${txChartHTML(st,c)}
   ${st.phase==="calc"?`<div class="fields">${inf?f("w","Estimated weight","kg"):""}${f("d","TXA dose","mg")}${f("v","Volume to deliver","mL")}${c.large?f("o","Volume to draw out from bag","mL"):""}</div>`:""}`;},
  foot:(st)=>st.phase==="calc"?`<button class="btn wide" data-tx="dose-check">Check calculation</button>`:""},

 room:{phases:["next","draw","discard"],
  init:(st)=>{st.next=txShuffle(TX_NEXT);st.disc=txShuffle(TX_DISCARD);st.v=0;st.cap=50;st.bagBase=100;},
  body:(st)=>{
   if(st.phase==="next") return `<div class="split"><div>${txBagCard(100)}</div><div><h3 class="q3">What is the next action before adding TXA to the 100 mL NSS bag?</h3>${txOptsHTML("next",st.next,st)}</div></div>`;
   if(st.phase==="draw") return `<h3 class="q3">The 50 mL syringe is on the bag’s medication port. Draw out exactly 10 mL of saline.</h3>
     ${txBench(st,{mode:"bag",fluid:"saline",bagOf:v=>100-v,target:10,max:50,gauge:v=>{const c=1000/(110-v);return{t:`If 1 g TXA is added now, the bag will be <b>${c.toFixed(2)} mg/mL</b>${Math.abs(v-10)<.05?" · exactly right":c>10?" · too strong":" · too weak"}`,ok:Math.abs(v-10)<.05,pct:50+(c-10)*25};}})}`;
   return `<div class="split"><div class="bagcard"><img src="${TXM("eq-kidney-basin.webp")}" alt="Kidney basin"></div><div><h3 class="q3">What do you do with the 10 mL of NSS you have drawn out?</h3>${txOptsHTML("disc",st.disc,st)}</div></div>`;},
  foot:(st)=>st.phase==="draw"?`<button class="btn wide" id="txconfirm" data-tx="room-confirm">${P.txMode==="guided"?`Confirm ${st.v.toFixed(1)} mL`:"Confirm volume"}</button>`:"",
  after:(st)=>{ if(st.phase==="draw") txBindRig(); }},

 drawup:{phases:["start","dq","video","snap","draw","inject","push"],
  init:(st,c)=>{st.dq=txShuffle(TX_DQ);st.snapped=[false,false];st.v=0;st.cap=50;st.amp=0;st.rem=[5,5];st.inj=txShuffle([{text:"Inject all 10 mL of TXA into the 90 mL normal saline bag via its medication port",ok:true},{text:"Give the undiluted TXA directly to the patient",outcome:`The child would get the full 1 g undiluted — ${(1000/c.row.dose).toFixed(1)}× their ${c.row.dose} mg dose, given fast enough to drop their blood pressure.`},{text:"Discard the normal saline and replace it with the TXA",outcome:"Undiluted TXA is 100 mg/mL — ten times the chart concentration, so every chart volume would be a 10× overdose."}]);st.watched=false;st.bag=90;
   st.confirmLabel=v=>v>=10?"Confirm 10 mL (1 g)":(P.txMode==="guided"?`${v.toFixed(1)} of 10 mL`:"Draw up 10 mL");st.confirmDisabled=v=>v<10;},
  body:(st,c)=>{
   const amps=`<div class="amps">${[0,1].map(i=>`<button class="amp ${st.snapped[i]?"snapped":""}" data-amp="${i}" ${st.phase!=="snap"||st.snapped[i]?"disabled":""} aria-label="${st.snapped[i]?"Ampoule "+(i+1)+" opened":"Press and hold to snap ampoule "+(i+1)+" open"}"><span class="amp-top" style="--pos:${i?"100%":"0%"}"></span><span class="amp-body" style="--pos:${i?"100%":"0%"}"></span><svg class="ring" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17"/></svg></button>`).join("")}</div>`;
   if(st.phase==="start") return `<div class="split"><div class="photo"><img src="${TXM("eq-txa-two-ampoules.webp")}" alt="Two TXA 500 mg/5 mL ampoules"></div><div><h3 class="q3">Two TXA 500 mg/5 mL ampoules. What first?</h3><div class="opts"><button class="opt" data-tx="dq-start"><span class="k">A</span>Double-check the medication with my colleague</button><button class="opt" data-tx="open-first"><span class="k">B</span>Open the ampoules</button></div></div></div>`;
   if(st.phase==="dq") return `<div class="split"><div class="photo"><img src="${TXM("eq-txa-two-ampoules.webp")}" alt="Two TXA ampoules"></div><div><h3 class="q3">Your colleague is about to read the ampoule label back to you. What should you expect to hear before you open it?</h3>${txOptsHTML("dq",st.dq,st)}</div></div>`;
   if(st.phase==="video") return `<div class="vid"><video id="txvid" src="${TXM("double-check.mp4")}" poster="${TXM("double-check-poster.jpg")}" controls playsinline preload="metadata" aria-label="Medication double-check video"></video></div>
     <div class="readlist"><span class="label">AP reads back</span><ul><li>${I.check}Drug name: Tranexamic acid 500 mg in 5 mL</li><li>${I.check}Clarity: clear and colourless, no particles</li><li>${I.check}Expiry: in date, not expired</li></ul></div>
     <p class="note" id="txvidnote">${st.watched?"Video watched.":"Watch the video to the end to confirm."}</p>`;
   if(st.phase==="snap") return `<h3 class="q3">Press and hold each ampoule to snap it open.</h3>${amps}<p class="note" style="text-align:center">Keyboard: focus an ampoule and hold Space.</p>`;
   if(st.phase==="draw") return `<h3 class="q3">Draw up 1 g TXA (2 × 5 mL = 10 mL) into the 50 mL syringe.</h3>
     ${txBench(st,{mode:"needle",fluid:"txa",target:st.amp===0?5:10,max:10,mg:v=>`${Math.round(v*100)} mg TXA`,gauge:v=>({t:`TXA in the syringe: <b>${Math.round(v*100)} mg</b> of 1000 mg`,ok:v>=10,pct:v*10,zone:94})})}
     ${st.amp===0&&st.rem[0]<=0?`<button class="btn" data-tx="amp2" style="justify-self:center">Move the needle to ampoule 2</button>`:""}`;
   if(st.phase==="inject") return `<div class="split"><div class="photo"><img src="${TXM("eq-50ml-syringe.webp")}" alt="50 mL syringe"></div><div><h3 class="q3">The 50 mL syringe now holds 10 mL (1 g) of TXA. What next?</h3>${txOptsHTML("inj",st.inj,st)}</div></div>`;
   return `<h3 class="q3">Push all 10 mL of TXA into the 90 mL bag through the medication port.</h3>
     ${txBench(st,{mode:"bag",fluid:"txa",push:true,bagOf:v=>100-v,streakOf:v=>(10-v)/10,target:0,max:10,gauge:v=>({t:v<=.05?"1 g TXA in 100 mL: <b>10 mg/mL</b>. Label it now, before mixing.":`TXA in the bag: <b>${Math.round((10-v)*100)} mg</b> of 1000 mg`,ok:v<=.05,pct:(10-v)*10,zone:94})})}`;},
  foot:(st)=>st.phase==="video"?`<button class="btn wide" id="txvidok" data-tx="vid-ok" ${st.watched?"":"disabled"}>Confirmed · back to the ampoules</button>`
   :st.phase==="snap"?(st.snapped[0]&&st.snapped[1]?`<button class="btn wide" data-tx="snap-done">Continue</button>`:"")
   :st.phase==="draw"?`<button class="btn wide" id="txconfirm" data-tx="draw-confirm" ${st.v>=10?"":"disabled"}>${st.confirmLabel(st.v)}</button>`
   :st.phase==="push"?`<button class="btn wide" id="txconfirm" data-tx="inj-done" ${st.v<=.05?"":"disabled"}>Continue to labelling</button>`:"",
  after:(st)=>{
   if(st.phase==="video"){const v=document.getElementById("txvid");if(v)v.addEventListener("ended",()=>{st.watched=true;const b=document.getElementById("txvidok");if(b)b.disabled=false;const n=document.getElementById("txvidnote");if(n)n.textContent="Video watched.";});}
   if(st.phase==="draw") txBindRig(()=>Math.min(10,(10-st.rem[0]-st.rem[1])+st.rem[st.amp]));
   if(st.phase==="push") txBindRig();
   if(st.phase==="snap") document.querySelectorAll(".amp:not([disabled])").forEach(b=>txBindHold(b,()=>{const i=+b.dataset.amp;st.snapped[i]=true;txSound("snap");drawPlayer(st.snapped[0]&&st.snapped[1]?".p-foot .btn":`.amp:not([disabled])`);}));
  },
  onV:(st,v)=>{ const drawn=v-(10-st.rem[0]-st.rem[1]); if(drawn!==0){st.rem[st.amp]=Math.min(5,Math.max(0,Math.round((st.rem[st.amp]-drawn)*10)/10));}
   if(st.phase!=="draw")return;[0,1].forEach(i=>{const r=document.getElementById("rig-a"+i);if(r){const h=st.rem[i]/5*92;r.setAttribute("y",210-h);r.setAttribute("height",h)}});
   if(st.amp===0&&st.rem[0]<=0&&!document.querySelector('[data-tx="amp2"]'))drawPlayer('[data-tx="amp2"]');},
  init2:null},

 label:{phases:["fill","attach"],
  init:(st,c)=>{st.vals={};},
  body:(st,c)=>{
   const photo=(vals)=>`<div class="labelphoto"><img src="${TXM("label.webp")}" alt="Tranexamic acid additive label on the 100 mL bag">${TX_LABEL.map(f=>`<span class="hand" id="txlab-${f.key}" style="left:${f.left}%;top:${f.top}%;width:${f.w}%;height:${f.h||2.4}%">${txEsc(vals[f.key]||"")}</span>`).join("")}</div>`;
   if(st.phase==="fill") return `<p class="lead">Fill in the additive label. Your entries appear on the label as you type.</p>
     <div class="labelgrid">${photo(st.vals)}<div class="labelform"><button class="btn ghost sm" data-tx="now">Use the current date and time</button>
      <div class="fields">${TX_LABEL.map(f=>`<label class="fld">${f.name}<span><input data-txin="lab:${f.key}" value="${txEsc(st.vals[f.key]||"")}" ${f.unit?'inputmode="decimal"':""} placeholder="${f.ph||""}"><em>${f.unit||""}</em></span></label>`).join("")}</div>
</div></div></div>`;
   return `<div class="attach">${photo(st.vals)}<p class="q3">Attaching the label to the bag…</p></div>`;},
  foot:(st)=>st.phase==="fill"?`<button class="btn wide" data-tx="label-confirm">Confirm label</button>`:"",
  after:(st)=>{ if(st.phase==="attach"&&!st.t){st.t=setTimeout(()=>{if(P&&P.sx===st)txOk("Bag labelled immediately: 1 g in 100 mL, 10 mg/mL.",{next:"END"});},1500);} }},

 mix:{phases:["mix"],
  init:(st)=>{st.turns=0;st.rot=0;st.acc=0;st.froth=false;},
  body:(st,c)=>{const lab=txLabelData(c);
   return `${txHero("mix-bag.webp","Stage 6","Mix gently")}
   <div class="mixzone" id="txmix" role="application" aria-label="Drag in a slow circle to turn the bag"><div class="mixbag" id="txmixbag" style="transform:rotate(${st.rot}deg)"><img src="${TXM("eq-nacl-100ml-bag.webp")}" alt="" draggable="false"><div class="sticker"><b>TRANEXAMIC ACID</b><span>${txEsc(lab.conc||"10")} mg/mL</span><small>${txEsc(lab.date||"")} ${txEsc(lab.time||"")} · ${txEsc(lab.weight||"")} kg</small></div><svg class="streaks" id="txstreak" viewBox="0 0 100 100" preserveAspectRatio="none" style="opacity:${Math.max(0,1-st.turns/3)}"><path d="M50 95 C40 75 62 60 48 40"/><path d="M50 95 C62 78 40 62 56 44"/><path d="M50 95 C46 80 58 70 44 55"/></svg>${st.froth?`<div class="froth"></div>`:""}</div></div>
   <div class="mixstat"><span>Gentle turns <b id="txturns">${st.turns}</b></span><button class="btn ghost sm" data-tx="turn">Turn once</button></div>`;},
  foot:()=>`<button class="btn wide" data-tx="mix-done">Mixing complete</button>`,
  after:(st)=>{const z=document.getElementById("txmix"),bag=document.getElementById("txmixbag");if(!z)return;let last=null;
   const ang=e=>{const r=z.getBoundingClientRect();return Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2))*180/Math.PI;};
   z.addEventListener("pointerdown",e=>{try{z.setPointerCapture(e.pointerId)}catch(_){}last={a:ang(e),t:performance.now()};});
   z.addEventListener("pointermove",e=>{if(!last)return;const a=ang(e);let d=a-last.a;if(d>180)d-=360;if(d<-180)d+=360;const now=performance.now(),dt=Math.max(1,now-last.t);last={a,t:now};
    if(Math.abs(d)/dt>1.6&&(!st.shookAt||now-st.shookAt>1500)){st.shookAt=now;st.froth=true;
      if(P.txMode==="guided"){last=null;txErr("Shook the bag vigorously","Turn the bag slowly and gently. Do not shake.","Vigorous shaking froths the solution and puts air bubbles into the bag and line.");return;}
      txNote("Shook the bag vigorously");}
    st.rot+=d;bag.style.transform=`rotate(${st.rot}deg)`;st.acc+=Math.abs(d);if(st.acc>=160){st.acc=0;txTurn(st);}});
   ["pointerup","pointercancel"].forEach(k=>z.addEventListener(k,()=>last=null));}},

 give:{phases:["rights","readback","draw","line","rate","infuse","doc"],
  init:(st,c)=>{st.rights=[];st.rb=txShuffle(txReadback(c));st.v=0;st.cap=50;st.bagBase=100;st.line=[];st.lineOrder=txShuffle([0,1,2]);st.left=600;st.speed=1;st.run=false;st.time="";},
  body:(st,c)=>{const r=c.row,dose=r.dose,give=r.volume,lab=txLabelData(c);
   const bag=`<div class="bagcard"><img src="${TXM("eq-nacl-100ml-bag.webp")}" alt="Labelled 100 mL bag"><div class="sticker"><b>TRANEXAMIC ACID</b><span>${txEsc(lab.conc||"10")} mg/mL</span><small>${txEsc(lab.date||"")} ${txEsc(lab.time||"")} · ${txEsc(lab.weight||"")} kg</small></div></div>`;
   if(st.phase==="rights") return `<div class="split"><div>${bag}</div><div><h3 class="q3">Cross-check the 5 medication rights with your colleague before drawing the dose.</h3><p class="note">Patient: ${c.name}, ${c.ageLabel}</p><div class="rights">${TX_RIGHTS.map(x=>`<button class="tog ${st.rights.includes(x)?"on":""}" data-tx="right" data-r="${x}" aria-pressed="${st.rights.includes(x)}"><i>${st.rights.includes(x)?I.check:""}</i>${x}</button>`).join("")}</div></div></div>`;
   if(st.phase==="readback") return `<div class="split"><div>${bag}</div><div><div class="mate"><img src="${txBust("pointing")}" alt="Crew mate" width="64" height="64"><div class="bubble"><p>Reading the labelled bag and the dose back to you. Which read-back is correct for ${c.name}?</p></div></div>${txOptsHTML("rb",st.rb,st)}</div></div>`;
   if(st.phase==="draw"){const tg=c.large?r.drawOut:r.volume;
     return `<h3 class="q3">${c.large?`Using the 50 mL syringe, draw OUT and discard ${r.drawOut} mL from the bag.`:`Using the 50 mL syringe, draw up the calculated dose of ${dose} mg from the bag.`}</h3>
     ${txBench(st,{mode:"bag",fluid:"txa",label:lab,bagOf:v=>100-v,target:tg,max:50,mg:c.large?(v=>`Bag left: ${(100-v).toFixed(1)} mL`):(v=>`${Math.round(v*10)} mg TXA`),
       gauge:c.large?(v=>({t:`Left to give after set compensation: <b>${Math.round(Math.max(0,90-v)*10)} mg</b> · dose ${dose} mg`,ok:Math.abs(v-tg)<.6,pct:50+(v-tg)/tg*50})):(v=>({t:`${v.toFixed(1)} mL = <b>${Math.round(v*10)} mg</b> · dose ${dose} mg`,ok:Math.abs(v-tg)<.6,pct:50+(v-tg)/tg*50}))})}`;}
   if(st.phase==="line") return `<h3 class="q3">Set up the administration line in the correct order. Tap each step in sequence.</h3>
     <div class="linegrid">${st.lineOrder.map(i=>{const L=TX_LINE[i],done=st.line.includes(i);return `<button class="lineitem ${done?"on":""}" data-tx="line" data-i="${i}" ${done?"disabled":""}>${L.img?`<img src="${TXM(L.img+".webp")}" alt="">`:`<span class="ph">${I.syringe}</span>`}<span>${done?`<b>${st.line.indexOf(i)+1}.</b> `:""}${L.t}</span></button>`}).join("")}</div>`;
   if(st.phase==="rate") return `<h3 class="q3">Over what duration should the ${give} mL be given?</h3><div class="rates">${[1,10,30,60].map(n=>`<button class="btn ghost" data-tx="rate" data-n="${n}">${n} min</button>`).join("")}</div>`;
   if(st.phase==="infuse"){const del=Math.round(give*(1-st.left/600)*10)/10;
    return `<div class="pump"><span class="label">Infusion · TXA 10 mg/mL · ${give} mL over 10 min</span><div class="pumpscreen"><b id="txclockbig">${txFmt(st.left)}</b><span id="txdel">Delivered ${del} / ${give} mL (${Math.round(del*10)} mg)</span><div class="bar"><i id="txinfbar" style="width:${(1-st.left/600)*100}%"></i></div></div>
     <div class="two"><button class="btn" data-tx="inf-run">${st.run?"Pause":st.left===600?"Start infusion":"Resume"}</button><button class="btn ghost" data-tx="inf-speed">Speed ${st.speed}×</button></div></div>`;}
   return `<div class="pump done"><span class="label">Infusion complete</span><p class="q3">Document the administration time on the PCR.</p><label class="fld">Time administered<span><input data-txin="time" value="${txEsc(st.time)}" placeholder="hh:mm"><em></em></span></label><button class="btn ghost sm" data-tx="time-now" style="justify-self:start">Use the current time</button></div>`;},
  foot:(st)=>st.phase==="rights"?`<button class="btn wide" data-tx="rights-ok">Confirm 5 Rights</button>`:st.phase==="draw"?`<button class="btn wide" id="txconfirm" data-tx="give-confirm">${P.txMode==="guided"?`Confirm ${st.v.toFixed(1)} mL`:"Confirm volume"}</button>`:st.phase==="doc"?`<button class="btn wide" data-tx="doc">Document &amp; continue</button>`:"",
  after:(st)=>{ if(st.phase==="draw") txBindRig(); }},

 dispose:{phases:["bin"],
  init:(st)=>{st.done=[];st.order=txShuffle(TX_BINS);},
  body:(st)=>`${txHero("sharps-disposal.webp","Stage 9","Dispose safely")}
   <div class="bins">${st.order.map(b=>{const d=st.done.find(x=>x.id===b.id);return `<div class="binitem ${d?"on":""}">${b.img?`<img src="${TXM(b.img+".webp")}" alt="">`:`<span class="ph">${I.cards}</span>`}<b>${b.name}</b>${d?`<span class="chip">${I.check} ${d.where==="sharps"?"Sharps bin":"General waste"}</span>`:`<div class="two"><button class="btn sm" data-tx="bin" data-id="${b.id}" data-w="sharps">Sharps bin</button><button class="btn ghost sm" data-tx="bin" data-id="${b.id}" data-w="general">General waste</button></div>`}</div>`}).join("")}</div>`}
};
