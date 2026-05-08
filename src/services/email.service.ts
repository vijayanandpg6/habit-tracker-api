import { sendMail } from '../lib/mailer';

export const emailService = {
  sendVerificationEmail: async (to: string, token: string): Promise<void> => {
    await sendMail({
      to,
      subject: 'Your verification code - Tasks App',
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#ffffff;">
          <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Verify your email</h2>
          <p style="margin:0 0 24px;font-size:15px;color:#6B7280;line-height:1.6;">
            Copy the verification token below and paste it into the app to activate your account. It expires in 24 hours.
          </p>
          <div style="background:#F3F4F6;border-radius:8px;padding:16px;font-family:monospace;font-size:14px;color:#111827;word-break:break-all;letter-spacing:0.5px;">
            ${token}
          </div>
          <p style="margin:24px 0 0;font-size:13px;color:#9CA3AF;">
            If you did not create an account, ignore this email.
          </p>
        </div>
      `,
    });
  },
};
