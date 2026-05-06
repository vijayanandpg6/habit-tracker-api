import { sendMail } from '../lib/mailer';
import { env } from '../config/env';

export const emailService = {
  sendVerificationEmail: async (to: string, token: string): Promise<void> => {
    const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${token}`;

    await sendMail({
      to,
      subject: 'Verify your email address',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Verify your email</h2>
          <p>Click the button below to verify your email address. This link expires in 24 hours.</p>
          <a href="${verificationUrl}" style="display:inline-block;padding:12px 24px;background:#4F46E5;color:#fff;text-decoration:none;border-radius:6px;">
            Verify Email
          </a>
          <p style="margin-top:24px;color:#6B7280;font-size:14px;">
            If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
      `,
    });
  },
};
