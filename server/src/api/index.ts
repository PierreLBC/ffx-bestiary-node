import express, { Request, Response } from 'express';
import bestiaryRoutes from './routes-bestiary';

const router = express.Router();

router.use('/bestiary', bestiaryRoutes);

export default router;
