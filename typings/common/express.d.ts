declare namespace Express {
  import { User } from '../../src/models/user.model';

  interface Response {
    title: (title: string) => void;
    load: (view: string, data?: object) => void;
  }

  type User = User;
}
