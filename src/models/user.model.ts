import { compare, hash } from 'bcrypt';
import createError from 'http-errors';
import { getModelForClass, pre, prop } from '@typegoose/typegoose';

@pre<User>('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    this.password = await hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
})
class User {
  @prop({ required: true, unique: true, type: String })
  name: string;

  @prop({ required: true, unique: true, lowercase: true, type: String })
  email: string;

  @prop({ required: true, type: String })
  password: string;

  @prop({ required: true, default: false, type: String })
  address: string;

  @prop({ required: true, default: false, type: Boolean })
  isAdmin: boolean;

  @prop({
    required: true,
    type: [String],
    enum: ['admin', 'super-admin', 'sells-operater', 'banned'],
  })
  roles: string[];

  async isValidPassword(password: string): Promise<string> {
    try {
      // @ts-ignore
      return await compare(password, this.password);
    } catch (error) {
      throw new createError.InternalServerError(error.message);
    }
  }
}

const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
});

export default UserModel;
