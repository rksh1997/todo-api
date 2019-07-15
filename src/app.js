import express from 'express';
import logger from 'morgan';

import { NODE_ENV } from './config';

const app = express();

if (NODE_ENV === 'development') {
  app.use(logger('dev'));
}

export default app;
