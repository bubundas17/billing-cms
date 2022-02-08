import { getModelForClass, prop } from '@typegoose/typegoose';

export class Option {
  @prop({ required: true, index: true })
  name: string;

  @prop({ required: false })
  value: string;

  @prop({ required: false, default: false })
  cachable: boolean;
}

const OptionModel = getModelForClass(Option, {
  schemaOptions: { timestamps: true },
});

export default OptionModel;
