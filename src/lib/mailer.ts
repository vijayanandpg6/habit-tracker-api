import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../config/env';
import { logger } from './logger';

let transporter: Transporter | null = null;

export const getMailer = (): Transporter => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  return transporter;
};

export const sendMail = async (options: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> => {
  const mailer = getMailer();
  await mailer.sendMail({
    from: env.SMTP_FROM,
    ...options,
  });
  logger.debug('Email sent', { to: options.to, subject: options.subject });
};
