import { getModelForClass, prop, Ref } from '@typegoose/typegoose';

import { User } from './user.model';

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

const TicketModel = getModelForClass(Ticket, {
  schemaOptions: { timestamps: true },
});

export default TicketModel;
