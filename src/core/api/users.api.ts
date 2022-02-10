import UserModel, { User } from '@models/user.model';
import env from '@configs/env.config';
import jwt from 'jsonwebtoken';

import { getOption } from '@lib/options';
import settingsEnum from '@enums/settings.enum';
import emailSender from '@services/email.sender.service';
import EmailTemplates from '@enums/email_templates.enum';

export class UserApi {
  static async getUserByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email });
  }

  static async getUserById(id: string): Promise<User | null> {
    return await UserModel.findById(id);
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    return await UserModel.findOne({ username });
  }

  // send Password Reset Link
  static async sendPasswordResetLink(email: string): Promise<boolean> {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return false;
    }
    const token = jwt.sign(
      {
        id: user._id,
        action: 'resetPassword',
      },
      env.JWT_SECRET,
      { expiresIn: '24h' },
    );
    const resetLink = `${getOption(
      settingsEnum.URL_PREFIX,
    )}/reset-password/${token}`;

    await emailSender.sendEmail(user, EmailTemplates.RESET_PASSWORD, {
      resetLink,
    });
    return true;
  }

  // generate password reset token
}

Object.freeze(UserApi);
export default UserApi;
