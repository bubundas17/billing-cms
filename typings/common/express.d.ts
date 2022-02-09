declare namespace Express {
  interface Request {
    flash: (type: string, message: string) => void;
  }

  interface Response {
    load: (view: string, data?: object) => void;
  }
}
