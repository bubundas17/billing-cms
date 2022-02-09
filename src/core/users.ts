import UserModel from '@models/user.model';

export class User {
  async getUserByEmail(email: string) {
    return await UserModel.findOne({ email });
  }
}
