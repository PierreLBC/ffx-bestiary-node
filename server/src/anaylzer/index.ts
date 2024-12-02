import fs from 'fs';
import { buildBestiaryTree, getMonsterContent } from './bestiary';
import Bestiary from '../classes/bestiary';

const fileName = 'bestiary_data.json';

console.log('\n\n');
console.log('------- Start analysis -------');
console.log('\n\n');
buildBestiary(true);

export async function buildBestiary(fromZero: boolean): Promise<Bestiary> {
  const bestiarySpec = !fromZero && fs.existsSync(fileName) ? JSON.parse(fs.readFileSync(fileName, 'utf8')) : [];
  const bestiaryCls = new Bestiary(bestiarySpec);
  const bestiaryTree = await buildBestiaryTree();

  // bestiary.add(await getMonsterContent('Abeille tueuse/Final Fantasy X', 'monstres'));
  // console.log(await getMonsterContent('Abeille tueuse/Final Fantasy X', 'monstres'));
  // console.log(await getMonsterContent('Xylomid', 'monstres'));
  // console.log(await getMonsterContent('Bicorne', 'monstres'));
  // console.log(await getMonsterContent('Vouivre', 'monstres'));
  // console.log(await getMonsterContent('Geosgaeno', 'monstres'));
  console.log(await getMonsterContent('Piranha', 'monstres'));

  // for (const category in bestiaryTree) {
  //   for (const monster of bestiaryTree[category]) {
  //     if (bestiaryCls.names.includes(monster)) {
  //       continue;
  //     }

  //     const m = await getMonsterContent(monster, category);
  //     console.log('monster ->', monster, m.toApi());
  //     bestiaryCls.add(m);
  //   }
  // }

  // fs.writeFileSync(fileName, JSON.stringify(bestiaryCls.export(), null, 2));
  return bestiaryCls;
}

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
