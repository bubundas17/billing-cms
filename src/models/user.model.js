import { Schema, model } from 'mongoose';
import { compare, hash } from 'bcrypt';
import createError from 'http-errors';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    /**
     * @TODO create adimn, superAdmin, seelsOperator enum
     */
    adminRole: { type: String },
    /**
     * Only let user log in to admin panel if they have admin role,
     * we can use this permissions to allow/denay access to admin panel
     * for example: sells operaters should not get any access to system settings.
     * @TODO create admin, admin-all, banned enum
     */
    permissions: [{ type: String }],
  },
  { timestamps: true },
);

/**
 * @description Hash password before saving
 */
UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    this.password = await hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * @description Compare password with hashed password
 *
 * @param {string} password
 * @returns {Promise}
 */
UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await compare(password, this.password);
  } catch (error) {
    throw createError.InternalServerError(error.message);
  }
};

export default model('User', UserSchema);
