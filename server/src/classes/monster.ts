export type Item = {
  name: string;
  quantity: number;
  cost?: number;
};

export default class Monster {
  nom: string;
  nomen: string;
  nomjap: string;
  romaji: string;
  category: string;
  localisation: string | string[];
  image?: string;
  stats?: Record<string, string | number>;
  waeknesses?: Record<string, string>;
  vol_courant: Item[];
  vol_rare: Item[];
  objets_courant_obtenus: Item[];
  objets_rare_obtenus: Item[];
  competences_d_armes: string;
  competences_de_protections: string;
  corruption: Item[];
  attaques: string;
  overdrive_kimahri_: string;
  resistant_a: string;
  immunise_contre: string;
  fandomTitle: string;
  source: string;

  constructor(spec: Partial<Monster>) {
    this.nom = spec.nom ?? '';
    this.nomen = spec.nomen ?? '';
    this.nomjap = spec.nomjap ?? '';
    this.romaji = spec.romaji ?? '';
    this.category = spec.category ?? '';
    this.localisation = spec.localisation ?? '';
    this.fandomTitle = spec.fandomTitle ?? '';
    this.image = spec.image;
    this.stats = spec.stats ?? {};
    this.waeknesses = spec.waeknesses ?? {};

    this.vol_courant = spec.vol_courant ?? [];
    this.vol_rare = spec.vol_rare ?? [];
    this.objets_courant_obtenus = spec.objets_courant_obtenus ?? [];
    this.objets_rare_obtenus = spec.objets_rare_obtenus ?? [];
    this.competences_d_armes = spec.competences_d_armes ?? '';
    this.competences_de_protections = spec.competences_de_protections ?? '';
    this.corruption = spec.corruption ?? [];
    this.attaques = spec.attaques ?? '';
    this.overdrive_kimahri_ = spec.overdrive_kimahri_ ?? '';
    this.resistant_a = spec.resistant_a ?? '';
    this.immunise_contre = spec.immunise_contre ?? '';
    this.source = spec.source ?? '';
  }

  get location(): string {
    return Array.isArray(this.localisation) ? this.localisation.join('/') : this.localisation;
  }

  toApi() {
    return {
      nom: this.nom,
      nomen: this.nomen,
      nomjap: this.nomjap,
      romaji: this.romaji,
      category: this.category,
      localisation: this.localisation,
      image: this.image,
      stats: this.stats,
      waeknesses: this.waeknesses,
      vol_courant: this.vol_courant,
      vol_rare: this.vol_rare,
      objets_courant_obtenus: this.objets_courant_obtenus,
      objets_rare_obtenus: this.objets_rare_obtenus,
      competences_d_armes: this.competences_d_armes,
      competences_de_protections: this.competences_de_protections,
      corruption: this.corruption,
      attaques: this.attaques,
      overdrive_kimahri_: this.overdrive_kimahri_,
      resistant_a: this.resistant_a,
      immunise_contre: this.immunise_contre,
      fandomTitle: this.fandomTitle,
    };
  }

  toString() {
    return `${this.nom} (${this.category})`;
  }

  export() {
    // Export in JSON
    return structuredClone(this);
  }
}
