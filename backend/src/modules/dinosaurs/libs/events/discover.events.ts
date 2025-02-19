import { ENERGY_COST_TO_DISCOVER } from "../../../../common/config/actions.constants";
import { DinosaurAction } from "../../models/dinosaur-action.enum";
import { DynamicEventData } from "../../models/dynamic-event-data.interface";

export const discoverEvents: DynamicEventData[] = [
  {
    id: 0,
    name: "Découverte majeure",
    actionType: DinosaurAction.Discover,
    minLevel: 2,
    positivityScore: 5,
    weight: 5,
    descriptions: [
      "Le dinosaure fait une découverte qui change tout, un moment historique.",
      "Une trouvaille majeure qui illumine son chemin.",
      "Il déterre un secret ancien, bouleversant son univers.",
      "Une découverte impressionnante qui lui confère une nouvelle sagesse.",
      "Un moment marquant qui redéfinit ses ambitions."
    ],
    baseModifiers: [
      {
        source: "discover",
        target: "experience",
        base_value: 1000,
        additiveStep: 10,
        additiveIncrement: 500,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "discover",
        target: "energy",
        base_value: -ENERGY_COST_TO_DISCOVER,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_DISCOVER,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  },
  {
    id: 0,
    name: "Découverte moyenne",
    actionType: DinosaurAction.Discover,
    minLevel: 2,
    positivityScore: 2,
    weight: 10,
    descriptions: [
      "Le dinosaure fait une découverte moyenne, suffisante pour l'inspirer.",
      "Une trouvaille modeste qui apporte un éclairage nouveau.",
      "Il déterre un fragment d'histoire, sans éclat majeur.",
      "Une découverte convenable qui enrichit son expérience.",
      "Un petit trésor trouvé presque par hasard, apportant un sourire discret."
    ],
    baseModifiers: [
      {
        source: "discover",
        target: "experience",
        base_value: 750,
        additiveStep: 10,
        additiveIncrement: 250,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "discover",
        target: "energy",
        base_value: -ENERGY_COST_TO_DISCOVER,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_DISCOVER,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  },
  {
    id: 0,
    name: "Découverte mineure",
    actionType: DinosaurAction.Discover,
    minLevel: 2,
    positivityScore: 0,
    weight: 20,
    descriptions: [
      "Le dinosaure fait une découverte mineure, discrète mais intrigante.",
      "Une trouvaille modeste qui laisse une petite étincelle d'inspiration.",
      "Un détail oublié refait surface, sans grand retentissement.",
      "Il découvre quelque chose d'anodin, mais qui pique sa curiosité.",
      "Une découverte mineure qui apporte une légère satisfaction."
    ],
    baseModifiers: [
      {
        source: "discover",
        target: "experience",
        base_value: 500,
        additiveStep: 10,
        additiveIncrement: 100,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "discover",
        target: "energy",
        base_value: -ENERGY_COST_TO_DISCOVER,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_DISCOVER,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  },
  {
    id: 0,
    name: "Découverte inutile",
    actionType: DinosaurAction.Discover,
    minLevel: 2,
    positivityScore: -5,
    weight: 15,
    descriptions: [
      "Le dinosaure suit un papillon et se retrouve avec une découverte bien banale.",
      "Une trouvaille totalement inutile, comme chercher une aiguille dans une botte de foin.",
      "Il découvre quelque chose qui n'a aucune importance.",
      "Un moment de distraction qui ne mène à rien de concret.",
      "Une découverte risible, sans valeur ni intérêt."
    ],
    baseModifiers: [
      {
        source: "discover",
        target: "energy",
        base_value: -ENERGY_COST_TO_DISCOVER,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_DISCOVER,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  },
  {
    id: 0,
    name: "Découverte mystérieuse",
    actionType: DinosaurAction.Discover,
    minLevel: 5,
    positivityScore: 10,
    weight: 1,
    descriptions: [
      "Le dinosaure trouve un portail vers une autre dimension, une vision hallucinante.",
      "Une découverte mystérieuse ouvre des portes vers l'inconnu.",
      "Il entre dans un monde parallèle où tout semble possible.",
      "Un portail étrange apparaît, promettant des secrets insoupçonnés.",
      "Une rencontre avec l'inexplicable, défiant toutes les lois de la réalité."
    ],
    baseModifiers: [
      {
        source: "discover",
        target: "experience",
        base_value: 5000,
        additiveStep: 20,
        additiveIncrement: 5000,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "discover",
        target: "energy",
        base_value: -ENERGY_COST_TO_DISCOVER,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_DISCOVER,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  },
  {
    id: 0,
    name: "Découverte phénoménale",
    actionType: DinosaurAction.Discover,
    minLevel: 10,
    positivityScore: 4,
    weight: 5,
    descriptions: [
      "Le dinosaure découvre une source d'énergie illimitée qui rehausse son karma.",
      "Une découverte phénoménale qui dépasse l'entendement.",
      "Face à une énergie inépuisable, il trouve une nouvelle force intérieure.",
      "Une trouvaille qui change la donne et booste son karma.",
      "Le secret de l'univers se dévoile, transformant son expérience en puissance."
    ],
    baseModifiers: [
      {
        source: "discover",
        target: "experience",
        base_value: 2500,
        additiveStep: 10,
        additiveIncrement: 500,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "discover",
        target: "energy",
        base_value: -ENERGY_COST_TO_DISCOVER,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_DISCOVER,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "discover",
        target: "karma",
        base_value: 200,
        additiveStep: 0,
        additiveIncrement: 0,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  },
  {
    id: 0,
    name: "Découverte universelle",
    actionType: DinosaurAction.Discover,
    minLevel: 20,
    positivityScore: 8,
    weight: 1,
    descriptions: [
      "Le dinosaure découvre les secrets de l'univers après avoir goûté à un champignon vénéneux.",
      "Une révélation cosmique ouvre son esprit aux mystères de l'infini.",
      "L'univers se dévoile dans une explosion de visions hallucinées.",
      "Un moment d'illumination cosmique qui transforme son karma.",
      "Une découverte universelle qui redéfinit sa perception de la réalité."
    ],
    baseModifiers: [
      {
        source: "discover",
        target: "experience",
        base_value: 5000,
        additiveStep: 10,
        additiveIncrement: 1000,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "discover",
        target: "energy",
        base_value: -ENERGY_COST_TO_DISCOVER,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_DISCOVER,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "discover",
        target: "karma",
        base_value: 500,
        additiveStep: 0,
        additiveIncrement: 0,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  },
  {
    id: 0,
    name: "Découverte ultime",
    actionType: DinosaurAction.Discover,
    minLevel: 25,
    positivityScore: 10,
    weight: 1,
    descriptions: [
      "Le dinosaure atteint la connaissance ultime de la nature.",
      "Une découverte transcendante qui révèle tous les secrets de l'univers.",
      "Le sommet de la découverte, un moment de pure révélation.",
      "Une illumination ultime, redéfinissant sa place dans le monde.",
      "Le dinosaure obtient la sagesse suprême grâce à une découverte inouïe."
    ],
    baseModifiers: [
      {
        source: "discover",
        target: "experience",
        base_value: 10000,
        additiveStep: 5,
        additiveIncrement: 1000,
        multiplicativeStep: 25,
        multiplicativeIncrement: 0.1
      },
      {
        source: "discover",
        target: "energy",
        base_value: -ENERGY_COST_TO_DISCOVER,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_DISCOVER,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "discover",
        target: "karma",
        base_value: 800,
        additiveStep: 0,
        additiveIncrement: 0,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  },
  {
    id: 0,
    name: "Trésor de poche",
    actionType: DinosaurAction.Discover,
    minLevel: 3,
    positivityScore: 5,
    weight: 10,
    descriptions: [
      "En fouillant dans une vieille cachette, le dinosaure déterre quelques pièces, comme un trésor de poche sorti d'une tirelire oubliée.",
      "Une trouvaille modeste, digne d'une collection insolite, qui fait sourire le dinosaure.",
      "Il met la main sur un petit pactole, aussi surprenant qu'une pièce de monnaie en chocolat.",
      "Un butin discret qui, malgré son aspect dérisoire, apporte son lot de bonne humeur.",
      "Le dinosaure découvre un trésor de poche qui aurait fait rougir un simple cochon-tirelire."
    ],
    baseModifiers: [
      {
        source: "discover",
        target: "money",
        base_value: 500,
        additiveStep: 10,
        additiveIncrement: 500,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "discover",
        target: "energy",
        base_value: -ENERGY_COST_TO_DISCOVER,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_DISCOVER,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  },
  {
    id: 0,
    name: "Trésor légendaire",
    actionType: DinosaurAction.Discover,
    minLevel: 8,
    positivityScore: 10,
    weight: 5,
    descriptions: [
      "Le dinosaure découvre un coffre oublié, débordant d'or et d'objets mystérieux, digne des plus grandes légendes jurassiques.",
      "Une trouvaille épique qui ferait pâlir d'envie n'importe quel pirate, un jackpot sorti tout droit d'une aventure mythique.",
      "Dans une caverne secrète, il met la main sur un trésor si colossal qu'il semble défier l'imagination.",
      "Un coffre légendaire se dévoile, mêlant richesses étincelantes et objets insolites, dans un style résolument déjanté.",
      "Le dinosaure déterre un trésor épique, un véritable coup de maître qui réécrit les annales du larcin."
    ],
    baseModifiers: [
      {
        source: "discover",
        target: "money",
        base_value: 1000,
        additiveStep: 10,
        additiveIncrement: 2000,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "discover",
        target: "energy",
        base_value: -ENERGY_COST_TO_DISCOVER,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_DISCOVER,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  },
  {
    id: 0,
    name: "Inspiration soudaine",
    actionType: DinosaurAction.Discover,
    minLevel: 5,
    positivityScore: 8,
    weight: 10,
    descriptions: [
      "En explorant une zone oubliée, le dinosaure reçoit un éclair de génie décalé qui booste ses compétences de façon inattendue.",
      "Une trouvaille farfelue lui confère un bonus de compétences, comme si l'univers lui faisait un clin d'œil humoristique.",
      "Il découvre un ancien parchemin révélant des techniques de combat improbables, qui lui valent un bonus de points de compétence.",
      "Un moment de pure inspiration, aussi surprenant qu'inexplicable, lui offre une nouvelle compétence secrète.",
      "Au détour d'une exploration loufoque, le dinosaure gagne un point de compétence, fruit d'une révélation aussi étrange qu'amusante."
    ],
    baseModifiers: [
      {
        source: "discover",
        target: "skillPoints",
        base_value: 0,
        additiveStep: 5,
        additiveIncrement: 10,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "discover",
        target: "energy",
        base_value: -ENERGY_COST_TO_DISCOVER,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_DISCOVER,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  }
];
