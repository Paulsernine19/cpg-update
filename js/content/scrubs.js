/* =====================================================================
   INTERACTIVE DIAGRAMS (lesson step type "scrub")
   The learner moves a slider and the diagram updates. Every value shown here is
   already in the approved course content; the cited page is in `src`.
   Use in a lesson: {type:"scrub", scrub:"arrest", scope:"AP"}
   Fields: title, intro, controls (array, or a function returning one, if it needs
   data from a later file such as TX_CHART), view(values) → HTML,
   goal (optional task that must be met to continue), src.
   ===================================================================== */
const scFmt=n=>String(Math.round(n*100)/100);
const scCard=(lab,val,tone)=>`<div class="sc-card ${tone||""}"><span class="label">${lab}</span><b>${val}</b></div>`;
const SCRUB={
 arrest:{title:"Run the shockable arrest",
  intro:"Adult medical arrest, shockable rhythm that persists. Move through the shocks and see what is due after each one.",
  controls:[{k:"n",label:"Shocks delivered",min:1,max:7,step:1,val:1,fmt:v=>`Shock ${v}`}],
  view:v=>{const n=v.n,due=n===3?["Adrenaline · first dose","Amiodarone 300 mg"]:n===5?["Adrenaline · repeat","Amiodarone 150 mg"]:n>=7&&n%2?["Adrenaline · repeat"]:[];
   const adr=n>=3?Math.floor((n-3)/2)+1:0,amio=n>=5?"300 + 150 mg":n>=3?"300 mg":"none yet";
   return `<div class="sc-track">${[1,2,3,4,5,6,7].map(i=>`<i class="${i<n?"past":i===n?"now":""} ${i===3||i===5?"key":""}">${i}</i>`).join("")}</div>
    <div class="sc-due ${due.length?"on":""}"><span class="label">After shock ${n}</span>${due.length?`<b>${due.join(" · ")}</b>`:`<b>Nothing due. Continue 2 minutes of CPR.</b>`}</div>
    <div class="sc-cards">${scCard("Adrenaline doses so far",adr)}${scCard("Amiodarone so far",amio)}</div>
    <p class="note">Rhythm check every 2 minutes. Adrenaline repeats every 4 minutes, which is every second cycle.</p>`},
  goal:{text:"Move to the shock after which the second amiodarone dose is due.",test:v=>v.n===5,done:"Amiodarone 150 mg is due after the fifth shock, together with the repeat adrenaline."},
  src:"CPG 2.1 · Summary p.1"},

 txa:{title:"Paediatric TXA by age",
  intro:"The dose is <b>15 mg/kg</b>, using the chart's estimated weight for age. With 1 g in the 100 mL bag the concentration is <b>10 mg/mL</b>, so volume (mL) = dose (mg) ÷ 10. Give over 10 minutes. Move through the ages to see the weight, dose, volume and method change.",
  controls:()=>{const rows=[...Array.from({length:11},(_,i)=>({m:i+1})),...TX_CHART.filter(r=>r.age<14)];
   return [{k:"i",label:"Age",min:0,max:rows.length-1,step:1,val:12,rows,fmt:i=>rows[i].m?`${rows[i].m} month${rows[i].m>1?"s":""}`:`${rows[i].age} year${rows[i].age>1?"s":""}`}]},
  view:(v,C)=>{const r=C[0].rows[v.i];
   if(r.m){const w=r.m*0.5+4,d=w*15;return `<div class="sc-cards">${scCard("Estimated weight",`${scFmt(w)} kg`)}${scCard("Dose · 15 mg/kg",`${scFmt(d)} mg`)}${scCard("Volume · 10 mg/mL",`${scFmt(d/10)} mL`)}</div>
     <div class="sc-due on"><span class="label">0–12 months · use the formula</span><b>(${r.m} × 0.5) + 4 = ${scFmt(w)} kg</b></div>`;}
   const big=r.drawOut!=null;
   return `<div class="sc-cards">${scCard("Chart weight",`${r.weight} kg`)}${scCard("Dose · 15 mg/kg",`${r.dose} mg`)}${scCard("Volume · 10 mg/mL",`${r.volume} mL`)}</div>
    <div class="sc-due on ${big?"alt":""}"><span class="label">${big?"8 years and over":"Under 8 years"}</span><b>${big?`Draw out and discard ${r.drawOut} mL, then give the remaining volume over 10 minutes`:`Draw ${r.volume} mL from the bag and give it over 10 minutes`}</b></div>`},
  goal:{text:"Find the youngest age where the method changes to draw out and discard.",test:(v,C)=>C[0].rows[v.i].age===8,done:"From 8 years (or over 30 kg) you draw out and discard the chart volume, then give the rest."},
  src:"HMCAS Paediatric IV TXA poster"},

 // aged 8+ or over 30 kg: the learner sets how much to draw out of the 1 g / 100 mL bag; what stays in is the dose plus 10 mL set compensation
 txabag:{title:"Aged 8 and over: draw out and discard",
  intro:"Don't draw the dose up. With 1 g in the 100 mL bag, <b>draw out and discard</b> the chart volume, then give the <b>remaining volume</b> over 10 minutes. The remainder includes 10 mL to compensate for the administration set.",
  controls:()=>[{k:"x",label:"Drawn out and discarded",min:0,max:60,step:1,val:0,row:TX_CHART.find(r=>r.age===10),fmt:v=>`${v} mL`}],
  view:(v,C,res)=>{const r=C[0].row,left=100-v.x,dose=Math.max(0,left-10)*10,y=ml=>20+200*(1-ml/100),ok=res==="ok";
   const fy=ml=>258-2*ml,lab=(yy,t,c)=>`<path d="M484 ${yy}h22" class="bagp-ld ${c}"/><text x="510" y="${yy+4}" class="bagp-l ${c}">${t}</text>`;
   return `<div class="bagv"><svg viewBox="318 8 302 300" class="bag-svg bagp" role="img" aria-label="100 mL bag: ${v.x} mL drawn out, ${left} mL left">
     <image href="tx/wb/bag.webp" x="320" y="13.8" width="191" height="286.6" preserveAspectRatio="none"/>
     <clipPath id="bagpClip"><rect x="350" y="36" width="130" height="224" rx="12"/></clipPath>
     <g clip-path="url(#bagpClip)">
      ${v.x>0?`<rect x="345" y="${fy(100)}" width="140" height="${2*v.x}" class="bagp-out"/>`:""}
      <rect x="345" y="${fy(left)}" width="140" height="${Math.max(0,fy(10)-fy(left))}" class="bagp-dose"/>
      <rect x="345" y="${fy(10)}" width="140" height="${262-fy(10)}" class="bagp-set"/>
      <path d="M350 ${fy(left)}h130" class="bagp-men"/></g>
     ${[20,40,60,80,100].map(m=>`<path d="M350 ${fy(m)}h9" class="bagp-tick"/><text x="347" y="${fy(m)+3}" text-anchor="end" class="bagp-t">${m}</text>`).join("")}
     ${v.x>=8?lab((fy(100)+fy(left))/2,`${v.x} mL out`,"out"):""}
     ${left>=18?lab((fy(left)+fy(10))/2,`${left-10} mL dose`,"dose"):""}
     ${lab(fy(5),"10 mL set","set")}
    </svg><div class="sc-cards">${scCard("Child","10 years · 37 kg")}${scCard("Chart dose",`${r.dose} mg`)}${scCard("Left in the bag",`${left} mL`)}${res?scCard("Dose given",`${dose} mg`,ok?"good":"bad"):""}</div></div>
    ${res?`<div class="sc-due on ${ok?"":"alt"}"><span class="label">${ok?"Correct volume":"Not the right volume"}</span><b>${ok?`${left} mL left: the ${r.volume} mL dose plus 10 mL for the set. Give over 10 minutes.`:`${left} mL left gives ${dose} mg once the 10 mL set compensation is allowed for. The dose is ${r.dose} mg. Draw out ${dose>r.dose?"more":"less"}, then confirm again.`}</b></div>`:`<p class="note">Set the volume to draw out, then confirm.</p>`}`},
  confirm:true,
  goal:{text:"A 10-year-old needs 550 mg. Set how much to draw out and discard, then confirm.",test:(v,C)=>v.x===C[0].row.drawOut,done:"35 mL drawn out and discarded. The remaining 65 mL is the 55 mL dose plus 10 mL to compensate for the administration set."},
  src:"HMCAS Paediatric IV TXA poster"},

 stroke:{title:"Route the stroke patient",
  intro:"BEFAST positive. Set when the patient was last known well and the RACE score, and see which branch of the decision tree applies.",
  controls:[{k:"h",label:"Last known well",min:0,max:30,step:1,val:4,fmt:v=>`${v} hour${v===1?"":"s"} ago`},{k:"r",label:"RACE score",min:0,max:9,step:1,val:6,fmt:v=>`${v} / 9`}],
  view:v=>{const h=v.h,mid=h>8&&h<24,b=h<=8?0:mid?(v.r>=5?1:2):3,p1=b<2;
   const rows=[["≤ 8 hours","P1 to HGH ED · prenotify via CC:E","p1"],["> 8 to < 24 hours, RACE ≥ 5","P1 to HGH ED · prenotify via CC:E","p1"],["> 8 to < 24 hours, RACE < 5","P2 to nearest appropriate ED","p2"],["≥ 24 hours","P2 to nearest appropriate ED","p2"]];
   return `<div class="sc-due on ${p1?"":"alt"}"><span class="label">Destination</span><b>${rows[b][1]}</b></div>
    <p class="note">${mid?`RACE decides the destination in this window.`:`RACE does not change the destination here. Include it in the prenotification if done.`}</p>
    <div class="tree sc-tree">${rows.map((x,i)=>`<div class="branch ${i===b?"on":""}"><div class="if">${x[0]}</div><div class="${x[2]}">${x[1]}</div></div>`).join("")}</div>
    <p class="note">Wake-up or unknown-onset stroke is treated as acute: P1 to HGH ED with prenotification.</p>`},
  goal:{text:"Find a patient who is under 24 hours but still goes P2.",test:v=>v.h>8&&v.h<24&&v.r<5,done:"In the >8 to <24-hour window, RACE below 5 means P2 to the nearest appropriate ED."},
  src:"CPG 3.1 p.64"},

 newborn:{title:"Newborn heart rate and targets",
  intro:"Set the heart rate and SpO₂ and see how each threshold applies.",
  controls:[{k:"hr",label:"Heart rate",min:0,max:180,step:5,val:120,fmt:v=>`${v} /min`},{k:"sp",label:"SpO₂",min:40,max:100,step:1,val:75,fmt:v=>`${v}%`}],
  view:v=>{const hr=v.hr,band=hr>100?["Satisfactory",""]:hr>=60?["May need intervention","mid"]:["Needs intervention","bad"],comp=hr<60,met=v.sp>80&&hr>100;
   return `<div class="sc-cards">${scCard("Assessment at birth",band[0],band[1])}${scCard("After 30 s of ventilation",comp?"Start compressions":"Compressions not indicated",comp?"bad":"")}${scCard("Targets by 5 minutes",met?"Met":"Not yet met",met?"good":"mid")}</div>
    ${comp?`<div class="sc-due on alt"><span class="label">HR &lt; 60 after 30 s of BVM ventilation</span><b>Compressions 3:1, two-thumb, oxygen up to 100%. Reassess every 30 seconds.</b></div>`:""}
    <p class="note">Targets by 5 minutes: SpO₂ &gt;80% and HR &gt;100. Bradycardia is usually due to hypoxia, so effective ventilation comes first.</p>`},
  goal:{text:"Lower the heart rate to the point where compressions start.",test:v=>v.hr<60,done:"Compressions start if the HR stays below 60 after 30 seconds of effective ventilation."},
  src:"CPG 2.5 pp.51–52"}
};
