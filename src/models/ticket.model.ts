import { getModelForClass, prop, Ref } from '@typegoose/typegoose';

import { User } from '@models/user.model';
import BaseModel from '@models/base.model';

enum TicketStatus {
  Open = 'open',
  Closed = 'closed',
}

enum TicketPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export class Reply {
  @prop()
  body: string;

  @prop({ ref: () => User })
  repliedBy: Ref<User>;
}

export class Ticket extends BaseModel {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  body: string;

  @prop({ enum: TicketStatus, default: TicketStatus.Open })
  status: TicketStatus;

  @prop({ enum: TicketPriority, default: TicketPriority.Low })
  priority: TicketPriority;

  @prop({ required: true, ref: () => User })
  createdBy: Ref<User>;

  @prop({ type: [Reply] })
  replies: Reply[];
}

export default getModelForClass(Ticket, {
  schemaOptions: { timestamps: true },
});
