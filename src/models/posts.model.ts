import { getModelForClass, prop, Ref } from '@typegoose/typegoose';

import Status from '@enums/status.enum';
import { PostCategory } from '@models/post-category.model';
import { User } from '@models/user.model';
import BaseModel from '@models/base.model';

export class Posts extends BaseModel {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  body: string;

  @prop({ required: true, unique: true })
  slug: string;

  @prop({ required: true, type: [String] })
  tags: string[];

  @prop({ required: true, ref: () => PostCategory })
  categories: Ref<PostCategory>[];

  @prop({ required: true, default: false })
  isPublished: boolean;

  @prop({ required: true, ref: () => User })
  postedBy: Ref<User>;

  @prop({ required: true, ref: () => User })
  lastEditedBy: Ref<User>;

  @prop({ default: Status.DRAFT, enum: Status })
  status: string;
}

export default getModelForClass(Posts, { schemaOptions: { timestamps: true } });
