declare namespace Express {
  import { User } from '../../src/models/user.model';
  import { Currency } from '../../src/models/currency.model';

  interface Response {
    title: (title: string) => void;
    load: (view: string, data?: object) => void;
    currency?: Currency;
  }
  export interface Request {
    session: Session & Partial<SessionData> & CustomSessionFields;
    getCurrency: () => Promise<Currency>;
  }

  type User = User;
}

interface CustomSessionFields {
  test: string;
}