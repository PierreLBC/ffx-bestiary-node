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
    if (!row || row.startsWith('{{') || row.startsWith('}}')) {
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
  const monsterText = await getMonsterFromContent(monsterTitle);

  const mSpec: Partial<Monster> & Record<string, string | number | string[]> = { category };
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
        value = value.replaceAll('[[', '').replaceAll(']]', '').replaceAll('<br/> ', '');
        if (STATS_KEYS[key]) {
          mSpec.stats[key] = parseInt(value.replaceAll(' ', ''), 10);
        } else if (RESISTANCES_WEAKNESSES[key]) {
          mSpec.waeknesses[key] = value;
        } else if (
          ['resistant_a', 'immunise_contre', 'competences_de_protections', 'competences_d_armes'].includes(key)
        ) {
          mSpec[key] = value.split('/').map((s) => s.trim());
        } else {
          mSpec[key] = value.trim();
        }
      }
    }
  }

  console.log('mSpec ->', mSpec);
  mSpec.image = await getMonsterImage(monsterTitle);
  return new Monster(mSpec);
}

class Monster {
  nom: string;
  nomen: string;
  nomjap: string;
  romaji: string;
  category: string;
  image?: string;
  stats?: Record<string, string | number>;
  waeknesses?: Record<string, string>;
  vol_courant: string;
  vol_rare: string;
  objets_courant_obtenus: string;
  objets_rare_obtenus: string;
  competences_d_armes: string;
  competences_de_protections: string;
  corruption: string;
  attaques: string;
  overdrive_kimahri_: string;
  resistant_a: string;
  immunise_contre: string;

  constructor(spec: Partial<Monster>) {
    this.nom = spec.nom ?? '';
    this.nomen = spec.nomen ?? '';
    this.nomjap = spec.nomjap ?? '';
    this.romaji = spec.romaji ?? '';
    this.category = spec.category ?? '';
    this.image = spec.image;
    this.stats = spec.stats ?? {};
    this.waeknesses = spec.waeknesses ?? {};

    this.vol_courant = spec.vol_courant ?? '';
    this.vol_rare = spec.vol_rare ?? '';
    this.objets_courant_obtenus = spec.objets_courant_obtenus ?? '';
    this.objets_rare_obtenus = spec.objets_rare_obtenus ?? '';
    this.competences_d_armes = spec.competences_d_armes ?? '';
    this.competences_de_protections = spec.competences_de_protections ?? '';
    this.corruption = spec.corruption ?? '';
    this.attaques = spec.attaques ?? '';
    this.overdrive_kimahri_ = spec.overdrive_kimahri_ ?? '';
    this.resistant_a = spec.resistant_a ?? '';
    this.immunise_contre = spec.immunise_contre ?? '';
  }

  toString() {
    return `${this.nom} (${this.category})`;
  }

  export() {
    // Export in JSON
    return JSON.parse(JSON.stringify(this));
  }
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
