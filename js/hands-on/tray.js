/* ============================ TXA HANDS-ON WORKBENCH (prototype) ============================
   Equipment drawn in code (SVG). The learner does each action:
   move the 50 mL syringe to a target (drag it, or tap it then tap the target), then pull or push the plunger.
   Fluid really moves: bag, syringe, ampoules and kidney basin update as the plunger moves.
   Free order with consequences: rules are checked when the syringe leaves a target (and on a few immediate actions),
   using the existing TXA feedback titles so the Solo Run report keeps working.
   Prototype scope: make room (draw 10 mL, discard), double-check, snap ampoules, draw up 1 g, inject into the bag.
   Fluid colours are teaching aids (saline blue, TXA violet); both are clear in reality. */
const WB={W:900,H:600,SC:.7,ML:4};                      // syringe: 4 px per mL along the barrel, scaled by SC
// docking points: tip position and direction (up: tip at top, plunger pulled downward; down: tip at bottom, plunger pulled upward)
const WB_DOCK={bag:{x:400,y:311,dir:"up",lab:"saline bag port"},basin:{x:700,y:420,dir:"down",lab:"kidney basin"},a0:{x:130,y:432,dir:"down",lab:"ampoule 1"},a1:{x:200,y:432,dir:"down",lab:"ampoule 2"},tap:{x:523,y:662,dir:"down",lab:"three-way tap"}};
// patient's arm with cannula and three-way tap, below the tray once the bag is labelled (photo tx/wb/arm.webp, 710×360, side port tip at 490,92)
const WB_ARM={x:180,y:600,k:.7},WB_TAP=[WB_ARM.x+490*WB_ARM.k,WB_ARM.y+92*WB_ARM.k];
const wbWH=st=>[WB.W,st&&st.labeled?840:WB.H];
const WB_REST={x:520,y:400};                           // syringe lying on the tray, tip pointing left
const wbV=s=>s.nss+s.txa;
function wbInit(st){Object.assign(st,{syr:{nss:0,txa:0,at:null},bag:{nss:100,txa:0},amps:[{txa:5,open:false},{txa:5,open:false}],basin:{nss:0,txa:0},
  checked:false,lineOn:false,room:false,added:false,labeled:false,turns:0,mixed:false,doseOk:false,doseDiscarded:false,rateOk:false,setOn:false,stopOn:false,running:false,chamber:0,primed:false,priming:false,clampOpen:false,done:false,sel:false,msg:null,glass:{t0:null,t1:null,a0:null,a1:null},glassSel:null,label:null,rate:false});}
/* ---------- drawing: realistic equipment, gloved hands ---------- */
const wbFluid=s=>{const v=wbV(s);if(v<.05)return "none";const f=s.txa/v;return f>.95?"url(#wbTxa)":f<.05?"url(#wbNss)":"url(#wbMix)";};
// nitrile glove, drawn in a hand-local frame
const WB_GLOVE=`<g class="wb-glove">
 <path d="M-30 58q-4 22 0 40h62q4-18 0-40z" class="gc"/><path d="M-30 66h62M-30 74h62M-31 82h63M-31 90h63" class="gr"/>
 <path d="M-58 -30q-8-10-2-18q7-8 16-2l20 22q8 10 4 22z" class="gf"/>
 <path d="M-27 -44q-2-30 4-40q5-7 11-4q5 3 5 10v36z" class="gf"/>
 <path d="M-9 -48q-1-36 5-46q5-7 11-4q5 3 5 10v42z" class="gf"/>
 <path d="M10 -46q0-32 6-41q5-6 10-3q5 3 5 10v36z" class="gf"/>
 <path d="M28 -36q1-24 6-31q4-5 9-2q4 3 4 9l-2 28z" class="gf"/>
 <path d="M-36 -18q-4-20 6-30q10-6 32-6q30 0 40 8q10 10 6 34q-2 30-8 52q-4 12-34 12q-30 0-36-14q-8-24-6-56z" class="gp"/>
 <path d="M-27 -48q4 4 0 8M-9 -52q4 4 0 8M10 -50q4 4 0 8M28 -40q4 4 0 8" class="gk"/>
 <path d="M-26 -84q3-3 6 0M-8 -94q3-3 6 0M11 -87q3-3 6 0M29 -67q3-3 6 0" class="gn"/>
 <ellipse cx="6" cy="-6" rx="22" ry="30" class="gh"/><path d="M-20 20q16 8 38 0M-14 36q12 5 26 0" class="gw"/>
 <path d="M-50 -38q6 4 10 10" class="gk"/></g>`;
const wbHand=(x,y,rot,sc,cls="")=>`<g class="wb-hand ${cls}" transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})">${WB_GLOVE}</g>`;
// photos (tx/wb/). Measured on the originals: barrel 0 mL at x=254, 23.6 px per mL; plunger stopper front x=92, handle centre x=2030.
const WBI=n=>TXM("wb/"+n+".webp");
const wbImg=(n,x,y,w,h,ex="")=>`<image href="${WBI(n)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none" ${ex}/>`;
// photo along the syringe axis: photo x → local +y (from px0, placed at ty), photo y → local x (centred on pyc)
const wbRot=(n,W,H,px0,pyc,sx,sy,ty,ex="")=>`<g transform="translate(0 ${ty}) rotate(90)">${wbImg(n,-px0*sx,-pyc*sy,W*sx,H*sy,ex)}</g>`;
const WB_HANDLE=311; // stopper front → handle centre, local units
const wbCarry=()=>`<g class="wb-hand hold" transform="rotate(90)">${wbImg("hand-carry",150-620*.15,-360*.15,1942*.15,809*.15)}</g>`;
const wbNeedle=s=>`<g class="wb-ndl">${s.at==="bag"?`<clipPath id="wbNdClip"><rect x="-30" y="-27" width="60" height="40"/></clipPath>`:""}<g ${s.at==="bag"?'clip-path="url(#wbNdClip)"':""}>${wbRot("needle",2172,724,2082,360,.04,.04,-4)}</g></g>`;
function wbSyringe(st){const s=st.syr,v=wbV(s),d=s.at?WB_DOCK[s.at]:null,flip=d&&d.dir==="down";
  const tf=d?`translate(${d.x} ${d.y}) rotate(${flip?180:0}) scale(${WB.SC})`:`translate(${WB_REST.x} ${WB_REST.y}) rotate(-90) scale(${WB.SC})`;
  const stop=14+v*WB.ML;
  return `<g id="wbSyr" class="wb-syr ${st.sel?"sel":""} ${d?"docked":""}" transform="${tf}">
   ${(d&&s.at!=="tap")||st.sel?wbNeedle(s):""}
   ${wbRot("barrel",2172,724,254,372,.1695,.1695,14)}
   <rect id="wbSyrFluid" x="-20" y="14" width="40" height="${Math.max(0,v*WB.ML)}" fill="${wbFluid(s)}" class="wb-sfl"/>
   <g id="wbPl" transform="translate(0 ${stop})">${d?`<clipPath id="wbPlClip"><rect x="-40" y="-10" width="80" height="${WB_HANDLE}"/></clipPath>`:""}<g ${d?'clip-path="url(#wbPlClip)"':""}>${wbRot("plunger",2172,724,92,378,.1605,.115,0)}</g></g>
   <rect x="-28" y="-8" width="56" height="300" fill="transparent" data-syr="1"/>
   <g id="wbPl2" transform="translate(0 ${stop})"><rect x="-26" y="${WB_HANDLE-10}" width="52" height="20" fill="transparent" class="wb-handle-hit" data-h="1"/>
    ${d?`<g class="wb-plhint" transform="translate(0 ${WB_HANDLE-210})"><path d="M44 196l8-10 8 10M44 230l8 10 8-10M52 188v50" /></g>${wbRot("hand-plunger",992,724,130,276,.18,.18,WB_HANDLE,'class="wb-hand pl"')}`:""}
    <rect x="-34" y="${WB_HANDLE-16}" width="68" height="${d?110:36}" fill="transparent" data-h="1"/></g>
   ${s.carry?wbCarry():""}</g>`;}
function wbBag(st){const b=st.bag,v=b.nss+b.txa,top=258-v*2,sx=(.9+.1*Math.min(1,v/100)).toFixed(3);
  return `<g class="wb-bag" data-zone="bag"><g id="wbBagRot" transform="rotate(${st.rot||0} 415 150)"><g id="wbBagShape" transform="translate(415 0) scale(${sx} 1) translate(-415 0)">
   ${wbImg("bag",320,13.8,191,286.6,'filter="url(#wbSh)"')}
   <clipPath id="wbBagClip"><rect x="350" y="36" width="130" height="224" rx="12"/></clipPath>
   <rect id="wbBagFluid" x="345" y="${top}" width="140" height="${262-top}" fill="${wbFluid(b)}" clip-path="url(#wbBagClip)" class="wb-bfl"/><path id="wbBagLine" d="M350 ${top}h130" class="wb-meniscus"/>
   ${st.labeled?`<g class="wb-sticker"><rect x="352" y="196" width="126" height="56" rx="3"/><text x="358" y="211" class="wb-t sb">Tranexamic Acid</text><rect x="444" y="200" width="18" height="15" class="wb-stbox"/><text x="453" y="211" text-anchor="middle" class="wb-t b">${txEsc((P.lab&&P.lab.conc)||"")}</text><text x="464" y="206" class="wb-t xs">mg/</text><text x="464" y="213" class="wb-t xs">mL</text><text x="358" y="228" class="wb-t s">${txEsc((P.lab&&P.lab.date)||"")} ${txEsc((P.lab&&P.lab.time)||"")} · ${txEsc((P.lab&&P.lab.weight)||"")} kg</text><text x="358" y="243" class="wb-t s">1000 mg in 10 mL → 100 mL</text></g>`:""}
   <g id="wbSwirl" class="wb-swirl"><circle cx="400" cy="240" r="8"/><circle cx="400" cy="240" r="16"/></g>
   <rect x="345" y="30" width="140" height="232" rx="14" class="wb-bagbody"/></g>
   <rect x="389" y="262" width="22" height="32" rx="6" class="wb-portring"/></g>
   <rect x="343" y="28" width="145" height="234" fill="transparent" data-bagbody="1"/>
   <rect x="370" y="250" width="60" height="70" fill="transparent" data-zone="bag" class="wb-dz" rx="10"/></g>`;}
const wbAmpLv=t=>t/5*86;
function wbAmp(st,i){if(st.glass["a"+i])return "";const a=st.amps[i],x=i?200:130,lv=wbAmpLv(a.txa);
  return `<g class="wb-amp ${a.open?"open":""}" data-amp="${i}"><rect x="${x-13}" y="${547-lv}" width="26" height="${lv}" fill="url(#wbTxa)" rx="3" class="wb-afl"/>
   <ellipse cx="${x}" cy="548" rx="17" ry="4" class="wb-shadow"/>
   ${wbImg(a.open?"amp-open":"amp",x-55,392,110,165,'class="wb-ampimg"')}<rect x="${x-13}" y="${547-lv}" width="26" height="${lv}" fill="url(#wbTxa)" rx="3" class="wb-afl2"/>
   <rect x="${x-24}" y="392" width="48" height="160" fill="transparent" data-amp="${i}" data-zone="a${i}" class="wb-dz ${a.open?"":"shut"}" rx="10"/></g>`;}
function wbScene(st){const b=st.basin,bv=b.nss+b.txa,c=st.cam||wbCam(st),[sw,sh]=wbWH(st);
  return `<svg class="wb-svg" style="--ar:${sw/sh}" viewBox="${c.join(" ")}" role="img" aria-label="Preparation tray">
  <defs><linearGradient id="wbNss" x1="0" x2="1"><stop offset="0" stop-color="#A9D1F5" stop-opacity=".7"/><stop offset=".5" stop-color="#8BBDEE" stop-opacity=".6"/><stop offset="1" stop-color="#6FA9E6" stop-opacity=".75"/></linearGradient>
   <linearGradient id="wbTxa" x1="0" x2="1"><stop offset="0" stop-color="#D2C2F5" stop-opacity=".8"/><stop offset=".5" stop-color="#B7A0EE" stop-opacity=".7"/><stop offset="1" stop-color="#9F84E6" stop-opacity=".85"/></linearGradient>
   <linearGradient id="wbMix" x1="0" x2="1"><stop offset="0" stop-color="#BCC6F4" stop-opacity=".8"/><stop offset="1" stop-color="#8A97E6" stop-opacity=".8"/></linearGradient>
   <radialGradient id="wbGlove" cx="38%" cy="30%" r="80%"><stop offset="0" stop-color="#9CC4FF"/><stop offset=".45" stop-color="#5F98F0"/><stop offset="1" stop-color="#3466C4"/></radialGradient><linearGradient id="wbCuff" x1="0" x2="1"><stop offset="0" stop-color="#4C82DE"/><stop offset=".5" stop-color="#78A8F5"/><stop offset="1" stop-color="#3E72CF"/></linearGradient>
   <filter id="wbSh" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="3" dy="6" stdDeviation="5" flood-color="#0B2A55" flood-opacity=".35"/></filter></defs>
  ${wbImg("tray",-7.8,-5.9,918,606)}
  <g class="wb-deco">${st.labeled?"":wbImg("label-blank",35.4,45.4,209,137,'filter="url(#wbSh)"')}${wbImg("sharps",758.7,38.3,122.7,184,'filter="url(#wbSh)"')}</g>
  ${wbBag(st)}
  <g class="wb-basin" data-zone="basin">${wbImg("basin",587.7,441.6,226,113,'filter="url(#wbSh)"')}
   ${bv>.05?`<ellipse id="wbPud" cx="700" cy="500" rx="${Math.min(60,18+bv*4)}" ry="${Math.min(14,5+bv)}" fill="${wbFluid(b)}"/>`:""}<rect x="590" y="430" width="220" height="130" fill="transparent" data-zone="basin" class="wb-dz" rx="16"/></g>
  ${wbArm(st)}${wbAmp(st,0)}${wbAmp(st,1)}
  ${st.added&&st.labeled&&!st.mixed?`<g class="wb-turns"><rect x="300" y="70" width="104" height="30" rx="15"/><text x="352" y="90" text-anchor="middle">Turns ${st.turns} of 3</text></g>`:""}
  ${wbLine(st)}
  ${wbGlass(st)}
  <path id="wbStream" class="wb-stream" d="M700 480Q702 490 700 500"/>
  <rect x="740" y="40" width="150" height="190" fill="transparent" data-sharps="1" class="wb-sz" rx="14"/>${st.labeled?"":`<rect x="36" y="46" width="208" height="138" fill="transparent" data-labelsheet="1"/>`}
  ${wbSyringe(st)}</svg>`;}
function wbArm(st){if(!st.labeled)return "";const A=WB_ARM,w=710*A.k,h=360*A.k;
  return `<g class="wb-arm"><linearGradient id="wbArmF" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".1" stop-color="#fff"/><stop offset=".9" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
   <mask id="wbArmM"><rect x="${A.x}" y="${A.y}" width="${w}" height="${h}" fill="url(#wbArmF)"/></mask>
   <g mask="url(#wbArmM)">${wbImg("arm",A.x,A.y,w,h,'filter="url(#wbSh)"')}</g>
   <rect x="${WB_TAP[0]-70}" y="${WB_TAP[1]-60}" width="140" height="150" fill="transparent" data-zone="tap" class="wb-dz" rx="14"/></g>`;}
// IV giving set and three-way stopcock: shown only when the remaining volume in the bag is given (aged 8 and over / over 30 kg)
const WB_PORT2=[434,292],WB_LEND=[330,372],WB_LEND2=[222,460]; // WB_LEND2: luer end of the giving set (dragged to the tap) // infusion port (bag), end of the hung line
const wbStopSVG=(x,y)=>`<g class="wb-stop" transform="translate(${x} ${y})"><rect x="-17" y="-5" width="34" height="10" rx="4" class="wb-clear"/><rect x="-4" y="4" width="8" height="12" rx="2" class="wb-clear"/>
  <path d="M0 -16v32M-16 0h32" class="wb-stoph" transform="translate(0 -8) scale(.7 .35)"/><circle cx="0" cy="-8" r="5" class="wb-stoph2"/></g>`;
// IV giving set photos: coiled on the tray; once connected, spike + drip chamber under the bag's blue port, tubing (drawn) to the roller clamp
function wbLine(st){let h="";
  if(!st.setOn){h+=`<g data-item="set" class="wb-item">${wbImg("set-coiled",540.8,152.2,210.1,140.1,'filter="url(#wbSh)"')}<rect x="545" y="160" width="200" height="126" fill="#000" fill-opacity="0" stroke="none"/></g>`;}
  else{h+=`<g class="wb-line"><clipPath id="wbSetClip"><rect x="400" y="290" width="70" height="92"/></clipPath>
     <path d="M434 376C434 412 424 430 404 430" class="wb-tube full"/>
     ${st.lineOn?`<path d="M258 428C170 440 150 560 300 590S${WB_TAP[0]} 560 ${WB_TAP[0]} ${WB_TAP[1]+6}" class="wb-tube full"/>${wbImg("set-clamp",254,404.2,152,50.7)}`
       :`<g data-item="lend" class="wb-item">${wbImg("set-clamp",254,404.2,152,50.7)}<path d="M258 428q-26 0-34 18" class="wb-tube full"/><rect x="214" y="444" width="16" height="22" rx="4" fill="#eef2f7" stroke="#b9c3d2"/><rect x="200" y="396" width="210" height="76" fill="#000" fill-opacity="0" stroke="none"/></g>`}
     <rect x="424" y="356" width="20" height="12" rx="3" fill="url(#wbNss)" opacity=".7"/>${st.running?`<circle cx="434" cy="322" r="2.4" fill="#9CC8F2" class="wb-drop"/>`:""}
     <g clip-path="url(#wbSetClip)">${wbImg("set-top",347.1,230.4,173.8,231.7)}</g></g>`;}
  return h;}
function wbGlass(st){const pos={t0:[345,548],t1:[372,548],a0:[262,548],a1:[300,548]};
  return Object.keys(st.glass).filter(k=>st.glass[k]==="tray").map(k=>{const [x,y]=pos[k],top=k[0]==="t";
    return `<g class="wb-glasspc ${st.glassSel===k?"sel":""}" data-glass="${k}" transform="translate(${x} ${y})">${top?wbImg("amp-top",-14,-44,28,44):wbImg("amp-open",-40,-114,80,120)}<rect x="-18" y="-50" width="36" height="56" fill="transparent" data-glass="${k}"/></g>`;}).join("");}
/* ---------- camera: zooms to the syringe and its target, follows the plunger ---------- */
function wbCam(st,A){A=A||st.camA||WB.W/WB.H;const s=st.syr,[W,H]=wbWH(st);if(!s.at||s.at==="tap"){if(A>=W/H)return [0,0,W,H];const h=W/A;return [0,(H-h)/2,W,h];}
  const d=WB_DOCK[s.at],v=wbV(s),hand=d.y+(d.dir==="up"?1:-1)*WB.SC*(520+v*WB.ML);
  let y0=Math.min(d.y,hand)-50,y1=Math.max(d.y,hand)+40;if(s.at==="bag")y0=Math.min(y0,190);if(s.at==="basin")y1=Math.max(y1,565);if(s.at[0]==="a")y1=Math.max(y1,578);
  let h=Math.max(300,y1-y0),w=h*A;if(w>WB.W){w=WB.W;h=WB.W/A;}
  let x=d.x-w/2;x=Math.max(0,Math.min(WB.W-w,x));let y=(y0+y1)/2-h/2;y=h>H?(H-h)/2:Math.max(0,Math.min(H+130-h,y));return [x,y,w,h];}
// smooth move between camera positions (instant with reduced motion or during plunger drags)
function wbCamTo(st,svg,target,instant){const from=(st.cam||target).slice();st.cam=target.slice();
  if(instant||matchMedia("(prefers-reduced-motion: reduce)").matches){svg.setAttribute("viewBox",target.join(" "));return;}
  const t0=performance.now(),D=450,ease=k=>1-Math.pow(1-k,3);cancelAnimationFrame(st.camRaf);
  const step=now=>{const k=Math.min(1,(now-t0)/D),e=ease(k),c=from.map((a,i)=>a+(target[i]-a)*e);if(!svg.isConnected)return;svg.setAttribute("viewBox",c.join(" "));if(k<1)st.camRaf=requestAnimationFrame(step);};
  st.camRaf=requestAnimationFrame(step);}
/* ---------- guidance, readouts, feedback ---------- */
function wbNext(st){const s=st.syr;if(st.done)return null;
  if(!st.room)return s.nss>0?(s.at==="bag"?"leave":"basin"):"bag";
  if(s.nss>0&&!st.added)return "basin";
  if(!st.checked)return "check";
  const a=st.amps.findIndex(x=>x.txa>.05);if(a>=0&&!st.added)return st.amps[a].open?"a"+a:"open"+a;
  if(!st.added)return "bag";
  if(!st.labeled)return "label";if(!st.mixed)return "mix";
  const c=wbCase();if(!st.doseOk)return s.at==="bag"?"bag":"bag";
  if(c.large&&!st.doseDiscarded)return "basin";
  if(wbGlassLeft(st).length)return "sharps";if(c.large&&!st.setOn)return "set";if(c.large&&!st.lineOn)return "line";if(!c.large&&s.at!=="tap")return "tap";return "give";}
function wbCoach(st){if(st.done)return "Preparation complete. Give the dose over 10 minutes.";
  const n=wbNext(st),s=st.syr,c=wbCase();
  if(st.added){
    if(n==="label")return "Label the bag now: tap the additive label.";
    if(n==="mix")return "Mix gently: drag the bag in slow turns.";
    if(n==="bag"&&!st.doseOk)return `Open the dose chart (book button at the top) for ${c.name} (${c.ageLabel}), then ${c.large?"draw out the chart volume":"draw up the dose"} from the bag.`;
    if(n==="basin")return "Discard the drawn-out volume in the kidney basin.";
    if(n==="sharps")return "Put the ampoule tops and empty ampoules in the sharps bin.";
    if(n==="give")return "Set the administration rate.";
    if(n==="tap")return "Connect the syringe to the three-way tap on the patient's cannula.";if(n==="line")return "Drag the end of the giving set to the three-way tap on the patient's cannula.";
    if(n==="set")return "Drag the IV giving set onto the bag to give the remaining volume.";if(n==="stop")return "Drag the three-way stopcock onto the end of the giving set.";if(n==="clamp")return "Open the roller clamp to start the infusion.";
    if(n==="squeeze")return "Squeeze the drip chamber to fill it about halfway.";if(n==="prime")return "Open the roller clamp to prime the line.";if(n==="closeclamp")return "Close the roller clamp now the line is full.";}
  if(n==="bag")return s.at==="bag"?(st.room?"Push the plunger to inject all of the TXA into the bag.":"Pull the plunger back to draw out exactly 10 mL of saline."):(st.room?"Take the syringe back to the bag's medication port.":"Move the syringe onto the bag's medication port.");
  if(n==="leave")return "Now take the syringe off the port.";
  if(n==="basin")return s.at==="basin"?"Push the plunger to discard all of the saline.":"Move the syringe to the kidney basin to discard the saline.";
  if(n==="check")return "Tap an ampoule to double-check it with your colleague before you open it.";
  if(n.startsWith("open"))return "Press and hold the ampoule to snap it open.";
  return s.at&&s.at.startsWith("a")?"Pull the plunger back to draw up the TXA.":"Move the syringe into the open ampoule.";}
// goal for the current stage (what to achieve); the method (wbCoach) is the level-2 hint
function wbGoal(st){if(st.done)return "Ready. We give it over 10 minutes.";const n=wbNext(st),c=wbCase();
  if(!st.room)return "Draw out 10 mL from the 100 mL bag to make room for the TXA.";
  if(st.syr.nss>.05&&st.bag.txa<.05)return "Discard the 10 mL of NSS you drew out in the kidney basin.";
  if(!st.added)return n==="check"||String(n).startsWith("open")||n[0]==="a"&&!st.syr.txa?"Prepare 1 g of TXA from the ampoules.":"Add the TXA to the bag.";
  if(n==="label")return "Make sure anyone can tell what's in this bag.";
  if(n==="mix")return "Mix the TXA through the bag: turn it slowly and gently at least 3 times. Do not shake it.";
  if(n==="bag"||n==="basin")return `Prepare ${c.name}'s dose. ${c.name} is ${c.ageLabel}.`;
  if(n==="sharps")return "Leave the tray safe before we move on.";
  if(n==="set")return "Set up to give the remaining volume.";
  if(n==="tap"||n==="line")return "Connect to the patient's cannula.";
  return "Get ready to give the dose.";}
const wbMateText=st=>P.txMode==="guided"&&st.hint>=2?wbCoach(st):wbGoal(st);
function wbMateHTML(st){return `<div class="wb-mate" aria-live="polite"><img src="${txBust(st.done?"happy":st.hint>=2?"pointing":"neutral")}" alt="" width="46" height="46"><p><b>Crew mate</b>${wbMateText(st)}</p></div>`;}
// hint ladder (guided only): 8 s idle → the target glows; 18 s → the crew mate explains the method; 30 s → a ghost hand shows the gesture
function wbHintTick(st,svg){if(P.txMode!=="guided"||st.done||st.label||st.rate||st.dq||st.ask||(st.msg&&!st.msg.ok)||!svg.isConnected)return;
  const idle=performance.now()-(st.idleT||0),lvl=idle>30000?3:idle>18000?2:idle>8000?1:0;if(lvl>(st.hint||0)){st.hint=lvl;wbHintApply(st,svg);}}
function wbHintApply(st,svg){const wb=svg.closest(".wb");if(!wb)return;const n=wbNext(st);
  if(st.hint>=1)wb.dataset.glow=n.startsWith("open")?"a"+n[4]:n==="check"?"a0":n;
  const m=wb.querySelector(".wb-mate");if(m)m.outerHTML=wbMateHTML(st);
  if(st.hint>=2&&st.saidHint!==n){st.saidHint=n;txSay(wbCoach(st));}
  if(st.hint>=3&&st.ghostKey!==n){st.ghostKey=n;wbGhost(st,svg,n);}}
// ghost hand: a faint glove performs the next gesture twice
function wbGhost(st,svg,n){const s=st.syr,d=s.at&&WB_DOCK[s.at],SC=WB.SC,grip=d?[d.x,d.y+(d.dir==="up"?1:-1)*SC*100]:[WB_REST.x+70,WB_REST.y];
  const handle=d?[d.x,d.y+(d.dir==="up"?1:-1)*SC*(14+WB_HANDLE+wbV(s)*WB.ML)]:null;let from,to,kind="move";
  const pull=d&&(s.at[0]==="a"||(s.at==="bag"&&!(s.txa>.05&&!st.added)&&!st.doseOk)),axis=d?(d.dir==="up"?1:-1):0;
  if(n==="bag"||n==="basin"||n==="a0"||n==="a1"){
    if(s.at===n){from=handle;to=[handle[0],handle[1]+axis*(pull?40:-40)];}
    else{const t={bag:[400,300],basin:[700,440],a0:[130,445],a1:[200,445]}[n];from=grip;to=t;}}
  else if(n==="leave"){from=grip;to=[WB_REST.x+70,WB_REST.y+20];}
  else if(n==="check"){from=to=[130,490];kind="tap";}
  else if(n.startsWith("open")){from=to=[n[4]==="1"?200:130,490];kind="hold";}
  else if(n==="label"){from=to=[140,115];kind="tap";}
  else if(n==="give"){from=to=[420,150];kind="tap";}else if(n==="tap"){from=grip;to=[WB_TAP[0],WB_TAP[1]+10];}else if(n==="line"){from=[300,430];to=[WB_TAP[0],WB_TAP[1]+10];}
  else if(n==="set"){from=[640,220];to=[434,300];}else if(n==="stop"){from=[290,345];to=WB_LEND;}else if(n==="clamp"||n==="prime"||n==="closeclamp"){from=to=[401,372];kind="tap";}else if(n==="squeeze"){from=to=[434,320];kind="tap";}
  else if(n==="mix"){from=to=[420,150];kind="circle";}
  else if(n==="sharps"){const k=wbGlassLeft(st)[0],p={t0:[345,530],t1:[372,530],a0:[262,520],a1:[300,520]}[k]||[200,560];from=p;to=[810,130];}
  if(!from)return;const g=document.createElementNS("http://www.w3.org/2000/svg","g");g.setAttribute("class","wb-ghost");g.innerHTML=WB_GLOVE;svg.appendChild(g);
  const D=kind==="move"?1500:kind==="circle"?1800:900,t0=performance.now(),reps=2,ease=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
  const step=now=>{if(!g.isConnected)return;const e=(now-t0)/D,r=Math.floor(e),k=e-r;if(r>=reps){g.remove();return;}
    let x,y,sc=.5;if(kind==="move"){const q=ease(Math.min(1,k*1.2));x=from[0]+(to[0]-from[0])*q;y=from[1]+(to[1]-from[1])*q;}
    else if(kind==="circle"){const a=k*Math.PI*2;x=from[0]+Math.cos(a)*34;y=from[1]+Math.sin(a)*22;}
    else{x=from[0];y=from[1];sc=.5*(kind==="hold"?(k<.7?.9:1):(Math.abs(k-.4)<.15?.88:1));}
    g.setAttribute("transform",`translate(${x} ${y+30}) scale(${sc})`);g.style.opacity=k<.1?k*10*.55:k>.9?(1-k)*10*.55:.55;requestAnimationFrame(step);};
  requestAnimationFrame(step);}
function wbSrText(st){const s=st.syr,v=wbV(s),b=st.bag,bv=b.nss+b.txa,at=s.at?WB_DOCK[s.at].lab:"on the tray";
  return `Syringe ${at}, ${v<.05?"empty":wbMl(v)+" mL"}. Bag ${wbMl(bv)} mL${st.labeled?", labelled":""}${st.mixed?", mixed":""}. Next: ${wbGoal(st)}`;}
function wbDebrief(){const ev=P.txEvents||[],errs=ev.filter(e=>!e.ok),stages=["room","drawup","label","mix","dose","give"];
  const first=stages.filter(k=>!errs.some(e=>e.stage===k)).length,by={};errs.forEach(e=>{by[e.text]=(by[e.text]||0)+1});
  return `<div class="wb-debrief" role="status"><div class="wbd-head"><span class="label">Debrief</span><b>${first} of ${stages.length} stages right first time</b></div>
   <ul class="wbd-stages">${stages.map(k=>{const n=errs.filter(e=>e.stage===k).length;return `<li class="${n?"no":"ok"}">${n?I.warn:I.check}<span>${TX_STAGE_NAMES[k]}</span>${n?`<em>${n} mistake${n>1?"s":""}</em>`:""}</li>`}).join("")}</ul>
   ${errs.length?`<p class="note">Mistakes to remember: ${Object.keys(by).map(t=>`<b>${t}</b>${by[t]>1?" ×"+by[t]:""}`).join(" · ")}</p>`:`<p class="note">No mistakes. Try the Solo Run next: no hints, timed, and you read the syringe scale yourself.</p>`}</div>`;}
const wbMl=v=>(Math.round(v*10)/10).toFixed(1);
function wbRead(st){if(P.l&&P.l.txRun)return `<div class="wb-read solo"><p class="note">Read the volume on the syringe scale.</p></div>`;const s=st.syr,b=st.bag,sv=wbV(s);
  const what=x=>{const v=wbV(x);if(v<.05)return "Empty";if(x.txa<.05)return `${wbMl(v)} mL saline`;if(x.nss<.05)return `${wbMl(v)} mL TXA (${Math.round(x.txa*100)} mg)`;return st.mixed?`${wbMl(v)} mL at 10 mg/mL (${Math.round(x.txa*100)} mg)`:`${wbMl(x.nss)} mL saline + ${wbMl(x.txa)} mL TXA`;};
  if(st.done&&!(P.l&&P.l.txRun))return wbDebrief();
  const bv=b.nss+b.txa,c=wbCase(),bagTxt=c.large&&st.doseOk&&st.doseDiscarded?`${wbMl(bv)} mL = ${wbMl(bv-10)} mL dose (${Math.round((bv-10)*10)} mg) + 10 mL for the set`:what(b);
  return `<div class="wb-read"><div><span class="label">Syringe</span><b id="wbRs">${what(s)}</b></div><div><span class="label">Saline bag</span><b id="wbRb">${bagTxt}</b></div></div>`;}
function wbBody(st){const g=P.txMode==="guided",n=wbNext(st),s=st.syr;
  const pk=n+"|"+(s.at||"")+"|"+Math.round(wbV(s)*2)+"|"+st.turns+"|"+wbGlassLeft(st).length;if(pk!==st.nextKey){st.nextKey=pk;st.hint=0;st.idleT=performance.now();st.ghostKey=null;st.saidHint=null;}
  const glow=g&&st.hint>=1&&n&&!["leave"].includes(n)?(n.startsWith("open")?"a"+n[4]:n==="check"?"a0":n):null;
  // pop-ups animate in only when they first open, not on every redraw while open
  const ck=[st.label?"label":"",st.rate?"rate":"",st.dq?"dq":"",st.ask?"ask":"",wbDrawOpen(st)?"wd":"",st.msg?st.msg.text:""].join("|"),still=ck===st.lastCk;st.lastCk=ck;
  return `<div class="wb ${s.at?"is-docked":""} ${st.sel?"is-sel":""} ${still?"wb-still":""}" data-glow="${glow||""}">
   ${wbMateHTML(st)}
   <div class="wb-stage">${wbScene(st)}${st.label?wbLabelHTML(st):""}${st.rate?wbRateHTML():""}${st.dq?wbDqHTML():""}${st.ask?wbAskHTML():""}${wbDrawOpen(st)?wbDrawHTML(st):""}${st.msg&&!(st.msg.ok&&(st.label||st.rate||st.dq||st.ask))?trMsgHTML(st):""}</div>
   <p class="wb-sr" aria-live="polite">${wbSrText(st)}</p>
   ${wbRead(st)}
   <div class="wb-ctl ${st.kb?"open":""}" aria-label="Keyboard controls">
    <div class="wb-move"><span class="label">Move syringe to</span>${["bag","basin","a0","a1",...(st.labeled?["tap"]:[])].map(k=>`<button class="btn ghost sm ${s.at===k?"on":""}" data-tr="dock" data-to="${k}">${WB_DOCK[k].lab.replace("saline ","")}</button>`).join("")}<button class="btn ghost sm" data-tr="dock" data-to="">tray</button></div>
    ${s.at?`<div class="wb-nudge"><span class="label">Plunger</span><button class="btn ghost sm" data-tr="pl" data-d="-1">Push 1 mL</button><button class="btn ghost sm" data-tr="pl" data-d="-0.5">Push 0.5</button><button class="btn ghost sm" data-tr="pl" data-d="0.5">Pull 0.5</button><button class="btn ghost sm" data-tr="pl" data-d="1">Pull 1 mL</button></div>`:""}
    ${st.added?`${st.doseOk?`<div class="wb-move"><span class="label">Line</span><button class="btn ghost sm ${st.setOn?"on":""}" data-tr="line" data-id="set">Connect IV giving set</button>${st.setOn?`<button class="btn ghost sm ${st.lineOn?"on":""}" data-tr="line" data-id="lend">Connect set to the three-way tap</button>`:""}</div>`:""}<div class="wb-move"><span class="label">Bag</span><button class="btn ghost sm ${st.labeled?"on":""}" data-tr="label" ${st.labeled?"disabled":""}>${st.labeled?"Labelled":"Label the bag"}</button><button class="btn ghost sm ${st.mixed?"on":""}" data-tr="turn" ${st.mixed?"disabled":""}>${st.mixed?"Mixed":`Turn the bag (${st.turns}/3)`}</button><button class="btn ghost sm ${st.rateOk?"on":""}" data-tr="give">Set the rate</button></div>`:""}
    ${wbGlassLeft(st).length?`<div class="wb-move"><span class="label">Sharps</span>${wbGlassLeft(st).map(k=>`<button class="btn ghost sm" data-tr="sharps" data-k="${k}">${k[0]==="t"?"Ampoule top":"Empty ampoule"} ${+k[1]+1} → sharps</button>`).join("")}</div>`:""}
    <div class="wb-move"><span class="label">Ampoules</span><button class="btn ghost sm ${st.checked?"on":""}" data-tr="check">${st.checked?"Double-checked":"Double-check with colleague"}</button>${[0,1].map(i=>`<button class="btn ghost sm ${st.amps[i].open?"on":""}" data-tr="snap" data-i="${i}" ${st.amps[i].open?"disabled":""}>${st.amps[i].open?`Ampoule ${i+1} open`:`Snap ampoule ${i+1}`}</button>`).join("")}</div></div></div>`;}
// prompt for the blank in focus; guided mode can also show its value
function wbLabTip(st){const f=TX_LABEL.find(x=>x.key===st.labFocus);if(!f)return `<span class="note">${(st.labBad||[]).length?"Fix the blanks marked in red.":"Tap a blank to see what it asks for."}</span>`;
  const show=st.labShow===f.key;return `<b>${f.tip}</b>${show?`<span class="wb-labval">${f.val(wbCase())}</span>`:P.txMode==="guided"?`<button class="btn ghost sm" data-tr="lab-hint">Show the value</button>`:""}`;}
function wbLabelHTML(st){const L=st.label;
  return `<div class="tr-card wb-labform" role="dialog" aria-label="Additive label"><h3 style="color:var(--ink)">Medication additive label</h3><p class="note" style="margin:0">Fill in the blanks directly on the additive label. Tap a blank to see what it asks for.</p>
   <button class="btn ghost sm" data-tr="lab-now" style="justify-self:start">Click to insert the current date and time</button>
   <div class="wb-labscroll"><div class="labelphoto crop"><img src="${TXM("label.webp")}" alt="Tranexamic acid additive label">${TX_LABEL.map(f=>`<input class="labin ${f.key==="conc"?"big":""} ${(st.labBad||[]).includes(f.key)?"bad":""}" data-lab="${f.key}" placeholder="${f.ph||""}" aria-label="${f.name}${f.unit?" in "+f.unit:""}" value="${txEsc(L[f.key]||"")}" ${f.unit?'inputmode="decimal"':""} enterkeyhint="next" autocomplete="off" style="left:${(f.left*9-150)/6.55}%;top:${(f.top*12.72-320)/6.25}%;--w:${f.w*9/6.55}%;--h:${(f.h||2.9)*12.72/6.25}%">`).join("")}</div></div>
   <div class="wb-labtip" id="wbLabTip" aria-live="polite">${wbLabTip(st)}</div>
   <div class="foot-btns wb-labfoot"><button class="btn ghost" data-tr="label-x">Cancel</button><button class="btn" data-tr="label-ok">Confirm label</button></div></div>`;}
function wbAskHTML(){return `<div class="tr-card wb-ratecard" role="dialog" aria-label="Before you open the ampoule"><h3 style="color:var(--ink)">Before you open the ampoule</h3><p>Do you want to double-check the medication with your colleague?</p><div class="foot-btns"><button class="btn ghost" data-tr="ask-no">No, open it</button><button class="btn" data-tr="ask-yes">Yes, double-check</button></div></div>`;}
const WB_DQ=[{k:"name",lab:"Drug name",rb:"Tranexamic acid",x:88,y:44.6},{k:"strength",lab:"Strength",rb:"500 mg in 5 mL",x:88,y:57.5},{k:"clarity",lab:"Clarity",rb:"Clear and colourless, no particles",x:50,y:24},{k:"expiry",lab:"Expiry",rb:"In date: EXP 06/2028",x:88,y:93}];
function wbDqHTML(){const st=P.sx,chk=st.chk||(st.chk={}),n=WB_DQ.filter(x=>chk[x.k]).length;
  return `<div class="tr-card wb-ratecard wb-dq" role="dialog" aria-label="Double-check"><h3 style="color:var(--ink)">Double-check with your colleague</h3><p class="note" style="margin:0">Your colleague holds up the ampoule. Tap each part to check it before you open it.</p>
   <div class="wb-dqgrid"><div class="wb-dqamp"><img src="${WBI("amp")}" alt="TXA ampoule close-up"><span class="wb-dqexp">EXP 06/2028 · LOT T4471</span>${WB_DQ.map(x=>`<button class="amp-hot ${chk[x.k]?"ok":""}" data-tr="chk" data-k="${x.k}" style="left:${x.x}%;top:${x.y}%" aria-label="Check ${x.lab}" aria-pressed="${!!chk[x.k]}">${chk[x.k]?I.check:""}</button>`).join("")}</div>
   <div class="readlist"><span class="label">Read-back · ${n} of 4 checked</span><ul>${WB_DQ.map(x=>`<li class="${chk[x.k]?"ok":"todo"}">${chk[x.k]?I.check:"<i></i>"}<span><b>${x.lab}:</b> ${chk[x.k]?x.rb:"not checked yet"}</span></li>`).join("")}</ul></div></div>
   <div class="foot-btns"><button class="btn ghost" data-tr="dq-x">Not now</button><button class="btn" data-tr="check" ${n<4?"disabled":""}>Confirm double-check</button></div></div>`;}
function wbRateHTML(){return `<div class="tr-card wb-ratecard" role="dialog" aria-label="Administration rate"><h3 style="color:var(--ink)">Over what duration is the dose given?</h3><div class="rates">${[1,10,30,60].map(n=>`<button class="btn ghost" data-tr="rate" data-n="${n}">${n} min</button>`).join("")}</div></div>`;}
// feedback (shared card markup from the earlier prototype)
function trMsgHTML(st){const m=st.msg;
  if(m.ok) return `<div class="tr-toast ok" role="status">${I.check}<span>${m.text}</span></div>`;
  return `<div class="tr-card" role="alertdialog" aria-label="${m.title}"><h3>${m.title}</h3><p>${m.text}</p>${m.outcome?`<p class="conseq"><b>If this happened on scene:</b> ${m.outcome}</p>`:""}<button class="btn bad wide" data-tr="msg-ok">Got it</button></div>`;}
const wbStage=st=>!st.room?"room":!st.added?"drawup":!st.labeled?"label":!st.mixed?"mix":(!st.doseOk||(wbCase().large&&!st.doseDiscarded))?"dose":"give";
function wbOk(st,text){st.tag=wbStage(st);txLog(true,text);txSound("ok");st.msg={ok:true,text};clearTimeout(st.msgT);const m=st.msg;st.msgT=setTimeout(()=>{if(P&&P.sx===st&&st.msg===m){st.msg=null;const t=document.querySelector(".wb .tr-toast");if(t){t.classList.add("out");setTimeout(()=>t.remove(),250);}}},2800);}
function wbInfo(st,text){st.msg={ok:true,text};clearTimeout(st.msgT);const m=st.msg;st.msgT=setTimeout(()=>{if(P&&P.sx===st&&st.msg===m){st.msg=null;const t=document.querySelector(".wb .tr-toast");if(t){t.classList.add("out");setTimeout(()=>t.remove(),250);}}},2400);}
function wbErr(st,title,text,outcome){st.tag=wbStage(st);txLog(false,title);st.err=true;txSound("err");clearTimeout(st.msgT);st.msg={ok:false,title,text,outcome};if(P.txMode==="guided")txSay(text);}
/* ---------- fluid physics ---------- */
// move the plunger to a new syringe volume; fluid comes from / goes to whatever the syringe is docked in
function wbSetV(st,target){const s=st.syr,at=s.at;if(!at||at==="tap")return;target=Math.round(target*10)/10;let v=wbV(s);if(target<.3&&target<v)target=0;let dv=Math.max(0,Math.min(50,target))-v;
  if(dv>0){ // pull
    if(at==="basin")return;                              // nothing to draw from the basin
    const src=at==="bag"?st.bag:st.amps[+at[1]];if(at!=="bag"&&!src.open)return;
    const have=at==="bag"?src.nss+src.txa:src.txa;dv=Math.min(dv,have);if(dv<=0)return;
    const ft=at==="bag"?src.txa/have:1;s.txa+=dv*ft;s.nss+=dv*(1-ft);if(at==="bag"){src.txa-=dv*ft;src.nss-=dv*(1-ft);}else src.txa-=dv;}
  else if(dv<0){ // push
    const out=Math.min(-dv,v),ft=v?s.txa/v:0,ot=out*ft,on=out-ot;s.txa-=ot;s.nss-=on;
    const dst=at==="bag"?st.bag:at==="basin"?st.basin:st.amps[+at[1]];dst.txa+=ot;if(dst.nss!==undefined)dst.nss+=on;}
  for(const o of [s,st.bag,st.basin])for(const k of ["nss","txa"])if(Math.abs(o[k])<1e-6)o[k]=0;}
/* ---------- rules ---------- */
function wbFresh(st){st.bag={nss:100,txa:0};st.amps=[{txa:5,open:false},{txa:5,open:false}];st.syr={nss:0,txa:0,at:st.syr.at};st.room=false;}
// checked when the syringe leaves a target
function wbLeave(st,from){const s=st.syr,b=st.bag;
  if(from==="bag"&&st.mixed&&!st.doseOk){const c=wbCase(),r=c.row,C=c.large?r.drawOut:r.volume,v=wbV(s);if(v<.05)return;
    if(Math.abs(v-C)<.6){st.doseOk=true;const k=s.txa/v;s.txa=C*k;s.nss=C*(1-k);wbOk(st,c.large?`Drew out ${C} mL. Discard it, then the remaining volume in the bag is given.`:`Drew up ${r.volume} mL = ${r.dose} mg.`);}
    else{const j=c.large?(90-v)*10:v*10;b.txa+=s.txa;b.nss+=s.nss;s.txa=0;s.nss=0;wbErr(st,"Wrong volume drawn",c.large?`For ${r.age} years draw out ${r.drawOut} mL (chart), leaving ${r.volume} mL to give.`:`${r.dose} mg ÷ 10 mg/mL = ${r.volume} mL.`,j>0?txNs(j,r.dose):undefined);}
    return;}
  if(from==="bag"){
    if(!st.room&&b.txa<.05&&s.nss>.05){
      if(Math.abs(s.nss-10)<=.25){s.nss=10;b.nss=90;st.room=true;wbOk(st,"Drew out 10 mL NSS from the bag with the 50 mL syringe.");}
      else{const v=s.nss;b.nss+=v;s.nss=0;s.txa=0;wbErr(st,"Wrong volume drawn out","Draw out exactly 10 mL of NSS from the 100 mL bag.",`With ${v.toFixed(1)} mL removed, the bag would end up at about ${(1000/(100-v)).toFixed(1)} mg/mL instead of 10 mg/mL once the TXA is added.`);}
      return;}
    if(b.txa>.05){
      if(!st.room){const o=TX_NEXT.find(x=>/Draw up TXA/i.test(x.text));wbErr(st,"Incorrect next action","Draw out 10 mL of NSS first to make room for the 10 mL of TXA. Start again with a fresh bag and ampoules.",o&&o.outcome);wbFresh(st);return;}
      if(b.txa>=9.75&&wbV(s)<.25){b.txa=10;b.nss=90;s.nss=0;s.txa=0;st.added=true;wbOk(st,"Added 1 g TXA to the bag: 1 g in 100 mL (10 mg/mL).");return;}
      wbInfo(st,"Add all 10 mL of TXA to the bag.");}
    return;}
  if(from==="basin"&&st.doseOk&&wbCase().large&&!st.doseDiscarded){if(wbV(s)<.05){st.doseDiscarded=true;st.basin.txa=0;wbOk(st,"Discarded the drawn-out volume. The bag now holds the dose plus 10 mL for the set.");}return;}
  if(from==="basin"){
    if(st.basin.txa>.05){const t=st.basin.txa;st.basin.txa=0;wbErr(st,"TXA discarded",`${t.toFixed(1)} mL of TXA went into the kidney basin. Only the saline drawn from the bag is discarded.`,"Discarded TXA means the child receives less than 1 g in the bag and every chart dose is too low.");return;}
    if(st.room&&st.basin.nss>=9.75&&s.nss<.05&&!st.discarded){st.discarded=true;wbOk(st,"Discarded the 10 mL NSS drawn from the bag. The bag now holds 90 mL.");}}}
// checked before docking
function wbCanDock(st,to){const s=st.syr;
  if(to==="a0"||to==="a1"){
    if(!st.room){const o=TX_NEXT.find(x=>/Draw up TXA/i.test(x.text));wbErr(st,"Incorrect next action","Draw out 10 mL of NSS first to make room for the 10 mL of TXA.",o&&o.outcome);return false;}
    // part of the TXA already in the bag: fluid drawn back from the bag goes back in, it is not the 10 mL of NSS to discard
    if(s.nss>.05&&st.bag.txa>.05){wbInfo(st,"Push the fluid in the syringe back into the bag, then draw up the second ampoule.");return false;}
    if(s.nss>.05){const o=TX_DISCARD.find(x=>/flush/i.test(x.text));wbErr(st,"Drawn NSS not discarded","The 10 mL of NSS drawn out must be discarded before you draw up the TXA.",o&&o.outcome);return false;}
    if(!st.amps[+to[1]].open){if(!st.checked){st.ask=true;return false;}wbInfo(st,"Snap the ampoule open first: press and hold it.");return false;}}
  if(to==="bag"&&st.added&&wbV(s)<.05&&!st.doseOk){
    if(!st.labeled){wbErr(st,"Bag not labelled","Label the bag immediately after preparation, before you mix it or draw from it.","An unlabelled bag is an unknown drug.");return false;}
    if(!st.mixed){wbErr(st,"Inadequate mixing","Turn the bag slowly at least 3 times to mix before drawing the dose.","If the TXA is not mixed through, the first millilitres drawn may be much stronger or weaker than 10 mg/mL.");return false;}}
  if(to==="bag"&&st.doseOk){wbInfo(st,wbCase().large?"Discard the drawn-out volume in the kidney basin.":"The dose is drawn up. Connect the syringe to the three-way tap.");return false;}
  if(to==="tap"){const c=wbCase();
    if(c.large){wbErr(st,"Wrong administration method",`${c.name} is ${c.ageLabel}: from 8 years or over 30 kg you don't draw the dose up. Give the remaining volume in the bag through the IV giving set: it includes 10 mL to compensate for the set.`);return false;}
    if(!st.doseOk){wbInfo(st,"Draw up the dose from the bag first.");return false;}
    if(wbGlassLeft(st).length){wbErr(st,"Sharps left on the tray","Put the ampoule tops and empty ampoules in the sharps bin before you move on.","Loose glass on the tray can cut you or a colleague on a moving ambulance.");return false;}}
  if(to==="bag"&&st.room&&s.nss>.05&&st.bag.txa<.05){const o=TX_DISCARD.find(x=>/back into the bag/i.test(x.text));wbErr(st,"Drawn NSS not discarded","The 10 mL of NSS drawn out must be discarded.",o&&o.outcome);return false;}
  return true;}
function wbDock(st,to){const s=st.syr,from=s.at;if(from===to)return;
  if(from&&from[0]==="a"&&st.amps[+from[1]].txa<.05&&!st.glass[from])st.glass[from]="tray";
  if(to&&!wbCanDock(st,to))return;
  s.at=null;st.sel=false;if(from)wbLeave(st,from);if(st.msg&&!st.msg.ok)return;
  s.at=to||null;if(to)txSound("click");
  if(to==="tap"){txLog(true,"Syringe connected to the three-way tap.");wbRateOpen(st);}}
function wbSnap(st,i){const a=st.amps[i];if(a.open)return;
  if(!st.checked){wbErr(st,"Opened ampoules before double-checking","Always double-check the drug name, strength, clarity and expiry with a colleague before opening.","An unchecked ampoule could be the wrong drug, cloudy or out of date — and once snapped open it cannot be returned.");return;}
  a.open=true;st.glass["t"+i]="tray";txSound("snap");if(st.amps.every(x=>x.open))txLog(true,"Opened both TXA ampoules.");}
const wbCase=()=>txCaseFor(P.steps[P.i]);
// glass (ampoule tops once snapped, ampoules once empty) belongs in the sharps bin
const wbGlassLeft=st=>Object.keys(st.glass).filter(k=>st.glass[k]==="tray");
function wbToSharps(st,k){if(st.glass[k]!=="tray")return;st.glass[k]="sharps";st.glassSel=null;txSound("bin");}
function wbLabel(st){if(!st.added){wbInfo(st,"Label the bag once the TXA has been added.");return;}if(st.labeled)return;st.label={};st.labFocus=null;st.labShow=null;st.labBad=null;}
const wbLabRead=st=>document.querySelectorAll("[data-lab]").forEach(i=>{st.label[i.dataset.lab]=i.value});
function wbLabelCheck(st){const c=wbCase(),L=st.label;
  const bad=TX_LABEL.filter(x=>{const want=x.ans(c),got=String(L[x.key]??"").trim();return want instanceof RegExp?!want.test(got):(got===""||Math.abs(parseFloat(got)-want)>.01);}).map(x=>x.name+(x.unit?` (${x.unit})`:""));
  st.labBad=TX_LABEL.filter(x=>{const want=x.ans(c),got=String(L[x.key]??"").trim();return want instanceof RegExp?!want.test(got):(got===""||Math.abs(parseFloat(got)-want)>.01);}).map(x=>x.key);
  if(bad.length){wbErr(st,"Incomplete or incorrect label",`${st.labBad.length} blank${st.labBad.length>1?"s are":" is"} missing or incorrect. They are marked in red on the label.`,"An incomplete label makes the bag an unknown drug to the next person who picks it up.");return;}
  st.labBad=null;st.labFocus=null;st.labShow=null;
  P.lab={...L};if(P.txMode==="guided"){S.txLabel={...L};save();}st.labeled=true;st.label=null;wbOk(st,"Bag labelled immediately: 1 g in 100 mL, 10 mg/mL.");}
function wbTurn(st,fast){if(!st.added)return;
  if(!st.labeled){wbErr(st,"Bag not labelled","Label the bag immediately after preparation, before you mix it.","An unlabelled bag is an unknown drug.");return;}
  if(fast){wbErr(st,"Shook the bag vigorously","Turn the bag slowly and gently, no more than a quarter turn to each side. Do not shake it.","Vigorous shaking froths the solution and puts air bubbles into the bag and line.");return;}
  if(st.mixed)return;st.turns++;txSound("slosh");if(st.turns>=3){st.mixed=true;wbOk(st,"Mixed the bag gently.");}}
function wbRateOpen(st){const c=wbCase();if(!st.doseOk||(c.large&&!st.doseDiscarded)){wbInfo(st,c.large?"Draw out and discard the chart volume first.":"Draw up the dose from the bag first.");return;}
  const g=wbGlassLeft(st);if(g.length){wbErr(st,"Sharps left on the tray","Put the ampoule tops and empty ampoules in the sharps bin before you move on.","Loose glass on the tray can cut you or a colleague on a moving ambulance.");return;}
  if(c.large&&!st.setOn){wbInfo(st,"Connect the IV giving set to the bag to give the remaining volume.");return;}
  if(c.large&&!st.lineOn){wbInfo(st,"Connect the end of the giving set to the three-way tap.");return;}
  if(!c.large&&st.syr.at!=="tap"){wbInfo(st,"Connect the syringe to the three-way tap on the patient's cannula.");return;}
  clearTimeout(st.msgT);st.msg=null;st.rate=true;}
function wbConnect(st,id){const c=wbCase();
  if(id==="lend"){if(!st.setOn||st.lineOn)return;st.lineOn=true;txSound("click");txLog(true,"Giving set connected to the three-way tap.");wbRateOpen(st);return;}
  if(id!=="set"||st.setOn)return;
  if(!c.large){wbErr(st,"Wrong administration method",`${c.name} is under 8 years and under 30 kg: the ${c.row.dose} mg dose is drawn up into the syringe and given from the syringe over 10 minutes, not through a giving set from the bag.`,`The bag holds 1 g of TXA. Running it through a giving set risks giving the child far more than the ${c.row.dose} mg dose.`);return;}
  if(!st.doseOk||!st.doseDiscarded){wbInfo(st,"Draw out and discard the chart volume before you connect the giving set.");return;}
  st.setOn=true;txSound("click");txLog(true,"IV giving set connected to the bag.");wbOk(st,"Giving set connected to the bag. Now connect its end to the three-way tap.");}

function wbRate(st,n){if(n===10){st.rate=false;st.rateOk=true;st.done=true;if(wbCase().large)st.running=true;txLog(true,"Rate set: over 10 minutes.");wbOk(st,wbCase().large?"Infusion running: the remaining volume over 10 minutes. Preparation complete.":"Syringe connected to the three-way tap: give the dose over 10 minutes. Preparation complete.");}else wbErr(st,"Incorrect administration rate","TXA is given slowly over 10 minutes.",TX_RATE[n]);}
/* ---------- input ---------- */
/* ---------- drawing close-up: while docked, a large syringe opens over the tray ----------
   Photo units (barrel photo at scale 1): 0 mL at x=254, 23.6 px per mL; drag away from the needle to draw, towards it to push.
   Horizontal on wide screens, vertical (needle at the top) on phones. The plunger follows the pointer 1:1; release snaps to 0.5 mL. */
const WD={X0:254,ML:23.6,CY:372,R:118};
const wbDrawOpen=st=>!!(st.syr.at&&st.syr.at!=="tap"&&!st.label&&!st.rate&&!st.dq&&!st.ask&&!(st.msg&&!st.msg.ok));
const WB_SRC={bag:"Saline bag port",basin:"Kidney basin",a0:"Ampoule 1",a1:"Ampoule 2"};
function wbTargetV(st){const s=st.syr,at=s.at,c=wbCase();
  if(at==="bag"){if(!st.room)return 10;if(!st.added)return 0;if(st.mixed&&!st.doseOk)return c.large?c.row.drawOut:c.row.volume;return null;}
  if(at==="basin")return 0;if(at&&at[0]==="a")return wbV(s)<5.05?5*(1+(st.amps[0].txa<.05&&at==="a1"?1:0)):10;return null;}
function wbDrawSVG(st){const s=st.syr,v=wbV(s),sx=WD.X0+v*WD.ML,vert=matchMedia("(max-width:600px)").matches;
  const g=P.txMode==="guided"&&st.hint>=2?wbTargetV(st):null;
  const body=`<g id="wdG">${wbImg("needle",150-2082*.35,WD.CY-360*.35,2172*.35,724*.35)}
    ${wbImg("barrel",0,0,2172,724)}
    <rect id="wdFluid" x="${WD.X0}" y="${WD.CY-WD.R}" width="${Math.max(0,v*WD.ML)}" height="${WD.R*2}" fill="${wbFluid(s)}" class="wd-fl"/>
    <g id="wdPl" transform="translate(${sx-92*.947} ${WD.CY-378*.68})"><image href="${WBI("plunger")}" width="${2172*.947}" height="${724*.68}" preserveAspectRatio="none"/></g>
    ${wbImg("barrel",0,0,2172,724,'class="wd-glass"')}
    ${g!=null?`<path d="M${WD.X0+g*WD.ML} ${WD.CY-WD.R-40}V${WD.CY+WD.R+40}" class="wd-target"/>`:""}
    <rect x="-400" y="-200" width="3200" height="1124" fill="#000" fill-opacity="0" data-wd="1"/></g>`;
  return vert?`<svg class="wd-svg vert" viewBox="${-720} 40 ${680} 1480" aria-hidden="true"><g transform="rotate(90)">${body}</g></svg>`
    :`<svg class="wd-svg" viewBox="40 40 1480 660" aria-hidden="true">${body}</svg>`;}
function wbDrawRead(st){const s=st.syr,v=wbV(s),src=st.syr.at==="bag"?`Bag ${wbMl(st.bag.nss+st.bag.txa)} mL`:st.syr.at[0]==="a"?`Ampoule ${wbMl(st.amps[+st.syr.at[1]].txa)} mL`:`Basin ${wbMl(st.basin.nss+st.basin.txa)} mL`;
  return P.l&&P.l.txRun?"Read the volume on the syringe scale.":`Syringe <b>${wbMl(v)} mL</b> · ${src}`;}
function wbDrawHTML(st){return `<div class="wd" role="dialog" aria-label="Syringe at the ${WB_SRC[st.syr.at]}">
   <div class="wd-head"><span class="label">${WB_SRC[st.syr.at]}</span><span class="wd-read" id="wdRead" aria-live="polite">${wbDrawRead(st)}</span></div>
   <div class="wd-stage" tabindex="0" aria-label="Syringe plunger: drag away from the needle to draw, towards it to push. Arrow keys move it by 0.5 mL.">${wbDrawSVG(st)}</div>
   <div class="wd-btns"><button class="btn ghost" data-tr="wdn" aria-label="Push 0.5 mL">− 0.5 mL</button><button class="btn ghost" data-tr="wup" aria-label="Pull 0.5 mL">+ 0.5 mL</button><button class="btn" data-tr="wdone">Take the syringe off</button></div>
   <p class="note wd-how">Drag along the syringe: away from the needle to draw, towards it to push.</p></div>`;}
function wbDrawLive(st){const s=st.syr,v=wbV(s),pl=document.getElementById("wdPl"),fl=document.getElementById("wdFluid"),rd=document.getElementById("wdRead");
  if(pl)pl.setAttribute("transform",`translate(${WD.X0+v*WD.ML-92*.947} ${WD.CY-378*.68})`);if(fl){fl.setAttribute("width",Math.max(0,v*WD.ML));fl.setAttribute("fill",wbFluid(s));}if(rd)rd.innerHTML=wbDrawRead(st);
  const r=document.querySelector(".wb-read");if(r)r.outerHTML=wbRead(st);}
function wbDrawStep(st,d){const was=wbV(st.syr);wbSetV(st,Math.round((was+d)*2)/2);if(Math.floor(wbV(st.syr))!==Math.floor(was))txSound("click");wbAfterPlunge(st);}
function wbDrawWire(st){const stg=document.querySelector(".wd-stage");if(!stg)return;const grp=stg.querySelector("#wdG");let d=null;
  const lx=e=>{const p=stg.querySelector("svg").createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(grp.getScreenCTM().inverse()).x;};
  stg.addEventListener("pointerdown",e=>{if(e.button>0)return;st.idleT=performance.now();d={x0:lx(e),v0:wbV(st.syr),id:e.pointerId};try{stg.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault();});
  stg.addEventListener("pointermove",e=>{if(!d)return;const was=wbV(st.syr);wbSetV(st,d.v0+(lx(e)-d.x0)/WD.ML);const v=wbV(st.syr);if(Math.floor(v)!==Math.floor(was))txSound("click");wbDrawLive(st);});
  const up=()=>{if(!d)return;d=null;wbSetV(st,Math.round(wbV(st.syr)*2)/2);wbAfterPlunge(st);drawPlayer(wbFoc(st)||".wd-stage");};
  stg.addEventListener("pointerup",up);stg.addEventListener("pointercancel",up);
  stg.addEventListener("keydown",e=>{const k={ArrowRight:.5,ArrowDown:.5,ArrowLeft:-.5,ArrowUp:-.5}[e.key];if(k==null)return;e.preventDefault();wbDrawStep(st,k);drawPlayer(wbFoc(st)||".wd-stage");});
  // − / + : press and hold repeats
  document.querySelectorAll('[data-tr="wdn"],[data-tr="wup"]').forEach(b=>{let t=null,iv=null;const stop=()=>{clearTimeout(t);clearInterval(iv);};
    b.addEventListener("pointerdown",()=>{t=setTimeout(()=>{iv=setInterval(()=>{wbDrawStep(st,b.dataset.tr==="wup"?.5:-.5);wbDrawLive(st);b.dataset.held=1;},110);},380);});
    ["pointerup","pointerleave","pointercancel"].forEach(k=>b.addEventListener(k,stop));});}
const wbFoc=st=>st.msg&&!st.msg.ok?'[data-tr="msg-ok"]':undefined;
function trClick(t){const st=P.sx;if(!st)return;const a=t.dataset.tr;st.idleT=performance.now();
  if(a==="hint"){st.hint=Math.min(3,(st.hint||0)+1);if(st.hint===3)st.ghostKey=null;st.idleT=performance.now()-[0,8000,18000,30000][st.hint]-500;drawPlayer('[data-tr="hint"]');return;}
  if(a==="kb"){st.kb=!st.kb;drawPlayer(st.kb?".wb-ctl button":'[data-tr="kb"]');return;}
  if(a==="wdn"||a==="wup"){if(t.dataset.held){delete t.dataset.held;drawPlayer(`[data-tr="${a}"]`);return;}wbDrawStep(st,a==="wup"?.5:-.5);drawPlayer(wbFoc(st)||`[data-tr="${a}"]`);return;}
  if(a==="wdone"){wbDock(st,"");drawPlayer(wbFoc(st));return;}
  if(a==="msg-ok"){st.msg=null;drawPlayer(st.label?"[data-lab]":undefined);return;}
  if(st.msg&&!st.msg.ok)return;
  if(st.syr.at&&!["wdn","wup","wdone","msg-ok","hint"].includes(a)&&wbDrawOpen(st))return;
  if((st.label||st.rate||st.dq||st.ask)&&!["label-ok","label-x","lab-now","lab-hint","rate","check","dq-x","ask-yes","ask-no","chk"].includes(a))return;
  if(a==="chk"){const k=t.dataset.k;st.chk=st.chk||{};if(!st.chk[k]){st.chk[k]=true;txSound("click");}drawPlayer(`[data-tr="chk"][data-k="${k}"]`);return;}
  if(a==="ask-yes"){st.ask=false;st.dq=true;drawPlayer('[data-tr="chk"]');return;}
  if(a==="ask-no"){st.ask=false;wbErr(st,"Opened ampoules before double-checking","Always double-check the drug name, strength, clarity and expiry with a colleague before opening.","An unchecked ampoule could be the wrong drug, cloudy or out of date — and once snapped open it cannot be returned.");drawPlayer(wbFoc(st));return;}
  if(a==="dq-x"){st.dq=false;drawPlayer();return;}
  if(a==="dock"){wbDock(st,t.dataset.to);drawPlayer(wbFoc(st)||`[data-tr="dock"][data-to="${t.dataset.to}"]`);return;}
  if(a==="pl"){const s=st.syr,was=wbV(s);wbSetV(st,was+Number(t.dataset.d));wbAfterPlunge(st);drawPlayer(wbFoc(st)||`[data-tr="pl"][data-d="${t.dataset.d}"]`);return;}
  if(a==="check"&&!st.dq&&!st.checked){st.dq=true;drawPlayer('[data-tr="chk"]');return;}
  if(a==="check"){const kb=!!t.closest(".wb-ctl");st.dq=false;if(!st.checked){st.checked=true;wbOk(st,"Double-checked with your colleague: tranexamic acid 500 mg in 5 mL, clear and colourless, in date.");}drawPlayer(kb?'.wb-ctl [data-tr="check"]':undefined);return;}
  if(a==="snap"){wbSnap(st,+t.dataset.i);drawPlayer(wbFoc(st)||`[data-tr="snap"][data-i="${t.dataset.i}"]`);return;}
  if(a==="label"){wbLabel(st);drawPlayer(st.label?"[data-lab]":wbFoc(st));return;}
  if(a==="label-ok"){wbLabRead(st);wbLabelCheck(st);drawPlayer(wbFoc(st));return;}
  if(a==="lab-now"){wbLabRead(st);const d=new Date(),p=x=>String(x).padStart(2,"0");st.label.date=`${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()}`;st.label.time=`${p(d.getHours())}:${p(d.getMinutes())}`;drawPlayer('[data-tr="lab-now"]');return;}
  if(a==="lab-hint"){wbLabRead(st);st.labShow=st.labFocus;drawPlayer(`[data-lab="${st.labFocus}"]`);return;}
  if(a==="label-x"){st.label=null;drawPlayer();return;}
  if(a==="turn"){wbTurn(st,false);drawPlayer(wbFoc(st)||'[data-tr="turn"]');return;}
  if(a==="glass"){const k=t.dataset.k;if(st.glassSel===k)st.glassSel=null;else st.glassSel=k;drawPlayer();return;}
  if(a==="sharps"){const k=t.dataset.k||st.glassSel;if(k)wbToSharps(st,k);drawPlayer();return;}
  if(a==="line"){wbConnect(st,t.dataset.id);drawPlayer(wbFoc(st));return;}
  if(a==="give"){wbRateOpen(st);drawPlayer(wbFoc(st)||(st.rate?'[data-tr="rate"]':undefined));return;}
  if(a==="rate"){wbRate(st,+t.dataset.n);drawPlayer(wbFoc(st));return;}
  if(a==="finish"){txGo("END");return;}}
// immediate rule after the plunger moves: saline pushed back into the bag after making room
function wbAfterPlunge(st){const b=st.bag,s=st.syr;
  if(s.at==="bag"&&st.room&&b.txa<.05&&b.nss>90.25){const back=b.nss-90;b.nss=90;s.nss+=back;const o=TX_DISCARD.find(x=>/back into the bag/i.test(x.text));wbErr(st,"Drawn NSS not discarded","The 10 mL of NSS drawn out must be discarded, not pushed back into the bag.",o&&o.outcome);}}
// pointer: drag the syringe to a target, drag the plunger handle, press and hold an ampoule to snap it
function trAfter(st){wbDrawWire(st);const svg=document.querySelector(".wb-svg");if(!svg)return;
  if(st.done&&!st.debriefShown){st.debriefShown=true;const d=document.querySelector(".wb-debrief");if(d)setTimeout(()=>d.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"end"}),300);}
  clearInterval(st.hintIv);st.hintIv=setInterval(()=>{if(!svg.isConnected){clearInterval(st.hintIv);return;}wbHintTick(st,svg);},1000);
  if(st.hint>=3&&st.ghostKey===null)wbHintApply(st,svg);
  {const g=wbGoal(st);if(st.saidGoal!==g&&!(st.msg&&!st.msg.ok)){st.saidGoal=g;if(P.txMode==="guided")setTimeout(()=>{if(P&&P.sx===st)txSay(g)},400);}}
  st.camA=svg.clientWidth/svg.clientHeight||WB.W/WB.H;
  {const tg=wbCam(st),c=st.cam;if(!c||tg.some((x,i)=>Math.abs(x-c[i])>.5))wbCamTo(st,svg,tg,!c);}
  const pt=e=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());};
  const syrEl=()=>svg.querySelector("#wbSyr");let drag=null,hold=null,tapAmp=null;
  let sndT=0,strT=0;
  const live=(was,bt)=>{const now=performance.now(),vv=wbV(st.syr);
    if(was!==undefined&&Math.abs(vv-was)>.05&&now-sndT>220&&txSoundOn()){sndT=now;try{txAC=txAC||new (window.AudioContext||window.webkitAudioContext)();txNoise(.12,vv>was?900:1500,.08)}catch(_){}}
    if(st.syr.at==="basin"&&was!==undefined&&vv<was){const sm=svg.querySelector("#wbStream");if(sm){sm.classList.add("on");clearTimeout(strT);strT=setTimeout(()=>sm.classList.remove("on"),250);}const pd=svg.querySelector("#wbPud"),bv=st.basin.nss+st.basin.txa;if(pd){pd.setAttribute("rx",Math.min(70,20+bv*4));pd.setAttribute("ry",Math.min(18,6+bv));}}
    if(bt!==undefined&&st.bag.txa>bt+.01){const sw=svg.querySelector("#wbSwirl");if(sw){sw.classList.remove("on");void sw.getBBox();sw.classList.add("on");}}
    const bs=svg.querySelector("#wbBagShape"),bvv=st.bag.nss+st.bag.txa;if(bs)bs.setAttribute("transform",`translate(415 0) scale(${(.9+.1*Math.min(1,bvv/100)).toFixed(3)} 1) translate(-415 0)`);
    const s=st.syr,v=vv,pl=svg.querySelector("#wbPl"),fl=svg.querySelector("#wbSyrFluid");if(pl)pl.setAttribute("transform",`translate(0 ${14+v*WB.ML})`);{const p2=svg.querySelector("#wbPl2");if(p2)p2.setAttribute("transform",`translate(0 ${14+v*WB.ML})`);}if(fl){fl.setAttribute("height",Math.max(0,v*WB.ML));fl.setAttribute("fill",wbFluid(s));}
    const b=st.bag,bv=b.nss+b.txa,bf=svg.querySelector("#wbBagFluid"),top=258-bv*2;{const ml=svg.querySelector("#wbBagLine");if(ml)ml.setAttribute("d",`M350 ${top}h130`);}if(bf){bf.setAttribute("y",top);bf.setAttribute("height",262-top);bf.setAttribute("fill",wbFluid(b));}
    st.amps.forEach((a,i)=>{svg.querySelectorAll(`[data-amp="${i}"] .wb-afl,[data-amp="${i}"] .wb-afl2`).forEach(r=>{const lv=wbAmpLv(a.txa);r.setAttribute("y",547-lv);r.setAttribute("height",lv);});});
    const rd=document.querySelector(".wb-read");if(rd)rd.outerHTML=wbRead(st);};
  svg.addEventListener("pointerdown",e=>{st.idleT=performance.now();if(st.msg&&!st.msg.ok||e.button>0)return;const p=pt(e);
    const h=e.target.closest("[data-h]");
    if(h&&st.syr.at){const d=WB_DOCK[st.syr.at],ly=(d.dir==="up"?p.y-d.y:d.y-p.y)/WB.SC;svg.classList.add("dragpl");drag={kind:"pl",y0:e.clientY,ly:e.clientY,lt:performance.now(),acc:0,v0:wbV(st.syr),sign:d.dir==="up"?1:-1,px:e.pointerType==="touch"?15:30};wbLoupe(st,svg,true);try{svg.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault();return;}
    if(e.target.closest("[data-syr]")){if(st.syr.at){const at=st.syr.at;st.syr.at=null;const ov=wbCam(st);st.syr.at=at;wbCamTo(st,svg,ov,true);}drag={kind:"syr",x:p.x,y:p.y,moved:false};try{svg.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault();return;}
    if(e.target.closest("[data-labelsheet]")&&!st.syr.at){wbLabel(st);drawPlayer(st.label?"[data-lab]":wbFoc(st));return;}
    if(e.target.closest("[data-chart]")){P.chartOpen=true;drawPlayer('[data-tx="chart-close"]');return;}
    const it=e.target.closest("[data-item]");if(it){drag={kind:"item",id:it.dataset.item,el:it,x:p.x,y:p.y,moved:false};try{svg.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault();return;}
    const gl=e.target.closest("[data-glass]");if(gl){drag={kind:"glass",k:gl.dataset.glass,el:gl.closest("g.wb-glasspc"),x:p.x,y:p.y,moved:false};try{svg.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault();return;}
    if(e.target.closest("[data-sharps]")&&st.glassSel){wbToSharps(st,st.glassSel);drawPlayer();return;}
    if(e.target.closest("[data-bagbody]")&&!st.syr.at&&!st.sel&&st.added){drag={kind:"rot",a:Math.atan2(p.y-150,p.x-420),side:0,total:0};try{svg.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault();return;}
    const z=e.target.closest("[data-zone]");
    if(z&&st.sel){wbDock(st,z.dataset.zone);drawPlayer(wbFoc(st));return;}
    const am=e.target.closest("[data-amp]");
    if(am&&!st.amps[+am.dataset.amp].open&&!st.checked){st.ask=true;drawPlayer('[data-tr="ask-yes"]');return;}
    if(am&&!st.amps[+am.dataset.amp].open){const i=+am.dataset.amp;wbHoldRing(svg,i);am.classList.add("holding");tapAmp=i;hold=setTimeout(()=>{hold=null;tapAmp=null;wbSnap(st,i);drawPlayer(wbFoc(st));},650);}});
  svg.addEventListener("pointermove",e=>{const p=pt(e);
    if(!drag){if(e.pointerType==="mouse")wbTip(svg,wbNameAt(e.target),e);return;}
    if(drag.kind==="syr"&&drag.moved){const z=wbZoneAt(p);wbTip(svg,z?"Drop on "+WB_DOCK[z].lab:null,e);}
    if(drag.kind==="glass"&&drag.moved){const q=p.x>=740&&p.x<=880&&p.y>=50&&p.y<=230;wbTip(svg,q?"Drop in the sharps bin":null,e);}
    if(drag.kind==="pl"){const now=performance.now(),dyp=e.clientY-drag.ly,sp=Math.abs(dyp)/Math.max(8,now-drag.lt);drag.ly=e.clientY;drag.lt=now;const g=e.shiftKey?.25:sp>1.6?4:sp>.9?2.5:sp>.45?1.5:1;drag.acc=(drag.acc||0)+dyp*drag.sign*g/drag.px;const was=wbV(st.syr),bt=st.bag.txa;wbSetV(st,drag.v0+drag.acc);live(was,bt);wbLoupe(st,svg,true);return;}
    if(drag.kind==="item"){if(!drag.moved&&Math.hypot(p.x-drag.x,p.y-drag.y)<6)return;drag.moved=true;svg.classList.add("dragging");drag.el.setAttribute("transform",`translate(${p.x-drag.x} ${p.y-drag.y})`);
      const ok=drag.id==="set"?wbZoneAt(p)==="bag":wbZoneAt({x:p.x-(drag.x-WB_LEND2[0]),y:p.y-(drag.y-WB_LEND2[1])})==="tap";wbTip(svg,ok?(drag.id==="set"?"Drop on the infusion port":"Drop on the three-way tap"):null,e);return;}
    if(drag.kind==="glass"){if(!drag.moved&&Math.hypot(p.x-drag.x,p.y-drag.y)<6)return;drag.moved=true;svg.classList.add("dragglass");drag.el.setAttribute("transform",`translate(${p.x} ${p.y})`);return;}
    if(drag.kind==="rot"){const a=Math.atan2(p.y-150,p.x-420);let da=(a-drag.a)*180/Math.PI;if(da>180)da-=360;if(da<-180)da+=360;drag.a=a;
      st.rot=Math.max(-120,Math.min(120,(st.rot||0)+da));drag.total+=Math.abs(da);const g=svg.querySelector("#wbBagRot");if(g)g.setAttribute("transform",`rotate(${st.rot} 415 150)`);
      const sw=svg.querySelector("#wbSwirl");if(sw)sw.classList.add("on");
      if(Math.abs(st.rot)>90){st.rot=0;wbTurn(st,true);drag=null;drawPlayer(wbFoc(st));return;}
      const side=st.rot>25?1:st.rot<-25?-1:0;
      if(side&&side!==drag.side){drag.side=side;wbTurn(st,false);const tt=svg.querySelector(".wb-turns text");if(tt)tt.textContent=`Turns ${st.turns} of 3`;if(st.mixed){st.rot=0;drag=null;drawPlayer(wbFoc(st));}}
      return;}
    if(!drag.moved&&Math.hypot(p.x-drag.x,p.y-drag.y)<8)return;if(!drag.moved){drag.moved=true;svg.classList.add("dragging");}
    const el=syrEl();if(!el.querySelector(".wb-hand.hold")){el.querySelectorAll(".wb-hand.pl,.wb-plhint").forEach(x=>x.remove());el.querySelectorAll("[clip-path]").forEach(x=>x.removeAttribute("clip-path"));el.insertAdjacentHTML("beforeend",wbCarry());}if(!el.querySelector(".wb-ndl"))el.insertAdjacentHTML("afterbegin",wbNeedle({at:null}));el.setAttribute("transform",`translate(${p.x} ${p.y}) rotate(-90) scale(${WB.SC})`);el.classList.add("carry");
    svg.querySelectorAll(".dropok").forEach(x=>x.classList.remove("dropok"));const z=wbZoneAt(p);if(z){const g=svg.querySelector(`.wb-${z==="bag"?"bag":z==="basin"?"basin":z==="tap"?"arm":"amp"}${z[0]==="a"?`[data-amp="${z[1]}"]`:""}`);if(g)g.classList.add("dropok");}});
  const up=e=>{svg.querySelectorAll(".wb-holdring").forEach(x=>x.remove());svg.classList.remove("dragging","dragpl","dragglass");wbTip(svg,null);if(hold){clearTimeout(hold);hold=null;svg.querySelectorAll(".holding").forEach(x=>x.classList.remove("holding"));if(tapAmp!==null){tapAmp=null;if(!st.checked){st.dq=true;drawPlayer('[data-tr="check"]');}else{wbInfo(st,"Press and hold the ampoule to snap it open.");drawPlayer();}return;}}
    if(!drag)return;const d=drag;drag=null;
    if(d.kind==="pl"){wbLoupe(st,svg,false);wbAfterPlunge(st);drawPlayer(wbFoc(st));return;}
    if(d.kind==="item"){if(!d.moved){drawPlayer();return;}const q=pt(e),ok=d.id==="set"?wbZoneAt(q)==="bag":wbZoneAt({x:q.x-(d.x-WB_LEND2[0]),y:q.y-(d.y-WB_LEND2[1])})==="tap";if(ok)wbConnect(st,d.id);else if(d.id==="lend")wbInfo(st,"Drop the end of the giving set on the three-way tap.");drawPlayer(wbFoc(st));return;}
    if(d.kind==="glass"){if(!d.moved){st.glassSel=st.glassSel===d.k?null:d.k;drawPlayer();return;}const q=pt(e);if(q.x>=740&&q.x<=880&&q.y>=50&&q.y<=230)wbToSharps(st,d.k);drawPlayer();return;}
    if(d.kind==="rot"){st.rot=0;if(d.total<6&&st.doseOk)wbRateOpen(st);drawPlayer(wbFoc(st)||(st.rate?'[data-tr="rate"]':undefined));return;}
    if(!d.moved){st.sel=!st.sel;txSound("click");drawPlayer();return;}
    const z=wbZoneAt(pt(e));wbDock(st,z||"");drawPlayer(wbFoc(st));};
  svg.addEventListener("pointerup",up);svg.addEventListener("pointercancel",up);svg.addEventListener("pointerleave",()=>{if(!drag)wbTip(svg,null)});
  let wT=0;svg.addEventListener("wheel",e=>{if(true||!st.syr.at||(st.msg&&!st.msg.ok)||st.label||st.rate)return;e.preventDefault();const was=wbV(st.syr),bt=st.bag.txa;
    wbSetV(st,was+(e.deltaY>0?1:-1)*(e.shiftKey?.5:.1));live(was,bt);wbLoupe(st,svg,true);clearTimeout(wT);wT=setTimeout(()=>{wbLoupe(st,svg,false);wbAfterPlunge(st);drawPlayer(wbFoc(st));},700);},{passive:false});}
// magnifier next to the plunger: the scale around the stopper, enlarged; guided mode also shows the number
function wbLoupe(st,svg,on){const stg=svg.parentNode;let el=stg.querySelector(".wb-loupe");if(!on){if(el)el.remove();return;}
  if(!el){el=document.createElement("div");el.className="wb-loupe";el.setAttribute("aria-hidden","true");stg.appendChild(el);}
  const v=wbV(st.syr),lo=Math.floor(v)-3;let t="";for(let m=lo;m<=lo+7;m++){if(m<0||m>50)continue;const x=10+(m-lo)*20,big=m%5===0;t+=`<path d="M${x} 34v${big?-20:-12}" stroke="#1d2a44" stroke-width="${big?2:1.2}"/>`+(big?`<text x="${x}" y="50" text-anchor="middle" font-size="12" font-weight="800" fill="#1d2a44">${m}</text>`:"");}
  const sx=10+(v-lo)*20;
  el.innerHTML=`<svg viewBox="0 0 160 56" width="160" height="56"><rect width="160" height="56" rx="10" fill="#fff"/>${t}<rect x="${sx}" y="6" width="5" height="30" fill="#232B3A"/><path d="M${sx} 4v34" stroke="#E5484D" stroke-width="1.5"/></svg>${P.l&&P.l.txRun?"":`<b>${wbMl(v)} mL</b>`}`;
  const h=svg.querySelector(".wb-handle-hit");if(h){const r=h.getBoundingClientRect(),R=stg.getBoundingClientRect();let x=r.right-R.left+14,y=r.top-R.top-28;if(x+170>R.width)x=r.left-R.left-184;el.style.left=Math.max(6,x)+"px";el.style.top=Math.max(6,Math.min(R.height-90,y))+"px";}}
// item names: shown next to the pointer on hover, and as the drop target while dragging
function wbNameAt(t){if(!t||!t.closest)return null;const c=x=>t.closest(x);
  if(c("[data-h]"))return "Plunger: drag to draw or push";if(c("[data-syr]"))return "50 mL syringe: drag to move";
  if(c("[data-item='set']"))return "IV giving set: drag to the bag";if(c("[data-item='lend']"))return "End of the giving set: drag to the three-way tap";if(c("[data-zone='tap']"))return "Three-way tap on the patient's cannula";if(c("[data-item='stop']"))return "Three-way stopcock: drag to the end of the giving set";if(c("[data-clamp]"))return "Roller clamp: tap to open or close";if(c("[data-chamber]"))return "Drip chamber: tap to squeeze";
  if(c("[data-chart]"))return "Dose chart: tap to open";
  if(c("[data-glass]"))return c("[data-glass]").dataset.glass[0]==="t"?"Ampoule top: drag to the sharps bin":"Empty ampoule: drag to the sharps bin";
  if(c("[data-amp]"))return "TXA 500 mg/5 mL ampoule";if(c("[data-labelsheet]"))return "Additive label: tap to fill in";if(c("[data-sharps]"))return "Sharps bin";
  if(c("[data-bagbody]"))return "0.9% NaCl 100 mL bag";if(t.matches&&t.matches("rect[data-zone='bag'],.wb-port"))return "Medication port";if(c("[data-zone='basin']"))return "Kidney basin";return null;}
function wbTip(svg,text,e){const stg=svg.parentNode;let el=stg.querySelector(".wb-tip");if(!text){if(el)el.remove();return;}
  if(!el){el=document.createElement("div");el.className="wb-tip";el.setAttribute("aria-hidden","true");stg.appendChild(el);}el.textContent=text;
  const R=stg.getBoundingClientRect();let x=e.clientX-R.left+16,y=e.clientY-R.top+18;if(x+el.offsetWidth>R.width-6)x=e.clientX-R.left-el.offsetWidth-12;el.style.left=x+"px";el.style.top=Math.min(R.height-36,y)+"px";}
function wbHoldRing(svg,i){const x=i?200:130,c=document.createElementNS("http://www.w3.org/2000/svg","circle");c.setAttribute("cx",x);c.setAttribute("cy",480);c.setAttribute("r",44);c.setAttribute("class","wb-holdring");c.setAttribute("pathLength","100");svg.appendChild(c);}
function wbZoneAt(p){const r=(x1,y1,x2,y2)=>p.x>=x1&&p.x<=x2&&p.y>=y1&&p.y<=y2;
  if(P.sx&&P.sx.labeled&&r(WB_TAP[0]-75,WB_TAP[1]-70,WB_TAP[0]+75,WB_TAP[1]+95))return "tap";
  if(r(330,30,512,330))return "bag";if(r(580,420,820,570))return "basin";if(r(100,390,165,560))return "a0";if(r(166,390,235,560))return "a1";return null;}
TXS.tray={phases:["work"],init:st=>wbInit(st),guide:()=>null,
  body:st=>wbBody(st),
  foot:st=>st.done?`<button class="btn good wide" data-tr="finish">Continue</button>`:P.txMode==="guided"?`<div class="foot-btns"><button class="btn ghost" data-tr="hint" style="flex:0 0 auto">Hint</button><p class="note tr-how" style="margin:0">Drag the syringe onto the bag, an ampoule, the kidney basin or the three-way tap. Tap an ampoule to double-check it, hold to snap it.</p></div>`:`<p class="note tr-how">Drag the syringe onto the bag, basin or an ampoule, then drag the plunger. Hold Shift for fine control, or scroll over the tray. Tap an ampoule to double-check it, press and hold to snap it.</p>`,
  after:st=>trAfter(st)};

const wbLabFoc=e=>{const i=e.target.closest&&e.target.closest("[data-lab]"),st=P&&P.sx;if(!i||!st||!st.label||st.labFocus===i.dataset.lab)return;st.labFocus=i.dataset.lab;if(st.labShow!==st.labFocus)st.labShow=null;const t=document.getElementById("wbLabTip");if(t)t.innerHTML=wbLabTip(st);};
document.addEventListener("focusin",wbLabFoc);document.addEventListener("pointerdown",wbLabFoc);
document.addEventListener("input",e=>{const i=e.target.closest&&e.target.closest("[data-lab]"),st=P&&P.sx;if(!i||!st||!st.labBad)return;i.classList.remove("bad");st.labBad=st.labBad.filter(k=>k!==i.dataset.lab);});
