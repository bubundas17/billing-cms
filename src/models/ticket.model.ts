import { getModelForClass, prop, Ref } from '@typegoose/typegoose';

import { User } from '@models/user.model';
import BaseModel from '@models/base.model';

export enum TicketStatus {
  Open = 'open',
  Closed = 'closed',
  Answerd = 'answerd',
  ClientReply = 'client-reply',
  OnProgress = 'on-progress',
}

export enum TicketPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum TicketType {
  Support = 'support',
  Sales = 'sales',
  Billing = 'billing',
}

export class Reply {
  @prop({ trim: true })
  body: string;

  @prop({ ref: () => User })
  repliedBy: Ref<User>;

  @prop({ default: Date.now })
  createdAt?: Date;
}

export class Ticket extends BaseModel {
  @prop({ required: true })
  subject: string;

  @prop({ required: true })
  body: string;

  @prop({ enum: TicketStatus, default: TicketStatus.Open })
  status: TicketStatus;

  @prop({ enum: TicketType, default: TicketType.Support })
  type: TicketType;

  @prop({ enum: TicketPriority, default: TicketPriority.Low })
  priority: TicketPriority;

  @prop()
  attachedFile: string;

  @prop({ required: true, ref: () => User })
  createdBy: Ref<User>;

  @prop({ type: [Reply] })
  replies?: Reply[];
}

export default getModelForClass(Ticket, {
  schemaOptions: { timestamps: true },
});
