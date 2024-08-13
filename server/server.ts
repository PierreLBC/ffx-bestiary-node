import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import apiRoutes from './src/api';

import { createLogger } from './src/utils/logger';
import { enableCorsMiddleware } from './src/utils/cors';
const logger = createLogger();

const app = express();
const port = 3000;

app.all('*', enableCorsMiddleware);

app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/api', apiRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
