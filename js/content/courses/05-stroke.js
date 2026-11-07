COURSES.push(
 { id:"stroke", title:"Stroke", category:"Module 4", hue:"--c-stroke", icon:"stroke", minutes:25, requires:["intro"],
   desc:"The changed time window, destination and priority tree, RACE and prenotification.",
   coverage:"CPG 3.1",
   units:[
    {title:"RACE", lessons:[
     {id:"st-1", title:"RACE Video", steps:[
      {type:"video", title:"Required RACE video", scope:"AP", body:"Circular AS/SC 26-56 requires all crews to watch this RACE educational video. Watching it is recorded separately and does not by itself show accurate scoring.",
       url:"https://youtu.be/9-65gGKgx_k?si=fyOk2lX7LI0lJ4PY", src:"Circular p.2"}
     ]},
     {id:"st-2", title:"RACE Scoring", steps:[
      {type:"read", title:"The RACE scale", scope:"AP", visual:"race", body:"RACE (Rapid Arterial oCclusion Evaluation) is used with BEFAST to spot a likely <b>large vessel occlusion</b>. Use it only for BEFAST-positive patients last known well <b>more than 8 and less than 24 hours</b> ago.", src:"CPG 3.1 pp.63–64"},
      {type:"choice", label:"Check", scope:"AP", prompt:"The patient's weakness is on the right side. Which cortical test do you score?",
       options:["Aphasia: \"Close your eyes\" and \"Make a fist\"","Agnosia: \"Whose arm is this?\" and \"Lift both arms and clap\"","Both"], answer:0,
       explain:"Right hemiparesis → aphasia. Left hemiparesis → agnosia. Score one or the other.", src:"CPG 3.1 p.63"},
      {type:"input", label:"Score it", scope:"AP", visual:"race", prompt:"Right-sided stroke. Moderate facial droop, can't lift the right arm against gravity (severe), moderate leg weakness, eyes deviated to the left, and does only one of the two commands. Total RACE?", answer:"7", unit:"/ 9",
       explain:"Face 2 + arm 2 + leg 1 + gaze 1 + aphasia 1 = 7. RACE ≥5 suggests LVO.", src:"CPG 3.1 p.63"},
      {type:"input", label:"Score it", scope:"AP", visual:"race", prompt:"Left-sided stroke. Mild facial droop, moderate arm weakness, normal leg, no gaze deviation, recognises the arm and the weakness. Total RACE?", answer:"2", unit:"/ 9",
       explain:"Face 1 + arm 1 + leg 0 + gaze 0 + agnosia 0 = 2.", src:"CPG 3.1 p.63"},
      {type:"choice", label:"Decide", scope:"AP", prompt:"That second patient was last known well 11 hours ago. Where do they go?",
       options:["P1 to HGH ED with prenotification","P2 to the nearest appropriate ED","P2 to HGH ED with prenotification"], answer:1,
       explain:">8 and <24 hours with RACE <5: P2 to the nearest appropriate ED.", src:"CPG 3.1 p.64"},
      {type:"choice", label:"Check", scope:"AP", prompt:"BEFAST positive, onset 3 hours ago. Do you need a RACE score to decide the destination?",
       options:["Yes, RACE decides every stroke destination","No, RACE is only used for >8 to <24 hours","Only if the blood pressure is also high"], answer:1,
       explain:"≤8 hours is P1 to HGH ED. RACE is used only in the >8 to <24-hour window. You can still include it in the prenotification if done.", src:"CPG 3.1 p.64"}
     ]}
    ]},
    {title:"Transport", lessons:[
     {id:"st-3", title:"Route Decisions", steps:[
      {type:"read", title:"The updated decision tree", scope:"AP", visual:"tree", body:"Destination depends on when the patient was last known well and, in the 8 to 24-hour window, on RACE. The old 15-hour threshold has been removed. Wake-up or unknown-onset stroke is treated as acute.",
       src:"CPG 3.1 p.64"},
      {type:"walk", label:"Interactive algorithm", title:"Route this patient", scope:"AP",
       case:"BEFAST positive. Last known well 10 hours ago. RACE 6.", start:"a",
       nodes:{a:{q:"When was the patient last known well?",opts:[{t:"≤ 8 hours",why:"10 hours is more than 8."},{t:"Wake-up / unknown onset",why:"The onset time is known: 10 hours ago."},{t:"> 8 to < 24 hours",to:"b"},{t:"≥ 24 hours",why:"10 hours is less than 24."}]},
              b:{q:"What is the RACE score?",opts:[{t:"RACE ≥ 5",to:"e"},{t:"RACE < 5",why:"RACE is 6 in this case."}]},
              e:{end:"P1 to HGH ED with prenotification via CC:E.",tone:"p1"}},
       src:"CPG 3.1 p.64"},
      {type:"choice", label:"Case", scope:"AP", prompt:"BEFAST positive, last known well 7 hours ago. Which branch applies?",
       options:["P1 to HGH ED with prenotification","P2 to the nearest appropriate ED","RACE decides the destination here"], answer:0,
       explain:"7 hours is within the ≤8-hour branch: P1 to HGH ED with prenotification via CC:E.", src:"CPG 3.1 p.64"},
      {type:"choice", label:"Case", scope:"AP", prompt:"BEFAST positive, last known well 10 hours ago, RACE 4. Where do they go?",
       options:["P1 to HGH ED, since it's under 24 hours","P2 to the nearest appropriate ED","P2 to HGH ED with prenotification"], answer:1,
       explain:"In the >8 to <24-hour window, RACE <5 means P2 to the nearest appropriate ED.", src:"CPG 3.1 p.64"},
      {type:"choice", label:"Case", scope:"AP", prompt:"BEFAST positive, last known well 30 hours ago. Which branch applies?",
       options:["P1 to HGH ED with prenotification","P2 to the nearest appropriate ED","P1 or P2, depending on the RACE score"], answer:1,
       explain:"≥24 hours: P2 to the nearest appropriate ED.", src:"CPG 3.1 p.64"}
     ]},
     {id:"st-4", title:"Prenotification & Care", steps:[
      {type:"multi", label:"Build the handover", scope:"AP", prompt:"Which items belong in the stroke prenotification?",
       options:["Age","Last seen well","BEFAST findings","RACE score, if done","RBS","Blood pressure","Anticoagulant status","ETA","Home address","Full past surgical history"], answer:[0,1,2,3,4,5,6,7],
       explain:"Age, last seen well, BEFAST, RACE if done, RBS, BP, anticoagulant status (which drug, if known) and ETA.", src:"CPG 3.1 p.62"},
      {type:"read", title:"Stroke management", scope:"AP", body:"Stroke is time critical. Manage symptomatically and transport rapidly:",
       points:["Lateral or semi-Fowler's position if consciousness is reduced","<b>Oxygen only as required</b>","<b>Paracetamol</b> and an <b>antiemetic</b> if required","<b>Penthrox has been removed</b> from stroke management","Don't lower a high BP with nitrates","Rule out mimics such as hypoglycaemia and seizures","APs don't need a CCP unless there's haemodynamic or airway compromise. Don't wait on scene; meet the CCP en route"], src:"CPG 3.1 pp.61–65"},
      {type:"choice", label:"Case", scope:"AP", prompt:"A stroke patient has a headache and SpO₂ 97% on room air. What's appropriate?",
       options:["Penthrox if required; high-flow oxygen","Paracetamol if required; no oxygen","Wait on scene for a CCP before treating"], answer:1,
       explain:"Penthrox is removed; oxygen only as required; paracetamol if required. Don't delay transport waiting for a CCP.", src:"CPG 3.1 pp.63, 65"}
     ]}
    ]},
    {title:"Module check", lessons:[{id:"st-x", title:"Stroke Check", mode:"exit", bank:"stroke"}]}
   ]},

);
