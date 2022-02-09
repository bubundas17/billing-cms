declare namespace Express {
  interface Request {
    flash: (type: string, message: string) => void;
  }

  interface Response {
    title: (title: string) => void;
    load: (view: string, data?: object) => void;
  }
}
