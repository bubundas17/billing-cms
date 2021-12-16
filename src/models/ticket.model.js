import mongoose, { Schema } from 'mongoose';

const Schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    replies: [
      {
        body: { type: String, required: true },
        postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    status: { type: String, required: true, default: 'open' },
  },
  { timestamps: true },
);


export default mongoose.model('Ticket', Schema);