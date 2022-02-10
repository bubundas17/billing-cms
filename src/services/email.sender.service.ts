import { User } from '@models/user.model';
import { Agenda } from 'agenda/es';
import mongoose from 'mongoose';

type EmailProps = {
  template: string;
  data: object;
  to: User;
};

class EmailSender {
  agenda: Agenda;
  AGENDA_JOB_KEY = 'send_email';
  init() {
    this.agenda = new Agenda({ mongo: mongoose.connection.db });
  }

  async processEmails() {
    this.agenda.define(this.AGENDA_JOB_KEY, (job, done) => {
      const props = job.attrs.data as EmailProps;
      // log
      console.log('frem send Mail function', props);
      done();
    });
    await this.agenda.start();
  }

  async sendEmail(user: User, template: string, data: object) {
    const emailProps: EmailProps = {
      template,
      data,
      to: user,
    };
    this.agenda.now(this.AGENDA_JOB_KEY, emailProps);
  }
}

export default new EmailSender();
