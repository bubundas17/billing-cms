declare namespace Express {
  import { User } from '../../src/models/user.model';

  interface Request {
    flash: (type: string, message: string) => void;
  }

  interface Response {
    title: (title: string) => void;
    load: (view: string, data?: object) => void;
  }

  type User = User;
}
