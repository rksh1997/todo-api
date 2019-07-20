import '@babel/polyfill';

import connectDB from './db';
import app from './app';
import winston from './lib/winston';
import { PORT } from './config';

async function main() {
  await connectDB();
  winston.info('Connected to database');
  await app.listen(PORT);
  winston.info(`API is live on: http://localhost:${PORT}`);
}

main();
