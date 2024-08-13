import Monster, { Item } from '../classes/monster';
import { getBestiaryFromFandom, getMonsterFromContent, getMonsterImage } from './api';

type MonsterTitlesByCategory = {
  [category: string]: string[];
};

const STATS_KEYS: Record<string, string> = {
  hp: 'hp',
  hp_overkill: 'hp_overkill',
  mp: 'mp',
  force: 'strength',
  magie: 'magic',
  constitution: 'defense',
  esprit: 'magic_defense',
  rapidite: 'agility',
  precision: 'accuracy',
  esquive: 'evasion',
  chance: 'luck',
  pc_obtenu: 'ap',
  pc_overkill: 'ap_overkill',
  gils: 'gils',
};

const RESISTANCES_WEAKNESSES: Record<string, string> = {
  feu: 'fire',
  foudre: 'lightning',
  eau: 'water',
  glace: 'ice',
  sacre: 'holy',
};

const OBJECTS_KEYS: Record<string, string> = {
  vol_courant: 'common_steal',
  vol_rare: 'rare_steal',
  objets_courant_obtenus: 'common_drop',
  objets_rare_obtenus: 'rare_drop',
  corruption: 'corruption',
};

const MONSTERS = {};

export async function buildBestiaryTree(): Promise<MonsterTitlesByCategory> {
  if (Object.keys(MONSTERS).length) {
    return MONSTERS;
  }

  const bestiary = (await getBestiaryFromFandom()).split('\n');
  const firstIndex = bestiary.findIndex((line) => line.startsWith('=='));
  const rows = bestiary.slice(firstIndex);

  const tree: MonsterTitlesByCategory = { monstres: [] };
  let currentCategory = '';

  for (const row of rows) {
    if (
      !row ||
      row.startsWith('{{') ||
      row.startsWith('}}') ||
      row.startsWith('[[Catégorie:') ||
      row.startsWith('[[en:')
    ) {
      continue;
    }

    if (row.startsWith('==')) {
      currentCategory = normalizeText(row.replace(/=/g, ''));
      if (currentCategory.length > 1) {
        tree[currentCategory] = [];
      }
    } else {
      const matches = row.match(/\[\[([^\]]+)\]\]/) || [null, ''];
      const foundId = matches[1].split('|', 1)[0];
      if (currentCategory.length === 1) {
        tree.monstres.push(foundId);
      } else {
        tree[currentCategory].push(foundId);
      }
    }
  }

  return tree;
}

export async function getMonsterContent(monsterTitle: string, category: string): Promise<Monster> {
  const { text: monsterText, title } = await getMonsterFromContent(monsterTitle);
  // console.log('monsterText ->', monsterText);

  const mSpec: Partial<Monster> & Record<string, string | number | string[] | Item[]> = {
    fandomTitle: title,
    category,
    source: monsterText,
  };
  let mode = '';
  mSpec.stats = {};
  mSpec.waeknesses = {};

  for (const line of monsterText.split('\n')) {
    if (line.startsWith('{{Ennemi FFX')) {
      mode = 'attributes';
    } else if (line.startsWith('}}')) {
      mode = '';
    } else if (line.startsWith('== Ennem')) {
      mode = normalizeText(line.replace(/=/g, ''));
    }

    if (mode === 'attributes') {
      let [key, value] = line.replace('| ', '').split('=');
      if (key && value) {
        key = normalizeText(key);
        value = value.replaceAll('[[', '').replaceAll(']]', '').replaceAll(' <br/>', '').trim();

        console.log('key, value ->', key, value);

        if (STATS_KEYS[key]) {
          mSpec.stats[key] = parseInt(value.replaceAll(' ', ''), 10);
        } else if (RESISTANCES_WEAKNESSES[key]) {
          mSpec.waeknesses[key] = value;
        } else if (
          ['resistant_a', 'immunise_contre', 'competences_de_protections', 'competences_d_armes'].includes(key)
        ) {
          mSpec[key] = value === 'Rien' || value === '-' ? undefined : value.split('/').map((s) => s.trim());
        } else if (key == 'localisation') {
          const delimiters = /\||<br\s?\/?>|\//g;
          mSpec[key] = Array.from(
            new Set(
              value
                .split(delimiters)
                .map((s) => s.trim())
                .filter((s) => s !== 'Final Fantasy X')
            )
          );
        } else if (OBJECTS_KEYS[key]) {
          mSpec[key] = parseItem(value);
        } else {
          mSpec[key] = value.trim().replaceAll(/<br\s?\/>/g, '');
        }
      }
    }
  }

  mSpec.image = await getMonsterImage(monsterTitle);
  return new Monster(mSpec);
}

function parseItem(text: string): Item[] {
  const cleanedText = text.replace(/<br\s*\/?>/gi, ' ');

  const regex = /(.+?)\sx(\d+)(?:\s*\((\d+)\s*gils\))?(?:\s+|$)/g;
  const matches = Array.from(cleanedText.matchAll(regex));

  return matches.map((match) => {
    const item: Item = {
      name: match[1].trim(),
      quantity: parseInt(match[2], 10),
    };

    if (match[3]) {
      item.cost = parseInt(match[3], 10);
    }

    return item;
  });
}

function normalizeText(str: string): string {
  return str
    .trim()
    .replace(/\s/g, '_')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_');
}
