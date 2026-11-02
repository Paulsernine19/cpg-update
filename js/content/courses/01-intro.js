COURSES.push(
 { id:"intro", title:"Start Here", category:"Orientation", hue:"--c-intro", icon:"flag", minutes:10,
   desc:"What changed in v2.6, how this course works, and a short ungraded diagnostic.",
   units:[{title:"Orientation", lessons:[
    {id:"in-1", title:"Welcome", steps:[
     {type:"read", title:"CPG v2.6 update training", visual:"org", body:"This HMCAS course is for Ambulance Paramedics who already hold baseline competencies. It focuses on the decisions that changed from v2.5 to v2.6, especially where a familiar routine could now lead to the wrong action. CPG v2.6 2026 took effect on 1 October 2026. All previous versions are to be disregarded.",
      points:["Module 1 · Trauma and the changed TXA indications, with hands-on TXA preparation (about 45 min)","Module 2 · Care of the newborn and newborn resuscitation, with hands-on thermal care (about 45 min)","Module 3 · Cardiac arrest, ROSC and related cardiac updates (about 40 min)","Module 4 · Stroke recognition, RACE scoring and transport decisions (about 25 min)","Final assessment (about 15 min)","<b>About 3 hours in total.</b> You don't need to finish in one sitting. Your progress saves automatically and you can pick up where you left off."],
      src:"Circular AS/SC 26-56"},
     {type:"read", title:"What changed at a glance", body:"The circular lists 30 changes. They fall into these groups, and every group is covered in the modules:",
      points:["<b>Resuscitation (ERC 2025):</b> adult, paediatric and trauma cardiac arrest, newborn resuscitation, ROSC care and special circumstances (CPG 2.1–2.6, 2.8)","<b>Stroke:</b> new stroke window, new transport decision tree and the RACE large vessel occlusion screen (CPG 3.1). The RACE video is mandatory for all staff.","<b>Cardioversion:</b> new adult synchronised energies for broad- and narrow-complex tachyarrhythmias (CPG 4.3, 4.4)","<b>TXA:</b> added for paediatric trauma patients, including paediatric isolated TBI with GCS ≤12, and removed from ectopic, miscarriage, abruption and praevia. The only obstetric indication left is post-partum haemorrhage (CPG 10.x, 12.1–12.4, formulary).","<b>Trauma:</b> abdominal seat belt sign added to the bypass criteria (10.10), neurogenic shock and SMR guidance (10.3), and a new Vehicle Extrication &amp; Care of the Trapped Patient guideline (10.13)","<b>Newborn:</b> new CPG 12.13 Care of the Newborn","<b>Antiemetics:</b> CCPs may sign off patients given an antiemetic (CPG 6.4, ondansetron formulary)"],
      src:"Circular AS/SC 26-56, change list items 1–30"},
     {type:"read", title:"How each lesson works", body:"Each topic follows the same pattern: a short case, your decision, the update, guided practice, then a fresh check. You can retry practice questions with no penalty.",
      points:["Completing this course does not certify procedural competence. RACE scoring needs a separate observed check.","Progress is saved in this browser on this device only. It is not an official training record. Use the same browser each time."],
      pending:["HMCAS Clinical Education will confirm the pass mark, attempts and certificate rules."]},
     {type:"read", title:"Before you start", body:"A few practical points:",
      points:["Turn your sound on. The hands-on activities use sounds and spoken prompts. Use headphones in shared spaces.","A laptop, desktop or tablet works best. A phone also works, but the hands-on activities are easier on a larger screen.","Questions about the CPG content? Email <b>HMCAS-Clinicalguidelines@hamad.qa</b>."],
      src:"Circular AS/SC 26-56"},
     {type:"read", title:"Labels you will see", body:"Each screen shows who acts and how certain the content is:",
      points:["<span class='badge ap'>AP action</span> within Ambulance Paramedic scope","<span class='badge ccp'>CCP · recognise &amp; escalate</span> taught for recognition, coordination and escalation only","<span class='badge pend'>Pending approved source</span> still being confirmed by HMCAS Clinical Services. Check the CPG itself before relying on it.","<span class='badge pop'>Population label</span> such as Adult medical, Adult trauma or Paediatric. Rules for one population must not be transferred to another."]}
    ]},
    {id:"in-2", title:"Current Version", steps:[
     {type:"choice", label:"Quick check", prompt:"It is 3 October 2026. A colleague's printed v2.5 pocket guide and the CPG on the Toughpad give different guidance. Which do you follow?", options:["The v2.5 printed guide, because it was signed off and you trained on it","CPG v2.6 2026, because all previous versions are disregarded from 1 October 2026","Whichever option is more conservative for the patient"], answer:1, scope:"AP",
      explain:"CPG v2.6 2026 came into effect on 1 October 2026. From that date all previous versions are disregarded, even if they look more cautious.", src:"Circular AS/SC 26-56"},
     {type:"choice", label:"Quick check", prompt:"While studying, you find two CPG v2.6 pages that seem to disagree with each other. What is the right next step?", options:["Follow the one that matches v2.5","Pick whichever seems clinically sensible and carry on","Email HMCAS-Clinicalguidelines@hamad.qa with both page numbers"], answer:2, scope:"AP",
      explain:"Questions about the CPG go to HMCAS-Clinicalguidelines@hamad.qa. Quoting the page numbers helps them answer quickly.", src:"Circular AS/SC 26-56"},
     {type:"lookup", title:"Find the current CPG", body:"Open CPG v2.6 2026 now. It can be downloaded from eTaleem and viewed on the ePCR Toughpads. You will be asked to look up specific sections during the modules.", find:"eTaleem › Clinical and Operational Updates › CPG V2.6 2026 (also on the ePCR Toughpads)", src:"Circular AS/SC 26-56"}
    ]},
    {id:"in-3", title:"Diagnostic", mode:"diag", bank:"diag"}
   ]}]},

);
