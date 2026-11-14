// Trauma scene pictures (sc/). A step sets pic:"key" (shown above the question) and optionally after:"key" + afterCap (replaces it once answered correctly).
// Walk nodes can set their own pic and cap. pos = object-position, keeps the subject in frame on narrow screens.
// Layout under test: "overlay" = full-width picture with the question on it; "card" = picture card above the question. Override with index.html?scene=card
const SCENE_LAYOUT=(()=>{try{return new URLSearchParams(location.search).get("scene")||"overlay"}catch(e){return "overlay"}})();
// Module cover pictures for the Modules tab cards (module id → image, crop position). Modules without one show their icon.
const MOD_COVERS={
 trauma:{img:"sc/scene-01-arrival.webp",pos:"55% 55%"},
 newborn:{img:"th/5wraped.webp",pos:"30% 30%"}
};
const SCENES={
 arrival:{img:"sc/scene-01-arrival.webp",pos:"55% 50%",alt:"Two HMCAS paramedics walk towards a two-car collision on a main road. Civil Defence are on scene and one driver is still seated in the white car."},
 "driver-window":{img:"sc/scene-02-driver-window.webp",pos:"52% 45%",alt:"A paramedic talks to an alert driver through the open window. The driver wears his seat belt and holds the back of his neck. No collar or board is in use."},
 "self-extrication":{img:"sc/scene-03-self-extrication.webp",pos:"58% 50%",alt:"The driver swings his legs out of the open door. A paramedic guides him with an open hand ready to support, and a stretcher is placed close to the car."},
 "to-stretcher":{img:"sc/scene-04-standing-to-stretcher.webp",pos:"40% 50%",alt:"The driver sits down on the stretcher beside his car, with a paramedic at his side."},
 "stretcher-blocks":{img:"sc/scene-05-on-stretcher-blocks.webp",pos:"50% 55%",alt:"The alert driver lies on the stretcher with head blocks in place and no board underneath. A paramedic checks him."},
 "door-cut":{img:"sc/scene-06-door-cut.webp",pos:"60% 45%",alt:"Civil Defence cut the driver's door with a hydraulic tool. A paramedic in the rear seat talks to the alert, trapped driver."},
 "cant-feel-legs":{img:"sc/scene-07-cant-feel-legs.webp",pos:"60% 50%",alt:"A distressed driver sits in his car looking down at his legs, with his hands on his thighs."},
 unconscious:{img:"sc/scene-08-unconscious-driver.webp",pos:"55% 50%",alt:"A driver is slumped forward against his seat belt with his eyes closed. A paramedic leans in at the driver's window."},
 "seatbelt-sign":{img:"sc/scene-09-seatbelt-sign.webp",pos:"50% 60%",alt:"Close-up of a patient's lower abdomen, showing a band of bruising across it from a lap belt."},
 "distressed-flat":{img:"sc/scene-10-distressed-flat.webp",pos:"40% 45%",alt:"In the ambulance, a patient with head blocks and harness straps grimaces while lying on the stretcher. A paramedic sits beside him."}
};
