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

  @prop({ required: true, ref: () => ProductGroup })
  parent: Ref<ProductGroup>;

  @prop({ required: true, ref: () => ProductGroup })
  children: Ref<ProductGroup>[];

  @prop({ required: true, default: false })
  hidden: boolean;

  @prop({ required: true, ref: () => User })
  addedBy: Ref<User>;

  @prop({ required: true, ref: () => User })
  lastEditedBy: Ref<User>;
}

export default getModelForClass(ProductGroup, {
  schemaOptions: { timestamps: true },
});
