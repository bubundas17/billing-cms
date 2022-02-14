import { getModelForClass, prop } from '@typegoose/typegoose';

import BaseModel from '@models/base.model';

export class Option extends BaseModel {
  @prop({ required: true, index: true })
  name: string;

  @prop({ required: false })
  value: string;

  @prop({ required: false, default: false })
  cachable: boolean;
}

export default getModelForClass(Option, {
  schemaOptions: { timestamps: true },
});
