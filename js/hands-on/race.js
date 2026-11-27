/* ============================ RACE PRACTICE (step type "racebench") ============================
   Each step generates a new suspected-stroke patient. The step's onset sets the kind: "mid" (>8 to <24 h),
   "other" (≤8 h, ≥24 h or wake-up) or "any" (any of those, a hypoglycaemia mimic or a BEFAST-negative patient).
   Times are clock times: the learner works out the window from when the patient was last known well.
   The learner taps each test to examine the patient, then answers every row and checks.
   Item scores follow the RACE table (V.race) and the destination rule the decision tree (V.tree), CPG 3.1 pp.62–64.
   The functional descriptions (arm 10 s, leg 5 s, slight asymmetry = mild) come from the original RACE scale
   (Pérez de la Ossa et al., Stroke 2014) and are pending verification (step field pending).
   After a racebench, P.rbLast holds the patient so a following spot step with note:true can build the prenotification. */
const RB_WIN=["≤8 h",">8 to <24 h","≥24 h","Wake-up"];
const RB_STROKE=[
 {k:"win",t:"Last known well window",bins:RB_WIN},
 {k:"face",t:"Facial palsy",bins:["0","1","2"]},
 {k:"arm",t:"Arm motor",bins:["0","1","2"]},
 {k:"leg",t:"Leg motor",bins:["0","1","2"]},
 {k:"gaze",t:"Head and gaze deviation",bins:["0","1"]},
 {k:"test",t:"Cortical test to use",bins:["Aphasia","Agnosia"]},
 {k:"cort",t:"Aphasia or agnosia score",bins:["0","1","2"]},
 {k:"need",t:"Does RACE decide the destination?",bins:["Yes","No"]},
 {k:"dest",t:"Destination",bins:["P1 to HGH ED","P2 to nearest ED"]}];
const RB_MIMIC=[{k:"low",t:"RBS",bins:["Normal","Low: possible mimic"]},{k:"next",t:"Next step",bins:["Score RACE and transport P1","Treat the low RBS per CPG, then reassess"]}];
const RB_NEG=[{k:"bef",t:"BEFAST",bins:["Positive","Negative"]},{k:"dest",t:"Destination",bins:["P1 to HGH ED","P2 to nearest ED","Manage per condition"]}];
const rbRows=c=>c.kind==="mimic"?RB_MIMIC:c.kind==="neg"?RB_NEG:RB_STROKE;
const RB_RACE=["face","arm","leg","gaze","cort"];
const rbR=n=>Math.floor(Math.random()*n),rbP=a=>a[rbR(a.length)];
const rbClock=m=>{m=((m%1440)+1440)%1440;return String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0");};
const rbDay=m=>m>=0?"today":m>=-1440?"yesterday":"2 days ago";
// onset kinds: mid >8 to <24 h (RACE decides) · early ≤8 h · late ≥24 h · wake (wake-up, treated as acute) · mimic (low RBS) · neg (BEFAST negative)
function rbKind(o){const other=["early","late","wake"];return o==="mid"?"mid":o==="other"?rbP(other):rbP(["mid","mid","early","late","wake","mimic","neg"]);}
function rbCase(o,force){
  const kind=rbKind(o),right=Math.random()<.5,hi=force||Math.random()<.5;
  let c;do{c={face:rbR(3),arm:rbR(3),leg:rbR(3),gaze:rbR(2),cort:rbR(3)};c.total=c.face+c.arm+c.leg+c.gaze+c.cort;}while(hi?c.total<5:c.total>=5);
  if(kind==="mimic"&&c.arm===0)c.arm=1;
  Object.assign(c,{kind,right,test:right?0:1,male:Math.random()<.5,age:52+rbR(34),bp:`${150+rbR(10)*5}/${82+rbR(6)*4}`,rbs:kind==="mimic"?(2.1+rbR(9)/10).toFixed(1):(5.2+rbR(40)/10).toFixed(1),
   ac:rbP(["Takes apixaban","Takes warfarin","Takes rivaroxaban","No anticoagulants"]),eta:10+rbR(4)*5});
  const now=7*60+rbR(14*60);c.now=now;
  if(kind==="wake"){const bed=22*60+rbR(4)*20,wake=7*60+rbR(5)*15;c.lkwT=bed;c.wakeT=wake;c.now=wake+30+rbR(3)*10;
    c.story=`Went to bed well at ${rbClock(bed)} last night and woke at ${rbClock(wake)} with the symptoms.`;}
  else if(kind!=="neg"){
    const back=kind==="mid"?490+rbR(95)*10:kind==="late"?(Math.random()<.25?1440:1450+rbR(96)*10):kind==="early"?(Math.random()<.25?480:30+rbR(45)*10):30+rbR(30)*10;
    const lkw=now-back,seen=lkw+Math.max(10,Math.round(back*(.4+Math.random()*.5)/10)*10),who=rbP(["His daughter","A colleague","His son","A neighbour"]).replace("His",c.male?"His":"Her");
    c.h=back/60;c.lkwT=lkw;
    c.story=`${who} last saw ${c.male?"him":"her"} well ${rbDay(lkw)} at ${rbClock(lkw)} and noticed the symptoms ${rbDay(seen)} at ${rbClock(seen)}.`;}
  else c.story=`Headache since this morning. Called because ${c.male?"he":"she"} is worried about a stroke.`;
  c.win=kind==="wake"?3:kind==="mid"?1:kind==="late"?2:0;
  c.need=kind==="mid"?0:1;c.dest=kind==="mid"?(c.total>=5?0:1):kind==="late"?1:0;
  if(kind==="mimic"){c.low=1;c.next=1;}if(kind==="neg"){c.bef=1;c.dest=2;}
  return c;}
// the five tests (or BEFAST checks) the learner taps to examine the patient, and what each one shows
function rbExam(c){const s=c.right?"right":"left",S=c.right?"Right":"Left",away=c.right?"left":"right";
  if(c.kind==="neg") return [["Balance","Walks steadily, no dizziness"],["Eyes","Vision normal in both eyes"],["Smile","Smiles symmetrically"],["Arms up","Holds both arms up evenly"],["Speech","Speech clear"],["RBS",`${c.rbs} mmol/L`]];
  return [["Smile",[`Smiles symmetrically`,`Slight asymmetry of the ${s} side of the mouth when smiling`,rbP([`${S} lower face droops clearly when smiling`,`Can't move the ${s} lower face`])][c.face]],
   ["Arms up",[rbP([`Holds both arms up for 10 seconds`,`${S} arm drifts slightly but stays up for 10 seconds`]),`${S} arm lifts but falls before 10 seconds`,`Can't lift the ${s} arm against gravity`][c.arm]],
   ["Legs up",[rbP([`Holds both legs up for 5 seconds`,`${S} leg drifts slightly but stays up for 5 seconds`]),`${S} leg lifts but falls before 5 seconds`,`Can't lift the ${s} leg against gravity`][c.leg]],
   ["Head and eyes",["No head or eye deviation",`Head and eyes turned to the ${away}`][c.gaze]],
   ["Two tasks",c.right?[`"Close your eyes" and "Make a fist": does both`,`"Close your eyes" and "Make a fist": does only one`,`"Close your eyes" and "Make a fist": does neither`][c.cort]
     :[`Shown the weak arm: recognises the arm and the weakness`,`Shown the weak arm: doesn't recognise the arm, or doesn't recognise the weakness`,`Shown the weak arm: recognises neither the arm nor the weakness`][c.cort]],
   ["RBS",`${c.rbs} mmol/L`]];}
const rbWhen=c=>c.kind==="wake"?`Woke at ${rbClock(c.wakeT)} with the symptoms; last seen well going to bed at ${rbClock(c.lkwT)}`:c.kind==="neg"?"":`Last known well ${rbDay(c.lkwT)} ${rbClock(c.lkwT)}, now ${rbClock(c.now)}: ${Math.floor(c.h)} h ${Math.round((c.h%1)*60)} min`;
function rbExplain(c){
  if(c.kind==="mimic") return `RBS ${c.rbs} mmol/L is low. Hypoglycaemia can mimic a stroke: rule it out first. Treat it per CPG and reassess BEFAST; if the deficit persists, route by the decision tree.`;
  if(c.kind==="neg") return "No balance, eye, face, arm or speech change: BEFAST negative. Manage according to the clinical condition.";
  return `${rbWhen(c)}. Face ${c.face} + arm ${c.arm} + leg ${c.leg} + gaze ${c.gaze} + ${c.right?"aphasia":"agnosia"} ${c.cort} = <b>${c.total}</b>. ${c.right?"Right":"Left"} hemiparesis → ${c.right?"aphasia":"agnosia"}. ${c.ex.some(x=>/drifts slightly/.test(x[1]))?"A slight drift that still holds up scores 0 (normal/mild). ":""}`+
  ({mid:`>8 to <24 hours: RACE decides. RACE ${c.total>=5?"≥5: P1 to HGH ED with prenotification via CC:E":"<5: P2 to the nearest appropriate ED"}.`,
    early:`≤8 hours: RACE doesn't decide. P1 to HGH ED with prenotification via CC:E; include the RACE score if done.`,
    late:`≥24 hours: RACE doesn't decide. P2 to the nearest appropriate ED.`,
    wake:`Wake-up onset is treated as acute: RACE doesn't decide. P1 to HGH ED with prenotification via CC:E.`})[c.kind];}
function raceBody(s){
  if(!P.rb){P.rb=rbCase(s.onset,s.hi);P.rb.ex=rbExam(P.rb);P.rbSeen=[];P.rbLast=P.rb;}const c=P.rb,L=locked(),rows=rbRows(c);s.explain=rbExplain(c);
  const seen=P.rbSeen||[],all=L||seen.length===c.ex.length,pick=P.rbPick;
  const exam=`<div class="rb-exam" role="group" aria-label="Examine the patient">${c.ex.map(([b,f],i)=>seen.includes(i)||L?`<div class="rb-x done"><span>${b}</span><p>${f}</p></div>`:`<button class="rb-x" data-rbx="${i}"><span>${b}</span><p>Tap to check</p></button>`).join("")}</div>`;
  const sum=RB_RACE.reduce((a,k)=>a+(pick[k]??0),0),allR=RB_RACE.every(k=>pick[k]!==undefined);
  const rowsH=all?`<div class="sort rbs">${rows.map(r=>{const want=c[r.k],v=L?want:pick[r.k];let cls="";if(L)cls="right";else if(P.status==="wrong"&&pick[r.k]!==undefined)cls=pick[r.k]===want?"right":"wrong";
     return `<div class="srow ${cls}${r.bins.every(b=>String(b).length<=2)?" num":""}"><div class="ct">${r.t}</div><div class="bins" role="group" aria-label="${r.t}">${r.bins.map((b,i)=>`<button class="bin" data-rb="${r.k}" data-rbv="${i}" aria-pressed="${v===i}" ${L?"disabled":""}>${b}</button>`).join("")}</div></div>`}).join("")}</div>
   ${rows===RB_STROKE?`<p class="rb-total" aria-live="polite">Your RACE total: <b>${allR||L?(L?c.total:sum):"–"}</b> / 9</p>`:""}`:`<p class="note">Check every item to continue.</p>`;
  return `${badges(s)}<span class="label">${s.label||"RACE practice"}</span><h2>${c.kind==="neg"?"Assess and route this patient":"Examine, score and route this patient"}</h2>
   <div class="case"><span class="label">Case · ${c.male?"Male":"Female"}, ${c.age} · suspected stroke · now ${rbClock(c.now)}</span><p>${c.story}</p></div>
   ${exam}${rowsH}${L&&s.more?`<p style="text-align:center;margin-top:12px"><button class="btn ghost" data-rbmore="1">Another patient</button></p>`:""}${pendingBox(s.pending)}${srcLine({src:"CPG 3.1 pp.62–64"})}`;
}
const rbReady=()=>P.rb&&(P.rbSeen||[]).length===P.rb.ex.length&&rbRows(P.rb).every(r=>P.rbPick[r.k]!==undefined);
const rbEval=()=>rbRows(P.rb).every(r=>P.rbPick[r.k]===P.rb[r.k]);
document.addEventListener("click",e=>{const t=e.target.closest&&e.target.closest("[data-rbx],[data-rbmore]");if(!t||!P||!P.rb)return;
  if(t.dataset.rbmore){P.rb=null;P.rbPick={};P.rbSeen=[];P.status="idle";P.firstTry=false;drawPlayer();const pb=document.querySelector("#player .p-body");if(pb)pb.scrollTop=0;return;}
  if(locked())return;const i=+t.dataset.rbx;if(!P.rbSeen.includes(i))P.rbSeen.push(i);if(typeof txSound==="function")txSound("click");drawPlayer(P.rbSeen.length<P.rb.ex.length?`[data-rbx]`:`[data-rb]`);});
/* prenotification for the patient just scored (spot step with note:true; tiles with bad:true belong in it) */
function rbNote(){let c=P.rbLast;if(!c||c.kind!=="mid"||c.dest!==0){c=rbCase("mid",true);c.ex=rbExam(c);P.rbLast=c;}
  if(c.note)return c.note;const S=c.right?"right":"left",bef=[c.face?`${S} face`:"",c.arm?`${S} arm`:"",c.leg?`${S} leg`:"",c.right&&c.cort?"speech":""].filter(Boolean),ac=c.ac.replace("Takes ","");
  const tiles=[{k:"Age",v:`${c.male?"Male":"Female"}, ${c.age}`,bad:1},{k:"Last seen well",v:rbClock(c.lkwT),bad:1},{k:"BEFAST",v:bef.join(", ")||"positive",bad:1},{k:"RACE",v:c.total,u:"/ 9",bad:1},
   {k:"RBS",v:c.rbs,u:"mmol/L",bad:1},{k:"BP",v:c.bp,bad:1},{k:"Anticoagulant",v:ac==="No anticoagulants"?"None":ac,bad:1},{k:"ETA",v:c.eta,u:"min",bad:1},
   {k:"Home address",v:"Zone 38",why:"Not on the prenotification list"},{k:"Occupation",v:"Retired",why:"Not on the prenotification list"},{k:"Past surgery",v:"Appendix",why:"Not on the prenotification list"},{k:"Next of kin",v:c.male?"Wife":"Husband",why:"Not on the prenotification list"}];
  for(let i=tiles.length-1;i>0;i--){const j=rbR(i+1);[tiles[i],tiles[j]]=[tiles[j],tiles[i]];}
  c.note={tiles,msg:`CC:E, stroke prenotification for HGH ED: ${c.male?"male":"female"}, ${c.age}. Last seen well ${rbClock(c.lkwT)}. BEFAST positive: ${bef.join(", ")}. RACE ${c.total}. RBS ${c.rbs} mmol/L. BP ${c.bp}. ${c.ac==="No anticoagulants"?"No anticoagulants":"On "+ac}. ETA ${c.eta} minutes.`};return c.note;}
