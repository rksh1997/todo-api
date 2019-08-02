import nodemailer from 'nodemailer';

import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } from '../config';

async function createTransport() {
  let testUser = {};
  if (!SMTP_USER) {
    testUser = await nodemailer.createTestAccount();
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    requireTLS: true,
    auth: {
      user: SMTP_USER || testUser.user,
      pass: SMTP_PASS || testUser.pass,
    },
  });

  return transporter;
}

export async function sendEmail(mail) {
  const mailer = await createTransport();
  return mailer.sendMail(mail);
}
