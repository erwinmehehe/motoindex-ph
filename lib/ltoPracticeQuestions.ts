/** Original MotoIndex practice scenarios. Not LTO examination questions. */
export type LtoPracticeQuestion = { id: string; question: string; options: string[]; correctIndex: number; explanation: string };
export const ltoPracticeQuestions: LtoPracticeQuestion[] = [
  {
    "id": "red",
    "question": "What should a driver do at a steady red traffic signal?",
    "options": [
      "Stop before the marked stop line and wait for a permitted signal",
      "Proceed if the road looks empty",
      "Honk and continue slowly"
    ],
    "correctIndex": 0,
    "explanation": "A red signal calls for stopping at the appropriate line. Do not enter solely because no other vehicle appears."
  },
  {
    "id": "pedestrian",
    "question": "A pedestrian is using a marked crossing ahead. What is the safer action?",
    "options": [
      "Maintain speed and sound the horn",
      "Slow down and yield as required",
      "Overtake vehicles stopped at the crossing"
    ],
    "correctIndex": 1,
    "explanation": "Give priority to pedestrians as required; never use another vehicle's stop as permission to pass."
  },
  {
    "id": "stop",
    "question": "What does a STOP sign instruct?",
    "options": [
      "Reduce speed only",
      "Come to a full stop, then proceed when safe",
      "Stop only when another vehicle is visible"
    ],
    "correctIndex": 1,
    "explanation": "A stop sign requires a complete stop at the appropriate location and a safety check before moving."
  },
  {
    "id": "rain",
    "question": "How should you adjust your driving on a wet road?",
    "options": [
      "Increase following distance and reduce speed",
      "Brake late because wet tires grip better",
      "Follow closely so others can see you"
    ],
    "correctIndex": 0,
    "explanation": "Wet surfaces can reduce traction and increase stopping distance. Leave room and adjust speed."
  },
  {
    "id": "emergency",
    "question": "An emergency vehicle using warning signals approaches from behind. What should you do?",
    "options": [
      "Block its lane to make other traffic stop",
      "Yield safely while obeying road conditions and traffic directions",
      "Accelerate abruptly to outrun it"
    ],
    "correctIndex": 1,
    "explanation": "Yield to an emergency vehicle in a safe, controlled manner; do not create a second hazard."
  },
  {
    "id": "lane",
    "question": "Before changing lanes, what should you check?",
    "options": [
      "Only the rear-view mirror",
      "Only whether the adjacent lane looks empty ahead",
      "Mirrors, blind spots, signaling and a safe gap"
    ],
    "correctIndex": 2,
    "explanation": "A safe lane change uses mirrors, a blind-spot check, a signal and enough space."
  },
  {
    "id": "junction",
    "question": "The traffic light is green but vehicles have blocked the intersection. What is best?",
    "options": [
      "Wait until there is space to clear the intersection",
      "Enter and stop in the intersection",
      "Follow the car ahead even if you cannot exit"
    ],
    "correctIndex": 0,
    "explanation": "Do not enter a junction if you are likely to block crossing traffic."
  },
  {
    "id": "curve",
    "question": "When approaching a sharp curve, which practice is safer?",
    "options": [
      "Slow to an appropriate speed before the curve",
      "Brake hard only after losing traction",
      "Accelerate into the curve to shorten the turn"
    ],
    "correctIndex": 0,
    "explanation": "Reduce speed before the turn and keep vehicle control and lane position."
  },
  {
    "id": "roadwork",
    "question": "You encounter warning signs and workers at road repairs. What should you do?",
    "options": [
      "Follow temporary traffic controls and reduce speed",
      "Ignore temporary signs if the road looks open",
      "Pass construction vehicles on the shoulder"
    ],
    "correctIndex": 0,
    "explanation": "Temporary road signs and directions protect workers and road users."
  },
  {
    "id": "crossing",
    "question": "When approaching a school or busy pedestrian area, you should:",
    "options": [
      "Increase speed to clear the zone",
      "Be ready to slow or stop for people crossing",
      "Assume children always see your vehicle"
    ],
    "correctIndex": 1,
    "explanation": "Anticipate unexpected movements and leave more time to react."
  },
  {
    "id": "code",
    "question": "Which Philippine driver-license code is assigned to motorcycles?",
    "options": [
      "DL Code B only",
      "DL Code A",
      "No code is needed if the motorcycle is under 400cc"
    ],
    "correctIndex": 1,
    "explanation": "LTO assigns DL Code A to motorcycles; DL Code B is for passenger vehicles."
  },
  {
    "id": "visibility",
    "question": "In poor visibility, what is a safer general approach?",
    "options": [
      "Use an appropriate reduced speed and lights required by conditions",
      "Turn off lights and rely only on the vehicle ahead",
      "Drive at the posted maximum regardless of visibility"
    ],
    "correctIndex": 0,
    "explanation": "Adjust to how far ahead you can see, your stopping distance and applicable lighting rules."
  }
];
