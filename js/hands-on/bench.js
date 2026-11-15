/* ============================ TXA PREPARATION BENCH ============================
   A lesson with bench:true runs all its preparation stages on one workbench that stays on screen.
   The kit sits on the bench and changes as each stage is completed; the stage itself (from TXS in txa.js,
   same checks and feedback) opens as a tool panel over the bench, and feedback floats at the bottom.
   Placeholder art: current equipment photos (tx/eq-*). Final art: a top-down bench photo + top-down cut-outs.
   Guided bench lessons remember the stage reached (S.benchAt) so leaving halfway resumes there. */
const BENCH_KIT=[
 {id:"bag",img:"eq-nacl-100ml-bag.webp",name:"0.9% NaCl 100 mL",tag:d=>d.mix?"Mixed":d.label?"Labelled":d.drawup?"1 g in 100 mL":d.room?"90 mL":"100 mL",on:d=>d.room},
 {id:"amp",img:"eq-txa-two-ampoules.webp",name:"TXA 500 mg/5 mL × 2",tag:d=>d.drawup?"Opened · in sharps":"Closed",used:d=>d.drawup},
 {id:"syr",img:"eq-50ml-syringe.webp",name:"50 mL syringe",tag:d=>d.give?"Dose given":d.drawup?"TXA added":"Empty",on:d=>d.drawup&&!d.give},
 {id:"lab",img:"eq-additive-label.webp",name:"Additive label",tag:d=>d.label?"On the bag":"Blank",used:d=>d.label},
 {id:"set",img:"eq-iv-giving-set.webp",name:"IV giving set",tag:d=>d.give?"Running":"Coiled",on:d=>d.give},
 {id:"stop",img:"eq-three-way-stopcock.webp",name:"Three-way stopcock",tag:()=>""},
 {id:"kid",img:"eq-kidney-basin.webp",name:"Kidney basin",tag:()=>""},
 {id:"sharps",img:"eq-sharps-container.webp",name:"Sharps container",tag:d=>d.drawup?"Ampoules in":"Open"}];
const benchOn=()=>!!(P&&P.l&&P.l.bench);
// which stages are finished: every stage before the current one
const benchDone=()=>{const d={};P.steps.slice(0,P.i).forEach(x=>{if(x.stage)d[x.stage]=true});return d};
function benchHTML(s){const d=benchDone(),hasKit=d.equip||!P.steps.some(x=>x.stage==="equip"),run=!!P.l.txRun;
  const tray=hasKit?BENCH_KIT.map(k=>{const used=k.used&&k.used(d),on=k.on&&k.on(d),t=k.tag(d);
    return `<div class="bk ${used?"used":""} ${on?"on":""}" title="${k.name}"><img src="${TXM(k.img)}" alt="" draggable="false"><span class="bk-n">${k.name}</span>${t?`<span class="bk-t">${t}</span>`:""}</div>`}).join("")
    :`<div class="bk-empty">${I.flag}<span>The bench is empty. Gather the equipment first.</span></div>`;
  const stages=P.steps.filter(x=>x.type==="stage"),cur=P.i;
  const list=run?`<div class="bench-step">Stage ${cur+1} of ${stages.length}</div>`
    :`<ol class="bench-check" aria-label="Preparation steps">${P.steps.map((x,i)=>`<li class="${i<cur?"ok":i===cur?"cur":""}">${i<cur?I.check:`<b>${i+1}</b>`}<span>${TX_STAGE_NAMES[x.stage]||x.stage}</span></li>`).join("")}</ol>`;
  return `<div class="bench-top"><div class="bench-tray" aria-label="Equipment on the bench">${tray}</div>${list}</div>`;}
// resume a guided bench where the learner left it
function benchResume(f){if(!f.l.bench||f.l.txRun)return;const at=(S.benchAt||{})[f.l.id];if(at>0&&at<P.steps.length)P.i=at;}
function benchSave(){if(!benchOn()||P.l.txRun)return;S.benchAt=S.benchAt||{};if(P.i<P.steps.length)S.benchAt[P.l.id]=P.i;else delete S.benchAt[P.l.id];save();}
