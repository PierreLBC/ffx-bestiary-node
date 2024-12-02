import Monster from './monster';

export default class Bestiary {
  monsters: Monster[];

  constructor(monsters: Partial<Monster>[] = []) {
    this.monsters = monsters.map((monster) => (monster instanceof Monster ? monster : new Monster(monster)));
  }

  add(monster: Monster): void {
    if (this.names.includes(monster.fandomTitle)) {
      console.log(`Monster ${monster.fandomTitle} already exists in the list`);
      return;
    }

    this.monsters.push(monster);
  }

  findByName(name: string) {
    console.log(
      'this.monsters :>> ',
      // this.monsters.map((monster) => monster.nom)
      this.monsters[0]
    );
    return this.monsters.find((monster) => monster.nom === name);
  }

  filter(filterBody: Record<string, string>): Monster[] {
    return this.monsters.filter((monster: any) => {
      for (const key in filterBody) {
        const requestedValue = filterBody[key];
        const value = monster[key];

        if (Array.isArray(value)) {
          if (value.indexOf(requestedValue) === -1) {
            for (const v of value) {
              if (v.indexOf(requestedValue) !== -1) {
                return true;
              }
            }

            return false;
          }
        } else if (value !== requestedValue) {
          return false;
        }
      }

      return true;
    });
  }

  export() {
    return this.monsters.map((monster) => monster.export());
  }

  get names() {
    return this.monsters.map((monster) => monster.fandomTitle);
  }
}
