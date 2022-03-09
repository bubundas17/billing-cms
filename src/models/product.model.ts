import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { ProductGroup } from './product-group.model';

import BaseModel from '@models/base.model';

class Price {
  @prop()
  duration: number;

  @prop()
  price: number;

  @prop()
  label: string;
}

export class Product extends BaseModel {
  @prop({ required: true })
  name: string; // Product name

  @prop({ required: true })
  slug: string; // Product slug, Used for permalink

  @prop()
  description: string; // Product description

  // @prop({ required: true, enum: ['product', 'service'] })
  // productType: string;

  @prop({ required: true, default: false })
  hidden: boolean; // Is Hidden Product?

  @prop({ required: true, type: [Price] })
  prices: Price[];

  @prop({ required: true, ref: () => ProductGroup })
  group: Ref<ProductGroup>;
}

export default getModelForClass(Product, {
  schemaOptions: { timestamps: true },
});
