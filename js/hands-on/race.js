/* ============================ RACE PRACTICE (step type "racebench") ============================
   Each step generates a new BEFAST-positive patient. The step's onset sets the time window: "mid" (>8 to <24 h),
   "other" (≤8 h, ≥24 h or wake-up) or "any". The learner picks the cortical test, scores each RACE item, decides
   whether RACE decides the destination, then chooses it. Item wording follows the RACE table
   (V.race) and the destination rule follows the decision tree (V.tree), both CPG 3.1 pp.63–64. */
const RB_ROWS=[
 {k:"face",t:"Facial palsy",bins:["0","1","2"]},
 {k:"arm",t:"Arm motor",bins:["0","1","2"]},
 {k:"leg",t:"Leg motor",bins:["0","1","2"]},
 {k:"gaze",t:"Head and gaze deviation",bins:["0","1"]},
 {k:"test",t:"Cortical test to use",bins:["Aphasia","Agnosia"]},
 {k:"cort",t:"Aphasia or agnosia score",bins:["0","1","2"]},
 {k:"need",t:"Does RACE decide the destination?",bins:["Yes","No"]},
 {k:"dest",t:"Destination",bins:["P1 to HGH ED","P2 to nearest ED"]}];
const rbR=n=>Math.floor(Math.random()*n);
// onset kinds: mid >8 to <24 h (RACE decides) · early ≤8 h · late ≥24 h · wake (unknown onset, treated as acute)
function rbKind(o){const other=["early","late","wake"];return o==="mid"?"mid":o==="other"?other[rbR(3)]:["mid","mid",...other][rbR(5)];}
function rbCase(o){
  const right=Math.random()<.5,hi=Math.random()<.5; // aim for an even mix of RACE ≥5 and <5
  let c;do{c={face:rbR(3),arm:rbR(3),leg:rbR(3),gaze:rbR(2),cort:rbR(3)};c.total=c.face+c.arm+c.leg+c.gaze+c.cort;}while(hi?c.total<5:c.total>=5);
  c.right=right;c.test=right?0:1;c.kind=rbKind(o);
  c.h=c.kind==="mid"?9+rbR(15):c.kind==="early"?1+rbR(8):c.kind==="late"?24+rbR(25):null;
  c.need=c.kind==="mid"?0:1;c.dest=c.kind==="mid"?(c.total>=5?0:1):c.kind==="late"?1:0;return c;}
const rbOnset=c=>c.kind==="wake"?"woke up with the symptoms · onset unknown":`last known well ${c.h} hour${c.h===1?"":"s"} ago`;
function rbFindings(c){const side=c.right?"right":"left",away=c.right?"left":"right";
  return [["No facial droop","Mild facial droop",Math.random()<.5?"Moderate facial droop":"Severe facial droop"][c.face],
   [`Normal ${side} arm strength`,`Moderate ${side} arm weakness`,`Severe ${side} arm weakness`][c.arm],
   [`Normal ${side} leg strength`,`Moderate ${side} leg weakness`,`Severe ${side} leg weakness`][c.leg],
   ["No head or gaze deviation",`Head and eyes deviated to the ${away}`][c.gaze],
   c.right?["Performs both commands (\"Close your eyes\", \"Make a fist\")","Performs only one of the two commands","Performs neither command"][c.cort]
     :["Recognises the weak arm and the weakness","Doesn't recognise the arm, or doesn't recognise the weakness","Recognises neither the arm nor the weakness"][c.cort]];}
const rbExplain=c=>`Face ${c.face} + arm ${c.arm} + leg ${c.leg} + gaze ${c.gaze} + ${c.right?"aphasia":"agnosia"} ${c.cort} = <b>${c.total}</b>. ${c.right?"Right":"Left"} hemiparesis → ${c.right?"aphasia":"agnosia"}. `+
  ({mid:`Last known well ${c.h} hours ago (>8 to <24 hours): RACE decides. RACE ${c.total>=5?"≥5: P1 to HGH ED with prenotification via CC:E":"<5: P2 to the nearest appropriate ED"}.`,
    early:`Last known well ${c.h} hour${c.h===1?"":"s"} ago (≤8 hours): RACE doesn't decide. P1 to HGH ED with prenotification via CC:E; include the RACE score if done.`,
    late:`Last known well ${c.h} hours ago (≥24 hours): RACE doesn't decide. P2 to the nearest appropriate ED.`,
    wake:`Wake-up or unknown onset is treated as acute: RACE doesn't decide. P1 to HGH ED with prenotification via CC:E.`})[c.kind];
function raceBody(s){
  if(!P.rb){P.rb=rbCase(s.onset);P.rb.find=rbFindings(P.rb);}const c=P.rb,L=locked();s.explain=rbExplain(c);
  const pick=P.rbPick,sum=["face","arm","leg","gaze","cort"].reduce((a,k)=>a+(pick[k]??0),0),all=["face","arm","leg","gaze","cort"].every(k=>pick[k]!==undefined);
  return `${badges(s)}<span class="label">${s.label||"RACE practice"}</span><h2>Score and route this patient</h2>
   <div class="case"><span class="label">Case · BEFAST positive · ${rbOnset(c)}</span><p><b>${c.right?"Right":"Left"}-sided weakness.</b></p><ul class="rb-find">${c.find.map(f=>`<li>${f}</li>`).join("")}</ul></div>
   <div class="sort rbs">${RB_ROWS.map(r=>{const want=c[r.k],v=L?want:pick[r.k];let cls="";if(L)cls="right";else if(P.status==="wrong"&&pick[r.k]!==undefined)cls=pick[r.k]===want?"right":"wrong";
     return `<div class="srow ${cls}${r.bins.every(b=>String(b).length<=2)?" num":""}"><div class="ct">${r.t}</div><div class="bins" role="group" aria-label="${r.t}">${r.bins.map((b,i)=>`<button class="bin" data-rb="${r.k}" data-rbv="${i}" aria-pressed="${v===i}" ${L?"disabled":""}>${b}</button>`).join("")}</div></div>`}).join("")}</div>
   <p class="rb-total" aria-live="polite">Your RACE total: <b>${all||L?(L?c.total:sum):"–"}</b> / 9</p>${srcLine({src:"CPG 3.1 pp.63–64"})}`;
}
const rbReady=()=>RB_ROWS.every(r=>P.rbPick[r.k]!==undefined);
const rbEval=()=>RB_ROWS.every(r=>P.rbPick[r.k]===P.rb[r.k]);
