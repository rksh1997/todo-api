import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import { OK, NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status';

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

app.get('/api/v1/health', (req, res) => {
  res.status(OK).json({
    status: OK,
    response: { messages: ['App is healthy'] },
  });
});

app.use('/api/v1', v1Routes);

// eslint-disable-next-line
app.use((req, res, next) => {
  res.status(NOT_FOUND).json(NotFoundError);
});

// eslint-disable-next-line
app.use((err, req, res, next) => {
  if (NODE_ENV === 'development') {
    winston.error(err);
  }
  res.status(INTERNAL_SERVER_ERROR).json(InternalServerError);
});

export default app;
