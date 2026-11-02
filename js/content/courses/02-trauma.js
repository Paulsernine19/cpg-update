COURSES.push(
 { id:"trauma", title:"Trauma", category:"Module 1", hue:"--c-trauma", icon:"trauma", minutes:45, requires:["intro"],
   desc:"Extrication, the changed TXA indications, hands-on paediatric TXA preparation, seat belt sign bypass, and spinal or neurogenic shock.",
   coverage:"CPG 10.1, 10.2, 10.3, 10.4–10.7, 10.10, 10.11, 10.13 · TXA formulary · obstetric TXA crossover 12.1–12.4",
   units:[
    {title:"Extrication", lessons:[
     {id:"tr-1", title:"Trapped Patient Case", steps:[
      {type:"choice", label:"Case · before the update", scope:"AP", prompt:"Road traffic collision. The driver is alert, has neck pain, follows instructions and says they can stand. You find no neurological deficit. What is your first-choice extrication approach?",
       options:["Full immobilised extraction because of the neck pain","Self-extrication or minimally assisted extrication","Leave the patient in the vehicle until the pain settles"], answer:1,
       fb:["Neck or back pain is no longer a reason for an immobilised extraction. Self-extrication is now first line unless there's a contraindication.",null,"Trapped patients are time critical. Extricate as soon as possible."],
       explain:"Self-extrication or minimal assistance is now the standard first-line technique for patients without contraindications, including those with neck or back pain.", src:"CPG 10.13 p.200"},
      {type:"read", title:"What changed", scope:"AP", body:"CPG 10.13 is new. Self-extrication, or minimally assisted extrication, is the first-line technique for every patient without a contraindication. That includes:",
       points:["Children who can follow instructions","Patients with neck or back pain","Soft neurological signs, such as non-dermatomal tingling, and signs of central cord syndrome","<b>Contraindications:</b> can't understand or follow instructions · injuries or baseline function that prevent standing on at least one leg","<b>Hard neurological signs</b> (loss of motor and sensory function): rapid extrication with gentle handling","Conscious with no neuro deficit: no manual in-line stabilisation needed in the vehicle","Assisted means gentle support, like an arm to stand or holding the belt. Never drag or lift."], src:"CPG 10.13 p.200"},
      {type:"walk", label:"Interactive algorithm", title:"Work through the extrication decision", scope:"AP",
       case:"Alert driver with neck pain. Follows instructions, says they can stand, no neurological deficit.", start:"s",
       nodes:{s:{q:"Is there an immediate threat to life, or is the patient unconscious with absent or ineffective breathing?",opts:[{t:"No",to:"a"},{t:"Yes",why:"Check the case: the driver is alert and talking."}]},
              a:{q:"Can the patient understand and follow instructions?",opts:[{t:"Yes",to:"b"},{t:"No",why:"Check the case: the driver follows instructions."}]},
              b:{q:"Can they stand on at least one leg?",opts:[{t:"Yes",to:"c"},{t:"No",why:"Check the case: the driver says they can stand."}]},
              c:{q:"Any hard neurological signs (loss of motor and sensory function)?",opts:[{t:"No",to:"e"},{t:"Yes",why:"Check the case: no neurological deficit was found."}]},
              e:{end:"Self-extrication or minimal assistance. Use U-STEP Out to guide it. Stop if any clinical concern appears.",tone:"p1"}},
       src:"CPG 10.13 pp.200–201"},
      {type:"choice", label:"Case changes", scope:"AP", prompt:"Same collision, different driver: confused and unable to follow instructions. Is self-extrication still the first choice?",
       options:["Yes, as long as the neck pain is mild","No. Being unable to follow instructions is a contraindication","Yes, confusion doesn't affect extrication"], answer:1,
       explain:"Inability to understand or follow instructions is a contraindication to self-extrication. Use manual extrication (combi-carrier or trauma board).", src:"CPG 10.13 pp.200, 202"},
      {type:"choice", label:"Case changes", scope:"AP", prompt:"Another driver can stand on both legs but reports pins and needles in one hand that doesn't follow a dermatome. Strength and sensation are otherwise normal. What does this change?",
       options:["Nothing: soft signs like non-dermatomal tingling still allow self-extrication","They need a rapid extrication with gentle handling","They must stay in the vehicle until fully immobilised"], answer:0,
       fb:[null,"Rapid extrication is for hard signs: loss of motor and sensory function.","Soft neurological signs are explicitly included in the self-extrication group."],
       explain:"Non-dermatomal tingling is a soft sign, so self-extrication is still first line. Reassess as you go.", src:"CPG 10.13 p.200"},
      {type:"choice", label:"Case changes", scope:"AP", prompt:"A third driver can't move or feel either leg. Which approach?",
       options:["Self-extrication with verbal guidance","Rapid extrication with gentle handling","Leave them until a full set of observations is done"], answer:1,
       explain:"Hard neurological signs (loss of motor and sensory function) mean rapid extrication with gentle handling. Keep monitoring to a minimum while they're trapped.", src:"CPG 10.13 p.200"},
      {type:"multi", label:"While trapped", scope:"AP", prompt:"The patient is trapped while Civil Defence cut the car. Which interventions belong in the vehicle?",
       options:["Haemorrhage control","TXA if indicated","Analgesia (Penthrox or ketamine) to help extrication","Full head-to-toe assessment","Repeated full sets of vital signs","Psychological support, with an extrication buddy if possible"], answer:[0,1,2,5],
       explain:"Limit care to critical interventions: haemorrhage control, TXA if indicated and analgesia to facilitate extrication, plus psychological support. Keep monitoring minimal; do the full head-to-toe once they're out.", src:"CPG 10.13 pp.200–202"}
     ]},
     {id:"tr-2", title:"U-STEP Out", steps:[
      {type:"read", title:"The U-STEP Out tool", scope:"AP", visual:"ustep", body:"CPG 10.13 includes the U-STEP Out decision tool to guide self-extrication. Before you start, ask: <b>does this casualty need a snatch rescue?</b> If there's an immediate threat to life, or they're unconscious with absent or ineffective breathing, perform an immediate extrication. Stop using the tool at any clinical concern or contraindication.", src:"CPG 10.13 p.201"},
      {type:"walk", label:"Guide the casualty", title:"Talk them out, step by step", scope:"AP",
       case:"Alert driver, neck pain, no contraindications. Civil Defence have the door open.", start:"u",
       nodes:{u:{q:"Step 1. What do you check first?",opts:[{t:"That they understand: wind the window down or give a thumbs up",to:"s"},{t:"Ask them to step out",why:"Check understanding first. A casualty who can't follow instructions isn't suitable."},{t:"Ask them to move their legs",why:"That's step 3. Start by checking they understand."}]},
              s:{q:"Step 2. Support. What do you do?",opts:[{t:"Reassure them and explain you'll keep them safe, in language they understand",to:"t"},{t:"Apply a collar and lift them out",why:"Self-extrication doesn't involve lifting. Support means reassurance and explanation."}]},
              t:{q:"Step 3. Try moving. Ask them to move both legs. They can't move one leg. What now?",opts:[{t:"Carry on to egress",why:"If they can't move both legs, they won't be able to self-extricate."},{t:"Stop: they won't be able to self-extricate",to:"t2"}]},
              t2:{q:"Back to our driver, who moves both legs easily. Step 4?",opts:[{t:"Egress: door fully open, all obstructions out of the way",to:"p"},{t:"Plan where they'll go",why:"Clear the exit (egress) before planning the destination."}]},
              p:{q:"Step 5. Plan. What do you sort out?",opts:[{t:"Where they go next: chair or stretcher, placed close to the vehicle",to:"o"},{t:"The hospital destination only",why:"Plan the immediate next place: chair or stretcher, close by. The stretcher must be ready."}]},
              o:{q:"Step 6. Out. How do they leave the vehicle?",opts:[{t:"Ask them to step out, supporting only if required",to:"e"},{t:"Pull them out by the arms",why:"Never drag or lift the casualty."}]},
              e:{end:"Out. A rigid collar can be used as an extrication aid; consider removing it once they're on the stretcher. Apply SMR if indicated.",tone:"p1"}},
       src:"CPG 10.13 pp.201–202"},
      {type:"choice", label:"Check", scope:"AP", prompt:"Before starting U-STEP Out, you find the patient unconscious with ineffective breathing. What do you do?",
       options:["Use U-STEP Out slowly","Immediate (snatch) extrication","Wait for them to wake"], answer:1,
       explain:"Immediate threat to life or unconscious with absent or ineffective breathing: perform an immediate extrication. U-STEP Out is only for suitable, cooperative casualties.", src:"CPG 10.13 p.201"}
     ]}
    ]},
    {title:"Tranexamic acid (TXA)", lessons:[
     {id:"tr-3", title:"TXA Indications", steps:[
      {type:"read", title:"Who gets paediatric TXA", scope:"AP", body:"Paediatric IV TXA is now within AP scope. Indications (AP and CCP):",
       points:["A <b>child under 14</b> with <b>major trauma less than 3 hours old</b>, and either:","&nbsp;&nbsp;• suspected or confirmed major haemorrhage, or","&nbsp;&nbsp;• isolated traumatic brain injury with <b>GCS ≤12</b>","<b>Contraindications:</b> hypersensitivity to TXA · injury more than 3 hours old · significant blood loss unlikely"],
       src:"HMCAS Paediatric IV TXA poster · Circular rows 12–18, 20, 27–28"},
      {type:"sort", label:"Sort the cases", scope:"AP", prompt:"Give or withhold TXA?", bins:["Give TXA","Withhold TXA"],
       cards:[{t:"6 years, pelvic injury 40 minutes ago, pale and tachycardic",b:0},{t:"9 years, isolated head injury 1 hour ago, GCS 11",b:0},{t:"4 years, fall 4 hours ago, suspected internal bleeding",b:1},{t:"7 years, closed wrist fracture, haemodynamically normal",b:1},{t:"10 years, major haemorrhage, previous anaphylaxis to TXA",b:1},{t:"11 years, isolated head injury 30 minutes ago, GCS 14",b:1}],
       explain:"Give: major trauma under 3 hours with suspected major haemorrhage, or isolated TBI with GCS ≤12. Withhold: injury over 3 hours old, significant blood loss unlikely, TXA hypersensitivity, or isolated head injury with GCS above 12.", src:"HMCAS Paediatric IV TXA poster"},
      {type:"read", title:"Obstetric TXA (crossover)", scope:"AP", body:"In obstetrics, TXA is now indicated for <b>postpartum haemorrhage only</b>. It has been removed from the ectopic pregnancy, miscarriage, placental abruption and placenta praevia algorithms (CPG 12.1–12.4).", src:"Circular rows 22–25, 29 · Summary p.4"},
      {type:"sort", label:"Sort the cards", scope:"AP", prompt:"Is TXA an indication in v2.6?", bins:["TXA indication","Not a TXA indication"],
       cards:[{t:"Postpartum haemorrhage",b:0},{t:"Ectopic pregnancy with bleeding",b:1},{t:"Miscarriage",b:1},{t:"Placental abruption",b:1},{t:"Placenta praevia",b:1}],
       explain:"PPH is the only obstetric TXA indication. Removal from the other algorithms does not remove the need for urgent haemorrhage care.", src:"Circular rows 22–25, 29"}
     ]},
     {id:"tr-4", title:"TXA Dose Chart", steps:[
      {type:"read", title:"Dose from the chart", scope:"AP", visual:"txachart", body:"The dose is <b>15 mg/kg</b>, using the chart's estimated weight for the child's age. For babies aged 0–12 months, weight = (age in months × 0.5) + 4. Once 1 g is in the 100 mL bag the concentration is <b>10 mg/mL</b>, so volume (mL) = dose (mg) ÷ 10.",
       points:["Poster example: 4-year-old, 16 kg → 240 mg → 24 mL, given over 10 minutes"], src:"HMCAS Paediatric IV TXA poster"},
      {type:"input", label:"Practice · baby", scope:"AP", prompt:"An 8-month-old baby meets the criteria. What is the estimated weight?", answer:"8", unit:"kg", explain:"(8 × 0.5) + 4 = 8 kg.", src:"HMCAS Paediatric IV TXA poster"},
      {type:"input", label:"Practice · baby", scope:"AP", prompt:"What dose does that 8 kg baby need at 15 mg/kg?", answer:"120", unit:"mg", explain:"8 kg × 15 mg/kg = 120 mg.", src:"HMCAS Paediatric IV TXA poster"},
      {type:"input", label:"Practice · baby", scope:"AP", prompt:"What volume do you draw from the 10 mg/mL bag?", answer:"12", unit:"mL", explain:"120 mg ÷ 10 mg/mL = 12 mL, given over 10 minutes.", src:"HMCAS Paediatric IV TXA poster"},
      {type:"input", label:"Practice · chart", scope:"AP", visual:"txachart", prompt:"A 6-year-old meets the criteria. Using the chart, what volume do you give?", answer:"37", unit:"mL", explain:"The chart gives 25 kg → 370 mg → 37 mL, over 10 minutes.", src:"HMCAS Paediatric IV TXA poster"},
      {type:"read", title:"Children aged 8 and over, or over 30 kg", scope:"AP", body:"For these children you don't draw the dose up. Instead:",
       points:["Add 1 g to the 100 mL bag as usual","<b>Draw out and discard</b> the volume the chart shows for the child's age","Give the <b>remaining volume</b> over 10 minutes","The remaining volume includes 10 mL to compensate for the administration set"], src:"HMCAS Paediatric IV TXA poster"},
      {type:"choice", label:"Case", scope:"AP", visual:"txachart", prompt:"A 10-year-old (37 kg) meets the criteria. What do you do with the bag?",
       options:["Draw out and discard 35 mL, then give the remaining volume over 10 minutes","Draw up 55 mL into a syringe and give it","Give the whole 100 mL bag over 10 minutes"], answer:0,
       fb:[null,"For children aged 8 and over or over 30 kg, draw out the chart volume and give the remainder through the set. The remainder includes a 10 mL administration-set compensation.","The whole bag is 1 g, far more than this child's 550 mg dose."],
       explain:"Draw out and discard 35 mL. The 55 mL dose plus 10 mL set compensation remain, and you give that over 10 minutes.", src:"HMCAS Paediatric IV TXA poster"},
      {type:"input", label:"Practice · chart", scope:"AP", visual:"txachart", prompt:"A 12-year-old meets the criteria. How much do you draw out and discard?", answer:"26", unit:"mL", explain:"Draw out 26 mL, then give the remaining volume (64 mL dose) over 10 minutes.", src:"HMCAS Paediatric IV TXA poster"}
     ]},
    ]},
    {title:"TXA preparation: hands-on", lessons:[
     {id:"tx-v", title:"Watch: TXA Preparation", steps:[{type:"watch",title:"Paediatric TXA preparation",scope:"AP",body:"Watch this video before you prepare and give TXA yourself in the hands-on lessons.",src:null,src2:"HMCAS video"}]},
     {id:"tx-1", title:"The Call", scene:true, steps:[{type:"stage",stage:"intro"},{type:"stage",stage:"elig",case:"withhold"},{type:"stage",stage:"elig"}]},
     {id:"tx-2", title:"Gather Equipment", scene:true, steps:[{type:"stage",stage:"equip"}]},
     {id:"tx-4", title:"Make Room in the Bag", scene:true, steps:[{type:"stage",stage:"room"}]},
     {id:"tx-5", title:"Check & Draw Up", scene:true, steps:[{type:"stage",stage:"drawup"}]},
     {id:"tx-6", title:"Label the Bag", scene:true, steps:[{type:"stage",stage:"label"}]},
     {id:"tx-7", title:"Mix Gently", scene:true, steps:[{type:"stage",stage:"mix"}]},
     {id:"tx-3", title:"Dose from the Chart", scene:true, steps:[{type:"stage",stage:"dose"}]},
     {id:"tx-8", title:"5 Rights & Give It", scene:true, steps:[{type:"stage",stage:"give"}]},
     {id:"tx-10", title:"Solo Run", scene:true, txRun:true, steps:[{type:"stage",stage:"elig",case:"run"},{type:"stage",stage:"equip",case:"run"},{type:"stage",stage:"room",case:"run"},{type:"stage",stage:"drawup",case:"run"},{type:"stage",stage:"label",case:"run"},{type:"stage",stage:"mix",case:"run"},{type:"stage",stage:"dose",case:"run"},{type:"stage",stage:"give",case:"run"}]}
    ]},
    {title:"Destination and spinal", lessons:[
     {id:"tr-5", title:"Seat Belt Sign Bypass", steps:[
      {type:"choice", label:"Case", scope:"AP", prompt:"A restrained driver has bruising across the abdomen from the seat belt. Vital signs are currently within normal limits. What does v2.6 add to your destination decision?",
       options:["The abdominal seat belt sign is now included in the trauma bypass criteria, so apply the CPG 10.10 destination decision","Seat belt marks only matter if the patient is hypotensive","Nothing has changed for seat belt injuries"], answer:0,
       fb:[null,"Normal vital signs don't remove the new criterion. Check the bypass criteria in CPG 10.10.","The abdominal seat belt sign is a new bypass criterion in v2.6."],
       explain:"The abdominal seat belt sign is now a bypass criterion. The full destination decision follows approved CPG 10.10.", src:"Circular row 19 · Summary p.4"}
     ]},
     {id:"tr-6", title:"Spinal & Neurogenic Shock", steps:[
      {type:"read", title:"Two shock patterns, two targets", scope:"AP", body:"CPG 10.3 adds a section on spinal cord injury and neurogenic shock. Rule out other causes of shock first, such as major haemorrhage and TBI.",
       points:["<b>Isolated</b> spinal cord injury with neurogenic shock: MAP <b>85–90 mmHg</b>","<b>Combined</b> haemorrhagic and neurogenic shock: MAP <b>≥65 mmHg</b>","Avoid hypotension; give fluids judiciously and avoid overload","<span class='badge ccp'>CCP</span> Noradrenaline is the preferred vasopressor (adults); add an adrenaline infusion if bradycardia and hypotension persist","<span class='badge ccp'>CCP</span> Consider early intubation for C1–4 injury with airway or breathing compromise, keeping in-line stabilisation"], src:"CPG 10.3 pp.177–178"},
      {type:"choice", label:"Case", scope:"AP", prompt:"A motorcyclist with a suspected spinal injury is hypotensive and has a possible pelvic injury. Which MAP target applies?",
       options:["85–90 mmHg, because it's a spinal injury","≥65 mmHg, as combined haemorrhagic and neurogenic shock","No target until the CCP arrives"], answer:1,
       fb:["85–90 mmHg is for isolated neurogenic shock. A possible pelvic bleed makes this combined shock.",null,"Manage hypotension now within AP scope and request a CCP."],
       explain:"Combined haemorrhagic and neurogenic shock: aim for MAP ≥65 mmHg. Manage the haemorrhage per its CPG and escalate for vasopressors.", src:"CPG 10.3 p.178"},
      {type:"read", title:"Revised spinal motion restriction", scope:"AP", body:"When SMR is indicated:",
       points:["Size collars correctly; remove a rigid collar if it causes discomfort or distress","The combi-carrier is mainly an extrication or carrying device: consider removing it once the patient is on the stretcher","Keep the <b>unconscious</b> trauma patient on the combi-carrier","Secure with spider harness (on the board) or stretcher straps","<b>Head blocks always</b>, on the board or the stretcher","Stretcher may be raised <b>up to 30°</b> if lying flat causes distress"], src:"CPG 10.3 p.178"},
      {type:"sort", label:"Sort the patients", scope:"AP", prompt:"On the stretcher: keep the combi-carrier, or consider removing it?", bins:["Keep the combi-carrier","Consider removing it"],
       cards:[{t:"Unconscious after a rollover",b:0},{t:"Alert, neck pain, distressed lying on the board",b:1},{t:"GCS 15 after self-extrication, on the stretcher",b:1},{t:"GCS 6, intubated by CCP",b:0}],
       explain:"Consider removing the board once the patient is on the stretcher, particularly if it causes distress. Keep unconscious trauma patients on it. Head blocks either way.", src:"CPG 10.3 p.178"}
     ]},
     {id:"tr-7", title:"Hands-on: On the Stretcher", scene:"smr", steps:[{type:"stage",stage:"smr"},{type:"stage",stage:"smr",variant:"unc"}]}
    ]},
    {title:"Module check", lessons:[{id:"tr-x", title:"Trauma Check", mode:"exit", bank:"trauma"}]}
   ]},

);
