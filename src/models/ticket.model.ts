import { getModelForClass, prop, Ref } from '@typegoose/typegoose';

import { User } from '@models/user.model';

export class Reply {
  @prop()
  body: string;

  @prop({ ref: () => User })
  postedBy: Ref<User>;
}

export class Ticket {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  body: string;

  @prop({ required: true, type: [Reply] })
  replies: Reply[];
}

export default getModelForClass(Ticket, {
  schemaOptions: { timestamps: true },
});
