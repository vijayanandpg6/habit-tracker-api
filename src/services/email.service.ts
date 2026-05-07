import { sendMail } from '../lib/mailer';

export const emailService = {
  sendVerificationEmail: async (to: string, token: string): Promise<void> => {
    const deepLink = `tasks://verify-email?token=${token}&email=${encodeURIComponent(to)}`;

    await sendMail({
      to,
      subject: 'Verify your email – Tasks App',
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#ffffff;">
          <div style="text-align:center;margin-bottom:32px;">
            <div style="display:inline-block;width:48px;height:48px;background:linear-gradient(135deg,#1D4ED8,#2563EB);border-radius:12px;line-height:48px;font-size:28px;font-weight:700;color:#fff;">t</div>
            <p style="margin:8px 0 0;font-size:13px;color:#6B7280;letter-spacing:1px;text-transform:uppercase;">Tasks App</p>
          </div>
          <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Verify your email</h2>
          <p style="margin:0 0 24px;font-size:15px;color:#6B7280;line-height:1.6;">
            Tap the button below to verify <strong style="color:#111827;">${to}</strong> and activate your account. This link expires in 24 hours.
          </p>
          <a href="${deepLink}" style="display:block;text-align:center;padding:14px 24px;background:#2563EB;color:#ffffff;text-decoration:none;border-radius:10px;font-size:16px;font-weight:600;">
            Verify Email
          </a>
          <p style="margin:24px 0 0;font-size:13px;color:#9CA3AF;text-align:center;">
            If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
      `,
    });
  },
};
