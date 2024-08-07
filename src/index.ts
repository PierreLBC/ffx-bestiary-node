import fs from 'fs';
import { buildBestiaryTree, getMonsterContent, Monsters } from './bestiary';

type MonsterByCategory = {
  [category: string]: string[];
};

(async () => {
  const monstersSpec = fs.existsSync('bestiary.json') ? JSON.parse(fs.readFileSync('bestiary.json', 'utf8')) : [];
  const monsters = new Monsters(monstersSpec);
  const bestiaryTree = await buildBestiaryTree();
  // monsters.add(await getMonsterContent('Abeille tueuse/Final Fantasy X', 'monstres'));

  try {
    for (const category in bestiaryTree) {
      for (const monster of bestiaryTree[category]) {
        if (monsters.names.includes(monster)) {
          continue;
        }

        console.log('monster ->', monster);
        monsters.add(await getMonsterContent(monster, category));
      }
    }
  } catch (e) {
    fs.writeFileSync('bestiary.json', JSON.stringify(monsters.export(), null, 2));
    throw e;
  }
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
