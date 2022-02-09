import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { User } from './user.model';

export class Category {
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
