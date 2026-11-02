/* ============================ RESUSCITATION HANDS-ON (native) ============================
   Newborn resuscitation "First 5 minutes" (CPG 2.5, 12.13), Code clock (CPG 2.1–2.4, 2.6),
   On the stretcher (CPG 10.3). Equipment photos supplied by HMCAS. Uses the shared scene engine. */
const RXM=n=>"rx/"+n+".webp";
const rxRunOn=()=>P.txMode!=="guided";
function rxBeep(f=880,d=.07){ if(!txSoundOn())return; try{txAC=txAC||new (window.AudioContext||window.webkitAudioContext)();if(txAC.state==="suspended")txAC.resume();txTone(f,d,"sine",.09);}catch(e){} }
const rxG=(guided,solo)=>()=>P.txMode==="guided"?guided:(solo?[["neutral",solo]]:null);

/* ---------- cases ---------- */
function rxNbCase(run){
  if(!run) return {gest:38,weight:3.2,hr:50,rbs:2.1,spo5:78,temp:36.2};
  const g=txPick([[28,1.1],[30,1.4],[31,1.6],[34,2.2],[37,2.9],[39,3.4]]);
  return {gest:g[0],weight:g[1],hr:txPick([40,50,80]),rbs:txPick([1.9,2.2,3.4]),spo5:txPick([76,78,84]),temp:txPick([36.1,36.3,36.8])};
}
function rxCodeCase(kind){
  if(kind==="adult") return {pop:"adult",label:"Adult · medical arrest",device:"LP15",rh:["VF","VF","VF","VF","VF","ROSC"],w:80};
  if(kind==="trauma") return {pop:"trauma",label:"Adult · trauma arrest",device:"LP15",rh:["PEA","PEA","PEA","ROSC"],w:80};
  if(kind==="paed") return {pop:"paed",label:"Child · 3 years · 15 kg",device:"LP15",rh:["VF","VF","VF","VF","ROSC"],w:15,age:3};
  const k=txPick(["adult","adult","paed","trauma"]);
  if(k==="adult") return {pop:"adult",label:"Adult · medical arrest",device:txPick(["LP15","Zoll"]),rh:txPick([["VF","VF","VF","VF","VF","ROSC"],["VF","VF","VF","VF","VF","VF","ROSC"]]),w:80};
  if(k==="paed"){const p=txPick([[1,10],[3,15],[5,20]]);return {pop:"paed",label:`Child · ${p[0]} year${p[0]>1?"s":""} · ${p[1]} kg`,device:txPick(["LP15","Zoll"]),rh:["VF","VF","VF","VF","ROSC"],w:p[1],age:p[0]};}
  return {pop:"trauma",label:"Adult · trauma arrest",device:txPick(["LP15","Zoll"]),rh:["PEA","PEA","PEA","ROSC"],w:80};
}
function rxCase(s){
  const run=!!P.l.rxRun;
  if(!P.rxc||P.rxc.lid!==P.l.id+(s.variant||"")){
    const kind=P.l.scene;
    let c;
    if(kind==="nbr") c=rxNbCase(run);
    else if(kind==="code") c=rxCodeCase(run?"run":(s.variant||P.l.variant||"adult"));
    else c={conscious:run?Math.random()<.5:(s.variant!=="unc")};
    c.lid=P.l.id+(s.variant||""); P.rxc=c;
  }
  return P.rxc;
}

/* ---------- shared visuals ---------- */
function rxTrace(type,rate=75){
  const W=300,B=48;
  const seg=o=>{let d="",x=0;const X=v=>(v+o).toFixed(1);
    if(type==="VF"){const amps=[18,26,14,22,30,12,20,27,16,24,19,25];let i=0;while(x<W-1){const w=Math.min(12+((i*5)%7),(W-x)/2),a=amps[i%amps.length];d+=` Q${X(x+w/2)} ${B-a} ${X(x+w)} ${B} Q${X(x+w*1.5)} ${B+a*.8} ${X(x+w*2)} ${B}`;x+=w*2;i++;}}
    else if(type==="cpr"){const sp=Math.round(100*60/110);while(x+sp<=W+.1){d+=` Q${X(x+sp*.25)} ${B-26} ${X(x+sp*.5)} ${B} Q${X(x+sp*.75)} ${B+10} ${X(x+sp)} ${B}`;x+=sp;}d+=` L${X(W)} ${B}`;}
    else if(type==="sin"){const sp=Math.max(30,W/Math.max(1,Math.round(W/(100*60/rate))));while(x+sp<=W+.1){const p=x+sp*.15;d+=` L${X(p)} ${B} Q${X(p+5)} ${B-6} ${X(p+10)} ${B} L${X(p+16)} ${B} L${X(p+19)} ${B+5} L${X(p+23)} ${B-34} L${X(p+27)} ${B+9} L${X(p+30)} ${B} L${X(p+42)} ${B} Q${X(p+52)} ${B-11} ${X(p+62)} ${B}`;x+=sp;}d+=` L${X(W)} ${B}`;}
    else if(type==="pleth"){const sp=Math.max(30,W/Math.max(1,Math.round(W/(100*60/rate))));while(x+sp<=W+.1){d+=` L${X(x+sp*.2)} ${B+14} Q${X(x+sp*.32)} ${B-26} ${X(x+sp*.48)} ${B-8} Q${X(x+sp*.6)} ${B-2} ${X(x+sp*.7)} ${B+4} L${X(x+sp)} ${B+14}`;x+=sp;}d+=` L${X(W)} ${B+14}`;}
    else d+=` L${X(W)} ${B}`;
    return d;};
  const y0=type==="pleth"?B+14:B;
  return `<svg viewBox="0 0 ${W} 80" preserveAspectRatio="none" aria-hidden="true"><g class="trk"><path d="M0 ${y0}${seg(0)}${seg(W)}" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></g></svg>`;
}
function rxMonitor(o){
  const v=(k,l,val,u="",cls="")=>`<div class="mv ${cls}"><span>${l}</span><b id="mv-${k}">${val}</b>${u?`<small>${u}</small>`:""}</div>`;
  return `<div class="mon" role="img" aria-label="Monitor: ${o.aria||""}"><div class="mon-l"><div class="mon-row ecg"><span class="ml">${o.lead||"Pads"}</span>${rxTrace(o.rhythm,o.rate)}</div>${o.spo!=null?`<div class="mon-row pl"><span class="ml">Pleth</span>${rxTrace("pleth",o.rate||120)}</div>`:""}${o.status?`<div class="mon-st">${o.status}</div>`:""}</div>
   <div class="mon-r">${v("hr","HR",o.hr??"---","","hr")}${o.spo!=null?v("spo","SpO₂",o.spo,"%","sp"):""}${o.co2!=null?v("co2","EtCO₂",o.co2,"mmHg","co"):""}${o.bp?v("bp","NIBP",o.bp,"","bp"):""}${o.energy?v("en","Energy",o.energy,"J","en"):""}${o.clock?v("clk","Time",o.clock,"","ck"):""}</div></div>`;
}
const RX_TORSO={
 front:`<path d="M100 8c13 0 22 10 22 24s-9 26-22 26-22-12-22-26 9-24 22-24z" class="sk"/><path d="M89 56h22v12H89z" class="sk"/><path d="M58 70q42-12 84 0l30 20q10 40-6 62l2 84q-68 22-136 0l2-84Q18 130 28 90z" class="sk"/><path d="M28 92q-14 52-6 112M172 92q14 52 6 112" class="ln"/><circle cx="78" cy="112" r="2.4" class="ln"/><circle cx="122" cy="112" r="2.4" class="ln"/><path d="M100 72v80M70 76q12 8 26 0M104 76q14 8 26 0" class="ln"/>`,
 back:`<path d="M100 8c13 0 22 10 22 24s-9 26-22 26-22-12-22-26 9-24 22-24z" class="sk"/><path d="M89 56h22v12H89z" class="sk"/><path d="M58 70q42-12 84 0l30 20q10 40-6 62l2 84q-68 22-136 0l2-84Q18 130 28 90z" class="sk"/><path d="M28 92q-14 52-6 112M172 92q14 52 6 112" class="ln"/><path d="M100 70v150" class="ln" stroke-dasharray="3 5"/><path d="M62 88q14 26 30 22M138 88q-14 26-30 22" class="ln"/>`
};
function rxBody(view,zones,placed,st,act,label){
  return `<div class="rxbody"><svg viewBox="0 0 200 250" aria-hidden="true">${RX_TORSO[view]}${placed.map(p=>`<rect x="${p.z[0]*2+2}" y="${p.z[1]*2.5+2}" width="${p.z[2]*2-4}" height="${p.z[3]*2.5-4}" rx="7" class="${p.cls}"/>`).join("")}</svg>
   <span class="rxview">${label||(view==="front"?"Front":"Back")}</span>
   ${zones.map(z=>`<button class="hot ${st.hint&&z.ok?"hint":""} ${st.wrongId===z.id?"wrong":""}" data-tx="${act}" data-z="${z.id}" aria-label="${z.label}" style="left:${z.z[0]}%;top:${z.z[1]}%;width:${z.z[2]}%;height:${z.z[3]}%"><span>${z.label}</span></button>`).join("")}</div>`;
}
const rxHead=(t,sub)=>`<h3 class="q3">${t}</h3>${sub?`<p class="note" style="margin-top:-4px">${sub}</p>`:""}`;
const rxOpts=(act,list)=>`<div class="opts">${list.map((t,i)=>`<button class="opt" data-tx="${act}" data-i="${i}"><span class="k">${String.fromCharCode(65+i)}</span>${t}</button>`).join("")}</div>`;
function rxKit(st,items){
  return `<div class="kit">${items.map(it=>`<button class="kitem ${st.sel[it.id]?"on":""} ${st.hint&&it.ok?"hint":""}" data-tx="rxkit" data-id="${it.id}" aria-pressed="${!!st.sel[it.id]}"><img src="${RXM(it.img)}" alt="" loading="lazy"><span>${it.label}</span><i>${st.sel[it.id]?I.check:""}</i></button>`).join("")}</div>`;
}
function rxKitCheck(st,items,okMsg){
  const miss=items.filter(i=>i.ok&&!st.sel[i.id]),extra=items.filter(i=>!i.ok&&st.sel[i.id]);
  if(!miss.length&&!extra.length) return txOk(okMsg,{next:"END"});
  txErr(miss.length?`Missing: ${miss.map(i=>i.label).join(", ")}`:`Not needed: ${extra.map(i=>i.label).join(", ")}`,(miss.length?`You still need: ${miss.map(i=>i.label.toLowerCase()).join(", ")}. `:"")+(extra.length?extra.map(i=>i.why).join(" "):""),undefined,{always:true});
}
const RX_ITEMS={
 neoBvm:{id:"neoBvm",img:"bvm-neo",label:"Infant BVM with PEEP valve"},
 adultBvm:{id:"adultBvm",img:"bvm-adult",label:"Adult BVM with reservoir"},
 o2:{id:"o2",img:"o2-bag",label:"Oxygen bag"},
 pads:{id:"pads",img:"pad-sternum",label:"Defibrillation pads"},
 ice:{id:"ice",img:"icepack",label:"Instant ice packs"},
 combi:{id:"combi",img:"combi",label:"Combi-carrier"},
 blocks:{id:"blocks",img:"headblocks",label:"Head blocks"}
};

/* ====================== NEWBORN RESUSCITATION ====================== */
const nbO2=c=>c.gest>=32?21:30;
TXS.nrintro={phases:["intro"],guide:()=>null,
  body:()=>`<div class="scn rxhero"><img src="${RXM("bvm-neo")}" alt="" loading="lazy"><div class="scn-t"><span class="label">Newborn resuscitation · hands-on</span><h2>The first 5 minutes</h2></div></div>
   <div class="mate big"><img src="${TXM("avatar-welcome-half.webp")}" alt="Your crew mate" width="150"><div class="bubble"><p>A baby has just been born in the back of the ambulance. She's floppy and not breathing.</p><p>You'll run the resuscitation the v2.6 way: cord, airway, five inflation breaths with PEEP, heart rate, compressions if needed, then targets and glucose.</p></div></div>
   <ol class="stages">${["Kit","Cord & airway","Set up the BVM","Inflation breaths","Heart rate","Compressions","Reassess","Glucose"].map((x,i)=>`<li><b>${i+1}</b>${x}</li>`).join("")}</ol>`,
  foot:()=>`<button class="btn wide" data-tx="intro-go">Start</button>`};

const NB_KIT=[{...RX_ITEMS.neoBvm,ok:1},{...RX_ITEMS.o2,ok:1},{...RX_ITEMS.adultBvm,why:"The adult BVM is too large for a newborn and has no PEEP valve set up."},{...RX_ITEMS.ice,why:"Ice packs would cool the baby; newborns must be kept warm."},{...RX_ITEMS.combi,why:"A combi-carrier isn't part of newborn resuscitation."},{...RX_ITEMS.blocks,why:"Head blocks aren't needed: keep the head neutral, with a pad under the shoulders if required."}];
TXS.nrkit={phases:["pick"],init:st=>{st.sel={};st.tag="nrkit";st.rx=1;},
  guide:rxG([["pointing","Before anything else, open and prepare the resuscitation equipment. Select what you need for this baby, then confirm."]],"Prepare your resuscitation equipment."),
  hint:()=>"Two items: the BVM sized for a newborn, and your oxygen.",
  body:st=>rxHead("Prepare the resuscitation kit","Select every item you need, then confirm.")+rxKit(st,NB_KIT),
  foot:()=>`<button class="btn wide" data-tx="rxkitok">Confirm kit</button>`};

TXS.nrcord={phases:["cord","airway"],init:st=>{st.tag="nrcord";st.rx=1;},
  guide:rxG([["thinking","The baby is floppy and apnoeic. The cord is still intact. Decide what happens to the cord, then open the airway."]],"Floppy, apnoeic newborn. Cord intact."),
  hint:(c,st)=>st.phase==="cord"?"Delayed clamping is for well babies. What does this baby need right now?":"Neutral position is the starting point. Which manoeuvre is preferred?",
  body:st=>st.phase==="cord"?rxHead("The cord is intact. What do you do?")+rxOpts("nrq",["Wait 60 seconds, then clamp about 5 cm from the umbilicus","Clamp and cut now, then move the baby to a dry, warm area to resuscitate","Leave the cord and start breaths on the mother's abdomen"])
   :rxHead("Dried, wrapped and on a warm surface. Open the airway.")+rxOpts("nrq",["Head neutral (pad under the shoulders if needed) and a jaw thrust","Hyperextend the neck","Suction the mouth and nose routinely first","Rub the back vigorously until the baby cries"]),
};

TXS.nrset={phases:["set"],init:st=>{st.tag="nrset";st.rx=1;st.peep=10;st.fio=100;},
  guide:rxG([["pointing","Set up the BVM before the first breath. Attach the PEEP valve and set it, then choose the oxygen for this baby's gestation."]],"Set up the BVM for this baby."),
  hint:(c)=>`PEEP is 6 cmH₂O for every newborn. Oxygen depends on gestation: this baby is ${c.gest} weeks.`,
  body:(st,c)=>rxHead("Set up the BVM",`Gestation: <b>${c.gest} weeks</b>`)+`<div class="split"><div class="rxphoto"><img src="${RXM("bvm-neo")}" alt="Infant BVM with PEEP valve"><span class="tag peep">PEEP valve</span></div><div class="thtemp">
    <div class="stp"><span class="label">PEEP valve</span><div><button class="iconbtn" data-tx="nrpeep" data-d="-1" aria-label="Lower PEEP">−</button><output aria-live="polite">${st.peep} cmH₂O</output><button class="iconbtn" data-tx="nrpeep" data-d="1" aria-label="Raise PEEP">+</button></div></div>
    <div class="stp"><span class="label">Oxygen concentration</span><div class="seg">${[[21,"Room air 21%"],[30,"30%"],[100,"100%"]].map(([v,l])=>`<button class="segb" data-tx="nrfio" data-v="${v}" aria-pressed="${st.fio===v}">${l}</button>`).join("")}</div></div></div></div>`,
  foot:()=>`<button class="btn wide" data-tx="nrsetok">Confirm set-up</button>`};

TXS.nrbreath={phases:["breaths"],init:st=>{st.tag="nrbreath";st.rx=1;st.good=0;st.last=null;},
  guide:rxG([["pointing","Mask sealed with a jaw thrust. Press and hold to squeeze the bag. Each inflation breath lasts 2 to 3 seconds. Give five."]],"Give the inflation breaths."),
  hint:()=>"Hold each squeeze until the gauge reaches the green band (2–3 seconds), then release. Five in total.",
  body:st=>rxHead("Five inflation breaths",`Hold for 2–3 seconds, then release. <b id="nrcount">${st.good}</b> of 5 given.`)+`<div class="split"><div class="rxbaby"><svg viewBox="0 0 240 150" role="img" aria-label="Newborn on a towel with a mask and bag over the face">
<rect x="14" y="104" width="214" height="22" rx="11" class="towel"/>
<ellipse cx="128" cy="134" rx="100" ry="6" class="shadow"/>
<path d="M176 108q20 -2 34 6" class="limb"/><path d="M178 92q22 -4 32 -16" class="limb"/>
<path d="M136 78q4 -18 -8 -26" class="limb"/>
<ellipse id="nrchest" cx="160" cy="98" rx="50" ry="22" class="sk"/>
<circle cx="92" cy="92" r="25" class="sk"/>
<path d="M68 86a25 25 0 0 1 32 -18q-6 10 -6 18z" class="cap"/>
<path d="M104 96q4 2 8 0" class="ln"/>
<path d="M80 70l26 -2 2 8 -30 4z" class="mask"/>
<rect x="88" y="54" width="12" height="15" rx="3" class="valve"/>
<rect x="100" y="57" width="16" height="9" rx="3" class="peep"/>
<g id="nrbag"><ellipse cx="94" cy="32" rx="44" ry="17" class="bagb"/><path d="M62 28q32 -10 64 0" class="ln" opacity=".35"/></g>
<rect x="132" y="28" width="10" height="7" rx="2" class="valve"/>
</svg><span class="peeptag">PEEP 6</span></div>
   <div class="thtemp"><div class="readout2"><span class="label">Inflation time</span><b id="nrsec">0.0 s</b><span id="nrmsg" role="status">${st.last||"Press and hold Squeeze"}</span></div>
   <div class="gbar"><span class="gz" style="left:50%;width:25%"></span><i id="nrgi" style="left:0%"></i></div><p class="note" style="margin:0">Green band = 2–3 s</p></div></div>`,
  after:(st)=>{const b=document.getElementById("nrhold");if(!b||b._b)return;b._b=1;let t0=0,raf=null;
    const sec=document.getElementById("nrsec"),gi=document.getElementById("nrgi"),ch=document.getElementById("nrchest"),bag=document.getElementById("nrbag");
    const tick=n=>{const s=(n-t0)/1000;sec.textContent=s.toFixed(1)+" s";gi.style.left=Math.min(100,s/4*100)+"%";raf=requestAnimationFrame(tick);};
    const down=e=>{e.preventDefault();if(t0||P.sx!==st||st.fb)return;t0=performance.now();ch.classList.add("rise");bag.classList.add("sq");raf=requestAnimationFrame(tick);};
    const up=()=>{if(!t0)return;cancelAnimationFrame(raf);const s=(performance.now()-t0)/1000;t0=0;ch.classList.remove("rise");bag.classList.remove("sq");
      const msg=document.getElementById("nrmsg");
      if(s<1.8){st.last=`Too short (${s.toFixed(1)} s). Hold for 2–3 seconds.`;txNote("Inflation breath too short");txSound("err");}
      else if(s>3.4){st.last=`Too long (${s.toFixed(1)} s). Release at 2–3 seconds.`;txNote("Inflation breath too long");txSound("err");}
      else{st.good++;st.last=`Good: ${s.toFixed(1)} s with chest rise.`;txSound("click");document.getElementById("nrcount").textContent=st.good;}
      msg.textContent=st.last;
      if(st.good>=5) setTimeout(()=>{if(P.sx===st)txOk("Five inflation breaths of 2–3 seconds with PEEP 6, ideally within 60 seconds of birth. Then continue ventilating and check the heart rate.",{next:"END"});},300);};
    b.addEventListener("pointerdown",down);["pointerup","pointerleave","pointercancel"].forEach(k=>b.addEventListener(k,up));
    b.addEventListener("keydown",e=>{if((e.key===" "||e.key==="Enter")&&!e.repeat)down(e);});b.addEventListener("keyup",e=>{if(e.key===" "||e.key==="Enter")up();});},
  foot:st=>`<button class="btn wide holdb" id="nrhold" data-tx="noop">Squeeze &amp; hold</button>`};

TXS.nrhr={phases:["listen","decide"],init:st=>{st.tag="nrhr";st.rx=1;st.heard=false;},
  guide:rxG([["thinking","You've ventilated for 30 seconds with good chest rise. Listen with the stethoscope for 6 seconds and count the beats. Multiply by 10."]],"30 seconds of ventilation done. Check the heart rate."),
  hint:(c,st)=>st.phase==="listen"?"Count every beat during the 6-second window, then multiply by 10.":"Below 60 after 30 seconds of ventilation is the compression trigger. 60–100: keep ventilating and reassess.",
  body:(st,c)=>st.phase==="listen"?rxHead("Listen for 6 seconds","Count the beats, then enter the heart rate per minute.")+`<div class="split"><div class="steth"><div class="hb" id="nrhb"><svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.4C.8 7.9 3.3 4 7 4c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.7 0 6.2 3.9 4.6 7.6C19.5 16.4 12 21 12 21z"/></svg></div><p class="note" id="nrtime" style="text-align:center">${st.heard?"Listen again if you need to.":"Press Listen to start"}</p><button class="btn ghost wide" data-tx="nrlisten">${I.sound} Listen (6 s)</button></div>
     <div class="thtemp"><label class="label" for="nrhrin">Heart rate (/min)</label><div class="ans"><input id="nrhrin" inputmode="numeric" autocomplete="off" aria-label="Heart rate per minute"><span class="unit">/min</span></div></div></div>`
   :rxHead(`Heart rate ${c.hr}/min after 30 seconds of ventilation. What next?`)+rxOpts("nrq",["Start compressions at 3:1 with the two-thumb technique and increase oxygen to 100%","Continue effective ventilation and reassess heart rate in 30 seconds","Stop ventilating: the heart rate is adequate"]),
  foot:st=>st.phase==="listen"?`<button class="btn wide" data-tx="nrhrok">Check heart rate</button>`:""};

TXS.nrcomp={phases:["tech","rhythm","skip"],init:(st,c)=>{st.tag="nrcomp";st.rx=1;st.seq=[];st.cycles=0;if(c.hr>=60)st.phase="skip";},
  guide:rxG([["pointing","Heart rate still below 60. Choose the compression technique, then deliver three compressions to one breath."]],"Compressions."),
  hint:(c,st)=>st.phase==="tech"?"For infants under 1 year the two-thumb encircling technique is required.":"Three compressions, then one breath. Repeat.",
  body:(st,c)=>{
   if(st.phase==="skip") return rxHead(`Heart rate ${c.hr}/min: compressions aren't needed yet`)+`<div class="info">Compressions start only if the heart rate stays below 60 after 30 seconds of effective ventilation. Keep ventilating, watch the chest rise and reassess heart rate and breathing every 30 seconds.</div>`;
   if(st.phase==="tech") return rxHead("Which compression technique?")+rxOpts("nrq",["Two-thumb encircling, hands around the chest","Two fingers on the sternum","Heel of one hand"]);
   const lab=["1","2","3","Breath"];
   return rxHead("3 compressions : 1 breath",`Complete 3 full cycles. <b id="nrcyc">${st.cycles}</b> of 3 done.`)+`<div class="cyc">${lab.map((l,i)=>`<span class="${st.seq.length>i?"on":""}">${l}</span>`).join("")}</div>
     <div class="rxbtns"><button class="btn big" data-tx="nrc" data-v="c">Compress</button><button class="btn big ghost" data-tx="nrc" data-v="b">Breathe</button></div>${st.cnote?`<p class="note" role="status" style="text-align:center">${st.cnote}</p>`:""}`;},
  foot:st=>st.phase==="skip"?`<button class="btn wide" data-tx="nrskip">Continue ventilating</button>`:""};

TXS.nrmon={phases:["m1","m2","m3"],init:st=>{st.tag="nrmon";st.rx=1;},
  guide:rxG([["thinking","Reassess every 30 seconds. Use the monitor and the expected SpO₂ for the baby's age in minutes."]],"Reassess against the targets."),
  hint:(c,st)=>st.phase==="m1"?"HR above 100 and the baby is breathing: what can stop?":st.phase==="m2"?"Expected at 5 minutes: SpO₂ 80–85%. Aim for over 80% by 5 minutes.":"Target 36.5–37.5 °C.",
  body:(st,c)=>{
   if(st.phase==="m1") return rxMonitor({rhythm:"sin",rate:130,hr:130,spo:72,clock:"03:00",aria:"HR 130, SpO2 72%",status:"3 min after birth · breathing on her own"})+rxHead("3 minutes. HR 130, SpO₂ 72%, breathing adequately on her own. What now?")+rxOpts("nrq",["Stop compressions and ventilations; titrate oxygen down to the SpO₂ target","Continue compressions for another 2 minutes","Increase to 100% oxygen until SpO₂ reaches 100%"]);
   const ok5=c.spo5>80;
   if(st.phase==="m2") return rxMonitor({rhythm:"sin",rate:135,hr:135,spo:c.spo5,clock:"05:00",aria:`SpO2 ${c.spo5}%`,status:"5 min after birth"})+rxHead(`5 minutes. SpO₂ ${c.spo5}%, HR 135. How is she doing?`)+rxOpts("nrq",["On target: SpO₂ above 80% and HR above 100 by 5 minutes. Keep monitoring","Below target: check airway and breathing, and titrate oxygen up to reach over 80%","Start compressions"]);
   return rxMonitor({rhythm:"sin",rate:140,hr:140,spo:88,clock:"07:00",aria:"Temperature check",status:`Temperature <b>${c.temp.toFixed(1)} °C</b>`})+rxHead(`Temperature ${c.temp.toFixed(1)} °C. What do you do?`)+rxOpts("nrq",["Nothing: it's within the normal range","Warm her: target 36.5–37.5 °C. Hat, dry wraps"+(c.gest<37?", thermal mattress and plastic bag wrap":"")+", warm ambulance with the AC off and doors closed","Remove the wraps so the monitoring is visible"]);},
};

TXS.nrglu={phases:["site","treat"],init:st=>{st.tag="nrglu";st.rx=1;},
  guide:rxG([["thinking","Ventilation, perfusion and temperature are now adequate, but she's still poorly responsive. Check her blood glucose."]],"Still poorly responsive. Check glucose."),
  hint:(c,st)=>st.phase==="site"?"Use the side of the heel.":`Below 2.6 mmol/L: dextrose 10% 2 ml/kg. She weighs ${c.weight} kg.`,
  body:(st,c)=>{
   if(st.phase==="site") return rxHead("Where do you prick for the RBS?","Tap the site on the foot.")+`<div class="rxfoot"><svg viewBox="0 0 200 220" aria-hidden="true"><path d="M70 10h60v110q14 30 6 64-10 30-46 30-38 0-44-34-4-30 24-60z" class="sk"/><path d="M78 186q22 16 44 0" class="ln"/></svg>${[
     {id:"lat",label:"Lateral heel (outer side)",z:[60,70,18,20],ok:1},{id:"mid",label:"Centre of the heel",z:[40,78,20,14]},{id:"toe",label:"Big toe",z:[36,4,26,14]},{id:"arch",label:"Arch of the foot",z:[30,40,22,22]}].map(z=>`<button class="hot ${st.hint&&z.ok?"hint":""} ${st.wrongId===z.id?"wrong":""}" data-tx="nrsite" data-z="${z.id}" data-ok="${z.ok||0}" aria-label="${z.label}" style="left:${z.z[0]}%;top:${z.z[1]}%;width:${z.z[2]}%;height:${z.z[3]}%"><span>${z.label}</span></button>`).join("")}</div>`;
   const low=c.rbs<2.6;
   return `<div class="readout2" style="max-width:340px;margin:0 auto"><span class="label">Glucometer</span><b>${c.rbs.toFixed(1)} mmol/L</b><span>Weight ${c.weight} kg</span></div>`+rxHead(low?"Hypoglycaemic during resuscitation. How much dextrose 10%?":"What do you do with this result?")+(low?`<div class="ans" style="max-width:280px;margin:0 auto"><input id="nrdex" inputmode="decimal" autocomplete="off" aria-label="Dextrose 10% volume in ml"><span class="unit">ml D10</span></div>`:rxOpts("nrq",["No dextrose: the RBS is not low. Continue care and prenotify the obstetric unit","Give dextrose 10% 2 ml/kg anyway","Give glucagon"]));},
  foot:(st,c)=>st.phase==="treat"&&c.rbs<2.6?`<button class="btn wide" data-tx="nrdexok">Give dextrose</button>`:""};

/* ====================== CODE CLOCK ====================== */
const CC_EN={LP15:[200,300,360],Zoll:[150,200,200]};
const ccEnergy=(c,n)=>c.pop==="paed"?Math.min(c.w*4,c.device==="Zoll"?200:360):CC_EN[c.device][Math.min(n,2)];
const ccClock=st=>txFmt(((st.cyc||1)-1)*120+(st.phase==="cpr"?60:0));
TXS.ccintro={phases:["intro"],guide:()=>null,
  body:()=>`<div class="scn rxhero mon-hero"><img src="${RXM("monitor")}" alt="" loading="lazy"><div class="scn-t"><span class="label">Cardiac arrest · hands-on</span><h2>Run the code clock</h2></div></div>
   <div class="mate big"><img src="${TXM("avatar-welcome-half.webp")}" alt="Your crew mate" width="150"><div class="bubble"><p>You're the team leader. You'll put the pads on, read every rhythm check, pick the energy and give each drug on the v2.6 timeline.</p><p>Adult medical, trauma and paediatric arrests each run differently. Don't carry the rules from one to another.</p></div></div>
   <ol class="stages">${["Kit","Pads on","Rhythm checks & shocks","Drugs on time","ROSC: oxygen & BP","Cooling"].map((x,i)=>`<li><b>${i+1}</b>${x}</li>`).join("")}</ol>`,
  foot:()=>`<button class="btn wide" data-tx="intro-go">Start</button>`};
const CC_KIT=[{...RX_ITEMS.pads,ok:1},{...RX_ITEMS.adultBvm,ok:1},{...RX_ITEMS.o2,ok:1},{...RX_ITEMS.neoBvm,why:"The infant BVM is for newborns and infants, not this adult."},{...RX_ITEMS.combi,why:"A combi-carrier isn't needed for a medical arrest on the floor."},{...RX_ITEMS.blocks,why:"Head blocks are for spinal motion restriction, not this arrest."}];
TXS.cckit={phases:["pick"],init:st=>{st.sel={};st.tag="cckit";st.rx=1;},
  guide:rxG([["pointing","Adult collapsed at home, CPR in progress by the family. Grab what you need to take in with the monitor."]],"Adult collapse, bystander CPR. Take in your kit."),
  hint:()=>"Three items: pads, the adult BVM and oxygen.",
  body:st=>rxHead("Take in the kit","Select every item you need with the monitor, then confirm.")+rxKit(st,CC_KIT),
  foot:()=>`<button class="btn wide" data-tx="rxkitok">Confirm kit</button>`};

const CC_PADZ={
 adult:{front:[{id:"rsub",label:"Right upper chest, below the collarbone",z:[24,26,20,13],pad:"sternum"},{id:"apex",label:"Left side, mid-axillary line",z:[66,42,16,17],pad:"apex"},{id:"lup",label:"Left upper chest",z:[56,26,20,13]},{id:"mid",label:"Over the sternum",z:[42,32,16,22]},{id:"abd",label:"Upper abdomen",z:[36,60,28,14]}]},
 paed:{front:[{id:"ant",label:"Front of the chest, left of the sternum",z:[44,34,22,18],pad:"front"},{id:"rsub",label:"Right upper chest",z:[22,26,20,12]},{id:"apex",label:"Left side, mid-axillary line",z:[68,42,14,16]},{id:"abd",label:"Abdomen",z:[36,62,28,14]}],
       back:[{id:"bk",label:"Back, between the shoulder blades",z:[36,32,28,18],pad:"back"},{id:"low",label:"Lower back",z:[36,62,28,16]}]}
};
TXS.ccpads={phases:["place"],init:(st,c)=>{st.tag="ccpads";st.rx=1;st.placed={};st.cur=null;st.view="front";},
  guide:s=>P.txMode==="guided"?[["pointing","Put the pads on. Pick a pad, then tap where it goes on the patient."]]:[["neutral","Pads on."]],
  hint:(c)=>c.pop==="paed"&&c.w<25?"Under 25 kg: anterior-posterior is first choice. One on the front of the chest, one on the back.":"Sternal pad: right upper chest below the collarbone. Apex pad: left side, mid-axillary line.",
  body:(st,c)=>{
   const paed=c.pop==="paed"&&c.w<25,Z=paed?CC_PADZ.paed[st.view]:CC_PADZ.adult.front;
   const pads=paed?[{id:"front",label:"Pad 1 · front",img:null},{id:"back",label:"Pad 2 · back",img:null}]:[{id:"sternum",label:"Sternal pad",img:"pad-sternum"},{id:"apex",label:"Apex pad",img:"pad-apex"}];
   const placed=Object.entries(st.placed).filter(([p,z])=>paed?(p==="back")===(st.view==="back"):true).map(([p,zid])=>({z:Z.find(z=>z.id===zid).z,cls:"padp"}));
   return rxHead(paed?`${c.label}: put the pads on`:"Put the pads on",paed?"Use the Front / Back switch to turn the patient.":"Pick a pad, then tap its position.")+`<div class="split"><div>${rxBody(st.view,Z.filter(z=>!Object.values(st.placed).includes(z.id)),placed,st,"ccz",paed?(st.view==="front"?"Front":"Back"):"Front")}${paed?`<div class="seg" style="margin-top:8px">${["front","back"].map(v=>`<button class="segb" data-tx="ccview" data-v="${v}" aria-pressed="${st.view===v}">${v==="front"?"Front":"Back"}</button>`).join("")}</div>`:""}</div>
    <div class="padpick">${pads.map(p=>`<button class="padc ${st.cur===p.id?"on":""} ${st.placed[p.id]?"done":""}" data-tx="ccpad" data-p="${p.id}" ${st.placed[p.id]?"disabled":""} aria-pressed="${st.cur===p.id}">${p.img?`<img src="${RXM(p.img)}" alt="">`:`<span class="padg"></span>`}<span>${p.label}${st.placed[p.id]?" ✓":""}</span></button>`).join("")}</div></div>`;}
};

function ccDue(c,st){
  const d=[];const adrGap=st.lastAdr==null||st.cyc-st.lastAdr>=2;
  if(c.pop==="trauma"){ if(st.fluid>=500&&st.hott.length===4&&adrGap) d.push("adr"); }
  else if(c.pop==="paed"){ if(st.cyc>=3&&adrGap) d.push("adr"); }
  else { if(st.shocks>=3&&adrGap) d.push("adr"); }
  if(c.pop!=="trauma"){ if(st.shocks>=3&&!st.amio1) d.push("amio1"); else if(st.shocks>=5&&st.amio1&&!st.amio2) d.push("amio2"); }
  return d.filter(x=>!st.given.includes(x));
}
const CC_HOTT=[["h","Hypovolaemia: control bleeding, give fluid"],["o","Oxygenation: airway and ventilation"],["t1","Tension pneumothorax: assess, CCP to decompress"],["t2","Tamponade: assess and escalate"]];
TXS.ccloop={phases:["start","check","defib","cpr"],init:(st,c)=>{st.tag="ccloop";st.rx=1;st.cyc=1;st.shocks=0;st.lastAdr=null;st.amio1=false;st.amio2=false;st.given=[];st.fluid=0;st.hott=[];st.energy=c.pop==="paed"?50:150;st.charged=false;st.log=[];if(c.pop==="adult")st.phase="check";},
  guide:s=>P.txMode!=="guided"?[["neutral","Run the arrest. Rhythm checks every 2 minutes."]]:(s.variant==="trauma"?[["thinking","Adult trauma arrest after a collision. Work on HOTT while CPR continues. Adrenaline is locked until the reversible causes and at least 500 ml of saline are done."]]:s.variant==="paed"?[["thinking","Child in cardiac arrest, 15 kg. Start the paediatric way, then dose everything by weight."]]:[["thinking","Adult medical arrest. Every rhythm check, decide. Then give drugs exactly when they're due and continue CPR."]]),
  hint:(c,st)=>{
   if(st.phase==="start") return c.pop==="paed"?"Paediatric CPR starts with 5 ventilations, then 15:2.":"Treat HOTT simultaneously with compressions.";
   if(st.phase==="check"){const r=c.rh[st.cyc-1];return r==="VF"?"VF is shockable.":r==="PEA"||r==="ROSC"?"An organised rhythm: check for a pulse.":"";}
   if(st.phase==="defib") return c.pop==="paed"?`4 J/kg × ${c.w} kg.`:`${c.device}: ${CC_EN[c.device].join(", ")} J for shocks 1, 2, 3+.`;
   const d=ccDue(c,st);return d.length?"Due now: "+d.map(x=>({adr:"adrenaline",amio1:"first amiodarone",amio2:"second amiodarone"}[x])).join(" and ")+".":(c.pop==="trauma"&&st.fluid<500?"Adrenaline is locked: HOTT and at least 500 ml first.":"Nothing is due this cycle. Continue CPR.");},
  body:(st,c)=>{
   const r=c.rh[st.cyc-1],cpr=st.phase==="cpr"||st.phase==="start";
   const rhythm=cpr?"cpr":(r==="VF"?"VF":"sin"),rate=r==="PEA"?48:r==="ROSC"?92:60;
   const mon=rxMonitor({rhythm,rate,hr:cpr?"CPR":r==="VF"?"---":rate,co2:cpr?(r==="ROSC"?38:22):null,energy:st.phase==="defib"?st.energy:null,clock:ccClock(st),aria:cpr?"CPR in progress":"Rhythm check",status:cpr?"<b>CPR in progress</b> · compressions 100–120/min":`<b>Rhythm check ${st.cyc}</b> · pause under 5 s`});
   const strip=`<div class="ccstrip"><span>Shocks <b>${st.shocks}</b></span><span>Adrenaline <b>${st.log.filter(x=>x.startsWith("Adr")).length}</b></span>${c.pop!=="trauma"?`<span>Amiodarone <b>${(st.amio1?1:0)+(st.amio2?1:0)}</b></span>`:`<span>Fluid <b>${st.fluid} ml</b></span>`}<span>Device <b>${c.device}</b></span></div>`;
   if(st.phase==="start") return mon+strip+rxHead(c.pop==="paed"?"How does CPR start for this child?":"Trauma arrest. How do you work?")+rxOpts("ccstart",c.pop==="paed"?["5 ventilations, then CPR at 15:2","30:2 straight away","Compressions only until the pads are on"]:["Treat HOTT at the same time as compressions; keep scene time to a minimum","Give adrenaline first, then look for causes","Run the adult medical algorithm unchanged"]);
   if(st.phase==="check") return mon+strip+rxHead(`Rhythm check ${st.cyc}. What do you do?`)+rxOpts("cccheck",["Shockable: charge and shock","Non-shockable: resume CPR","Organised rhythm: check for a pulse"]);
   if(st.phase==="defib"){const paed=c.pop==="paed";return mon+strip+rxHead(paed?`Set the energy for ${c.w} kg`:`Shock ${st.shocks+1}: set the energy on the ${c.device}`)+`<div class="stp" style="max-width:360px;margin:0 auto"><span class="label">Energy</span>${paed?`<div><button class="iconbtn" data-tx="ccen" data-d="-10" aria-label="Lower energy">−</button><output aria-live="polite">${st.energy} J</output><button class="iconbtn" data-tx="ccen" data-d="10" aria-label="Raise energy">+</button></div>`:`<div class="seg">${[120,150,200,300,360].map(v=>`<button class="segb" data-tx="ccenv" data-v="${v}" aria-pressed="${st.energy===v}">${v}</button>`).join("")}</div>`}</div>
     <div class="rxbtns"><button class="btn big ${st.charged?"ghost":""}" data-tx="cccharge" ${st.charged?"disabled":""}>${st.charged?"Charged ✓":"Charge"}</button><button class="btn big shock" data-tx="ccshock" ${st.charged?"":"disabled"}>⚡ Shock</button></div><p class="note" style="text-align:center">Compressions continue while charging. Everyone clear before the shock.</p>`;}
   const paed=c.pop==="paed",aD=Math.min(+(c.w*.01).toFixed(2),1),mD=Math.min(c.w*5,st.amio1?150:300);
   const drugs=c.pop==="trauma"?`<div class="ccdrugs"><div class="hottl"><span class="label">HOTT</span>${CC_HOTT.map(([k,t])=>`<button class="tog" data-tx="cchott" data-k="${k}" aria-pressed="${st.hott.includes(k)}"><i>${st.hott.includes(k)?I.check:""}</i>${t}</button>`).join("")}</div>
      <div class="rxbtns"><button class="btn ghost" data-tx="ccfluid">+250 ml normal saline</button><button class="btn ghost" data-tx="ccadr">Adrenaline 1 mg</button></div></div>`
    :paed?`<div class="ccdrugs paed"><div class="drow"><label for="ccadrin">Adrenaline</label><input id="ccadrin" inputmode="decimal" autocomplete="off"><span class="unit">mg</span><button class="btn ghost sm" data-tx="ccadr">Give</button></div><div class="drow"><label for="ccamin">Amiodarone</label><input id="ccamin" inputmode="decimal" autocomplete="off"><span class="unit">mg</span><button class="btn ghost sm" data-tx="ccamio">Give</button></div></div>`
    :`<div class="rxbtns"><button class="btn ghost" data-tx="ccadr">Adrenaline 1 mg</button><button class="btn ghost" data-tx="ccamio" data-v="300">Amiodarone 300 mg</button><button class="btn ghost" data-tx="ccamio" data-v="150">Amiodarone 150 mg</button></div>`;
   return mon+strip+rxHead(`Cycle ${st.cyc}: 2 minutes of CPR`,"Give anything that's due now, then continue CPR.")+drugs+(st.log.length?`<p class="note" style="text-align:center">Given: ${st.log.join(" · ")}</p>`:"");},
  foot:st=>st.phase==="cpr"?`<button class="btn wide" data-tx="cccont">Continue CPR · next rhythm check</button>`:""};

TXS.ccrosc={phases:["o2","bp"],init:(st,c)=>{st.tag="ccrosc";st.rx=1;st.fi=15;},
  guide:rxG([["happy","ROSC. Now protect the brain: titrate oxygen to the target, then support the blood pressure."]],"ROSC achieved."),
  hint:(c,st)=>st.phase==="o2"?"Target SpO₂ 94–98%. Turn the flow down until you're in range, then confirm.":c.pop==="paed"?"Paediatric boluses are 10 ml/kg.":"Adults: 250 ml boluses.",
  body:(st,c)=>{
   const STEPS=[0,1,2,3,4,5,6,7,9,12,15,25],spo=st.fi>=6?100:[88,92,94,96,97,98][st.fi]??100;st.spo=spo;
   if(st.phase==="o2"){const ang={0:90,1:62,2:34,3:3,4:-24,5:-50,6:-90,7:-118,9:-148,12:180,15:150,25:122}[st.fi]*Math.PI/180;
    return rxMonitor({rhythm:"sin",rate:96,hr:96,spo,co2:42,bp:c.pop==="paed"?"72/40":"84/50",aria:`SpO2 ${spo}%`,status:"ROSC · ventilated with oxygen"})+rxHead(`SpO₂ ${spo}%. Titrate the oxygen.`,"Target 94–98%. Avoid hyperoxaemia.")+`<div class="split"><div class="rxphoto flow"><img src="${RXM("flowmeter")}" alt="Oxygen flowmeter dial"><span class="fdot" style="left:${46.4+Math.cos(ang)*17.5}%;top:${54.8+Math.sin(ang)*19.5}%"></span></div>
     <div class="thtemp"><div class="stp"><span class="label">Oxygen flow</span><div><button class="iconbtn" data-tx="ccfi" data-d="-1" aria-label="Lower flow">−</button><output aria-live="polite">${st.fi} L/min</output><button class="iconbtn" data-tx="ccfi" data-d="1" aria-label="Raise flow">+</button></div></div><div class="readout2"><span class="label">SpO₂</span><b>${spo}%</b><span>${spo>98?"Too high: hyperoxaemia":spo<94?"Too low":"In target range"}</span></div></div></div>`;}
   const tgt=c.pop==="paed"?`SBP target (age × 2) + 70 = ${c.age*2+70} mmHg`:"Target SBP >90 or MAP >65 mmHg";
   return rxMonitor({rhythm:"sin",rate:96,hr:96,spo:96,co2:40,bp:c.pop==="paed"?"66/38":"82/48",aria:"Hypotensive",status:tgt})+rxHead("Hypotensive after ROSC. Which fluid bolus?")+rxOpts("ccbp",c.pop==="paed"?[`10 ml/kg: ${c.w*10} ml`,`20 ml/kg: ${c.w*20} ml`,"No fluid: start an adrenaline infusion yourself"]:["250 ml bolus, reassess","2 L wide open","No fluid: SBP 82 is acceptable"]);}
};

const ICEZ=[{id:"rax",label:"Right axilla",z:[8,34,16,14],ok:1},{id:"lax",label:"Left axilla",z:[76,34,16,14],ok:1},{id:"groin",label:"Groin",z:[36,86,28,10],ok:1},{id:"head",label:"Forehead",z:[40,2,20,10]},{id:"neck",label:"Neck",z:[42,20,16,8]},{id:"chest",label:"Centre of the chest",z:[38,38,24,18]}];
TXS.ccice={phases:["decide","place","temp"],init:st=>{st.tag="ccice";st.rx=1;st.ice=[];},
  guide:rxG([["thinking","Your patient had a medical arrest, has ROSC and is still comatose, GCS 3. Decide about cooling."]],"Post-ROSC. Decide about cooling."),
  hint:(c,st)=>st.phase==="decide"?"Ice-pack cooling is for comatose adults after a medical arrest.":st.phase==="place"?"Axillae and groin.":"Don't let the temperature fall below 33 °C, and tell the hospital.",
  body:(st,c)=>{
   if(st.phase==="decide") return rxHead(`${c.label}. ROSC, GCS 3. Start ice-pack cooling?`)+rxOpts("ccicey",["Yes: comatose adult after a medical arrest","No: cooling isn't indicated for this patient"]);
   if(st.phase==="place") return rxHead("Place the ice packs",`Tap each correct position. <b>${st.ice.length}</b> of 3 placed.`)+`<div class="split"><div>${rxBody("front",ICEZ.filter(z=>!st.ice.includes(z.id)),ICEZ.filter(z=>st.ice.includes(z.id)).map(z=>({z:z.z,cls:"icep"})),st,"ccicez","Front")}</div><div class="rxphoto"><img src="${RXM("icepack")}" alt="Instant ice pack"><p class="note">Activate each pack and wrap it in a cloth barrier.</p></div></div>`;
   return rxMonitor({rhythm:"sin",rate:84,hr:84,spo:96,co2:40,bp:"104/62",aria:"Temperature 33.2",status:"Core temperature <b>33.2 °C</b> and falling"})+rxHead("Temperature 33.2 °C and falling. What do you do?")+rxOpts("cctemp",["Remove the ice packs so it doesn't fall below 33 °C, and update the hospital on the cooling","Keep cooling: lower is better","Add more ice packs to the chest"]);}
};

/* ====================== ON THE STRETCHER (SMR) ====================== */
TXS.smr={phases:["board","blocks","secure","angle"],init:(st,c)=>{st.tag="smr";st.rx=1;st.ang=0;},
  guide:s=>P.txMode==="guided"?[["thinking",s.variant==="unc"?"Unconscious motorcyclist, GCS 6, extricated on the combi-carrier and now on the stretcher.":"Alert driver, GCS 15, neck pain. Self-extricated to the stretcher via the combi-carrier. She's distressed lying flat on the board."]]:null,
  hint:(c,st)=>({board:c.conscious?"Consider removing the board once on the stretcher, particularly if it's causing distress.":"Keep the unconscious trauma patient on the combi-carrier.",blocks:"Head blocks apply on the board or on the stretcher.",secure:"On the board: spider harness plus stretcher straps. Off the board: stretcher straps.",angle:"Up to 30° if lying flat causes distress."}[st.phase]),
  body:(st,c)=>{
   const who=c.conscious?"Alert, GCS 15, neck pain, distressed lying flat":"Unconscious, GCS 6";
   if(st.phase==="board") return rxHead(`${who}. On the stretcher: the combi-carrier?`)+`<div class="kit two"><button class="kitem" data-tx="smrb" data-v="keep"><img src="${RXM("combi")}" alt=""><span>Keep on the combi-carrier</span></button><button class="kitem" data-tx="smrb" data-v="off"><img src="${RXM("combi")}" alt="" style="opacity:.35;filter:grayscale(1)"><span>Remove the combi-carrier</span></button></div>`;
   if(st.phase==="blocks") return rxHead("Head blocks?")+`<div class="kit two"><button class="kitem" data-tx="smrh" data-v="1"><img src="${RXM("headblocks")}" alt=""><span>Apply head blocks</span></button><button class="kitem" data-tx="smrh" data-v="0"><img src="${RXM("headblocks")}" alt="" style="opacity:.35;filter:grayscale(1)"><span>Not needed now</span></button></div>`;
   if(st.phase==="secure") return rxHead("How do you secure the patient?")+rxOpts("smrs",c.conscious?["Stretcher straps","Spider harness only, no stretcher straps","Leave unsecured so she's comfortable"]:["Spider harness to the board, plus the stretcher straps","Stretcher straps only","Tape across the forehead only"]);
   return rxHead(c.conscious?"She's distressed lying flat. Set the stretcher backrest.":"Set the stretcher backrest.","Maintain SMR principles.")+`<div class="angw"><svg viewBox="0 0 240 120" aria-hidden="true"><path d="M20 100h200" class="ln"/><g transform="rotate(${-st.ang} 120 92)"><rect x="20" y="84" width="100" height="10" rx="4" class="bed"/></g><rect x="120" y="84" width="100" height="10" rx="4" class="bed"/></svg>
     <div class="stp" style="max-width:300px;margin:0 auto"><span class="label">Backrest angle</span><div><button class="iconbtn" data-tx="smra" data-d="-5" aria-label="Lower">−</button><output aria-live="polite">${st.ang}°</output><button class="iconbtn" data-tx="smra" data-d="5" aria-label="Raise">+</button></div></div></div>`;},
  foot:st=>st.phase==="angle"?`<button class="btn wide" data-tx="smrok">Confirm angle</button>`:""};

/* ====================== actions ====================== */
function rxClick(t,st){
  const a=t.dataset.tx,s=P.steps[P.i],c=rxCase(s),i=t.dataset.i!==undefined?+t.dataset.i:null;
  const pick=(ok,okMsg,next,badTitle,badWhy,outcome)=>ok?txOk(okMsg,{next}):txErr(badTitle,badWhy,outcome,{always:true});
  switch(a){
  case "noop": return true;
  case "rxkit": st.sel[t.dataset.id]=!st.sel[t.dataset.id];txSound("click");drawPlayer(`[data-id="${t.dataset.id}"]`);return true;
  case "rxkitok": rxKitCheck(st,st.tag==="nrkit"?NB_KIT:CC_KIT,st.tag==="nrkit"?"Infant BVM with a PEEP valve and oxygen, opened and ready. Also have a warm, dry place to resuscitate.":"Pads, adult BVM and oxygen go in with the monitor. Get the pads on as soon as possible.");return true;
  /* newborn */
  case "nrq": {
    const k=st.tag+":"+st.phase;
    if(k==="nrcord:cord") return pick(i===1,"Delayed clamping is for well babies. When urgent resuscitation is needed, clamp and cut now and move to a dry, warm area.","airway","Cord decision",i===0?"Waiting 60 seconds delays resuscitation. Don't delay clamping when resuscitation is needed.":"Resuscitate on a dry, warm, flat surface.","Ventilation would be delayed in an apnoeic baby."),true;
    if(k==="nrcord:airway") return pick(i===0,"Neutral position with a jaw thrust. Suction only for obstruction, under direct vision.","END","Airway",["","Hyperextension can obstruct a newborn's airway. Keep the head neutral.","Suction is only for obstruction seen under direct vision. Routine suction was removed.","Stimulate gently by drying or rubbing the soles or back. Never vigorously."][i]),true;
    if(k==="nrhr:decide"){const ok=c.hr<60?0:1;return pick(i===ok,c.hr<60?"HR below 60 after 30 seconds of ventilation: start compressions 3:1, two-thumb, 100% oxygen.":"HR 60–100: ventilation may need improving. Keep ventilating, check chest rise and reassess in 30 seconds.","END","Next step",c.hr<60?"HR is below 60 after 30 seconds of effective ventilation. That's the compression trigger.":i===0?"Compressions start only when HR stays below 60. This baby's HR is above that.":"HR under 100 means the baby still needs support. Keep ventilating.",c.hr<60?"Bradycardia would persist.":undefined),true;}
    if(k==="nrcomp:tech") return pick(i===0,"Two-thumb encircling technique. Now increase oxygen to 100% and deliver 3:1.","rhythm","Technique","For newborns and infants under 1 year, use the two-thumb encircling technique."),true;
    if(k==="nrmon:m1") return pick(i===0,"Breathing adequately with HR over 100: stop compressions and ventilations, and titrate oxygen down to the expected SpO₂.","m2","Reassessment",i===1?"HR is 130 and she's breathing. Compressions must stop.":"Oxygen is titrated to the expected SpO₂ for her age in minutes, not to 100%. At 3 minutes 70–75% is expected."),true;
    if(k==="nrmon:m2"){const ok=c.spo5>80?0:1;return pick(i===ok,ok===0?"On track: SpO₂ above 80% and HR above 100 by 5 minutes.":"Below 80% at 5 minutes should be avoided. Check the airway and ventilation and titrate oxygen up.","m3","Target check",ok===0?`SpO₂ ${c.spo5}% is above 80% at 5 minutes, which is on target.`:`SpO₂ ${c.spo5}% is below the 80% target for 5 minutes.`),true;}
    if(k==="nrmon:m3"){const low=c.temp<36.5,ok=low?1:0;return pick(i===ok,low?"Below 36.5 °C. Warm her: hat, dry wraps, a thermal mattress and plastic bag if preterm, a warm ambulance with doors closed.":"Within 36.5–37.5 °C. Keep her warm and keep checking.","END","Temperature",low?`${c.temp.toFixed(1)} °C is below the 36.5–37.5 °C target.`:i===1?`${c.temp.toFixed(1)} °C is already within the target. Maintain it.`:"Removing the wraps would cool her."),true;}
    if(k==="nrglu:treat") return pick(i===0,"RBS isn't low, so no dextrose. Prenotify the receiving obstetric unit: she's been resuscitated.","END","Glucose",i===1?"Dextrose is for hypoglycaemia. This RBS is not low.":"Glucagon should not be given to a newborn."),true;
    return true;}
  case "nrpeep": st.peep=Math.max(0,Math.min(20,st.peep+ +t.dataset.d));txSound("click");drawPlayer(`[data-tx="nrpeep"][data-d="${t.dataset.d}"]`);return true;
  case "nrfio": st.fio=+t.dataset.v;txSound("click");drawPlayer(`[data-tx="nrfio"][data-v="${t.dataset.v}"]`);return true;
  case "nrsetok": {const want=nbO2(c);
    if(st.peep!==6) return txErr(`PEEP ${st.peep} cmH₂O`,"PEEP for newborn ventilation is 6 cmH₂O.","Too little PEEP lets the lungs collapse between breaths; too much can over-distend them.",{always:true}),true;
    if(st.fio!==want) return txErr(`${st.fio}% oxygen at ${c.gest} weeks`,c.gest>=32?"At 32 weeks or more, start with room air (21%).":"Under 32 weeks, start with 30% oxygen.",undefined,{always:true}),true;
    txOk(`PEEP 6 cmH₂O and ${want===21?"room air (21%)":"30% oxygen"} for ${c.gest} weeks.`,{next:"END"});return true;}
  case "nrlisten": {if(st.listening)return true;st.listening=true;st.heard=true;const hb=document.getElementById("nrhb"),tm=document.getElementById("nrtime");const beats=Math.round(c.hr/10),gap=6000/beats;let n=0;const t0=Date.now();
    const iv=setInterval(()=>{if(P.sx!==st){clearInterval(iv);return;}const el=Date.now()-t0;if(tm)tm.textContent=`Listening… ${Math.max(0,6-el/1000).toFixed(1)} s`;},100);
    for(let b=0;b<beats;b++)setTimeout(()=>{if(P.sx!==st)return;n++;rxBeep(520,.09);if(hb){hb.classList.remove("on");void hb.offsetWidth;hb.classList.add("on");}},gap*b+gap/2);
    setTimeout(()=>{clearInterval(iv);st.listening=false;if(tm)tm.textContent="Done. Enter the heart rate.";},6050);return true;}
  case "nrhrok": {const v=+(document.getElementById("nrhrin")||{}).value;
    if(!st.heard) return txErr("Listen first","Listen for 6 seconds and count the beats before entering a heart rate.",undefined,{always:true}),true;
    if(!v||Math.abs(v-c.hr)>10) return txErr(`Heart rate ${v||"blank"}`,"Count the beats in 6 seconds and multiply by 10. Listen again if needed.",undefined,{always:true}),true;
    txOk(`Heart rate ${c.hr}/min.`,{next:"decide"});return true;}
  case "nrc": {const want=st.seq.length<3?"c":"b";
    if(t.dataset.v!==want){st.seq=[];st.cnote=want==="c"?"Out of sequence: three compressions first. Start the cycle again.":"After three compressions, give one breath. Start the cycle again.";txNote("Compression ratio out of sequence");txSound("err");drawPlayer(`[data-tx="nrc"][data-v="${t.dataset.v}"]`);return true;}
    st.seq.push(want);st.cnote="";txSound("click");if(st.seq.length===4){st.seq=[];st.cycles++;}
    if(st.cycles>=3) txOk("3:1 with the two-thumb technique and 100% oxygen. Reassess heart rate and breathing every 30 seconds.",{next:"END"});else drawPlayer(`[data-tx="nrc"][data-v="${t.dataset.v}"]`);return true;}
  case "nrskip": txOk("Keep ventilating effectively and reassess every 30 seconds. Compressions only if HR stays below 60.",{next:"END",quiet:true});return true;
  case "nrsite": if(t.dataset.ok==="1"){st.wrongId=null;txOk("Lateral heel. The RBS result is on the glucometer.",{next:"treat"});}else{st.wrongId=t.dataset.z;txErr(t.getAttribute("aria-label"),"Prick the lateral aspect of the heel.",undefined,{always:true});}return true;
  case "nrdexok": {const v=+(document.getElementById("nrdex")||{}).value,want=+(c.weight*2).toFixed(1);
    if(!v||Math.abs(v-want)>0.15) return txErr(`${v||"Blank"} ml`,`Dextrose 10% is 2 ml/kg: 2 × ${c.weight} kg = ${want} ml.`,v>want?"Too much glucose risks hyperglycaemia and fluid overload in a newborn.":undefined,{always:true}),true;
    txOk(`Dextrose 10% ${want} ml (2 ml/kg) IV/IO. Prenotify the obstetric unit: she's been resuscitated.`,{next:"END"});return true;}
  /* code clock */
  case "ccview": st.view=t.dataset.v;txSound("click");drawPlayer(`[data-tx="ccview"][data-v="${st.view}"]`);return true;
  case "ccpad": st.cur=t.dataset.p;txSound("click");drawPlayer(`[data-tx="ccpad"][data-p="${st.cur}"]`);return true;
  case "ccz": {const paed=c.pop==="paed"&&c.w<25,Z=paed?CC_PADZ.paed[st.view]:CC_PADZ.adult.front,z=Z.find(x=>x.id===t.dataset.z);
    if(!st.cur) return txErr("Pick a pad first","Select a pad on the right, then tap where it goes.",undefined,{always:true}),true;
    if(z.pad!==st.cur){st.wrongId=z.id;return txErr(`${z.label}`,paed?"Under 25 kg, anterior-posterior is first choice: one pad on the front of the chest, one on the back between the shoulder blades.":"Sternal pad below the right collarbone; apex pad on the left side in the mid-axillary line. Pads must not overlap.","Poor pad placement leads to ineffective defibrillation.",{always:true}),true;}
    st.placed[st.cur]=z.id;st.cur=null;st.wrongId=null;txSound("snap");
    if(Object.keys(st.placed).length===2) txOk(paed?"Anterior-posterior: first choice under 25 kg.":"Sternal and apex pads in position with good contact.",{next:"END"});else drawPlayer();return true;}
  case "ccstart": return pick(i===0,c.pop==="paed"?"Five ventilations, then 15:2.":"HOTT alongside compressions, minimum scene time.","check","Start",c.pop==="paed"?"Paediatric CPR starts with 5 ventilations, then 15:2.":"Trauma arrest: correct reversible causes alongside compressions. Adrenaline comes only after HOTT and volume."),true;
  case "cccheck": {const r=c.rh[st.cyc-1];
    if(r==="VF") return pick(i===0,"VF: shockable. Charge and shock.","defib","Rhythm check","This is VF, a shockable rhythm. Shock without delay.","Every minute without defibrillation in VF lowers survival."),true;
    if(i!==2) return txErr("Rhythm check","This is an organised rhythm. Check for a pulse.",undefined,{always:true}),true;
    if(r==="ROSC"){txOk("Pulse present: ROSC. Avoid rapid movement for up to 10 minutes, then move to post-ROSC care.",{next:"END"});return true;}
    st.given=[];st.phase="cpr";txLog(true,"PEA recognised");txSound("ok");drawPlayer();return true;}
  case "ccen": st.energy=Math.max(10,Math.min(200,st.energy+ +t.dataset.d));txSound("click");drawPlayer(`[data-tx="ccen"][data-d="${t.dataset.d}"]`);return true;
  case "ccenv": st.energy=+t.dataset.v;txSound("click");drawPlayer(`[data-tx="ccenv"][data-v="${t.dataset.v}"]`);return true;
  case "cccharge": {const want=ccEnergy(c,st.shocks);
    if(st.energy!==want) return txErr(`${st.energy} J`,c.pop==="paed"?`4 J/kg × ${c.w} kg = ${want} J.`:`${c.device}: ${CC_EN[c.device].join(", ")} J for shocks 1, 2 and 3 onwards. Shock ${st.shocks+1} is ${want} J.`,undefined,{always:true}),true;
    st.charged=true;txSound("alert");drawPlayer('[data-tx="ccshock"]');return true;}
  case "ccshock": st.shocks++;st.charged=false;st.given=[];txSound("snap");txLog(true,"Shock "+st.shocks);st.phase="cpr";drawPlayer();return true;
  case "cchott": {const k=t.dataset.k;st.hott=st.hott.includes(k)?st.hott.filter(x=>x!==k):[...st.hott,k];txSound("click");drawPlayer(`[data-tx="cchott"][data-k="${k}"]`);return true;}
  case "ccfluid": st.fluid+=250;st.log.push("NS 250 ml");txSound("click");drawPlayer('[data-tx="ccfluid"]');return true;
  case "ccadr": {const due=ccDue(c,st).includes("adr");
    if(c.pop==="paed"){const v=+(document.getElementById("ccadrin")||{}).value,want=Math.min(+(c.w*.01).toFixed(2),1);
      if(!due) return txErr("Adrenaline not due",st.lastAdr!=null?"Adrenaline repeats every 4 minutes (every second cycle).":"Shockable paediatric arrest: first adrenaline after 4 minutes of CPR.",undefined,{always:true}),true;
      if(Math.abs(v-want)>0.005) return txErr(`Adrenaline ${v||"blank"} mg`,`0.01 mg/kg × ${c.w} kg = ${want} mg (${(want*10).toFixed(1)} ml of 1:10,000).`,v>want?"A tenfold error with adrenaline in a child can cause dangerous arrhythmias.":undefined,{always:true}),true;
    } else if(!due){
      const why=c.pop==="trauma"?(st.hott.length<4||st.fluid<500?`Not yet: manage HOTT and give at least 500 ml normal saline first (${st.fluid} ml so far).`:"Adrenaline repeats every 4 minutes (every second cycle)."):st.lastAdr!=null?"Adrenaline repeats every 4 minutes (every second cycle).":"Adult medical shockable arrest: first adrenaline after the third shock.";
      return txErr("Adrenaline not due",why,c.pop==="trauma"&&st.fluid<500?"Adrenaline into an empty circulation won't restore output.":undefined,{always:true}),true;}
    st.given.push("adr");st.lastAdr=st.cyc;st.log.push(c.pop==="paed"?`Adr ${(c.w*.01).toFixed(2)} mg`:"Adr 1 mg");txLog(true,"Adrenaline cycle "+st.cyc);txSound("ok");drawPlayer();return true;}
  case "ccamio": {const d=ccDue(c,st),first=!st.amio1,want=c.pop==="paed"?Math.min(c.w*5,first?300:150):(first?300:150);
    const v=c.pop==="paed"?+(document.getElementById("ccamin")||{}).value:+t.dataset.v;
    if(!d.includes("amio1")&&!d.includes("amio2")) return txErr("Amiodarone not due",first?"First amiodarone is after the third shock.":st.amio2?"Both amiodarone doses have been given.":"The second amiodarone dose is after the fifth shock.",undefined,{always:true}),true;
    if(v!==want) return txErr(`Amiodarone ${v||"blank"} mg`,c.pop==="paed"?`5 mg/kg × ${c.w} kg = ${c.w*5} mg (max ${first?300:150} mg).`:first?"First dose after the third shock: 300 mg.":"Second dose after the fifth shock: 150 mg.",undefined,{always:true}),true;
    if(first){st.amio1=true;st.given.push("amio1");}else{st.amio2=true;st.given.push("amio2");}st.log.push(`Amio ${v} mg`);txLog(true,"Amiodarone "+v);txSound("ok");drawPlayer();return true;}
  case "cccont": {const d=ccDue(c,st);
    if(c.pop==="trauma"&&st.cyc===1&&(st.hott.length<4||st.fluid<500)) return txErr("HOTT not complete",`Work through all four HOTT causes and give at least 500 ml (${st.fluid} ml so far) during this cycle.`,"Uncorrected reversible causes mean CPR alone won't restore circulation.",{always:true}),true;
    if(d.length) return txErr("Drug due",`Due now: ${d.map(x=>({adr:"adrenaline",amio1:"amiodarone (first dose)",amio2:"amiodarone (second dose)"}[x])).join(" and ")}.`,undefined,{always:true}),true;
    st.cyc++;st.given=[];st.phase="check";txSound("click");drawPlayer();return true;}
  case "ccfi": {const S2=[0,1,2,3,4,5,6,7,9,12,15,25],k=S2.indexOf(st.fi)+ +t.dataset.d;if(k<0||k>=S2.length)return true;st.fi=S2[k];txSound("click");drawPlayer(`[data-tx="ccfi"][data-d="${t.dataset.d}"]`);return true;}
  case "ccspo": {const s2=st.spo;if(s2>=94&&s2<=98)txOk(`SpO₂ ${s2}%: within 94–98%. Avoid hyperoxaemia after ROSC.`,{next:"bp"});else txErr(`SpO₂ ${s2}%`,s2>98?"Too high. Titrate oxygen down to 94–98%; prolonged 100% is hyperoxaemia.":"Too low. Titrate oxygen up to 94–98%.",undefined,{always:true});return true;}
  case "ccbp": return pick(i===0,c.pop==="paed"?"10 ml/kg boluses after paediatric ROSC, titrated to the age-based SBP.":"250 ml boluses to SBP >90 / MAP >65, reassessing after each.","END","Fluid",c.pop==="paed"?(i===1?"Paediatric post-ROSC boluses are 10 ml/kg in v2.6.":"Vasopressor support isn't an AP decision; give fluid and escalate."):(i===1?"Give 250 ml boluses and reassess. Avoid overload.":"SBP 82 is below the >90 mmHg target.")),true;
  case "ccicey": {const yes=c.pop==="adult";return pick(i===(yes?0:1),yes?"Comatose adult after a medical arrest: start ice-pack cooling.":"Ice-pack cooling is only for comatose adults after a medical arrest. Monitor temperature and avoid hyperthermia.",yes?"place":"END","Cooling",yes?"This is a comatose adult after a medical arrest, so ice-pack cooling applies.":`Not for this patient (${c.pop==="paed"?"paediatric":"trauma"} arrest).`),true;}
  case "ccicez": {const z=ICEZ.find(x=>x.id===t.dataset.z);if(!z.ok){st.wrongId=z.id;return txErr(z.label,"Place the ice packs in the axillae and groin.",undefined,{always:true}),true;}
    st.wrongId=null;st.ice.push(z.id);txSound("snap");if(st.ice.length===3)txOk("Ice packs in both axillae and the groin.",{next:"temp"});else drawPlayer();return true;}
  case "cctemp": return pick(i===0,"Don't let the temperature fall below 33 °C, and update the hospital on the cooling measures.","END","Temperature",i===1?"Temperature must not fall below 33 °C.":"Ice packs go to the axillae and groin, and cooling should now be reduced, not increased.","Over-cooling below 33 °C risks arrhythmias and bleeding."),true;
  /* SMR */
  case "smrb": {const ok=(t.dataset.v==="keep")!==c.conscious;return pick(ok,c.conscious?"Remove the board once she's on the stretcher, particularly as it's causing distress.":"Keep the unconscious trauma patient on the combi-carrier.","blocks","Combi-carrier",c.conscious?"The combi-carrier is mainly an extrication and carrying device. Consider removing it on the stretcher.":"Unconscious trauma patients should be kept on the combi-carrier."),true;}
  case "smrh": return pick(t.dataset.v==="1","Head blocks always, on the board or the stretcher.","secure","Head blocks","Head blocks should be applied whether on the board or the stretcher."),true;
  case "smrs": return pick(i===0,c.conscious?"Off the board: secure with the stretcher straps.":"On the board: spider harness, plus the board secured with the stretcher straps.",c.conscious?"angle":"END","Securing",c.conscious?"Patients on the stretcher without the board are secured with the stretcher straps.":"On the board, use the spider harness and secure it to the stretcher with the stretcher straps."),true;
  case "smra": st.ang=Math.max(0,Math.min(60,st.ang+ +t.dataset.d));txSound("click");drawPlayer(`[data-tx="smra"][data-d="${t.dataset.d}"]`);return true;
  case "smrok": return pick(st.ang>0&&st.ang<=30,`${st.ang}°: within the 30° limit while maintaining SMR.`,"END",`${st.ang}°`,st.ang===0?"She's distressed lying flat. The stretcher may be raised, up to 30°.":"No more than 30° while maintaining SMR."),true;
  }
  return false;
}
TXS.ccrosc.foot=st=>st.phase==="o2"?`<button class="btn wide" data-tx="ccspo">Confirm oxygen</button>`:"";

/* ====================== solo-run results ====================== */
const RX_RUNS={
 nbr:{title:"Newborn resuscitation: solo run",stages:[["nrkit","Kit","nr-1"],["nrcord","Cord & airway","nr-1"],["nrset","BVM set-up","nr-2"],["nrbreath","Inflation breaths","nr-3"],["nrhr","Heart rate","nr-4"],["nrcomp","Compressions","nr-4"],["nrmon","Reassess","nr-5"],["nrglu","Glucose","nr-5"]]},
 code:{title:"Code clock: solo run",stages:[["ccpads","Pads on","cc-2"],["ccloop","Rhythm checks & drugs","cc-3"],["ccrosc","ROSC oxygen & BP","cc-6"],["ccice","Cooling","cc-6"]]}
};
function rxRunResult(kind){
  const ev=P.txEvents||[],R=RX_RUNS[kind],rows=R.stages.map(([k,t,l])=>{const e=ev.filter(x=>!x.ok&&x.stage===k);const h=(P.thHints&&P.thHints[k])||0;return {k,title:t,lesson:l,errors:e.length,hints:h,choices:[...new Set(e.map(x=>x.text))]};});
  return {kind,rows,first:rows.filter(r=>!r.errors&&!r.hints).length,errors:rows.reduce((n,r)=>n+r.errors,0),hints:rows.reduce((n,r)=>n+r.hints,0),time:Math.round((Date.now()-P.t0)/1000),label:P.rxc&&P.rxc.label};
}
function rxRunEnd(){
  const R=P.rxRes,good=R.first===R.rows.length;
  return `<div></div><div class="p-body"><div class="done wide">
   <div class="mate big"><img src="${TXM((good?"avatar-celebrate":"avatar-happy")+"-half.webp")}" alt="Crew mate" width="150"><div class="bubble"><p><b>${good?"Clean run.":"Your learning summary."}</b> ${good?"Every stage first time, without hints.":"Review the stages that needed another attempt or a hint."}</p></div></div>
   <span class="label">${RX_RUNS[R.kind].title}${R.label?" · "+R.label:""} · ${txFmt(R.time)}</span><h1 style="font-size:2rem">${R.first} / ${R.rows.length} stages first attempt</h1>
   <div class="tiles"><div class="tile"><b style="color:var(--good)">${R.first}</b><span>Without retries or hints</span></div><div class="tile"><b style="color:${R.errors?"var(--bad)":"var(--ink)"}">${R.errors}</b><span>Errors</span></div><div class="tile"><b style="color:var(--sun)">${R.hints}</b><span>Hints</span></div></div>
   <div class="res">${R.rows.map(r=>`<div class="resrow"><b>${r.title}</b><small class="${r.errors||r.hints?"no":"ok"}">${r.errors?r.errors+" error"+(r.errors>1?"s":""):""}${r.errors&&r.hints?" · ":""}${r.hints?r.hints+" hint"+(r.hints>1?"s":""):""}${!r.errors&&!r.hints?"First attempt":""}</small>${r.choices.length?`<p class="note" style="grid-column:1/-1;margin:0">To review: ${r.choices.join("; ")}.</p>`:""}${r.errors||r.hints?`<div class="revisit"><button class="btn ghost sm" data-revisit="${r.lesson}">Revisit: ${lessonById(r.lesson).l.title}</button></div>`:""}</div>`).join("")}</div>
  </div></div>
  <div class="p-foot"><div class="foot-in"><div class="foot-btns"><button class="btn ghost" data-act="retake">Run again</button><button class="btn" data-act="finish">Done</button></div></div></div>`;
}
function rxTop(s){
  const c=rxCase(s),k=P.l.scene;
  if(["nrintro","ccintro"].includes(s.stage)) return "";
  if(k==="nbr") return `<div class="pt"><div class="pt-id"><b>Newborn</b><span>${c.gest} weeks · ${c.weight} kg</span></div><div class="pt-v"><span>${c.gest<37?"Preterm":"Term"}</span><span>O₂ start <b>${nbO2(c)===21?"room air":"30%"}</b></span></div></div>`;
  if(k==="code") return `<div class="pt"><div class="pt-id"><b>${c.label.split(" · ")[0]}</b><span>${c.label.split(" · ").slice(1).join(" · ")}</span></div><div class="pt-v"><span>${c.pop==="paed"?"Weight <b>"+c.w+" kg</b>":"Monitor <b>"+c.device+"</b>"}</span></div></div>`;
  return `<div class="pt"><div class="pt-id"><b>Trauma patient</b><span>${c.conscious?"GCS 15 · neck pain":"GCS 6 · unconscious"}</span></div><div class="pt-v"><span>SMR</span></div></div>`;
}

function txReadback(c){const r=c.row,g=r.weight,b=`${c.name}, ${g} kg · Tranexamic acid 10 mg/mL`,u=Math.round(r.dose)/100,G=g+10;
 return[{ok:true,text:`${b} · ${r.dose} mg = ${r.volume} mL · IV · over 10 minutes`},{text:`${b} · ${r.dose} mg = ${u} mL · IV · over 10 minutes`,why:`At 10 mg/mL, ${r.dose} mg is ${r.volume} mL. ${u} mL would only be right for the undiluted 100 mg/mL ampoule.`,outcome:`The child would receive about ${Math.round(r.dose/10)} mg instead of ${r.dose} mg — a 90% underdose.`},{text:`${b} · ${r.dose} mg = ${r.volume} mL · IV · push over 1 minute`,why:"TXA is given slowly over 10 minutes.",outcome:"A rapid push of TXA can drop the child’s blood pressure."},{text:`${b} · ${r.dose} mg = ${r.volume} mL · IM · over 10 minutes`,why:"The route is IV, as on the label and the protocol.",outcome:"Giving the IV preparation by the wrong route means the dose does not work as intended."},{text:`${c.name}, ${G} kg · Tranexamic acid 10 mg/mL · ${G*15} mg = ${G*1.5} mL · IV · over 10 minutes`,why:`The weight must match the patient: ${g} kg, not ${G} kg.`,outcome:`The child would receive ${G*15} mg instead of ${r.dose} mg — an overdose.`}];}
function txTurn(st){st.turns++;txSound("slosh");const t=document.getElementById("txturns");if(t)t.textContent=st.turns;const s=document.getElementById("txstreak");if(s)s.style.opacity=Math.max(0,1-st.turns/3);}
function txBindHold(btn,done){
  let timer=null,t0=0;const ring=btn.querySelector(".ring circle");
  const stop=()=>{if(timer){cancelAnimationFrame(timer);timer=null;}if(ring)ring.style.strokeDashoffset="107";};
  const start=e=>{if(e)e.preventDefault();if(timer)return;t0=performance.now();const step=n=>{const k=Math.min(1,(n-t0)/800);if(ring)ring.style.strokeDashoffset=String(107*(1-k));if(k>=1){timer=null;done();}else timer=requestAnimationFrame(step);};timer=requestAnimationFrame(step);};
  btn.addEventListener("pointerdown",start);["pointerup","pointerleave","pointercancel"].forEach(k=>btn.addEventListener(k,stop));
  btn.addEventListener("keydown",e=>{if((e.key===" "||e.key==="Enter")&&!e.repeat)start(e);});btn.addEventListener("keyup",e=>{if(e.key===" "||e.key==="Enter")stop();});
}

/* ---------- actions ---------- */
function txClick(t){
  const s=P.steps[P.i],st=P.sx,c=txCaseFor(s),a=t.dataset.tx,i=t.dataset.i!==undefined?+t.dataset.i:null;
  if(a==="cont"){const f=st.fb;st.fb=null;st.mood=st.guide?st.guide[st.guide.length-1][0]:"neutral";txGo(f.next);return;}
  if(a==="dismiss"){st.fb=null;st.mood=st.guide?st.guide[st.guide.length-1][0]:"neutral";drawPlayer();return;}
  if(a==="hint"){st.hint=!st.hint;if(st.hint&&st.tag){const k=st.tag+":"+st.phase;P.thHintKeys=P.thHintKeys||{};if(!P.thHintKeys[k]){P.thHintKeys[k]=1;P.thHints=P.thHints||{};P.thHints[st.tag]=(P.thHints[st.tag]||0)+1;}}drawPlayer('[data-tx="hint"]');return;}
  if(a==="sound"){S.txSound=!txSoundOn();save();if(!txSoundOn())txHush();drawPlayer('[data-tx="sound"]');return;}
  if(a==="chart"){P.chartOpen=!P.chartOpen;drawPlayer(P.chartOpen?'[data-tx="chart-close"]':'[data-tx="chart"]');return;}
  if(a==="chart-close"){P.chartOpen=false;drawPlayer('[data-tx="chart"]');return;}
  if(a==="case"){P.caseOpen=!P.caseOpen;drawPlayer('[data-tx="case"]');return;}
  if(a==="intr"){const q=TX_INTERRUPT[P.intr.i];const ok=i===q.a;P.intr=null;if(ok){txLog(true,"Interruption handled");txSound("ok");drawPlayer();}else{txErr("Interruption answered incorrectly",`The right answer was: ${q.opts[q.a]}.`);}return;}
  if(st.fb&&!st.fb.ok&&a!=="dismiss")return;
  if(st.step&&thClick(t,st))return;
  if(st.rx&&rxClick(t,st))return;
  switch(a){
   case "intro-go": nextStep(); return;
   case "decide": { const yes=t.dataset.v==="1";
     if(yes===c.indicated){txSound("click");st.phase="why";drawPlayer('[data-tx="crit"]');}
     else txErr(c.indicated?"Withheld TXA despite indication":"Gave TXA despite contraindication",c.indicated?`This child meets the AP criteria: ${c.reason}`:`TXA is contraindicated here. ${c.reason}`,TX_MISSED[c.criterion]);
     return; }
   case "crit": { const pick=st.crit[i];
     if(pick.id===c.criterion) txOk(c.indicated?`Eligibility and indication confirmed: ${c.reason}`:`TXA correctly withheld: ${c.reason}${s.case==="run"?" Next patient.":""}`,{next:"END"});
     else txErr("Wrong criterion","Look again at the time since injury, the findings, the GCS and the allergies.");
     return; }
   case "kit": { const id=t.dataset.id;st.sel=st.sel.includes(id)?st.sel.filter(x=>x!==id):[...st.sel,id];txSound("click");drawPlayer(`[data-id="${id}"]`);return; }
   case "kit-confirm": { const miss=TX_KIT.filter(k=>k.ok&&!st.sel.includes(k.id)),extra=TX_KIT.filter(k=>!k.ok&&st.sel.includes(k.id));
     if(!miss.length&&!extra.length){txOk("Correct equipment selected.",{next:"END"});return;}
     const out=extra.map(k=>TX_KITWHY[k.id]).find(Boolean)||(miss.some(k=>k.id==="sharps")?"Without a sharps container the ampoule glass and needle have nowhere safe to go on scene.":undefined);
     txErr("Equipment selection error",`${miss.length?"Missing: "+miss.map(k=>k.name).join(", ")+". ":""}${extra.length?"Not required: "+extra.map(k=>k.name).join(", ")+".":""}`,out);return; }
   case "row": { const id=t.dataset.row,inf=c.ageMonths!==undefined,want=inf?"0":String(c.row.age);
     if(id===want){txSound("click");st.row=id;st.rowMsg=inf?"0–12 months row: estimate the weight with the formula.":`${c.row.age}-year row: ${c.row.weight} kg`;st.phase="calc";txLog(true,"Found the chart row");drawPlayer('[data-txin]');}
     else{const r=id==="0"?null:TX_CHART.find(x=>String(x.age)===id);txErr("Wrong chart row",`${c.name} is ${c.ageLabel}. Use the ${inf?"0–12 months":c.row.age+"-year"} row.`,r?txNs(r.dose,c.row.dose):`Using the infant formula for a ${c.row.age}-year-old gives the wrong weight and dose.`);}
     return; }
   case "dose-check": { const h=c.row,x=h.weight*15,v=st.vals,inf=c.ageMonths!==undefined,list=[];
     if(inf&&!txKn(v.w,h.weight))list.push(`weight = (${c.ageMonths} × 0.5) + 4 = ${h.weight} kg`);
     const okD=txKn(v.d,h.dose,2)||txKn(v.d,x,2),okV=txKn(v.v,h.volume)||txKn(v.v,x/10);
     if(!okD)list.push(`dose = ${h.weight} kg × 15 mg/kg = ${h.dose} mg`);if(!okV)list.push(`volume = dose ÷ 10 mg/mL = ${h.volume} mL`);
     if(c.large&&!txKn(v.o,h.drawOut||0))list.push(`draw out and discard ${h.drawOut} mL (from the chart)`);
     if(!list.length){txOk(`Dose calculated: ${h.dose} mg = ${h.volume} mL.`,{next:"END"});return;}
     const out=!okD&&Number(v.d)>0?txNs(Number(v.d),h.dose):!okV&&Number(v.v)>0?txNs(Number(v.v)*10,h.dose):undefined;
     txErr("Dose calculation error",`Check: ${list.join("; ")}.`,out);return; }
   case "next": { const o=st.next[i];
     if(o.ok){st.v=0;txOk("Correct: draw out 10 mL of NSS before adding TXA.",{next:"draw"});} else txErr("Incorrect next action","Draw out 10 mL of NSS first to make room for the 10 mL of TXA.",o.outcome);return; }
   case "fine": st.fine=!st.fine;drawPlayer('[data-tx="fine"]');return;
   case "nudge": { txSetV(st.v+Number(t.dataset.d),st.key==="drawup"&&st.phase==="draw"?Math.min(10,(10-st.rem[0]-st.rem[1])+st.rem[st.amp]):undefined);st.vr=st.v;return; }
   case "room-confirm": { if(Math.abs(st.v-10)<.05) txOk("Drew out 10 mL NSS from the bag with the 50 mL syringe.",{next:"discard"});
     else txErr("Wrong volume drawn out","Draw out exactly 10 mL of NSS from the 100 mL bag.",`With ${st.v.toFixed(1)} mL removed, the bag would end up at about ${(1000/(100-st.v)).toFixed(1)} mg/mL instead of 10 mg/mL once the TXA is added.`);return; }
   case "disc": { const o=st.disc[i]; if(o.ok) txOk("Discarded the 10 mL NSS drawn from the bag. The bag now holds 90 mL.",{next:"END"}); else txErr("Drawn NSS not discarded","The 10 mL of NSS drawn out must be discarded.",o.outcome);return; }
   case "open-first": txErr("Opened ampoules before double-checking","Always double-check the drug name, strength, clarity and expiry with a colleague before opening.","An unchecked ampoule could be the wrong drug, cloudy or out of date — and once snapped open it cannot be returned.");return;
   case "dq-start": txSound("click");st.phase="dq";drawPlayer('[data-tx="dq"]');return;
   case "dq": { const o=st.dq[i]; if(o.ok){txSound("click");st.phase="video";drawPlayer("#txvid");} else txErr("Expected the wrong double-check read-back",o.why,o.outcome);return; }
   case "vid-ok": if(st.watched) txOk("Medication double-checked: name, strength, clarity and expiry.",{next:"snap"});return;
   case "snap-done": txOk("Opened both TXA ampoules.",{quiet:true,next:"draw"});return;
   case "amp2": st.amp=1;txSound("click");drawPlayer("#txrig");return;
   case "draw-confirm": if(st.v>=10) txOk("Drew up both 5 mL ampoules: 1 g TXA (10 mL).",{next:"inject"});return;
   case "inj": { const o=st.inj[i]; if(o.ok){st.v=10;st.vr=10;st.confirmLabel=()=>"Continue to labelling";st.confirmDisabled=v=>v>.05;} if(o.ok) txOk("Correct: inject all 10 mL (1 g) of TXA into the 90 mL bag via its medication port, making 100 mL.",{next:"push"});
     else txErr("Incorrect action after drawing TXA","Add all 10 mL of TXA to the 90 mL normal saline bag via its medication port to make 100 mL total, then label it immediately.",o.outcome);return; }
   case "inj-done": if(st.v<=.05) txOk("Added 1 g TXA to the bag: 1 g in 100 mL (10 mg/mL).",{quiet:true,next:"END"});return;
   case "now": { const d=new Date(),p=x=>String(x).padStart(2,"0");st.vals.date=`${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()}`;st.vals.time=`${p(d.getHours())}:${p(d.getMinutes())}`;drawPlayer('[data-tx="now"]');return; }
   case "right": { const r=t.dataset.r;st.rights=st.rights.includes(r)?st.rights.filter(x=>x!==r):[...st.rights,r];txSound("click");drawPlayer(`[data-r="${r}"]`);return; }
   case "label-confirm": { const bad=TX_LABEL.filter(f=>{const want=f.ans(c),got=String(st.vals[f.key]??"").trim();return want instanceof RegExp?!want.test(got):(got===""||Math.abs(parseFloat(got)-want)>.01);}).map(f=>f.name+(f.unit?` (${f.unit})`:""));
     if(bad.length){txErr("Incomplete or incorrect label",`Check: ${[...new Set(bad)].join(", ")}.`,"An incomplete label makes the bag an unknown drug to the next person who picks it up.");return;}
     P.lab={...st.vals};if(P.txMode==="guided"){S.txLabel={...st.vals};save();}
     txLog(true,"Label completed");txSound("click");st.phase="attach";drawPlayer();return; }
   case "rights-ok": if(st.rights.length===5){txLog(true,"5 Rights ticked");txSound("click");st.phase="readback";drawPlayer('[data-tx="rb"]');} else txErr("5 Rights not cross-checked",`Tick all five: ${TX_RIGHTS.filter(x=>!st.rights.includes(x)).join(", ")} still unchecked.`,"Skipping a right is how the wrong dose, route or patient slips through.");return;
   case "rb": { const o=st.rb[i]; if(o.ok) txOk(`5 Rights cross-checked for ${c.name}.`,{next:"draw"}); else txErr("Wrong 5 Rights read-back",o.why,o.outcome);return; }
   case "turn": txTurn(st);return;
   case "mix-done": if(st.turns>=3) txOk("Mixed the bag gently.",{next:"END"}); else txErr("Inadequate mixing","Turn the bag slowly at least 3 times to mix.","If the TXA is not mixed through, the first millilitres drawn may be much stronger or weaker than 10 mg/mL.");return;
   case "give-confirm": { const r=c.row,C=c.large?r.drawOut:r.volume,v=st.v;
     if(Math.abs(v-C)<.6) txOk(c.large?`Drew out and discarded ${C} mL. The remaining volume is given.`:`Drew up ${r.volume} mL (${r.dose} mg).`,{next:"line"});
     else{const j=c.large?(90-v)*10:v*10;txErr("Wrong volume drawn",c.large?`For ${r.age} years draw out ${r.drawOut} mL (chart), leaving ${r.volume} mL to give.`:`${r.dose} mg ÷ 10 mg/mL = ${r.volume} mL.`,j>0?txNs(j,r.dose):undefined);}
     return; }
   case "line": { if(i===st.line.length){st.line.push(i);txSound("click");if(st.line.length===3)txOk("Line set up in order: giving set primed, stopcock attached, connected and flush-checked.",{next:"rate"});else drawPlayer('.lineitem:not([disabled])');}
     else txErr("Line set-up order",`The next step should be: ${TX_LINE[st.line.length].t}.`);return; }
   case "rate": { const n=+t.dataset.n; if(n===10) txOk("Rate set: over 10 minutes.",{quiet:true,next:"infuse"}); else txErr("Incorrect administration rate","TXA is given slowly over 10 minutes.",TX_RATE[n]);return; }
   case "inf-run": st.run=!st.run;txInfTimer(st,c);drawPlayer('[data-tx="inf-run"]');return;
   case "inf-speed": st.speed=st.speed===1?30:1;drawPlayer('[data-tx="inf-speed"]');return;
   case "time-now": { const d=new Date();st.time=d.toTimeString().slice(0,5);drawPlayer('[data-tx="doc"]');return; }
   case "doc": if(String(st.time).trim()) txOk(`Gave ${c.row.dose} mg over 10 minutes, documented at ${st.time}.`,{next:"END"});
     else txErr("Administration not documented","Document the time administered.","Without a recorded time the receiving team cannot tell when TXA was given, risking a duplicate dose.");return;
   case "bin": { const b=TX_BINS.find(x=>x.id===t.dataset.id),w=t.dataset.w;
     if((w==="sharps")!==b.sharp){txErr(`${b.name} in wrong bin`,b.sharp?`${b.name} must go in the sharps bin.`:"Non-sharp packaging goes in general waste.",b.sharp?`${b.name} in the general bag can cut or stab a crew mate or cleaner — a sharps injury needs urgent follow-up.`:undefined);return;}
     st.done.push({id:b.id,where:w});txSound(w==="sharps"?"bin":"click");
     if(st.done.length===TX_BINS.length) txOk("Equipment disposed of correctly.",{next:"END"}); else drawPlayer('.binitem:not(.on) .btn');return; }
  }
}
function txInfTimer(st,c){
  clearInterval(P.infT);
  if(!st.run)return;
  P.infT=setInterval(()=>{ if(!P||P.sx!==st){clearInterval(P&&P.infT);return;}
    st.left=Math.max(0,st.left-st.speed);const give=c.row.volume,del=Math.round(give*(1-st.left/600)*10)/10;
    const a=document.getElementById("txclockbig");if(a)a.textContent=txFmt(st.left);
    const d=document.getElementById("txdel");if(d)d.textContent=`Delivered ${del} / ${give} mL (${Math.round(del*10)} mg)`;
    const b=document.getElementById("txinfbar");if(b)b.style.width=(1-st.left/600)*100+"%";
    if(st.left<=0){clearInterval(P.infT);st.run=false;txSound("alert");st.phase="doc";drawPlayer('[data-txin="time"]');}
  },1000);
}
function txInput(el){
  const st=P&&P.sx;if(!st)return;const k=el.dataset.txin;
  if(k.startsWith("lab:")){const f=k.slice(4);st.vals[f]=el.value;const sp=document.getElementById("txlab-"+f);if(sp)sp.textContent=el.value;return;}
  if(k==="time"){st.time=el.value;return;}
  st.vals[k]=el.value;
}

/* ---------- shell: top bar, body, footer ---------- */
function txTopHTML(s){
  const st=P.sx,c=txCaseFor(s),phases=TXS[s.stage].phases,pi=Math.max(0,phases.indexOf(st.phase));
  const pct=((P.i+pi/phases.length)/P.steps.length)*100,run=P.txMode!=="guided",el=Math.round((Date.now()-P.t0)/1000);
  const thermo=P.l.scene==="thermo";
  const label=P.l.txRun?`${TX_STAGE_NAMES[s.stage]||"Briefing"}`:P.l.thRun?`${P.i+1}/${P.steps.length}`:`${P.i+1}/${P.steps.length}`;
  const showPt=s.stage!=="intro"&&s.stage!=="thintro";
  return `<div class="p-top scene-top"><button class="x" data-act="close" aria-label="Close">${I.x}</button>
   <div class="bar" role="progressbar" aria-label="Progress" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
   <span class="count">${label}</span>
   ${run?`<span class="clock ${P.txMode==="pressure"&&el>TX_TARGET?"over":""}" id="txclock">${txFmt(el)}${P.txMode==="pressure"?" / "+txFmt(TX_TARGET):""}</span>`:""}
   ${P.l.scene!==true?"":`<button class="tbtn" data-tx="chart" ${s.stage==="dose"?"disabled title=\"Hidden while you calculate\"":""} aria-label="Dose chart">${I.book}</button>`}
   <button class="tbtn" data-tx="sound" aria-pressed="${txSoundOn()}" aria-label="${txSoundOn()?"Mute sound and voice":"Turn on sound and voice"}">${txSoundOn()?I.sound:I.mute}</button></div>
   ${["nbr","code","smr"].includes(P.l.scene)?rxTop(s):showPt&&thermo?`<div class="pt"><div class="pt-id"><b>Newborn</b><span>term · just born</span></div><div class="pt-v"><span class="tmp">Temp <b>${P.thTemp?P.thTemp.toFixed(1)+" °C":"not yet measured"}</b></span><span>Target <b>${P.thTemp?"36.5–37.5 °C":"—"}</b></span></div></div>`:showPt?`<div class="pt"><div class="pt-id"><b>${c.name}</b><span>${c.ageLabel}</span></div><div class="pt-v"><span class="hr"><i class="beat" style="animation-duration:${(60/c.hr).toFixed(2)}s"></i>${c.hr}</span><span>SBP <b>${c.sbp}</b></span><span>GCS <b>${c.gcs}</b></span></div><button class="pt-more" data-tx="case" aria-expanded="${!!P.caseOpen}">Case</button></div>
   ${P.caseOpen?`<div class="pt-case"><p><b>Mechanism:</b> ${c.mechanism}</p><p><b>Findings:</b> ${c.findings}</p><p><b>Time since injury:</b> ${c.injuryMins} min · <b>Allergies:</b> ${c.allergy}</p></div>`:""}`:""}`;
}
function txBody(s){
  const st=txSx(s),c=txCaseFor(s),hint=TXS[s.stage].hint?(cc=>TXS[s.stage].hint(cc,st)):(P.txMode==="guided"&&TX_HINT[s.stage]);
  const h=typeof hint==="function"?hint(c):hint;
  return `${s.stage!=="intro"?txGuideHTML(st):""}${st.hint&&h?`<div class="info hintbox"><b>Hint:</b> ${h}</div>`:""}${TXS[s.stage].body(st,c)}`;
}
function txFoot(s){
  const st=P.sx;
  if(st.fb&&st.fb.ok) return `<div class="fb"><h3>${I.check.replace('<svg','<svg width="22" height="22"')} Correct</h3><p>${st.fb.msg}</p></div><button class="btn good wide" data-tx="cont">Continue</button>`;
  if(st.fb) return `<div class="fb"><h3>Not quite</h3><p>${st.fb.msg}</p>${st.fb.outcome?`<p class="conseq"><b>If this happened on scene:</b> ${st.fb.outcome}</p>`:""}</div><button class="btn bad wide" data-tx="dismiss">Try again</button>`;
  const hint=(TXS[s.stage].hint||(P.txMode==="guided"&&TX_HINT[s.stage]))&&s.stage!=="intro"&&s.stage!=="thintro"&&!(st.phase==="process");
  const main=TXS[s.stage].foot?TXS[s.stage].foot(st,txCaseFor(s)):"";
  if(!main&&!hint) return `<p class="note" style="text-align:center;margin:0">${P.txMode==="guided"?"Choose an option above.":"Work through the task above."}</p>`;
  return `<div class="foot-btns">${hint?`<button class="btn ghost" data-tx="hint" aria-pressed="${st.hint}" style="flex:0 0 auto;min-width:0">Hint</button>`:""}${main}</div>`;
}
function txOverlays(s){
  let o="";
  if(P.chartOpen) o+=`<div class="sheet" role="dialog" aria-label="Dose chart"><div class="sheet-in"><div class="section-head"><h2 style="font-size:1.2rem">Dose chart</h2><button class="btn ghost sm" data-tx="chart-close">Close</button></div><div class="visual">${V.txachart}</div></div></div>`;
  if(P.intr){const q=TX_INTERRUPT[P.intr.i];o+=`<div class="sheet" role="alertdialog" aria-label="Interruption"><div class="sheet-in"><div class="mate"><img src="${txBust("urgent")}" alt="" width="64" height="64"><div class="bubble"><p><b>Interruption</b></p><p>${q.q}</p></div></div><div class="opts">${q.opts.map((x,i)=>`<button class="opt" data-tx="intr" data-i="${i}"><span class="k">${String.fromCharCode(65+i)}</span>${x}</button>`).join("")}</div></div></div>`;}
  return o;
}
function txAfter(s){ const st=P.sx; TXS[s.stage].after&&TXS[s.stage].after(st,txCaseFor(s)); }
function txStartRunTimer(){
  clearInterval(P.tick);
  if(P.txMode==="guided")return;
  P.lastIntr=Date.now();P.intrIdx=0;
  P.tick=setInterval(()=>{ if(!P||!P.l||(!P.l.txRun&&!P.l.rxRun)){clearInterval(P&&P.tick);return;}
    const el=Math.round((Date.now()-P.t0)/1000),ck=document.getElementById("txclock");
    if(ck){ck.textContent=txFmt(el)+(P.txMode==="pressure"?" / "+txFmt(TX_TARGET):"");ck.classList.toggle("over",P.txMode==="pressure"&&el>TX_TARGET);}
    if(P.l.txRun&&P.txMode==="pressure"&&!P.intr&&P.status!=="complete"&&P.sx&&!P.sx.fb&&P.intrIdx<TX_INTERRUPT.length&&Date.now()-P.lastIntr>45000){
      P.intr={i:P.intrIdx++};P.lastIntr=Date.now();txSound("alert");drawPlayer('[data-tx="intr"]');}
  },1000);
}
function txRunResult(){
  const ev=P.txEvents||[],errs=ev.filter(e=>!e.ok),time=Math.round((Date.now()-P.t0)/1000);
  const over=P.txMode==="pressure"&&time>TX_TARGET,score=Math.max(0,100-errs.length*10-(over?10:0));
  const byStage=Object.keys(TX_STAGE_NAMES).map(k=>({k,name:TX_STAGE_NAMES[k],n:errs.filter(e=>e.stage===k).length}));
  const tech=TX_TECH.map(([n,re])=>({n,ok:!errs.some(e=>re.test(e.text))}));
  return {score,time,over,errs,byStage,tech,comp:score>=80};
}
function txRunEnd(){
  const R=P.runRes;
  return `<div></div><div class="p-body"><div class="done wide">
   <div class="mate big"><img src="${TXM((R.comp?"avatar-celebrate":"avatar-happy")+"-half.webp")}" alt="Crew mate" width="150"><div class="bubble"><p><b>${R.comp?"Well done.":"Good effort."}</b> ${R.comp?"You prepared and gave the TXA safely.":"Review the steps below, then try again."}</p></div></div>
   <span class="label">${P.txMode==="pressure"?"Pressure":"Independent"} run · ${P.runCase.name}, ${P.runCase.ageLabel}</span>
   <h1 style="font-size:2rem">${R.score}% · ${R.comp?"Competent":"Needs review"}</h1>
   <div class="tiles"><div class="tile"><b style="color:var(--accent)">${R.score}%</b><span>Score</span></div><div class="tile"><b style="color:${R.over?"var(--bad)":"var(--ink)"}">${txFmt(R.time)}</b><span>${P.txMode==="pressure"?"Time · target 08:00":"Time"}</span></div><div class="tile"><b style="color:${R.errs.length?"var(--bad)":"var(--good)"}">${R.errs.length}</b><span>Errors</span></div></div>
   <div class="res">${R.byStage.map(b=>`<div class="resrow"><b>${b.name}</b><small class="${b.n?"no":"ok"}">${b.n?b.n+" error"+(b.n>1?"s":""):"First try"}</small>${b.n?`<div class="revisit"><button class="btn ghost sm" data-revisit="${TX_STAGE_LESSON[b.k]}">Revisit: ${TX_STAGE_NAMES[b.k]}</button></div>`:""}</div>`).join("")}</div>
   <div class="res"><div class="resrow" style="display:block"><b>Technique ${R.tech.filter(x=>x.ok).length}/${R.tech.length}</b><p class="note" style="margin:4px 0 8px">A skill counts only if it was done right first time.</p><ul class="techlist">${R.tech.map(x=>`<li class="${x.ok?"ok":"no"}">${x.ok?I.check:I.x}${x.n}</li>`).join("")}</ul></div></div>
  </div></div>
  <div class="p-foot"><div class="foot-in"><div class="foot-btns">${P.txMode==="independent"?`<button class="btn ghost" data-act="tx-pressure">Try pressure mode</button>`:`<button class="btn ghost" data-act="retake">Run again</button>`}<button class="btn" data-act="finish">Done</button></div></div></div>`;
}

