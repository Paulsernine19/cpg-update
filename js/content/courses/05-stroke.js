COURSES.push(
 { id:"stroke", title:"Stroke", category:"Module 4", hue:"--c-stroke", icon:"stroke", minutes:20, requires:["intro"],
   desc:"The changed time window, destination and priority tree, RACE and prenotification.",
   coverage:"CPG 3.1",
   units:[
    {title:"Destination", lessons:[
     {id:"st-3", title:"Route Decisions", steps:[
      {type:"read", title:"The updated decision tree", scope:"AP", visual:"tree", body:"Destination depends on when the patient was last known well and, in the 8 to 24-hour window, on RACE. The old 15-hour threshold has been removed. Wake-up or unknown-onset stroke is treated as acute.",
       src:"CPG 3.1 p.64"},
      {type:"scrub", scrub:"stroke", label:"Explore", scope:"AP"},
      {type:"sort", label:"Route each patient", scope:"AP", prompt:"Where does each patient go?", bins:["P1 to HGH ED","P2 to nearest ED","Treat per condition"],
       cards:[{t:"BEFAST positive, last known well 7 hours ago",b:0,why:"≤8 hours: P1 to HGH ED with prenotification via CC:E."},
        {t:"BEFAST positive, last known well exactly 8 hours ago",b:0,why:"Exactly 8 hours is in the ≤8-hour branch: P1 to HGH ED."},
        {t:"BEFAST positive, last known well 10 hours ago, RACE 6",b:0,why:">8 to <24 hours with RACE ≥5: P1 to HGH ED with prenotification."},
        {t:"BEFAST positive, last known well 12 hours ago, RACE 3",b:1,why:">8 to <24 hours with RACE <5: P2 to the nearest appropriate ED."},
        {t:"BEFAST positive, last known well exactly 24 hours ago",b:1,why:"≥24 hours: P2 to the nearest appropriate ED. RACE isn't used."},
        {t:"BEFAST positive, woke up with the symptoms, onset unknown",b:0,why:"Wake-up or unknown onset is treated as acute: P1 to HGH ED with prenotification."},
        {t:"BEFAST negative: no balance, vision, face, arm or speech change",b:2,why:"BEFAST negative: manage according to the clinical condition."}],
       explain:"≤8 hours, or wake-up / unknown onset: P1 to HGH ED with prenotification via CC:E. >8 to <24 hours: RACE decides (≥5 P1 to HGH ED, <5 P2 to the nearest appropriate ED). ≥24 hours: P2 to the nearest appropriate ED. BEFAST negative: manage according to the clinical condition.", src:"CPG 3.1 p.64"}
     ]}
    ]},
    {title:"RACE", lessons:[
     {id:"st-1", title:"RACE Video", steps:[
      {type:"video", title:"Required RACE video", scope:"AP", body:"Circular AS/SC 26-56 requires all crews to watch this RACE educational video. Watching it is recorded separately and does not by itself show accurate scoring.",
       url:"https://youtu.be/9-65gGKgx_k?si=fyOk2lX7LI0lJ4PY", src:"Circular p.2"}
     ]},
     {id:"st-2", title:"RACE Scoring", steps:[
      {type:"read", title:"The RACE scale", scope:"AP", visual:"race", body:"RACE (Rapid Arterial oCclusion Evaluation) is used with BEFAST to spot a likely <b>large vessel occlusion</b>. It decides the destination only for BEFAST-positive patients last known well <b>more than 8 and less than 24 hours</b> ago.", src:"CPG 3.1 pp.63–64"},
      {type:"choice", label:"Cortical test", scope:"AP", prompt:"The patient's weakness is on the right side. Which cortical test do you score?",
       options:["Aphasia: \"Close your eyes\" and \"Make a fist\"","Agnosia: \"Whose arm is this?\" and \"Lift both arms and clap\"","Both"], answer:0,
       fb:[null,"Agnosia is scored for left hemiparesis. Right-sided weakness means aphasia.","Score one test only: aphasia for right hemiparesis, agnosia for left."],
       explain:"Right hemiparesis → aphasia. Left hemiparesis → agnosia. Score one or the other.", src:"CPG 3.1 p.63"},
      {type:"input", label:"Score it", scope:"AP", visual:"race", prompt:"Right-sided stroke. Moderate facial droop, can't lift the right arm against gravity (severe), moderate leg weakness, eyes deviated to the left, and does only one of the two commands. Total RACE?", answer:"7", unit:"/ 9",
       explain:"Face 2 + arm 2 + leg 1 + gaze 1 + aphasia 1 = 7. RACE ≥5 suggests LVO.", src:"CPG 3.1 p.63"}
     ]},
     {id:"st-rb", title:"RACE Practice", steps:[
      {type:"racebench", label:"Patient 1 of 3", onset:"mid", scope:"AP"},
      {type:"racebench", label:"Patient 2 of 3", onset:"other", scope:"AP"},
      {type:"racebench", label:"Patient 3 of 3", onset:"any", scope:"AP"}
     ]}
    ]},
    {title:"Handover and care", lessons:[
     {id:"st-4", title:"Prenotification & Care", steps:[
      {type:"choice", label:"Prenotification", scope:"AP", prompt:"You update CC:E and prenotify HGH: \"Male, 67. Last seen well at 07:30. BEFAST positive: right facial droop and right arm weakness. RACE 6. BP 182/96. ETA 15 minutes.\" What's missing?",
       options:["RBS and anticoagulant status","Home address and next of kin","Past surgical history and occupation"], answer:0,
       fb:[null,"These aren't on the stroke prenotification list. The handover is missing the RBS and anticoagulant status.","These aren't on the stroke prenotification list. The handover is missing the RBS and anticoagulant status."],
       explain:"Stroke prenotification: age, time last seen well or symptom onset, BEFAST findings, RACE score if applicable, RBS, blood pressure, anticoagulant status (which drug, if known) and ETA.", src:"CPG 3.1 p.62"},
      {type:"sort", label:"Management", scope:"AP", prompt:"Stroke is time critical: manage symptomatically and transport rapidly. Do or don't?", bins:["Do","Don't"],
       cards:[{t:"Lateral or semi-Fowler's position if consciousness is reduced",b:0,why:"Position the patient with a reduced level of consciousness laterally or semi-Fowler's."},
        {t:"Check the RBS to rule out a mimic",b:0,why:"Rule out mimics such as hypo- or hyperglycaemia, seizures and hypoxia."},
        {t:"Paracetamol for a headache, if required",b:0,why:"Paracetamol and an antiemetic if required."},
        {t:"High-flow oxygen with SpO₂ 97% on room air",b:1,why:"Oxygen only as required."},
        {t:"Penthrox for pain",b:1,why:"Penthrox has been removed from stroke management."},
        {t:"GTN to bring down a BP of 210/110",b:1,why:"Don't try to reduce the BP with nitrates."},
        {t:"Wait on scene for a CCP; airway and circulation are stable",b:1,why:"APs don't need a CCP without airway or haemodynamic compromise. Don't wait on scene; meet a CCP en route if one is needed."}],
       explain:"Position appropriately, rule out mimics, oxygen only as required, paracetamol and an antiemetic if required. No Penthrox, no nitrates for high BP, and don't delay transport waiting for a CCP.", src:"CPG 3.1 pp.62–65"}
     ]}
    ]},
    {title:"Module check", lessons:[{id:"st-x", title:"Stroke Check", mode:"exit", bank:"stroke"}]}
   ]},

);
