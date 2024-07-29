import { buildBestiaryTree } from './bestiary';

type MonsterByCategory = {
  [category: string]: string[];
};

(async () => {
  const bestiaryTree = await buildBestiaryTree();
  console.log(bestiaryTree);
})();
