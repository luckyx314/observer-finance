import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { SendMailOptions } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter?: nodemailer.Transporter;

  constructor() {
    if (process.env.SMTP_HOST) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              }
            : undefined,
      });
    }
  }

  private async dispatch(options: SendMailOptions) {
    if (!this.transporter) {
      this.logger.warn(
        `SMTP not configured. Email to ${options.to} (${options.subject}) logged instead of sent.`,
      );
      this.logger.debug(options.text ?? options.html ?? '');
      return;
    }
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM || 'no-reply@observerfinance.local',
      ...options,
    });
  }

  async sendEmailVerification(email: string, code: string) {
    const appUrl = process.env.APP_URL || 'http://localhost:5174';
    const verificationLink = `${appUrl}/verify-email?email=${encodeURIComponent(email)}&code=${code}`;
    const subject = 'Verify your Observer Finance account';
    const text = `Use the verification code ${code} to activate your account. You can also click the link below:\n${verificationLink}`;
    const html = `
      <p>Thanks for signing up for Observer Finance.</p>
      <p><strong>Your verification code: ${code}</strong></p>
      <p>You can also verify your email by clicking the link below:</p>
      <p><a href="${verificationLink}">${verificationLink}</a></p>
      <p>If you did not create an account, please ignore this email.</p>
    `;

    await this.dispatch({
      to: email,
      subject,
      text,
      html,
    });
  }

  async sendPasswordReset(email: string, token: string) {
    const appUrl = process.env.APP_URL || 'http://localhost:5174';
    const resetLink = `${appUrl}/reset-password?token=${token}`;
    const subject = 'Reset your Observer Finance password';
    const text = `We received a request to reset your password. Click the link below to proceed (valid for 30 minutes):\n${resetLink}`;
    const html = `
      <p>We received a request to reset your Observer Finance password.</p>
      <p>This link expires in 30 minutes.</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `;

    await this.dispatch({
      to: email,
      subject,
      text,
      html,
    });
  }
}
