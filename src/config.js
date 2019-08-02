import path from 'path';
import { config as dotenv } from 'dotenv';

export const NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV === 'development') {
  dotenv();
} else {
  dotenv({ path: path.join(__dirname, '..', '.env.test') });
}

// Application
export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET || 'dkfm$2%3423#2cdc';
export const SENTRY_DSN = process.env.SENTRY_DSN || '';
export const VERIFICATION_SECRET =
  process.env.VERIFICATION_SECRET || '%$3cdeZS';

// Database
export const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/todoapp';
