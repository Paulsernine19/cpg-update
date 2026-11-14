/* ============================ RACE PRACTICE (step type "racebench") ============================
   Each step generates a new BEFAST-positive patient in the >8 to <24-hour window. The learner picks the
   cortical test, scores each RACE item and chooses the destination. Item wording follows the RACE table
   (V.race) and the destination rule follows the decision tree (V.tree), both CPG 3.1 pp.63–64. */
const RB_ROWS=[
 {k:"face",t:"Facial palsy",bins:["0","1","2"]},
 {k:"arm",t:"Arm motor",bins:["0","1","2"]},
 {k:"leg",t:"Leg motor",bins:["0","1","2"]},
 {k:"gaze",t:"Head and gaze deviation",bins:["0","1"]},
 {k:"test",t:"Cortical test to use",bins:["Aphasia","Agnosia"]},
 {k:"cort",t:"Aphasia or agnosia score",bins:["0","1","2"]},
 {k:"dest",t:"Destination",bins:["P1 to HGH ED","P2 to nearest ED"]}];
const rbR=n=>Math.floor(Math.random()*n);
function rbCase(){
  const right=Math.random()<.5,hi=Math.random()<.5; // aim for an even mix of RACE ≥5 and <5
  let c;do{c={face:rbR(3),arm:rbR(3),leg:rbR(3),gaze:rbR(2),cort:rbR(3)};c.total=c.face+c.arm+c.leg+c.gaze+c.cort;}while(hi?c.total<5:c.total>=5);
  c.right=right;c.test=right?0:1;c.h=9+rbR(15);c.dest=c.total>=5?0:1;return c;}
function rbFindings(c){const side=c.right?"right":"left",away=c.right?"left":"right";
  return [["No facial droop","Mild facial droop",Math.random()<.5?"Moderate facial droop":"Severe facial droop"][c.face],
   [`Normal ${side} arm strength`,`Moderate ${side} arm weakness`,`Severe ${side} arm weakness`][c.arm],
   [`Normal ${side} leg strength`,`Moderate ${side} leg weakness`,`Severe ${side} leg weakness`][c.leg],
   ["No head or gaze deviation",`Head and eyes deviated to the ${away}`][c.gaze],
   c.right?["Performs both commands (\"Close your eyes\", \"Make a fist\")","Performs only one of the two commands","Performs neither command"][c.cort]
     :["Recognises the weak arm and the weakness","Doesn't recognise the arm, or doesn't recognise the weakness","Recognises neither the arm nor the weakness"][c.cort]];}
const rbExplain=c=>`Face ${c.face} + arm ${c.arm} + leg ${c.leg} + gaze ${c.gaze} + ${c.right?"aphasia":"agnosia"} ${c.cort} = <b>${c.total}</b>. ${c.right?"Right":"Left"} hemiparesis → ${c.right?"aphasia":"agnosia"}. Last known well ${c.h} hours ago with RACE ${c.total>=5?"≥5: P1 to HGH ED with prenotification via CC:E":"<5: P2 to the nearest appropriate ED"}.`;
function raceBody(s){
  if(!P.rb){P.rb=rbCase();P.rb.find=rbFindings(P.rb);}const c=P.rb,L=locked();s.explain=rbExplain(c);
  const pick=P.rbPick,sum=["face","arm","leg","gaze","cort"].reduce((a,k)=>a+(pick[k]??0),0),all=["face","arm","leg","gaze","cort"].every(k=>pick[k]!==undefined);
  return `${badges(s)}<span class="label">${s.label||"RACE practice"}</span><h2>Score this patient</h2>
   <div class="case"><span class="label">Case · BEFAST positive · last known well ${c.h} hours ago</span><p><b>${c.right?"Right":"Left"}-sided weakness.</b></p><ul class="rb-find">${c.find.map(f=>`<li>${f}</li>`).join("")}</ul></div>
   <div class="sort">${RB_ROWS.map(r=>{const want=c[r.k],v=L?want:pick[r.k];let cls="";if(L)cls="right";else if(P.status==="wrong"&&pick[r.k]!==undefined)cls=pick[r.k]===want?"right":"wrong";
     return `<div class="srow ${cls}"><div class="ct">${r.t}</div><div class="bins" role="group" aria-label="${r.t}">${r.bins.map((b,i)=>`<button class="bin" data-rb="${r.k}" data-rbv="${i}" aria-pressed="${v===i}" ${L?"disabled":""}>${b}</button>`).join("")}</div></div>`}).join("")}</div>
   <p class="rb-total" aria-live="polite">Your RACE total: <b>${all||L?(L?c.total:sum):"–"}</b> / 9</p>${srcLine({src:"CPG 3.1 pp.63–64"})}`;
}
const rbReady=()=>RB_ROWS.every(r=>P.rbPick[r.k]!==undefined);
const rbEval=()=>RB_ROWS.every(r=>P.rbPick[r.k]===P.rb[r.k]);
