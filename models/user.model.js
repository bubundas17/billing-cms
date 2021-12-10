import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('User', UserSchema);
