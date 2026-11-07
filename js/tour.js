/* ============================ APP TOUR (coach marks) ============================
   Started by a {type:"tour"} lesson step. Dims the app; "Next" moves on. Only the final target is clickable.
   Skip/Escape are offered only once the tour has been completed before (S.tourDone). */
const TOUR=[
 {go:"home",sel:'.tab[data-go="home"]',t:"Learn",b:"Your current module and next lesson."},
 {go:"courses",sel:'.tab[data-go="courses"]',t:"Modules",b:"The four modules can be taken in any order. The final assessment unlocks once all four are complete."},
 {go:"reference",sel:'.tab[data-go="reference"]',t:"Reference",b:"Key v2.6 changes, one screen per module. Available at any time, including on shift."},
 {go:"reference",sel:'#main .quick.docs',t:"Your documents",b:"CPG v2.6 and the list of changes from Circular AS/SC 26-56."},
 {go:"profile",sel:'.tab[data-go="profile"]',t:"Progress",b:"Completed lessons, assessment results and time remaining."},
 {go:"home",home:"intro",sel:'#main .path .node[data-lesson="in-3"]',t:"Start Here",b:"Orientation ends with a short warm-up: eleven statements, each either still true or changed in v2.6.",end:true}
];
let TR=null;
const tourTarget=()=>TR&&[...document.querySelectorAll(TOUR[TR.i].sel)].find(x=>{const r=x.getBoundingClientRect();return r.width&&r.height});
function tourStart(){
  TR={i:0,canSkip:!!S.tourDone};const el=document.createElement("div");el.id="tour";el.className="tour";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-labelledby","tourT");
  el.innerHTML=`<div class="tour-hole"></div><div class="tour-tip" tabindex="-1"></div>`;document.body.appendChild(el);
  el.addEventListener("click",e=>{e.stopPropagation();const b=e.target.closest("[data-tour]");if(b){const k=b.dataset.tour;if(k==="skip")tourEnd();else if(k==="play"){tourEnd();openLesson("in-3")}else tourNext();return}
    const t=tourTarget(),r=t&&t.getBoundingClientRect();if(r&&TOUR[TR.i].end&&e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)tourNext();});
  tourDraw();
}
function tourDraw(){
  const s=TOUR[TR.i],el=document.getElementById("tour"),tip=el.querySelector(".tour-tip");
  homeOverride=s.home||null;if(view!==s.go||s.home)go(s.go);
  const lost=s.end&&!tourTarget(); // fallback if the target can't be shown
  tip.innerHTML=`<span class="label">Tour · ${TR.i+1}/${TOUR.length}</span><h3 id="tourT">${s.t}</h3><p>${s.b}</p>
   <div class="tour-btns">${TR.canSkip?`<button class="btn ghost sm" data-tour="skip">Skip tour</button>`:"<span></span>"}${lost?`<button class="btn sm" data-tour="play">Start the warm-up</button>`:s.end?`<span class="note">Select the highlighted item</span>`:`<button class="btn sm" data-tour="next">Next</button>`}</div>`;
  const fit=()=>{const t=tourTarget();if(t&&t.closest("#main"))t.scrollIntoView({block:"center"});tourPlace()};
  requestAnimationFrame(()=>{fit();(tip.querySelector('[data-tour="next"]')||tip).focus();});
  setTimeout(fit,450); // re-measure after view entry animations settle
}
function tourPlace(){
  const el=document.getElementById("tour");if(!el)return;const t=tourTarget(),hole=el.querySelector(".tour-hole"),tip=el.querySelector(".tour-tip");
  if(!t){hole.style.cssText="width:0;height:0;top:50%;left:50%";tip.style.cssText="top:40%;left:50%;transform:translateX(-50%)";return}
  const r=t.getBoundingClientRect(),p=6,W=innerWidth,H=innerHeight,tw=tip.offsetWidth,th=tip.offsetHeight;
  hole.style.cssText=`top:${r.top-p}px;left:${r.left-p}px;width:${r.width+p*2}px;height:${r.height+p*2}px`;hole.classList.toggle("pulse",!!TOUR[TR.i].end);
  let top,left;
  if(r.right+16+tw<W&&r.width<300){left=r.right+16;top=r.top+r.height/2-th/2}
  else{left=r.left+r.width/2-tw/2;top=r.bottom+16+th<H?r.bottom+16:r.top-16-th}
  tip.style.cssText=`top:${Math.max(16,Math.min(top,H-th-16))}px;left:${Math.max(16,Math.min(left,W-tw-16))}px`;
}
function tourNext(){
  const s=TOUR[TR.i];
  if(s.end){tourEnd();openLesson("in-3");return}
  TR.i++;tourDraw();
}
function tourEnd(){const el=document.getElementById("tour");if(el)el.remove();TR=null;homeOverride=null;S.tourDone=true;save();if(!P)render();}
addEventListener("resize",()=>{if(TR)tourPlace()});addEventListener("scroll",()=>{if(TR)tourPlace()},true);
document.addEventListener("keydown",e=>{if(!TR)return;
  if(e.key==="Escape"){e.preventDefault();e.stopPropagation();if(TR.canSkip)tourEnd();return}
  if((e.key==="Enter"||e.key===" ")&&!e.target.closest("[data-tour]")){e.preventDefault();e.stopPropagation();tourNext();}
},true);
