import { getModelForClass, prop, Ref } from '@typegoose/typegoose';

import Status from '@enums/status.enum';
import { Category } from '@models/category.model';
import { User } from '@models/user.model';

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

  @prop({ default: Status.DRAFT, enum: Status })
  status: string;
}

export default getModelForClass(Posts, { schemaOptions: { timestamps: true } });
