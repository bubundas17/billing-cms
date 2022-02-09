export class User {
  async getUserByEmail(email) {
    return await User.findOne({ email });
  }
}
