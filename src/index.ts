import { buildBestiaryTree, getMonsterContent } from './bestiary';

type MonsterByCategory = {
  [category: string]: string[];
};

(async () => {
  const bestiaryTree = await buildBestiaryTree();
  // console.log(bestiaryTree.monstres[0]);
  console.log(await getMonsterContent(bestiaryTree.monstres[1], 'monstres'));
})();

console.log('\n\n');
console.log('------- Start analysis -------');
console.log('\n\n');

// nom;
// nomen;
// nomjap;
// romaji;
// image;
// hp;
// hp_overkill;
// mp;
// force;
// magie;
// constitution;
// esprit;
// rapidite;
// precision;
// esquive;
// chance;
// pc_obtenu;
// pc_overkill;
// gils;

// feu;
// foudre;
// eau;
// glace;
// sacre;

// localisation;

// vol_courant;
// vol_rare;
// objets_courant_obtenus;
// objets_rare_obtenus;
// competences_d_armes;
// competences_de_protections;
// corruption;
// attaques;
// overdrive_kimahri_;
// resistant_a;
// immunise_contre;
