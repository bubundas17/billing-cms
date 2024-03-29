import { Agenda } from 'agenda';
import mongoose from 'mongoose';

import { User } from '@models/user.model';
import emailDriver from '@lib/email-driver';
import theme from '@lib/theme';

type EmailProps = {
  template: string;
  data: {
    subject: string;
    info: object;
  };
  subject: string;
  to: User;
};

class EmailSender {
  agenda: Agenda;
  AGENDA_JOB_KEY = 'send_email';
  init() {
    this.agenda = new Agenda({ mongo: mongoose.connection.db });
  }

  async processEmails() {
    this.agenda.define(this.AGENDA_JOB_KEY, async (job, done) => {
      const props = job.attrs.data as EmailProps;
      const rendered = (await theme.render(
        'email-templates/' + props.template,
        {
          data: props.data,
          user: props.to,
        },
      )) as string;
      emailDriver.sendEmail(props.to.email, props.subject, rendered);
      done();
    });
    await this.agenda.start();
  }

  async sendEmail(user: User, template: string, data: EmailProps['data']) {
    const emailProps: EmailProps = {
      template,
      subject: data.subject,
      data,
      to: user,
    };
    this.agenda.now(this.AGENDA_JOB_KEY, emailProps);
  }
}

export default new EmailSender();
