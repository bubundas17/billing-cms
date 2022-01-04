import { Schema, model } from 'mongoose';

const optionSchema = new Schema(
  {
    name: { type: String, required: true, index: 1 },
    value: { type: String, required: false },
    cachable: { type: Boolean, required: false, default: false },
  },
  { timestamps: false },
);

export default model('Option', optionSchema);
