import { getModelForClass, prop } from '@typegoose/typegoose';

import BaseModel from '@models/base.model';

export class Currency extends BaseModel {
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

  @prop({ required: true })
  prices: [
    {
      duration: number; // Duration in days, 0 for one time
      price: number; // Price in base currency
      label: string; // Label for price
    },
  ];
}

export default getModelForClass(Currency, {
  schemaOptions: { timestamps: true },
});
