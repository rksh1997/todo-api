import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import { OK, NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as Sentry from '@sentry/node';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import winston from './lib/winston';
import v1Routes from './routes/v1';
import { NODE_ENV, SENTRY_DSN, ENABLE_CORS, CORS_WHITELIST } from './config';
import { NotFoundError, InternalServerError } from './lib/errors';

const app = express();
Sentry.init({ dsn: SENTRY_DSN });
app.use(Sentry.Handlers.requestHandler());

if (ENABLE_CORS) {
  app.use(
    cors({
      credentials: true,
      origin: (origin, callback) => {
        if (CORS_WHITELIST.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    }),
  );
} else {
  app.use(
    cors({
      credentials: true,
      origin: (_, cb) => cb(null, true),
    }),
  );
}

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
  }),
);

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.get('/api/v1/debug-sentry', () => {
    throw new Error('sentry is working');
  });
}

/**
 * @api {get} /health Health check
 * @apiName HealthCheck
 * @apiGroup Application
 * @apiVersion 1.0.0
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "status": 200,
 *    "response": {
 *      "messages": ["App is healthy"]
 *    }
 *  }
 */
app.get('/api/v1/health', (req, res) => {
  res.status(OK).json({
    status: OK,
    response: { messages: ['App is healthy'] },
  });
});

app.use('/api/v1', v1Routes);

app.use(Sentry.Handlers.errorHandler());

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
