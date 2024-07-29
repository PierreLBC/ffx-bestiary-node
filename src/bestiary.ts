import { getBestiaryFromFandom } from './api';

type Monster = {
  name: string;
  category: string; // Monster, or Boss, Optional Boss
  url?: string;
  image?: string;
  description?: string;
  stats?: {
    [key: string]: string;
  };
  categories?: string[];
};

type MonsterByCategory = {
  [category: string]: Monster[];
};

const MONSTERS = {};

export async function buildBestiaryTree(): Promise<MonsterByCategory> {
  if (Object.keys(MONSTERS).length) {
    return MONSTERS;
  }

  const bestiary = (await getBestiaryFromFandom()).split('\n');
  const firstIndex = bestiary.findIndex((line) => line.startsWith('=='));
  const rows = bestiary.slice(firstIndex);

  const tree: MonsterByCategory = {};
  let currentCategory = '';

  for (const row of rows) {
    if (!row) {
      continue;
    } else if (row.startsWith('==')) {
      currentCategory = row.replace(/=/g, '').trim();
      tree[currentCategory] = [];
    } else {
      tree[currentCategory].push(parseMonsterFromName(row, currentCategory));
    }
  }

  return tree;
}

function parseMonsterFromName(str: string, currentCategory: string): Monster {
  const name = str.replace(/\*?\[\[/, '').replace(/\]\]/, '');
  return { name, category: currentCategory };
}
