import mongoose, { Schema } from 'mongoose';

const Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: 'Category' },
    children: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    isPublished: { type: Boolean, default: false },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    lastEditedBy: { type: Schema.Types.ObjectId, ref: 'User' },    
  },
  { timestamps: true },
);


export default mongoose.model('Category', Schema);