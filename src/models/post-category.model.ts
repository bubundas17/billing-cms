import { getModelForClass, prop, Ref } from '@typegoose/typegoose';

import { User } from '@models/user.model';
import BaseModel from '@models/base.model';

export class PostCategory extends BaseModel {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  slug: string;

  @prop({ required: true })
  description: string;

  @prop({ ref: () => PostCategory })
  parent: Ref<PostCategory>;

  @prop({ ref: () => PostCategory })
  children: Ref<PostCategory>[];

  @prop({ ref: () => User })
  addedBy: Ref<User>;

  @prop({ ref: () => User })
  lastEditedBy: Ref<User>;
}

export default getModelForClass(PostCategory, {
  schemaOptions: { timestamps: true },
});
