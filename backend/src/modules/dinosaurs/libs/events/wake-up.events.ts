import { DinosaurAction } from "../../models/dinosaur-action.enum";
import { DynamicEventData } from "../../models/dynamic-event-data.interface";

export const wakeUpEvents: DynamicEventData[] = [
  {
    id: 0,
    name: "Réveil en pleine forme",
    actionType: DinosaurAction.WakeUp,
    minLevel: 0,
    positivityScore: 5,
    weight: 2,
    descriptions: [
      "Le dinosaure se réveille en pleine forme, prêt à conquérir la jungle !",
      "Une aube radieuse, l'énergie déborde de ses veines.",
      "Il ouvre les yeux, et le monde semble s'incliner devant sa vitalité.",
      "Un réveil éclatant qui illumine sa journée.",
      "Le dinosaure se lève, vif et alerte, comme un rayon de soleil."
    ],
    baseModifiers: [
      {
        source: "wakeUp",
        target: "hunger",
        base_value: -500,
        additiveStep: 5,
        additiveIncrement: -100,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
    ] 
  },
  {
    id: 0,
    name: "Réveil malade",
    actionType: DinosaurAction.WakeUp,
    minLevel: 0,
    positivityScore: -5,
    weight: 1,
    descriptions: [
      "Le dinosaure se réveille avec la moue, visiblement patraque.",
      "Un réveil laborieux où même le soleil semble se moquer de lui.",
      "Les paupières lourdes et l'énergie en berne, le réveil est un calvaire.",
      "Il titube hors de son sommeil, souffrant d'un mal inexplicable.",
      "Un matin sombre : le dinosaure semble avoir attrapé la fièvre."
    ],
    baseModifiers: [
      {
        source: "wakeUp",
        target: "energy",
        base_value: -500,
        additiveStep: 5,
        additiveIncrement: -100,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  },
  {
    id: 0,
    name: "Réveil normal",
    actionType: DinosaurAction.WakeUp,
    minLevel: 0,
    positivityScore: 0,
    weight: 5,
    descriptions: [
      "Le dinosaure se réveille pour une nouvelle journée, sans grande surprise.",
      "Un réveil ordinaire, où l'énergie fait un petit plongeon.",
      "Le matin arrive, et il se lève tranquillement, conscient que rien d'extraordinaire n'est prévu.",
      "Un réveil modeste, ni éclatant ni désastreux.",
      "Le dinosaure ouvre les yeux pour une journée qui s'annonce banale."
    ],
    baseModifiers: []
  },
  {
    id: 0,
    name: "Réveil grognon",
    actionType: DinosaurAction.WakeUp,
    minLevel: 2,
    positivityScore: -5,
    weight: 2,
    descriptions: [
      "Le dinosaure se réveille grognon, râlant dès l'aube.",
      "Un réveil grincheux où la mauvaise humeur se lit sur son visage.",
      "Il se lève en grognant, déjà prêt à contester la journée.",
      "Un matin maussade, où l'irritation règne en maître.",
      "Le réveil est perturbé par une humeur noire et un râle constant."
    ],
    baseModifiers: [
      {
        source: "wakeUp",
        target: "energy",
        base_value: -50,
        additiveStep: 1,
        additiveIncrement: -10,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "wakeUp",
        target: "karma",
        base_value: -10,
        additiveStep: 0,
        additiveIncrement: 0,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  },
  {
    id: 0,
    name: "Réveil raté",
    actionType: DinosaurAction.WakeUp,
    minLevel: 3,
    positivityScore: -7,
    weight: 4,
    descriptions: [
      "Le dinosaure se réveille avec la gueule de bois, visiblement patraque.",
      "Un réveil laborieux où même le soleil semble se moquer de lui.",
      "Les paupières lourdes et l'énergie en berne, le réveil est un calvaire.",
      "Il titube hors de son sommeil, souffrant d'un mal inexplicable.",
      "Un matin sombre : le dinosaure semble avoir attrapé la fièvre."
    ],
    baseModifiers: [
      {
        source: "wakeUp",
        target: "energy",
        base_value: -100,
        additiveStep: 1,
        additiveIncrement: -25,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "wakeUp",
        target: "food",
        base_value: -500,
        additiveStep: 1,
        additiveIncrement: -20,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "wakeUp",
        target: "hunger",
        base_value: 500,
        additiveStep: 1,
        additiveIncrement: 50,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  },
  {
    id: 0,
    name: "Réveil explorateur",
    actionType: DinosaurAction.WakeUp,
    minLevel: 4,
    positivityScore: 5,
    weight: 2,
    descriptions: [
      "Le dinosaure se réveille avec une envie irrésistible d'explorer de nouveaux territoires.",
      "Un réveil aventurier, l'esprit ouvert aux mystères du monde.",
      "L'aube se lève sur un dinosaure en quête de découvertes inattendues.",
      "Un matin d'exploration où chaque pas promet une nouvelle aventure.",
      "Le dinosaure se lève, l'âme d'explorateur, prêt à tracer de nouveaux chemins."
    ],
    baseModifiers: [
      {
        source: "wakeUp",
        target: "experience",
        base_value: 500,
        additiveStep: 5,
        additiveIncrement: 250,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  },
  {
    id: 0,
    name: "Réveil méditatif",
    actionType: DinosaurAction.WakeUp,
    minLevel: 5,
    positivityScore: 10,
    weight: 2,
    descriptions: [
      "Le dinosaure se réveille en méditant, regagnant karma et énergie.",
      "Un réveil zen, où la méditation apporte sérénité et renouveau.",
      "Il ouvre les yeux dans un état méditatif, son karma se bonifie.",
      "Un matin apaisé, alliant énergie et équilibre intérieur.",
      "Le réveil est empreint de calme, un véritable moment de méditation."
    ],
    baseModifiers: [
      {
        source: "wakeUp",
        target: "experience",
        base_value: 500,
        additiveStep: 5,
        additiveIncrement: 50,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "wakeUp",
        target: "karma",
        base_value: 100,
        additiveStep: 0,
        additiveIncrement: 0,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  }
];
