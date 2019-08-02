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
export const PASSWORD_RESET_SECRET =
  process.env.PASSWORD_RESET_SECRET || 'wnjif&^fwd$%';

export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// SMTP
export const SMTP_HOST = process.env.SMTP_HOST || 'smtp.ethereal.email';
export const SMTP_PORT = process.env.SMTP_PORT || 587;
export const { SMTP_USER } = process.env;
export const { SMTP_PASS } = process.env;
export const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@todoapp.com';

// Database
export const DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/todoapp';
