import { getModelForClass, prop, Ref } from '@typegoose/typegoose';

import { Category } from './category.model';
import { User } from './user.model';

export enum Status {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  TRASH = 'trash',
}

export class Posts {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  body: string;

  @prop({ required: true, unique: true })
  slug: string;

  @prop({ required: true, type: [String] })
  tags: string[];

  @prop({ required: true, ref: () => Category })
  categories: Ref<Category>[];

  @prop({ required: true, default: false })
  isPublished: boolean;

  @prop({ required: true, ref: () => User })
  postedBy: Ref<User>;

  @prop({ required: true, ref: () => User })
  lastEditedBy: Ref<User>;

  @prop({ default: 'draft', enum: Status })
  status: Status;
}

export default getModelForClass(Posts, { schemaOptions: { timestamps: true } });
