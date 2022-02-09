declare namespace Express {
  export interface Request {
    flash: (type: string, message: string) => void;
  }
}
