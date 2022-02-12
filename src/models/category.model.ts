import { getModelForClass, prop, Ref } from '@typegoose/typegoose';

import { User } from '@models/user.model';
import BaseModel from '@models/base.model';

export class Category extends BaseModel {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  slug: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true, ref: () => Category })
  parent: Ref<Category>;

  @prop({ required: true, ref: () => Category })
  children: Ref<Category>[];

  @prop({ required: true })
  isPublished: boolean;

  @prop({ required: true, ref: () => User })
  addedBy: Ref<User>;

  @prop({ required: true, ref: () => User })
  lastEditedBy: Ref<User>;
}

export default getModelForClass(Category, {
  schemaOptions: { timestamps: true },
});
