import { getModelForClass, prop, Ref } from '@typegoose/typegoose';

import { User } from '@models/user.model';
import BaseModel from '@models/base.model';

export class ProductGroup extends BaseModel {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  slug: string;

  @prop({ required: true })
  description: string;

  @prop({ ref: () => ProductGroup })
  parent: Ref<ProductGroup>;

  @prop({ ref: () => ProductGroup })
  children: Ref<ProductGroup>[];

  @prop({ default: false })
  hidden: boolean;

  @prop({ ref: () => User })
  addedBy: Ref<User>;

  @prop({ ref: () => User })
  lastEditedBy: Ref<User>;
}

export default getModelForClass(ProductGroup, {
  schemaOptions: { timestamps: true },
});
