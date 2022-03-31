import { getModelForClass, Pre, prop, Ref } from '@typegoose/typegoose';
import slugify from 'slugify';

import { User } from '@models/user.model';
import BaseModel from '@models/base.model';
import { Product } from './product.model';

@Pre<Product>('save', function (next) {
  this.slug = slugify(this.name, {
    replacement: '-',
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    trim: true,
  });

  next();
})
export class ProductGroup extends BaseModel {
  @prop({ required: true })
  name: string;

  @prop()
  slug: string;

  @prop({ required: true })
  description: string;

  @prop({ ref: () => ProductGroup })
  parent: Ref<ProductGroup>;

  // @prop({ ref: () => ProductGroup })
  // children: Ref<ProductGroup>[];

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
