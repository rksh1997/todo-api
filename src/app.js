import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import { NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status';

import winston from './lib/winston';
import v1Routes from './routes/v1';
import { NODE_ENV } from './config';
import { NotFoundError, InternalServerError } from './lib/errors';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (NODE_ENV === 'development') {
  app.use(logger('dev'));
}

app.use('/api/v1', v1Routes);

app.use((_, res) => {
  res.status(NOT_FOUND).json(NotFoundError);
});

// eslint-disable-next-line
app.use((err, _, res, __) => {
  if (NODE_ENV === 'development') {
    winston.error(err);
  }
  res.status(INTERNAL_SERVER_ERROR).json(InternalServerError);
});

export default app;
