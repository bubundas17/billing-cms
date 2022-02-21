import jwt, { JwtPayload } from 'jsonwebtoken';
import { hash } from 'bcrypt';

import UserModel, { User } from '@models/user.model';
import env from '@configs/env.config';
import { getOption } from '@lib/options';
import settingsEnum from '@enums/settings.enum';
import emailSender from '@services/email-sender.service';
import EmailTemplates from '@enums/email_templates.enum';
import { DocumentType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import { FilterQuery } from 'mongoose';

class UserApi {
  static async getUserByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email });
  }

  static async getUserById(id: string) {
    return await UserModel.findById(id).lean();
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    return await UserModel.findOne({ username });
  }

  // Change password
  static async changePassword(user: User, password: string): Promise<boolean> {
    if (!user) {
      return false;
    }
    const newPassword = await hash(password, 10);
    await UserModel.findByIdAndUpdate(user._id, {
      $set: { password: newPassword },
    });
    return true;
  }

  // send Password Reset Link
  static async sendPasswordResetLink(user: User): Promise<boolean> {
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
    const resetLink = `${await getOption(
      settingsEnum.URL_PREFIX,
    )}/auth/reset-password/?token=${token}`;

    await emailSender.sendEmail(user, EmailTemplates.RESET_PASSWORD, {
      subject: 'Reset your password',
      info: { passwordResetLink: resetLink },
    });
    return true;
  }

  // read password reset token
  static async readPasswordResetToken(
    token: string,
  ): Promise<User | null | undefined> {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      if (decoded.action === 'resetPassword') {
        return await UserModel.findById(decoded.id).lean();
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Search users
  static async searchUsers(
    _query: Record<string, unknown>,
    page = 1,
    perPage = 50,
  ): Promise<{ totalPages: number; users: Array<User> }> {
    // const regex = new RegExp(query, 'i');
    const query: FilterQuery<DocumentType<User, BeAnObject>>[] = [];

    if (_query.name) query.push({ name: _query.name });
    if (_query.email) query.push({ email: _query.email });
    if (_query.company) query.push({ company: _query.company });
    if (_query.phone) query.push({ phone: _query.phone });
    const totalPages = await UserModel.find(
      query.length > 0 ? { $or: query } : {},
    ).count();
    const users = await UserModel.find(query.length > 0 ? { $or: query } : {})
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();

    return { totalPages: Math.ceil(totalPages / perPage), users };
  }
}

Object.freeze(UserApi);
export default UserApi;
