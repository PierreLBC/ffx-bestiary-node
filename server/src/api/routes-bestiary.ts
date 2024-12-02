import express, { Request, Response } from 'express';
import bestiaryData from '../anaylzer/bestiary_data.json';
import Monster from '../classes/monster';
import Bestiary from '../classes/bestiary';
import logger from '../utils/logger';

logger.debug(`Bestiary count -> ${bestiaryData.length}`);

const bestiary = new Bestiary(bestiaryData as Partial<Monster>[]);

const router = express.Router();

router.get('/', list);
router.get('/list', list);

router.get('/by-location', (req: Request, res: Response) => {
  const result = {};

  for (const monster of bestiary.monsters) {
    const location = Array.isArray(monster.localisation) ? monster.localisation.join('/') : monster.localisation;
    if (!result[location]) {
      result[location] = [];
    }

    result[location].push(monster.nom);
  }

  res.status(200).send(result);
});

router.get('/locations', (req: Request, res: Response) => {
  const result = new Set();

  for (const monster of bestiary.monsters) {
    result.add(monster.location);
  }

  res.status(200).send(Array.from(result));
});

router.post('/filter', (req: Request, res: Response) => {
  const filterBody = req.body;
  logger.debug(`Filtering bestiary with '${JSON.stringify(filterBody)}'`);
  const result = bestiary.filter(filterBody);

  res.status(200).send(result.map((monster: any) => monster.nom));
});

router.get('/:name', (req: Request, res: Response) => {
  logger.debug(`Getting monster ${req.params.name}`);
  const name = req.params.name;
  const monster = bestiary.findByName(name);

  if (!monster) {
    res.status(404).send(`Monster ${name} not found`);
    return;
  }

  res.status(200).send(monster.toApi());
});

export default router;

async function list(req: Request, res: Response) {
  const list = bestiary.monsters.map((monster: any) => monster.nom);
  res.status(200).send(list);
}
