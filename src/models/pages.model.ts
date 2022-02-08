import { getModelForClass, prop } from '@typegoose/typegoose';

import { Status } from './posts.model';

export class Pages {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  body: string;

  @prop({ required: true, unique: true })
  slug: string;

  @prop({ required: true, type: [String] })
  tags: string[];

  @prop({ required: true, default: false })
  isPublished: boolean;

  @prop({ required: true, ref: () => User })
  postedBy: string;

  @prop({ required: true, ref: () => User })
  lastEditedBy: string;

  @prop({ default: 'draft', enum: Status })
  status: Status;
}

export default getModelForClass(Pages, { schemaOptions: { timestamps: true } });
