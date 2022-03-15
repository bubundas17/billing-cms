import { getModelForClass, Pre, prop, Ref } from '@typegoose/typegoose';
import slugify from 'slugify';

import { ProductGroup } from '@models/product-group.model';
import BaseModel from '@models/base.model';

class Price {
  @prop()
  duration: number;

  @prop()
  price: number;

  @prop()
  label: string;
}

@Pre<Product>('save', function (next) {
  this.slug = slugify(this.name, {
    replacement: '-',
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    trim: true,
  });

  next();
})
export class Product extends BaseModel {
  @prop()
  name: string; // Product name

  @prop()
  slug: string; // Product slug, Used for permalink

  @prop()
  description: string; // Product description

  // @prop({  enum: ['product', 'service'] })
  // productType: string;

  @prop({ default: false })
  hidden: boolean; // Is Hidden Product?

  @prop({ type: [Price] })
  prices: Price[];

  @prop({ ref: () => ProductGroup })
  group: Ref<ProductGroup>;
}

export default getModelForClass(Product, {
  schemaOptions: { timestamps: true },
});
