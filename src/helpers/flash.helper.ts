import { NextFunction, Request, Response } from 'express';

// Flash message helper
export default (_req: Request, _res: Response, next: NextFunction) => {
  // req.flash = (type, message) => {
  //   /*
  //    * type: 'success', 'info', 'warning', 'danger'
  //    * message: string
  //    */
  //   res.cookie(
  //     'flash',
  //     { type, message },
  //     {
  //       maxAge: 1000 * 60 * 3,
  //       httpOnly: false,
  //     },
  //   );
  // };

  next();
};
