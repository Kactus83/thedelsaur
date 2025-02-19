import { DinosaurAction } from "../../models/dinosaur-action.enum";
import { DynamicEventData } from "../../models/dynamic-event-data.interface";

export const resurrectEvents: DynamicEventData[] = [
  {
    id: 0,
    name: 'Retour à la vie',
    actionType: DinosaurAction.Resurrect,
    minLevel: 0,
    positivityScore: 0,
    weight: 1,
    descriptions: [
      "Le dinosaure renaît miraculeusement, prêt à reprendre l'aventure.",
      "Un retour à la vie spectaculaire, ses forces se réinitialisent comme par magie.",
      "Le miracle de la résurrection opère, et le dinosaure repart avec un nouvel élan.",
      "Un réveil étonnant : le dinosaure est ressuscité avec toutes ses ressources retrouvées.",
      "La vie reprend son cours : le dinosaure revient à zéro pour mieux repartir.",
      "Tel un phénix, il renaît de ses cendres, flamboyant et invincible.",
      "La mort n'a pu le retenir : il revient pour semer le chaos avec style.",
      "Un coup de pouce divin lui offre une seconde chance inespérée.",
      "Il défie les lois de la mort et revient avec un clin d’œil malicieux.",
      "Un souffle cosmique réanime le dinosaure, le rajeunissant à vue d'œil.",
      "Un miracle opère dans la jungle : le dinosaure reprend vie, plus audacieux que jamais.",
      "Il revient parmi nous, défiant l'inévitable avec une pointe d'arrogance.",
      "La mort a perdu son emprise, et notre dinosaure refait surface en héros.",
      "Un réveil inattendu, plein de panache et de fierté sauvage.",
      "Il renaît, tel un champion, prêt à écrire une nouvelle légende.",
      "Un retournement épique : le dinosaure reprend vie avec éclat.",
      "Un moment magique où l'inattendu se transforme en triomphe.",
      "Il sort des limbes en riant, prêt à faire vibrer la jungle de nouveau.",
      "Une seconde chance offerte par le destin, et il la saisit avec audace.",
      "Le dinosaure refait surface, prêt à défier l'univers et ses lois.",
      "Un retour triomphal, où chaque cellule célèbre sa renaissance.",
      "De l'autre côté de la mort, il se réveille avec un sourire narquois.",
      "Le destin lui offre une revanche : il est de retour, plus fort et plus fougueux.",
      "Un réveil spectaculaire qui laisse la mort bouche bée.",
      "Il renaît dans un éclat de rire, prêt à semer la pagaille en beauté.",
      "La magie opère, et il revient comme si de rien n'était, mais avec du style.",
      "Un retour inattendu qui redéfinit les règles du jeu.",
      "Il se relève, invincible et imperturbable, pour une nouvelle ère de chaos joyeux.",
      "Le miracle de la résurrection transforme sa fatalité en une fête sauvage.",
      "La vie lui sourit une seconde fois, et il est de retour pour réécrire les légendes."
    ],
    baseModifiers: []
  }
];
