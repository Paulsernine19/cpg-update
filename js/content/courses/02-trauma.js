// Extrication decision (CPG 10.13 pp.200–202): four drivers through the same flowchart, each ending at a different method.
// Methods: immediate (snatch) extrication; rapid extrication with gentle handling (also called manual extrication: hard neurological signs,
// or unable to follow instructions / stand on at least one leg); assisted self-extrication (gentle support and guidance only); self-extrication (U-STEP Out).
// Option text kept the same for every driver; the deciding question differs.
// mk = colour key (css .mk-*), sh = short name on the driver strip and route chart, x = branch label on the flowchart
const XT_M=[{t:"Immediate (snatch) extrication",mk:"imm",ic:"pull",sh:"Immediate",x:"immediate extrication"},{t:"Rapid extrication with gentle handling",mk:"rap",ic:"stretcher",sh:"Rapid",x:"rapid extrication"},
 {t:"Assisted self-extrication with gentle support",mk:"ast",ic:"move",sh:"Assisted",x:"assisted self-extrication"},{t:"Self-extrication guided by U-STEP Out",mk:"self",ic:"exit",sh:"Self",x:"self-extrication"}];
const XT_Q={s:["Immediate threat to life?","Is there an immediate threat to life, or is the patient unconscious with absent or ineffective breathing?"],
 a:["Follows instructions?","Can the patient understand and follow instructions?"],
 b:["Stands on one leg?","Can they stand on at least one leg?"],
 c:["Hard neurological signs?","Any hard neurological signs (loss of motor and sensory function)?"],
 d:["Gets out unaided?","Can they get out on their own, with guidance only?"]};
// branch that leaves the flowchart at each question (shown on the map once answered)
const XT_EXIT={s:{Yes:0},a:{No:1},b:{No:1},c:{Yes:1},d:{No:2,Yes:3}},XT_D=[];
// d: {n, pic, after, afterCap, case, facts, path:[[node,"yes"|"no",ev,why]...], m: correct method index, mWhy:[why per method], end}
const xtWalk=d=>{XT_D.push(d);const nodes={},ids=d.path.map(p=>p[0]);d.path.forEach(([id,yes,ev,why],i)=>{const to=i<ids.length-1?ids[i+1]:"m",
  Y={t:"Yes",ic:"yes"},N={t:"No",ic:"no"},ok=yes?Y:N,bad=yes?N:Y;ok.to=to;bad.why=why;{const k=XT_EXIT[id][bad.t];bad.alt=`If ${bad.t.toLowerCase()}: ${k===undefined?"next question":XT_M[k].x}`;if(k!==undefined)bad.amk=XT_M[k].mk;}if(ev!==undefined)bad.ev=ev;nodes[id]={short:XT_Q[id][0],q:XT_Q[id][1],opts:[N,Y].map(o=>o)};});
  nodes.m={short:"Method",q:"Which extrication method?",opts:XT_M.map(({t,ic,mk},i)=>i===d.m?{t,ic,mk,to:"e"}:{t,ic,mk,why:d.mWhy[i]})};
  nodes.e={end:d.end,tone:"p1",mk:XT_M[d.m].mk,ic:XT_M[d.m].ic};
  return {type:"walk",group:"xt",mk:XT_M[d.m].mk,gl:XT_M[d.m].sh,pic:d.pic,after:d.after,afterCap:d.afterCap,label:`Interactive algorithm · Driver ${d.n} of 4`,title:"Work through the extrication decision",scope:"AP",case:d.case,facts:d.facts,ref:"trauma-3",start:ids[0],nodes,src:d.src};};
const XT_DRIVERS=[
 xtWalk({n:1,pic:"driver-window",after:"self-extrication",afterCap:"Self-extrication: guided by voice, supported only if needed.",
  case:"Side-impact collision. Alert driver with back pain and tingling in the left hand that doesn't follow a nerve pathway. Follows instructions, can stand on both legs and gets up without help.",
  facts:["Side impact","Alert driver","Back pain","Tingling in one hand, not along a nerve pathway","Follows instructions","Can stand on both legs","Gets up without help"],
  path:[["s",0,1,"Check the case: the driver is alert and talking."],["a",1,4,"Check the case: the driver follows instructions."],["b",1,5,"Check the case: the driver can stand on both legs."],["c",0,3,"Non-dermatomal tingling is a soft sign. Hard signs are loss of motor and sensory function."],["d",1,6,"Check the case: the driver gets up without help."]],
  m:3,mWhy:["There's no immediate threat to life and the driver is breathing normally.","There are no hard neurological signs and no contraindication. Tingling that doesn't follow a nerve pathway is a soft sign.","The driver gets up without help, so they can get out on their own with guidance only."],
  end:"Self-extrication, guided by U-STEP Out. Back pain and soft neurological signs don't rule it out. Stop if any clinical concern appears.",src:"CPG 10.13 pp.200–201"}),
 xtWalk({n:2,pic:"driver-window",
  case:"Rear-end collision. Alert driver who follows instructions, with no neurological signs. The right ankle is painful and swollen. They can stand on the left leg but can't get up from the seat without help.",
  facts:["Rear-end collision","Alert driver","Follows instructions","Painful, swollen right ankle","Can stand on the left leg","No neurological signs","Can't get up from the seat without help"],
  path:[["s",0,1,"Check the case: the driver is alert."],["a",1,2,"Check the case: the driver follows instructions."],["b",1,4,"Check the case: the driver can stand on the left leg."],["c",0,5,"Check the case: there are no neurological signs."],["d",0,6,"Check the case: the driver can't get up from the seat without help."]],
  m:2,mWhy:["The driver is alert with no immediate threat to life.","There are no hard neurological signs, and the driver follows instructions and can stand on one leg. Rapid extrication isn't needed.",null,"The driver can't get up without help, so they can't self-extricate independently. Give gentle support and guidance."],
  end:"Assisted self-extrication: gentle support and guidance only, for example an arm to help them to their feet, or holding their belt for extra stability. It doesn't involve dragging or uncontrolled lifting.",src:"CPG 10.13 p.200"}),
 xtWalk({n:3,pic:"cant-feel-legs",
  case:"Head-on collision. Alert driver who follows instructions. They can't move or feel the right leg, but can stand on the left leg. Moderate neck pain.",
  facts:["Head-on collision","Alert driver","Follows instructions","Can't move or feel the right leg","Can stand on the left leg","Neck pain"],
  path:[["s",0,1,"Check the case: the driver is alert."],["a",1,2,"Check the case: the driver follows instructions."],["b",1,4,"Check the case: the driver can stand on the left leg."],["c",1,3,"Loss of movement and feeling in a limb is loss of motor and sensory function: a hard neurological sign."]],
  m:1,mWhy:["The driver is alert with no immediate threat to life.",null,"Hard neurological signs rule out self-extrication, with or without assistance.","Hard neurological signs rule out self-extrication."],
  end:"Rapid extrication with gentle handling (manual extrication). Hard neurological signs (loss of motor and sensory function) rule out self-extrication. Use the combi-carrier or trauma board and a rigid c-collar as extrication devices; consider removing both once the patient is on the stretcher.",src:"CPG 10.13 pp.200, 202"}),
 xtWalk({n:4,pic:"unconscious",
  case:"High-speed collision. The driver is slumped against the seat belt with eyes closed. Breathing is slow and noisy, with poor chest movement.",
  facts:["High-speed collision","Slumped, eyes closed","Slow, noisy breathing","Poor chest movement"],
  path:[["s",1,3,"Unconscious with ineffective breathing is an immediate threat to life."]],
  m:0,mWhy:[null,"Unconscious with ineffective breathing is an immediate threat to life. It needs immediate extrication.","Assisted self-extrication needs a cooperative patient. This driver is unconscious.","U-STEP Out is only for suitable, cooperative casualties. This driver is unconscious."],
  end:"Immediate (snatch) extrication. Unconscious with ineffective breathing is an immediate threat to life.",src:"CPG 10.13 pp.200–201"})];
// route chart for the summary: one column per driver, coloured line down to the question where they leave the flowchart
const XT_CUE=["Soft signs","Needs help up","One leg","Unconscious"];
Object.defineProperty(V,"xtroutes",{get:()=>`<div class="xr" role="table" aria-label="Route of each driver through the extrication decision"><div class="xr-r xr-h" role="row"><span role="columnheader"></span>${XT_D.map((d,j)=>`<span class="xr-d mk-${XT_M[d.m].mk}" role="columnheader"><b>${d.n}</b>${XT_CUE[j]}</span>`).join("")}</div>
${Object.keys(XT_Q).map((q,r)=>`<div class="xr-r" role="row"><span class="xr-q" role="rowheader">${XT_Q[q][0]}</span>${XT_D.map(d=>{const k=d.path.findIndex(p=>p[0]===q),last=k===d.path.length-1,M=XT_M[d.m];
  return k<0?`<span class="xr-c" role="cell"></span>`:`<span class="xr-c on mk-${M.mk}${k===0?" first":""}${last?" exit":""}" role="cell"><i>${d.path[k][1]?"Yes":"No"}</i>${last?`<em>${WICX(M.ic)}${M.sh}</em>`:""}</span>`;}).join("")}</div>`).join("")}</div>`});
COURSES.push(
 { id:"trauma", title:"Trauma", category:"Module 1", hue:"--c-trauma", icon:"trauma", minutes:45, requires:["intro"],
   desc:"Extrication, the changed TXA indications, hands-on paediatric TXA preparation, seat belt sign bypass, and spinal or neurogenic shock.",
   coverage:"CPG 10.1, 10.2, 10.3, 10.4–10.7, 10.10, 10.11, 10.13 · TXA formulary · obstetric TXA crossover 12.1–12.4",
   units:[
    {title:"Extrication", lessons:[
     {id:"tr-1", title:"Trapped Patient Case", steps:[
      {type:"read", pic:"arrival", title:"Two-car collision", scope:"AP", body:"You arrive at a two-car collision on a main road. Civil Defence are on scene. One driver is still seated in the vehicle."},
      {type:"choice", pic:"driver-window", after:"self-extrication", afterCap:"Self-extrication: guided by voice, supported only if needed.", label:"Case · before the update", scope:"AP", prompt:"Road traffic collision. The driver is alert, has neck pain, follows instructions and says they can stand. You find no neurological deficit. What is your first-choice extrication approach?",
       options:["Full immobilised extraction because of the neck pain","Self-extrication or minimally assisted extrication","Leave the patient in the vehicle until the pain settles"], answer:1,
       fb:["Neck or back pain is no longer a reason for an immobilised extraction. Self-extrication is now first line unless there's a contraindication.",null,"Trapped patients are time critical. Extricate as soon as possible."],
       explain:"CPG 10.13 is new. Self-extrication or minimal assistance is now first line for every patient without a contraindication, including neck or back pain, soft neurological signs and children who can follow instructions. <b>Contraindications:</b> unable to follow instructions, or unable to stand on at least one leg.", src:"CPG 10.13 p.200"},
      {type:"sort", label:"Sort the patients", scope:"AP", prompt:"Self-extrication first line, or contraindicated?", bins:["Self-extrication first line","Contraindicated"],
       cards:[{t:"Adult with neck pain who follows instructions and can stand",b:0},{t:"9-year-old who follows instructions and can stand",b:0},{t:"Tingling in one hand that doesn't follow a nerve pathway (non-dermatomal tingling)",b:0},{t:"Weakness or burning pain in the arms and hands, worse than in the legs (signs of central cord syndrome)",b:0},{t:"Confused and unable to follow instructions",b:1},{t:"Unable to stand on at least one leg",b:1}],
       explain:"Neck or back pain, soft neurological signs such as non-dermatomal tingling, signs of central cord syndrome and children who can follow instructions are all in the self-extrication group. Contraindications: unable to understand or follow instructions, or unable to stand on at least one leg.", src:"CPG 10.13 p.200"},
      ...XT_DRIVERS,
      {type:"read", title:"Four drivers, four routes", scope:"AP", body:"The same CPG 10.13 decisions, in the same order, led each driver to a different extrication method. Patients who can't follow instructions or can't stand on at least one leg also need rapid extrication with gentle handling (manual extrication), using the combi-carrier or trauma board and a rigid c-collar. Consider removing both once the patient is on the stretcher.", visual:"xtroutes", src:"CPG 10.13 pp.200–202"},
      {type:"multi", pic:"door-cut", label:"While trapped", scope:"AP", prompt:"An alert driver with no neurological deficit is trapped while Civil Defence cut the car. Which interventions should be performed at this time?",
       options:["Haemorrhage control","TXA if indicated","Analgesia (Penthrox or ketamine) to help extrication","Manual in-line stabilisation until they are out","Full head-to-toe assessment","Repeated full sets of vital signs","Psychological support, with an extrication buddy if possible"], answer:[0,1,2,6],
       explain:"Limit care to critical interventions: haemorrhage control, TXA if indicated and analgesia to facilitate extrication, plus psychological support. Keep monitoring minimal; do the full head-to-toe once they're out. Manual in-line stabilisation isn't required in the vehicle for a fully conscious patient with no neurological deficit.", src:"CPG 10.13 pp.200–202"}
     ]},
     {id:"tr-2", title:"U-STEP Out", steps:[
      {type:"read", title:"The U-STEP Out tool", scope:"AP", stepper:"ustep", body:"Trapped patients are at higher risk of serious illness and death than those who can self-extricate, so keep entrapment short. U-STEP Out guides self-extrication in suitable, cooperative casualties.", src:"CPG 10.13 pp.200–201"},
      {type:"walk", hideNext:true, pic:"driver-window", after:"to-stretcher", afterCap:"Out of the vehicle and seated on the stretcher.", label:"Guide the casualty", title:"Talk them out, step by step", scope:"AP",
       case:"Alert driver with neck pain who follows instructions and can stand on both legs. Self-extrication is suitable.", facts:["Alert driver","Neck pain","Follows instructions","Can stand on both legs"], ref:"trauma-3", start:"u",
       nodes:{u:{short:"U · Understand",q:"You're at the driver's window. What do you say first?",opts:[{t:"“Can you wind down the window or give me a thumbs up?”",ic:"talk",to:"s"},{t:"“Move both legs for me, nice and slowly.”",ic:"move",why:"That's Try moving (step 3). First check they understand you: ask them to wind down the window or give a thumbs up."},{t:"“Right, step out of the car for me now.”",ic:"exit",why:"That's the last step (Out). Start by checking they understand you."}]},
              s:{short:"S · Support",q:"<i>They give you a thumbs up.</i> What next?",opts:[{t:"“You're safe. I'll talk you through every move.”",ic:"talk",to:"t"},{t:"“Move both legs for me, nice and slowly.”",ic:"move",why:"That's Try moving (step 3). Support comes first: reassure them and explain how you'll keep them safe."},{t:"Apply a collar and lift them onto the stretcher",ic:"lift",why:"Self-extrication doesn't involve lifting. Support means reassurance and explanation, in language they understand."}]},
              t:{short:"T · Try moving",q:"<i>They're calmer and listening.</i> What next?",opts:[{t:"“Move both legs for me, nice and slowly.”",ic:"move",to:"e"},{t:"“Right, step out of the car for me now.”",ic:"exit",why:"Check they can move both legs first (Try moving). If they can't, they won't be able to self-extricate."},{t:"Bring the stretcher right up to the door",ic:"stretcher",why:"That's Plan (step 5). First check they can move both legs."}]},
              e:{short:"E · Egress",q:"<i>They move both legs easily.</i> What next?",opts:[{t:"Open the door fully and clear any obstructions",ic:"door",to:"p"},{t:"“Right, step out of the car for me now.”",ic:"exit",why:"Clear the exit first (Egress): door fully open and obstructions out of the way."},{t:"Bring the stretcher right up to the door",ic:"stretcher",why:"Clear the exit first (Egress), then plan where they'll go."}]},
              p:{short:"P · Plan",q:"<i>The exit is clear.</i> What next?",opts:[{t:"Place a chair or stretcher close to the vehicle",ic:"stretcher",to:"o"},{t:"“Right, step out of the car for me now.”",ic:"exit",why:"Plan first: where will they go? A chair or stretcher, close to the vehicle."},{t:"Agree the hospital destination with your crew",ic:"hospital",why:"Plan the immediate next place: a chair or stretcher, close to the vehicle."}]},
              o:{short:"Out",q:"<i>The stretcher is beside the door.</i> How do they get out?",opts:[{t:"“Step out for me. I'll support you if needed.”",ic:"exit",to:"w"},{t:"Hold their arms and pull them out of the vehicle",ic:"pull",why:"Never drag or lift the casualty. Ask them to step out, supporting only if required."},{t:"Slide them out of the vehicle onto a long board",ic:"board",why:"Self-extrication doesn't involve lifting or sliding. Ask them to step out, supporting only if required."}]},
              w:{short:"What if",q:"What if a different driver can't move their left leg at Try moving?",opts:[{t:"Stop: they can't self-extricate",ic:"stop",to:"x"},{t:"Lift the leg out of the footwell for them",ic:"lift",why:"If they can't move both legs themselves, they won't be able to self-extricate. Stop."},{t:"Carry on, supporting them as they step out",ic:"exit",why:"If they can't move both legs, they won't be able to self-extricate. Stop."}]},
              x:{end:"Out and on the stretcher. A rigid collar can be used as an extrication aid; consider removing it once they're on the stretcher. Apply SMR if indicated. If they can't move both legs, stop: they can't self-extricate.",tone:"p1"}},
       src:"CPG 10.13 pp.201–202"},
     ]},
     {id:"tr-cd", title:"Working with Civil Defence", steps:[
      {type:"choice", pic:"door-cut", story:"Mechanical entrapment: a car has hit a barrier. The driver is alert and talking, with both legs pinned under the dashboard. Civil Defence are stabilising the car and preparing to cut the door.", label:"First contact", scope:"AP", prompt:"You arrive as Civil Defence start work on the car. Who starts the coordination between the two teams?",
       options:["You do: introduce yourself to the Civil Defence lead","The Civil Defence lead, once they are ready to brief you","Your control centre, by radio, before you reach the car"], answer:0,
       fb:[null,"Don't wait to be briefed. HMCAS crews establish communication and coordination with Civil Defence: take the first step.","Coordination happens face to face at the vehicle. Go to the Civil Defence lead and introduce yourself."],
       explain:"Establish communication and coordination with Civil Defence: take the first step on every job. Introduce yourself to the lead, share the patient's condition and agree how you will work together.", src:"CPG 10.13 p.201"},
      {type:"multi", pic:"door-cut", label:"Coordinate", scope:"AP", prompt:"You meet the Civil Defence lead at the vehicle. Which of these should you communicate and coordinate with them?",
       options:["The patient's clinical condition and your concerns","Any need for an immediate extrication","Any need to place a rescue buddy in the vehicle","A brief pause in cutting for a lifesaving intervention","Any safety concerns you see on scene","A pause in cutting for a full head-to-toe assessment"], answer:[0,1,2,3,4],
       explain:"Establish communication and coordination with Civil Defence to relay the patient's condition or concerns, any need for immediate extrication, any need for a rescue buddy, a brief pause for a lifesaving or time-critical intervention, and safety concerns. The full head-to-toe assessment waits until the patient is out.", src:"CPG 10.13 pp.201–202"},
      {type:"choice", pic:"door-cut", label:"Extrication buddy", scope:"AP", prompt:"The driver is frightened by the noise of the cutting. Civil Defence offer to place a rescuer inside the car with them. What applies?",
       options:["Agree it with Civil Defence; the buddy wears PPE and explains each step","Decline: nobody should be inside the car while it is being cut","Agree, and ask the buddy to take over the patient's monitoring"], answer:0,
       fb:[null,"An extrication buddy should be considered and coordinated with Civil Defence. They wear appropriate PPE and stay with the patient.","The buddy's role is psychological support: explaining the extrication, what is happening, and reassuring the patient."],
       explain:"Consider an extrication buddy, coordinated with Civil Defence. The buddy must wear appropriate PPE. Their role is psychological support: explaining the extrication process and what is happening, and reassuring the patient.", src:"CPG 10.13 p.200"},
      {type:"multi", pic:"door-cut", label:"Plan ahead", scope:"AP", prompt:"Civil Defence expect the door to be off in about ten minutes. What should your crew prepare meanwhile?",
       options:["Stretcher and SMR equipment, ready and close by","IV fluids prepared and hanging in the ambulance","RSI set up, if it is likely to be needed","Equipment for lifesaving interventions once out","Full monitoring attached, with repeated vital signs","A full head-to-toe assessment inside the vehicle"], answer:[0,1,2,3],
       explain:"Forward planning reduces scene time: have the stretcher and SMR equipment ready, prepare IVs, set up for RSI if likely, and be ready to perform lifesaving interventions as soon as the patient is out. Keep monitoring to what informs immediate decisions, and do the head-to-toe after extrication.", src:"CPG 10.13 pp.202–203"},
      {type:"choice", pic:"door-cut", label:"Case changes", scope:"AP", prompt:"During cutting, a wound on the driver's thigh starts bleeding heavily. You need to control it now. What do you do?",
       options:["Ask Civil Defence for a brief pause, control the bleeding, then resume","Keep the cutting going and control the bleeding once the patient is out","Reach in and control it while cutting continues, without telling them"], answer:0,
       fb:[null,"Haemorrhage control is a critical intervention during entrapment. Ask Civil Defence for a brief pause to perform it.","Working in the vehicle while cutting continues is a safety risk. Coordinate a brief pause with Civil Defence first."],
       explain:"Ask Civil Defence for a brief pause in rescue efforts to perform a lifesaving or time-critical intervention. Haemorrhage control and TXA, if indicated, are critical interventions while trapped.", src:"CPG 10.13 pp.200–201"},
      {type:"choice", pic:"unconscious", label:"Case changes", scope:"AP", prompt:"The door is still being cut. The driver becomes unresponsive, with slow and ineffective breathing. What do you tell Civil Defence?",
       options:["That you now need an immediate extrication","To continue the planned cut while you monitor","To stop all work until the breathing improves"], answer:0,
       fb:[null,"Unconscious with ineffective breathing is an immediate threat to life. Tell Civil Defence you need an immediate extrication.","Waiting delays care. Unconscious with ineffective breathing needs an immediate extrication."],
       explain:"Tell Civil Defence immediately when there is a need for immediate extrication. Unconscious with absent or ineffective breathing is an indication for immediate extrication.", src:"CPG 10.13 p.201", story:""}
     ]}
    ]},
    {title:"Tranexamic acid (TXA)", lessons:[
     {id:"tr-3", title:"TXA Indications", steps:[
      {type:"choice", label:"Case", scope:"AP", prompt:"A 7-year-old fell 40 minutes ago. Isolated head injury, GCS 10. You're the AP on scene. TXA?",
       options:["No. APs give TXA to adults only","Yes. Isolated TBI with GCS ≤12 qualifies","No. Paediatric TXA is for CCPs only"], answer:1,
       fb:["That was v2.5. Paediatric IV TXA is now within AP scope.",null,"In v2.5, paediatric TXA was CCP only and for haemorrhage. v2.6 brings it into AP scope and adds isolated TBI with GCS ≤12."],
       explain:"A child under 14 with major trauma less than 3 hours old and isolated TBI with GCS ≤12 meets the indication. Check the contraindications first.", src:"Formulary TXA v2.6 p.392 (v2.5 p.377) · HMCAS Paediatric IV TXA poster"},
      {type:"read", title:"Paediatric TXA indications", scope:"AP", body:"Child under 14 with <b>major trauma less than 3 hours old</b>, and either:",
       points:["Suspected or confirmed major haemorrhage","Isolated traumatic brain injury with <b>GCS ≤12</b>","<b>Contraindications:</b> TXA hypersensitivity · injury over 3 hours old · significant blood loss unlikely"],
       src:"HMCAS Paediatric IV TXA poster · Circular rows 12–18, 20, 27–28"},
      {type:"walk", label:"Interactive algorithm", title:"Decide on TXA", scope:"AP",
       case:"8-year-old pedestrian struck by a car 50 minutes ago. Pale and mottled, cap refill 4 s, tender distended abdomen. GCS 14. No known allergies.",
       facts:["8 years old","Struck by a car 50 minutes ago","Pale, mottled, cap refill 4 s","Tender, distended abdomen","GCS 14","No known allergies"], ref:"trauma-5", start:"a",
       nodes:{a:{short:"Under 14?",q:"Is the patient under 14 years old?",opts:[{t:"Yes",ic:"yes",to:"b"},{t:"No",ic:"no",ev:0,why:"Check the case: the patient is 8 years old."}]},
              b:{short:"Major trauma under 3 hours?",q:"Is this major trauma less than 3 hours old?",opts:[{t:"Yes",ic:"yes",to:"c"},{t:"No",ic:"no",ev:1,why:"Check the case: the injury was 50 minutes ago."}]},
              c:{short:"Which indication?",q:"Which indication applies?",opts:[{t:"Suspected major haemorrhage",ic:"drop",to:"d"},{t:"Isolated TBI with GCS ≤12",ic:"brain",ev:4,why:"No head injury is described and GCS is 14. The signs point to internal bleeding."},{t:"Neither: TXA not indicated",ic:"no",ev:2,why:"Pale, mottled skin, slow capillary refill and a tender, distended abdomen suggest major haemorrhage."}]},
              d:{short:"Any contraindication?",q:"Any contraindication: TXA hypersensitivity, injury over 3 hours old, or significant blood loss unlikely?",opts:[{t:"No",ic:"no",to:"e"},{t:"Yes",ic:"yes",ev:5,why:"Check the case: no known allergies, the injury is 50 minutes old and significant blood loss is likely."}]},
              e:{end:"Give TXA. 15 mg/kg from the chart, given over 10 minutes. Within AP scope.",tone:"p1"}},
       src:"HMCAS Paediatric IV TXA poster"},
      {type:"sort", label:"Sort the cases", scope:"AP", prompt:"Give or withhold TXA?", bins:["Give TXA","Withhold TXA"],
       cards:[{t:"5 years, pelvic injury 2 hours 45 minutes ago, pale and tachycardic",b:0,why:"Suspected major haemorrhage, still under 3 hours: give."},
        {t:"9 years, isolated head injury 1 hour ago, GCS 12",b:0,why:"TBI with GCS ≤12: GCS 12 qualifies. Give."},
        {t:"4 years, abdominal injury 3 hours 15 minutes ago, suspected internal bleeding",b:1,why:"Injury over 3 hours old: withhold."},
        {t:"7 years, closed wrist fracture, haemodynamically normal",b:1,why:"Significant blood loss unlikely: withhold."},
        {t:"10 years, major haemorrhage, previous anaphylaxis to TXA",b:1,why:"Hypersensitivity to TXA: withhold."},
        {t:"11 years, isolated head injury 30 minutes ago, GCS 14",b:1,why:"GCS above 12 with no major haemorrhage: TXA not indicated."}],
       explain:"Give (under 14 years, injury under 3 hours): suspected or confirmed major haemorrhage, or TBI with GCS ≤12. Withhold: injury over 3 hours old, significant blood loss unlikely, or hypersensitivity to TXA.", src:"CPG TXA formulary p.392 · HMCAS Paediatric IV TXA poster"},
      {type:"choice", label:"Why withhold?", scope:"AP", prompt:"An 8-year-old fell from a scooter 5 hours ago and the parents called late. Abdominal bruising, mild tachycardia. Why is TXA withheld?",
       options:["After 3 hours TXA no longer helps and may cause harm","Paediatric TXA is only for isolated head injury with GCS ≤12","Mild tachycardia in a child is not a sign of bleeding"], answer:0,
       fb:[null,"Suspected or confirmed major haemorrhage is also an indication. What rules TXA out here is the time since injury.","Time is the deciding factor here. An injury more than 3 hours old is a contraindication."],
       explain:"Injury more than 3 hours old is a contraindication. Beyond that window TXA no longer helps and may increase the risk of death from bleeding.", src:"HMCAS Paediatric IV TXA poster · HMCAS paediatric TXA preparation activity"},
      {type:"sort", label:"Sort the cards", scope:"AP", prompt:"Is TXA an indication in v2.6?", bins:["TXA indication","Not a TXA indication"],
       cards:[{t:"Postpartum haemorrhage",b:0},{t:"Ectopic pregnancy with bleeding",b:1},{t:"Miscarriage",b:1},{t:"Placental abruption",b:1},{t:"Placenta praevia",b:1}],
       explain:"PPH is the only obstetric TXA indication (CPG 12.1–12.4). TXA was removed from the abruption, praevia, ectopic and miscarriage algorithms; this does not reduce the urgency of haemorrhage care.", src:"Formulary TXA v2.6 p.392 (v2.5 p.377) · Circular rows 22–25, 29"}
     ]},
     {id:"tr-4", title:"TXA Dose Chart", steps:[
      {type:"scrub", scrub:"txa", label:"Explore", scope:"AP"},
      {type:"chartpick", label:"Try it", scope:"AP", age:4, col:"dose", prompt:"A 4-year-old meets the TXA criteria. Tap their row on the chart to find the dose.", explain:"The 4-year row gives 16 kg → 240 mg.", src:"HMCAS Paediatric IV TXA poster"},
      {type:"read", title:"How the chart works", scope:"AP", body:"The dose is <b>15 mg/kg</b>, using the chart's estimated weight for age. With 1 g in the 100 mL bag the concentration is <b>10 mg/mL</b>, so volume (mL) = dose (mg) ÷ 10. Give over 10 minutes.", src:"HMCAS Paediatric IV TXA poster"},
      {type:"input", label:"Practice", scope:"AP", prompt:"What volume does that 4-year-old (240 mg) need from the 10 mg/mL bag?", answer:"24", unit:"mL",
       fbv:{"240":"240 is the dose in mg. The question asks for the volume in mL: divide by 10 mg/mL.","2.4":"At 10 mg/mL, every 10 mg is 1 mL: 240 ÷ 10.","100":"The whole 100 mL bag holds 1 g, far more than this child's 240 mg dose."},
       explain:"240 mg ÷ 10 mg/mL = 24 mL, given over 10 minutes.", src:"HMCAS Paediatric IV TXA poster"},
      {type:"choice", label:"Practice · give", scope:"AP", prompt:"The 4-year-old's 24 mL is drawn up from the bag into the 50 mL syringe. How do you give it?",
       options:["From the syringe through the three-way tap, over 10 minutes","Through a giving set from the bag, over 10 minutes","From the syringe through the three-way tap, over 1 minute"], answer:0,
       fb:[null,"Under 8 years and under 30 kg, the dose is drawn up and given from the syringe. The bag holds 1 g: running it through a giving set risks giving far more than the dose.","TXA is given over 10 minutes. A rapid push can drop the child's blood pressure."],
       explain:"Under 8 years: draw the chart volume up into the syringe and give it through the three-way tap over 10 minutes. From 8 years or over 30 kg, the remaining volume in the bag is given through the giving set instead.", src:"HMCAS Paediatric IV TXA poster"},
      {type:"chain", label:"Practice · baby", scope:"AP", intro:"For babies aged 0–12 months, estimate the weight: <b>(age in months × 0.5) + 4</b>.", prompt:"An 8-month-old baby meets the criteria. Work through the calculation.",
       fields:[{lab:"Estimated weight",expr:"(8 × 0.5) + 4",answer:8,unit:"kg",fbv:{"4":"Add the 4: (8 × 0.5) + 4.","6":"Multiply the months by 0.5 first, then add 4: (8 × 0.5) + 4."}},
               {lab:"Dose",expr:"8 kg × 15 mg/kg",answer:120,unit:"mg",fbv:{"80":"The dose is 15 mg/kg, not 10 mg/kg: 8 × 15.","12":"Multiply the weight by 15 mg/kg: 8 × 15."}},
               {lab:"Volume",expr:"120 mg ÷ 10 mg/mL",answer:12,unit:"mL",fbv:{"120":"120 is the dose in mg. Divide by 10 mg/mL for the volume.","1.2":"At 10 mg/mL: 120 ÷ 10."}}],
       explain:"(8 × 0.5) + 4 = 8 kg → 8 × 15 = 120 mg → 120 ÷ 10 = 12 mL, given over 10 minutes.", src:"HMCAS Paediatric IV TXA poster"},
      {type:"scrub", scrub:"txabag", label:"Try it", scope:"AP"},
      {type:"choice", label:"Case · put it together", scope:"AP", story:"Hana, 9 years. Fell from a second-floor balcony 1 hour ago. Open femur fracture with active bleeding, cool peripheries, GCS 13.",
       prompt:"Is TXA indicated for Hana?", options:["Yes, for suspected major haemorrhage","No, a fracture alone isn't an indication","No, GCS 13 is above the threshold"], answer:0,
       fb:[null,"Active bleeding with cool peripheries suggests major haemorrhage. That is the indication, not the fracture itself.","GCS ≤12 is the threshold for isolated TBI. Here the indication is suspected major haemorrhage."],
       explain:"Under 14, major trauma 1 hour ago, suspected major haemorrhage and no contraindication: TXA is indicated.", src:"HMCAS Paediatric IV TXA poster"},
      {type:"chartpick", label:"Case · dose", scope:"AP", age:9, col:"drawOut", prompt:"Hana is 9. Tap her row: how much do you draw out and discard?", explain:"9 years: 34 kg, 500 mg. Draw out and discard 40 mL.", src:"HMCAS Paediatric IV TXA poster"},
      {type:"choice", label:"Case · give", scope:"AP", prompt:"You've drawn out and discarded 40 mL. How do you give Hana's dose?",
       options:["Give the remaining 60 mL over 10 minutes","Give the remaining 60 mL as a 1-minute push","Draw up 50 mL in a syringe, give over 10 minutes"], answer:0,
       fb:[null,"TXA is given over 10 minutes. A rapid push can drop the child's blood pressure.","From 8 years or over 30 kg you don't draw the dose up. Give the remaining volume through the set: it includes 10 mL to compensate for the set."],
       explain:"The remaining 60 mL is Hana's 50 mL dose plus 10 mL to compensate for the administration set. Give it over 10 minutes.", src:"HMCAS Paediatric IV TXA poster"}
     ]},
    ]},
    {title:"TXA preparation: hands-on", lessons:[
     {id:"tx-v", title:"Watch: TXA Preparation", steps:[{type:"watch",title:"Paediatric TXA preparation",scope:"AP",body:"Watch this video before you prepare and give TXA yourself in the hands-on lessons.",src:null,src2:"HMCAS video"}]},
     {id:"tx-g", title:"Guided Preparation", scene:true, steps:[{type:"stage",stage:"tray"}]},
     {id:"tx-10", title:"Solo Run", scene:true, txRun:true, steps:[{type:"stage",stage:"tray",case:"run"}]}
    ]},
    {title:"Destination and spinal", lessons:[
     {id:"tr-5", title:"Seat Belt Sign Bypass", steps:[
      {type:"choice", pic:"seatbelt-sign", label:"Case", scope:"AP", prompt:"A restrained driver has bruising across the abdomen from the seat belt. Vital signs are currently within normal limits. What does v2.6 add to your destination decision?",
       options:["It is now a bypass criterion: apply CPG 10.10","It only matters if the patient becomes hypotensive","Nothing: seat belt injuries are managed as before"], answer:0,
       fb:[null,"Normal vital signs don't remove the new criterion. Check the bypass criteria in CPG 10.10.","The abdominal seat belt sign is a new bypass criterion in v2.6."],
       explain:"The abdominal seat belt sign is now a bypass criterion. The full destination decision follows approved CPG 10.10.", src:"Circular row 19 · Summary p.4"}
     ]},
     {id:"tr-6", title:"Spinal & Neurogenic Shock", steps:[
      {type:"choice", label:"Case", scope:"AP", prompt:"A motorcyclist with a suspected spinal injury is hypotensive and has a possible pelvic injury. Which MAP target applies?",
       options:["85–90 mmHg, because it's a spinal injury","≥65 mmHg, because it's combined shock","No target until the CCP arrives"], answer:1,
       fb:["85–90 mmHg is for isolated neurogenic shock. A possible pelvic bleed makes this combined shock.",null,"Manage hypotension now within AP scope and request a CCP."],
       explain:"Combined haemorrhagic and neurogenic shock: aim for MAP ≥65 mmHg. Manage the haemorrhage per its CPG and escalate for vasopressors.", src:"CPG 10.3 p.178"},
      {type:"read", title:"Two shock patterns, two targets", scope:"AP", body:"Rule out other causes of shock first, such as major haemorrhage and TBI.",
       points:["<b>Isolated</b> spinal cord injury with neurogenic shock: MAP <b>85–90 mmHg</b>","<b>Combined</b> haemorrhagic and neurogenic shock: MAP <b>≥65 mmHg</b>","Avoid hypotension. Give fluids judiciously and avoid overload"], src:"CPG 10.3 p.178"},
      {type:"match", label:"Definitions", scope:"AP", prompt:"Match each type of shock to its definition.",
       pairs:[{term:"Spinal shock",def:"Temporary loss or depression of most spinal reflex activity below the level of the injury"},{term:"Neurogenic shock",def:"Hypotension with bradycardia after spinal cord injury, from loss of sympathetic nerve tone"},{term:"Hypovolaemic shock",def:"Low circulating volume from dehydration or non-traumatic blood loss, such as an obstetric emergency"}],
       explain:"Spinal shock is a reflex response below the injury. Neurogenic shock is a circulatory problem with hypotension and bradycardia. Hypovolaemic shock comes from fluid or blood loss, so other causes of shock must be ruled out in a spinal patient.", src:"CPG 10.3 pp.176–178 · CPG 6.5 p.122"},
      {type:"choice", label:"Case changes", scope:"AP", prompt:"Isolated spinal cord injury after a dive into shallow water, with neurogenic shock. No other injuries found. Which MAP target?",
       options:["MAP 85–90 mmHg","MAP ≥65 mmHg","MAP 70–80 mmHg"], answer:0,
       fb:[null,"≥65 mmHg is for combined haemorrhagic and neurogenic shock. With an isolated cord injury the target is higher.","70–80 mmHg is the adult target for isolated TBI (CPG 10.2). Isolated neurogenic shock: 85–90 mmHg."],
       explain:"Isolated spinal cord injury with neurogenic shock: maintain MAP 85–90 mmHg.", src:"CPG 10.3 p.178 · CPG 10.2 p.174"},
      {type:"read", title:"CCPs: vasopressors and airway", scope:"CCP", points:["Noradrenaline is the preferred vasopressor for adults. Add an adrenaline infusion if bradycardia and hypotension persist","Consider early intubation for high spinal injury (C1–4) with airway or breathing compromise, maintaining in-line stabilisation"], src:"CPG 10.3 pp.177–178"},
      {type:"read", pic:"stretcher-blocks", title:"Spinal motion restriction", scope:"AP",
       points:["Rigid collar: size it correctly, and remove it if it causes discomfort or distress","Combi-carrier: mainly for extrication or carrying. Consider removing it on the stretcher; keep the unconscious patient on it","<b>Head blocks always</b>, on the board or the stretcher"], src:"CPG 10.3 p.178"},
     ]},
     {id:"tr-7", title:"Hands-on: On the Stretcher", scene:"smr", steps:[{type:"stage",stage:"smr"},{type:"stage",stage:"smr",variant:"unc"}]}
    ]},
    {title:"Module check", lessons:[{id:"tr-x", title:"Trauma Check", mode:"exit", bank:"trauma"}]}
   ]},

);
