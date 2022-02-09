import nodemailer from 'nodemailer';

import settingsEnum from '@enums/settings.enum';
import { getOption } from '@lib/options';
import User from '@models/user.model';

export class EmailDriver {
  constructor(config) {
    this.config = config;
  }

  async init() {
    // check email config
    this.transporter = nodemailer.createTransport(this.config);
  }

  async testConnection() {
    // check email connection
    const testEmail = {
      from: this.config.from,
      to: getOption(settingsEnum.ADMIN_EMAIL),
      subject: 'Test email',
      text: 'This is a test email',
    };
    const info = await this.transporter.sendMail(testEmail);
    return info;
  }

  async sendEmail(userId) {
    // send email to user
    const user = await User.findById(userId);
    const email = {
      from: this.config.from,
      to: user.email,
      subject: 'Welcome to the app',
      text: 'Your account has been successfully created',
    };
    const info = await this.transporter.sendMail(email);
    return info;
  }
}
