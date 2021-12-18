import { Schema, model } from 'mongoose';

const pagesSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    tags: [{ type: String, required: true }],
    isPublished: { type: Boolean, default: false },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    lastEditedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, required: true, default: 'draft' },
  },
  { timestamps: true },
);

export default model('Page', pagesSchema);
