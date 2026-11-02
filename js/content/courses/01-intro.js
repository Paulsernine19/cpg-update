COURSES.push(
 { id:"intro", title:"Start Here", category:"Orientation", hue:"--c-intro", icon:"flag", minutes:5,
   desc:"What changed in v2.6, how this course works, and a short ungraded diagnostic.",
   units:[{title:"Orientation", lessons:[
    {id:"in-1", title:"Welcome", steps:[
     {type:"read", title:"CPG v2.6 update training", visual:"org", body:"This HMCAS course is for Ambulance Paramedics who already hold baseline competencies. It focuses on the decisions that changed from v2.5 to v2.6, especially where a familiar routine could now lead to the wrong action. CPG v2.6 took effect on 1 October 2026.",
      points:["Module 1 · Trauma and the changed TXA indications, with hands-on TXA preparation (about 45 min)","Module 2 · Care of the newborn and newborn resuscitation, with hands-on thermal care (about 45 min)","Module 3 · Cardiac arrest, ROSC and related cardiac updates (about 40 min)","Module 4 · Stroke recognition, RACE scoring and transport decisions (about 25 min)","Final assessment (about 15 min)"]},
     {type:"read", title:"How each lesson works", body:"Each topic follows the same pattern: a short case, your decision, the update, guided practice, then a fresh check. Practice questions let you retry with no penalty.",
      points:["<b>Proposed completion standard:</b> at least 80% overall, at least 75% in every module, and all critical items correct.","Completing this course does not certify procedural competence. RACE scoring needs a separate observed check.","Progress is saved in this browser only. It is not an official training record."],
      pending:["Completion standard, critical items, attempts and certificate rules await education-lead approval."]},
     {type:"read", title:"Labels you will see", body:"Each screen shows who acts and how certain the content is:",
      points:["<span class='badge ap'>AP action</span> within Ambulance Paramedic scope","<span class='badge ccp'>CCP · recognise &amp; escalate</span> taught for recognition, coordination and escalation only","<span class='badge pend'>Pending approved source</span> the value or resource was not in the supplied documents and will be added after clinical review","<span class='badge pop'>Population label</span> such as Adult medical, Adult trauma or Paediatric. Rules for one population must not be transferred to another."]}
    ]},
    {id:"in-2", title:"Current Version", steps:[
     {type:"choice", label:"Quick check", prompt:"Which CPG version is current for HMCAS Ambulance Paramedics?", options:["v2.5","v2.6","v2.7"], answer:1, scope:"AP",
      explain:"v2.6 took effect on 1 October 2026. The September briefings were the run-up to release.", src:"Circular AS/SC 26-56"},
     {type:"lookup", title:"Find the current CPG", body:"Open the approved CPG v2.6 from your service's official source. You will be asked to look up specific sections during the modules.", find:"CPG v2.6 · full approved document and formulary", src:"Location link to be added by the project owner"}
    ]},
    {id:"in-3", title:"Diagnostic", mode:"diag", bank:"diag"}
   ]}]},

);
