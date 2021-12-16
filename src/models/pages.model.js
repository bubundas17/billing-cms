import mongoose, { Schema } from 'mongoose';

const Schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    tags: [{ type: String, required: true, }],
    isPublished: { type: Boolean, default: false },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    lastEditedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, required: true, default: 'draft' },
  },
  { timestamps: true },
);


export default mongoose.model('Page', Schema);