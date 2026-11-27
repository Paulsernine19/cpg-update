/* ============================ INSTRUCTOR FEEDBACK ============================
   Shown only in instructor mode: open the course once with ?instructor=1 (remembered on that device; ?instructor=0 turns it off).
   A button over the lesson player opens a panel; the comment is sent with the module, lesson and step to a Google Apps Script
   web app (IFB_URL) that appends a row to a Google Sheet. If sending fails it is queued on the device and retried later.
   Setup steps for the sheet: README-feedback.txt. */
const IFB_URL="https://script.google.com/macros/s/AKfycbzURdXceah0AMhXlEEilLHAovXzepK2DhPI4u_Tfm7ojxssvK2gdbwa80_3oLhcz3xtIQ/exec"; // Google Apps Script web app URL (ends in /exec)
const IFB_KEY="stepwise-ifb",IFB_TYPES=["Content","Wording","Design","Technical","Other"];
const ifbGet=()=>{try{return JSON.parse(localStorage.getItem(IFB_KEY))||{}}catch(e){return {}}};
const ifbSet=o=>{try{localStorage.setItem(IFB_KEY,JSON.stringify({...ifbGet(),...o}))}catch(e){}};
(()=>{try{const q=new URLSearchParams(location.search).get("instructor");if(q==="1")ifbSet({on:true});if(q==="0")ifbSet({on:false});}catch(e){}})();
const ifbOn=()=>!!ifbGet().on;
const ifbTxt=t=>String(t||"").replace(/<[^>]+>/g,"").replace(/\s+/g," ").trim();
function ifbWhere(){if(!P)return null;const s=P.steps&&P.steps[P.i]||{},n=(P.steps||[]).length;
  return {module:P.c.title,lesson:P.l.title,lessonId:P.l.id,step:n?`${Math.min(P.i+1,n)} of ${n}`:"",
    screen:ifbTxt(s.label||s.title||s.prompt||(s.stage?"Hands-on: "+s.stage:s.type)).slice(0,120)};}
async function ifbPost(d){if(!IFB_URL)throw new Error("no url");
  await fetch(IFB_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(d)});}
async function ifbFlush(){const q=ifbGet().queue||[];if(!q.length||!navigator.onLine)return;const left=[];
  for(const d of q){try{await ifbPost(d)}catch(e){left.push(d)}}ifbSet({queue:left});}
function ifbButton(){if(!ifbOn()||document.getElementById("ifbBtn"))return;const b=document.createElement("button");
  b.id="ifbBtn";b.className="ifb-btn";b.type="button";b.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/></svg><span>Instructor feedback</span>`;
  b.addEventListener("click",ifbOpen);document.getElementById("player").after(b);}
function ifbOpen(){const w=ifbWhere();if(!w)return;const g=ifbGet(),d=document.createElement("div");d.className="ifb-wrap";d.id="ifbWrap";
  d.innerHTML=`<form class="ifb" role="dialog" aria-modal="true" aria-labelledby="ifbH"><h3 id="ifbH">Instructor feedback</h3>
   <p class="ifb-where"><b>${w.module}</b> › ${w.lesson} › step ${w.step}<br><span>${w.screen}</span></p>
   <label>Your name<input id="ifbName" autocomplete="name" value="${(g.name||"").replace(/"/g,"&quot;")}" required></label>
   <div class="ifb-types" role="radiogroup" aria-label="Type">${IFB_TYPES.map((t,i)=>`<label><input type="radio" name="ifbType" value="${t}" ${i===0?"checked":""}><span>${t}</span></label>`).join("")}</div>
   <label>Feedback<textarea id="ifbText" rows="5" required></textarea></label>
   <p class="ifb-msg" id="ifbMsg" role="status"></p>
   <div class="foot-btns"><button type="button" class="btn ghost" data-ifb="x">Cancel</button><button type="submit" class="btn">Send</button></div></form>`;
  document.body.appendChild(d);const f=d.querySelector("form");
  d.addEventListener("click",e=>{if(e.target===d||e.target.closest("[data-ifb=x]"))ifbClose()});
  d.addEventListener("keydown",e=>{if(e.key==="Escape"){e.stopPropagation();ifbClose()}});
  f.addEventListener("submit",async e=>{e.preventDefault();const name=f.querySelector("#ifbName").value.trim(),comment=f.querySelector("#ifbText").value.trim();if(!name||!comment)return;
    ifbSet({name});const item={...w,name,type:f.querySelector("[name=ifbType]:checked").value,comment,device:`${innerWidth}×${innerHeight} · ${navigator.userAgent.replace(/^.*?\((.*?)\).*$/,"$1").slice(0,80)}`,sent:new Date().toISOString()};
    const btn=f.querySelector("[type=submit]"),msg=f.querySelector("#ifbMsg");btn.disabled=true;msg.textContent="Sending…";
    try{await ifbPost(item);msg.textContent="Sent. Thank you.";msg.className="ifb-msg ok";}
    catch(err){ifbSet({queue:[...(ifbGet().queue||[]),item]});msg.textContent="No connection. Saved on this device; it will be sent automatically when you're online.";msg.className="ifb-msg wait";}
    setTimeout(ifbClose,1400);});
  setTimeout(()=>f.querySelector(g.name?"#ifbText":"#ifbName").focus(),30);}
function ifbClose(){const d=document.getElementById("ifbWrap");if(d)d.remove();const b=document.getElementById("ifbBtn");if(b)b.focus();}
ifbButton();ifbFlush();addEventListener("online",ifbFlush);
