import { Schema, model } from 'mongoose';

const themeSchema = new Schema({
  name: { type: String, unique: true },
  description: { type: String },
  author: { type: String },
  version: { type: String },
  status: { type: Boolean, default: false },
});

themeSchema.pre('save', function (next) {
  this.name = this.name.toLowerCase().trim().replace(/\s+/g, '-');
  next();
});

export default model('Theme', themeSchema);
