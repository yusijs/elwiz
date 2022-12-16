import * as express from 'express';
import { ElwizConfig } from '@elwiz/common';
import { join } from 'path';
import * as yaml from 'yamljs';

const app = express();

app.get('/config', (req, res) => {
  const config: ElwizConfig = yaml.load(join(__dirname, 'assets/config.yaml'));
  res.json(config);
});

app.listen(8081, () => console.log('Listening on 8081'));
