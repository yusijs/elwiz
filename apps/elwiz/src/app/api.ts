import * as express from 'express';
import { Request } from 'express';
import { ElwizConfig } from '@elwiz/common';
import { join } from 'path';
import { state } from './state';
import * as yaml from 'yamljs';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { Op } from 'sequelize';


const app = express();

const api = express.Router();

api.get('/config', (req, res) => {
  const config: ElwizConfig = yaml.load(join(__dirname, 'assets/config.yaml'));
  res.json(config);
});

api.get('/month', async (req, res) => {
  const conn = state.db.List3Data;
  const data = await conn.findAll();
  res.status(200);
  res.json(data);
  res.end();
});

api.get('/price', async (req: Request<{}, {}, {}, { start: string; end: string }>, res) => {
  const conn = state.db.Price;
  const { start: startString, end: endString } = req.query;
  const start = startOfDay(startString ? parseISO(startString) : new Date());
  const end = endOfDay(endString ? parseISO(endString) : new Date());
  const prices = conn.findAll({ where: { time_start: { [ Op.gte ]: start }, time_end: { [ Op.lte ]: end } } });
  res.json(prices);
});

app.use('/api', api);

app.use(express.static(join(__dirname, '..', 'elwiz-app')));

export { app };
