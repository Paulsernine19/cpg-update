/* ============================ NEWBORN THERMOREGULATION (native) ============================
   Steps, scene items, feedback and explanations come from the HMCAS newborn thermoregulation
   practice activity (thermal-care explanations reference: WHO, Thermal protection of the newborn). */
const THM=n=>"th/"+n+".webp";
const TH_DIM={"6environment":[1672,941],offac:[1672,941],closingdoor:[1672,941],coveringwiththermal:[1448,1086],placingheadcap:[1588,991]};
const thDim=n=>TH_DIM[n]||[1536,1024];
const TH_IMG={wet:'1wet',drying:'drying',dry:'2drybaby',capping:'placingheadcap',capped:'3headcovered',toweling:'coveringwithb',toweled:'4coveredblanket',thermal:'coveringwiththermal',wrapped:'5wraped',checking:'checkingtemp',environment:'6environment',acTurning:'offac',acOff:'offac',doorClosing:'closingdoor',secondCheck:'7secondcheck',final:'final'};
const TH_SEQ=[
 {key:'dry',scene:'wet',title:'Dry the newborn',guide:'Select one of the dry towels and dry the newborn immediately.',processScene:'drying',process:'Drying the newborn',next:'dry',mood:'pointing'},
 {key:'cap',scene:'dry',title:'Cover the head',guide:'The head is a major source of heat loss. Select the baby cap and cover it now.',processScene:'capping',process:'Placing the baby cap',next:'capped',mood:'pointing'},
 {key:'towel',scene:'capped',title:'Wrap with a dry towel',guide:'Select the remaining dry towel and wrap the newborn.',processScene:'toweling',process:'Wrapping with the dry towel',next:'toweled',mood:'pointing'},
 {key:'thermal',scene:'toweled',title:'Add thermal protection',guide:'Choose the thermal blanket to provide another protective layer.',processScene:'thermal',process:'Applying the thermal blanket',next:'wrapped',mood:'pointing'},
 {key:'temp1',scene:'wrapped',title:'Check the temperature',guide:'It is time for a temperature check. Select the ThermoScan.',processScene:'checking',process:'Checking the temperature',special:'range',mood:'thinking'},
 {key:'ac',scene:'environment',title:'Warm the environment',guide:'The temperature is still below target. Select the air conditioner to turn it off.',processScene:'acTurning',process:'Turning off the air conditioner',next:'acOff',mood:'thinking'},
 {key:'door',scene:'acOff',title:'Reduce environmental heat loss',guide:'Close the door to warm and optimise the environment further.',processScene:'doorClosing',process:'Closing the door',next:'secondCheck',mood:'pointing'},
 {key:'temp2',scene:'secondCheck',title:'Reassess',guide:'Select the ThermoScan and check the newborn’s temperature again.',processScene:'final',process:'Rechecking the temperature',special:'quiz',mood:'thinking'}
];
const TH_WHY={dry:'Drying removes moisture from the skin, reducing heat lost through evaporation.',cap:'Covering the head helps reduce heat loss from exposed skin.',towel:'A dry towel provides insulation and helps keep the newborn warm after drying.',thermal:'The added covering helps retain warmth. In this activity, it follows the dry-towel wrap.',temp1:'Measuring temperature checks the newborn’s thermal status and helps guide the next care decision.',ac:'In this scene, switching off cooling helps create a warmer environment for the newborn.',door:'Closing the door reduces drafts and helps maintain the warmer environment in this scene.',temp2:'Rechecking temperature helps you assess the newborn’s response to the warming measures.'};
const TH_RANGE_WHY='36.5–37.5 °C is the target range used in this activity. The measured 36.0 °C is below that range, so warming and reassessment remain important.';
const TH_QUIZ_WHY='The three checks cover the patient journey: on scene, en route, and at hospital handover. This keeps temperature monitoring going across care transitions.';
const TH_QUIZ=['Two: on scene and at handover','Three: on scene, en route, and at hospital handover','Three: after drying, after wrapping, and before departure','Four: on scene, before transport, en route, and after handover'];
const TH_LESSON={dry:"th-1",cap:"th-2",towel:"th-2",thermal:"th-2",temp1:"th-3",ac:"th-4",door:"th-4",temp2:"th-5"};
const TH_ITEMS=(()=>{
  const item=(id,label,zone,action=null)=>({id,label,zone,action});
  const bins=()=>[item('sharps','Sharps container',[77,0,17,34]),item('waste','Clinical waste bags',[77,63,18,31])];
  const tools=()=>[item('clamps','Cord clamps',[49,13,8,19]),item('suction','Bulb syringe',[48,33,9,24]),item('instrument','Packaged instrument',[58,34,6,25]),item('thermometer','ThermoScan',[65,10,9,26],'temperature'),item('cap','Baby cap',[64,34,14,28],'cap'),item('thermal','Thermal blanket',[77,34,17,28],'thermal'),...bins()];
  const patient=()=>item('newborn','Newborn',[8,12,34,79]);
  const used=()=>item('used-towel','Used towel',[4,8,19,18]);
  const wornCap=()=>item('worn-cap','Cap on newborn',[24,10,15,13]);
  const room=(second=false)=>[item('bed','Bed and bedding',[0,53,76,47]),item('window','Window and curtains',second?[0,0,17,32]:[0,0,23,31]),item('lamp','Bedside lamp',second?[0,30,11,20]:[9,30,8,21]),item('bedside-plant','Bedside plant',second?[10,40,7,11]:[14,39,7,11]),item('cabinet','Storage cabinet',second?[16,34,15,20]:[21,34,13,20]),item('plant','Plant on cabinet',second?[19,24,12,13]:[24,23,9,13]),item('picture','Wall picture',second?[18,0,5,24]:[23,4,5,20]),item('dresser','Dresser',second?[87,46,13,35]:[82,45,18,48]),item('right-plant','Plant on dresser',second?[87,32,12,15]:[82,32,10,15]),item('books','Books',second?[97,47,3,6]:[90,45,7,7]),item('wall-art','Right wall pictures',second?[93,8,7,20]:[87,0,13,29]),item('switch','Light switch',second?[56,26,2,3]:[55,26,2,3]),item('ac','Air conditioner',second?[31,1,16,10]:[33,1,15,15],'ac'),item('door','Door',second?[59,7,15,44]:[57,7,25,52],'door'),item('newborn','Wrapped newborn',second?[42,55,15,39]:[43,55,13,38]),item('worn-cap','Cap on newborn',second?[45,56,8,5]:[46,57,6,5]),item('applied-thermal','Thermal blanket on newborn',second?[42,64,15,29]:[43,65,13,27])];
  return {
    wet:[patient(),...tools(),item('towel-left','Dry towel on the left',[40,60,18,34],'towel'),item('towel-right','Dry towel on the right',[57,60,19,34],'towel')],
    dry:[patient(),...tools(),used(),item('towel','Dry towel',[57,60,19,34],'towel')],
    capped:[patient(),used(),wornCap(),item('cord','Cord clamp on newborn',[22,48,4,5]),item('thermometer','ThermoScan',[66,9,6,23],'temperature'),item('thermal','Thermal blanket',[58,33,17,27],'thermal'),bins()[0],item('towel','Dry towel',[56,61,21,35],'towel')],
    toweled:[item('newborn','Wrapped newborn',[13,11,28,78]),wornCap(),item('applied-towel','Towel around newborn',[13,30,27,59]),bins()[0],item('thermometer','ThermoScan',[68,10,6,23],'temperature'),item('thermal','Thermal blanket',[57,47,20,32],'thermal')],
    wrapped:[item('newborn','Wrapped newborn',[14,12,30,78]),wornCap(),item('applied-thermal','Thermal blanket on newborn',[14,27,30,63]),bins()[0],item('thermometer','ThermoScan',[65,10,9,26],'temperature')],
    environment:[...room(),item('vase','Vase',[96,32,4,22])],
    acOff:[...room(),item('vase','Vase',[96,32,4,22]),item('remote','Air conditioner remote',[21,43,10,37])],
    secondCheck:[...room(true),item('thermometer','ThermoScan',[55,66,11,21],'temperature')]
  };
})();
const thExpected=(item,step)=>item.action===({dry:'towel',temp1:'temperature',temp2:'temperature'}[step.key]||step.key);
function thReason(item,step){
  if(item.id==='used-towel') return 'This towel has already been used for drying. It is not the remaining dry towel in this activity.';
  if(['worn-cap','applied-towel','applied-thermal','cord'].includes(item.id)) return 'This item is already in place. Select the next action in the pathway.';
  if(item.id==='ac'||item.id==='remote') return step.key==='door'||step.key==='temp2'?'The air conditioner is already off. This action is complete.':'Changing the air conditioner is not the next action in this activity.';
  if(item.id==='door') return step.key==='temp2'?'The door is already closed. This action is complete.':'Closing the door comes after turning off the air conditioner in this activity.';
  if(item.action==='temperature') return 'A temperature check is not due at this point in the activity. Complete the preceding care steps first.';
  if(item.action==='cap') return 'Covering the head comes after drying in this activity.';
  if(item.action==='towel') return 'The next towel is for wrapping, which comes after covering the head in this activity.';
  if(item.action==='thermal') return 'Thermal protection comes after the dry-towel wrap in this activity.';
  if(item.id==='newborn') return 'Select the equipment or environmental control for the next action, rather than the newborn.';
  return 'This item is not used for the next action in this activity.';
}
function thScene(name,inner="",cls=""){
  const [w,h]=thDim(name);
  return `<div class="thscene ${cls}" style="aspect-ratio:${w}/${h};width:min(100%,calc(58vh * ${(w/h).toFixed(3)}))"><img src="${THM(name)}" alt="" draggable="false">${inner}</div>`;
}
function thHint(st){ return st.phase==="range"?"Set the lower limit to 36.5 °C and the upper limit to 37.5 °C.":st.phase==="quiz"?"Consider all three points in the patient journey: on scene, en route, and at hospital handover.":st.step.guide; }

TXS.thintro={phases:["intro"],
  guide:()=>null,
  body:()=>`<div class="scn"><img src="${THM("1wet")}" alt="" loading="lazy"><div class="scn-t"><span class="label">Newborn thermal care · hands-on</span><h2>Keep the newborn warm</h2></div></div>
   <div class="mate big"><img src="${TXM("avatar-welcome-half.webp")}" alt="Your crew mate" width="150"><div class="bubble"><p>You have just attended a birth. The newborn is wet and vulnerable to rapid heat loss.</p><p>Your priority is to begin the warm chain. Select items in the scene to choose each action.</p></div></div>
   <ol class="stages">${TH_SEQ.map((x,i)=>`<li><b>${i+1}</b>${x.title}</li>`).join("")}</ol>`,
  foot:()=>`<button class="btn wide" data-tx="intro-go">Start</button>`};

TXS.th={phases:["pick","process","range","quiz"],
  init:(st,c,s)=>{st.step=TH_SEQ.find(x=>x.key===s.key);st.tag=s.key;st.lo=36.0;st.hi=37.0;st.hintSeen={};},
  guide:(s)=>{const t=TH_SEQ.find(x=>x.key===s.key);return P.txMode==="guided"?[[t.mood,t.guide]]:[["neutral","What do you do next? Select the next item. Ask for a hint if you need support."]];},
  hint:(c,st)=>thHint(st),
  body:(st)=>{
   const s=st.step,guided=P.txMode==="guided",head=`<h3 class="q3">${guided?s.title:"What do you do next?"}</h3>`;
   if(st.phase==="pick"){const items=TH_ITEMS[s.scene];
     return head+thScene(TH_IMG[s.scene],`<button class="thmiss" data-tx="thmiss" tabindex="-1" aria-label="Scene background"></button>${items.map((it,i)=>{const z=it.zone;return `<button class="hot ${st.hint&&thExpected(it,s)?"hint":""} ${st.wrongId===it.id?"wrong":""} ${z[1]<14?"lb":""}" data-tx="thpick" data-i="${i}" aria-label="${it.label}" style="left:${z[0]}%;top:${z[1]}%;width:${z[2]}%;height:${z[3]}%"><span>${it.label}</span></button>`}).join("")}`)
       +`<p class="note" style="text-align:center">Tap or click an item in the scene. Hover or focus shows its name.</p>`;}
   if(st.phase==="process"){const img=st.fb&&st.fb.ok?TH_IMG[s.next||s.processScene]:TH_IMG[s.processScene];
     return head+thScene(img,st.fb?"":`<div class="thproc"><span>${s.process}<i class="dots"><b></b><b></b><b></b></i></span></div>`);}
   if(st.phase==="range") return head+`<div class="split"><div>${thScene("checkingtemp","","small")}</div><div class="thtemp">
      <div class="readout2"><span class="label">ThermoScan · measured</span><b>36.0 °C</b><span>Current temperature</span></div>
      <h3 class="q3">Choose the target temperature range</h3><p class="note">Each press changes a limit by 0.5 °C (available 35.0–39.0 °C).</p>
      <div class="stps">${[["lo","Lower limit"],["hi","Upper limit"]].map(([k,l])=>`<div class="stp"><span class="label">${l}</span><div><button class="iconbtn" data-tx="thstep" data-k="${k}" data-d="-0.5" aria-label="Decrease ${l.toLowerCase()}">−</button><output aria-live="polite">${st[k].toFixed(1)} °C</output><button class="iconbtn" data-tx="thstep" data-k="${k}" data-d="0.5" aria-label="Increase ${l.toLowerCase()}">+</button></div></div>`).join("")}</div>
      ${st.rangeNote?`<p class="note" role="status">${st.rangeNote}</p>`:""}</div></div>`;
   return head+`<div class="split"><div>${thScene("final","","small")}</div><div><h3 class="q3">Minimum temperature monitoring: how many checks are required, and when?</h3><div class="opts">${TH_QUIZ.map((o,i)=>`<button class="opt" data-tx="thq" data-i="${i}"><span class="k">${String.fromCharCode(65+i)}</span>${o}</button>`).join("")}</div></div></div>`;},
  foot:(st)=>st.phase==="range"?`<button class="btn wide" data-tx="th-check">Check answer</button>`:"",
  after:(st)=>{ if(st.phase==="process"&&!st.fb&&!st.timer){st.timer=setTimeout(()=>{if(P&&P.sx===st){const n=st.step.special;txOk(TH_WHY[st.step.key],{next:n==="range"?"range":n==="quiz"?"quiz":"END"});}},1500);} }
};
function thClick(t,st){
  const a=t.dataset.tx,s=st.step,guided=P.txMode==="guided";
  if(a==="thpick"){const it=TH_ITEMS[s.scene][+t.dataset.i];
    if(thExpected(it,s)){st.wrongId=null;st.hint=false;txLog(true,"Selected "+it.label);txSound("ok");st.phase="process";drawPlayer();}
    else{st.wrongId=it.id;txErr(`${it.label} is not the next choice`,`${it.label}: ${thReason(it,s)}${guided?" Next: "+s.title+".":" Try another item."}`,undefined,{always:true});}
    return true;}
  if(a==="thmiss"){txErr("Scene background","No item selected. Choose an item in the scene.",undefined,{always:true});return true;}
  if(a==="thstep"){const k=t.dataset.k,v=st[k]+Number(t.dataset.d),lo=k==="lo"?v:st.lo,hi=k==="hi"?v:st.hi;
    if(v<35||v>39)st.rangeNote="Limit reached: choose a value from 35.0 to 39.0 °C.";else if(lo>hi)st.rangeNote="The lower limit cannot exceed the upper limit. Adjust the other limit first.";else{st[k]=v;st.rangeNote="";txSound("click");}
    drawPlayer(`[data-tx="thstep"][data-k="${k}"][data-d="${t.dataset.d}"]`);return true;}
  if(a==="th-check"){if(st.lo===36.5&&st.hi===37.5){P.thTemp=36.0;txOk(TH_RANGE_WHY,{next:"END"});}
    else txErr(`Target range ${st.lo.toFixed(1)}–${st.hi.toFixed(1)} °C`,`Not quite: ${st.lo.toFixed(1)}–${st.hi.toFixed(1)} °C is not the target range. Adjust the limits and check again.`,undefined,{always:true});return true;}
  if(a==="thq"){const i=+t.dataset.i;if(i===1)txOk(TH_QUIZ_WHY,{next:"END"});else txErr(TH_QUIZ[i],"Review when monitoring must occur across the patient journey.",undefined,{always:true});return true;}
  return false;
}
function thRunResult(){
  const ev=P.txEvents||[],rows=TH_SEQ.map(s=>{const e=ev.filter(x=>!x.ok&&x.stage===s.key);const h=(P.thHints&&P.thHints[s.key])||0;return {key:s.key,title:s.title,errors:e.length,hints:h,choices:[...new Set(e.map(x=>x.text))]};});
  return {rows,first:rows.filter(r=>!r.errors&&!r.hints).length,errors:rows.reduce((n,r)=>n+r.errors,0),hints:rows.reduce((n,r)=>n+r.hints,0),time:Math.round((Date.now()-P.t0)/1000)};
}
function thRunEnd(){
  const R=P.thRes,good=R.first===R.rows.length;
  return `<div></div><div class="p-body"><div class="done wide">
   <div class="mate big"><img src="${TXM((good?"avatar-celebrate":"avatar-happy")+"-half.webp")}" alt="Crew mate" width="150"><div class="bubble"><p><b>${good?"You protected the newborn.":"Your learning summary."}</b> ${good?"Every step first time, without hints.":"Review your decisions and revisit any steps that needed another attempt or a hint."}</p></div></div>
   <span class="label">Solo round · newborn thermal care</span><h1 style="font-size:2rem">${R.first} / ${R.rows.length} first attempt</h1>
   <div class="tiles"><div class="tile"><b style="color:var(--good)">${R.first}</b><span>Without retries or hints</span></div><div class="tile"><b style="color:${R.errors?"var(--bad)":"var(--ink)"}">${R.errors}</b><span>Incorrect choices</span></div><div class="tile"><b style="color:var(--sun)">${R.hints}</b><span>Hints</span></div></div>
   <div class="res">${R.rows.map(r=>`<div class="resrow"><b>${r.title}</b><small class="${r.errors||r.hints?"no":"ok"}">${r.errors?r.errors+" incorrect":""}${r.errors&&r.hints?" · ":""}${r.hints?r.hints+" hint"+(r.hints>1?"s":""):""}${!r.errors&&!r.hints?"First attempt":""}</small>${r.choices.length?`<p class="note" style="grid-column:1/-1;margin:0">Choices to review: ${r.choices.map(x=>x.replace(/ is not the next choice$/,"")).join("; ")}.</p>`:""}${r.errors||r.hints?`<div class="revisit"><button class="btn ghost sm" data-revisit="${TH_LESSON[r.key]}">Revisit: ${lessonById(TH_LESSON[r.key]).l.title}</button></div>`:""}</div>`).join("")}</div>
  </div></div>
  <div class="p-foot"><div class="foot-in"><div class="foot-btns"><button class="btn ghost" data-act="retake">Run again</button><button class="btn" data-act="finish">Done</button></div></div></div>`;
}

