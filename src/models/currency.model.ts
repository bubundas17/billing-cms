import { getModelForClass, prop } from '@typegoose/typegoose';

import BaseModel from '@models/base.model';

export class Currency extends BaseModel {
  @prop({ required: true })
  name: string; // Currency name (e.g. USD, EUR, GBP, etc.)

  @prop({ required: true, index: true })
  code: string; // ISO 4217 Currency code (e.g. USD, EUR, GBP, etc.)

  @prop({ required: true, index: true })
  symbol: string;

  @prop()
  prefix: string;

  @prop()
  suffix: string;

  @prop({ required: true, default: false })
  default: boolean; // default currency

  @prop({ required: true, default: false })
  rate: number; // Conversion rate to default currency
}

export default getModelForClass(Currency, {
  schemaOptions: { timestamps: true },
});
