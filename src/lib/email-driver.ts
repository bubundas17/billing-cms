import nodemailer from 'nodemailer';

import settingsEnum from '@enums/settings.enum';
import { getOption } from '@lib/options';
import Mail from 'nodemailer/lib/mailer';
import env from '@configs/env.config';

export type EmailConfig = {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
};

export class EmailDriver {
  config: any;
  transporter: nodemailer.Transporter;

  async init(config: EmailConfig) {
    // check email config
    // log email config
    console.log('Email Driver Config:', config);
    this.transporter = nodemailer.createTransport(config);
  }

  async testConnection() {
    // check email connection
    const testEmail: Mail.Options = {
      from: this.config.from,
      to: (await getOption(settingsEnum.ADMIN_EMAIL)) as string,
      subject: 'Test email',
      text: 'This is a test email',
    };
    const info = await this.transporter.sendMail(testEmail);
    return info;
  }

  async sendEmail(to: string, subject: string, body: string) {
    // send email to user
    const email = {
      from: `${env.SMTP_FROM_NAME} <${env.SMTP_FROM_EMAIL}>`,
      to: to,
      subject: subject,
      text: body,
    };
    const info = await this.transporter.sendMail(email);
    return info;
  }
}

export default new EmailDriver();
