import { Request, Response, NextFunction } from 'express';

import CurrencyApi from '@core/api/currency.api';

// TODO: Impliment Get Currency From IP address
// TODO: Impliment Get Currency From User Preferences
// TODO: Impliment Get Currency From User Session
// TODO: Handle Errors
export const getCurrency = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.session.currency) {
    res.locals.currency = await CurrencyApi.getCurrency({
      code: req.session.currency,
    });
  } else if (req.query.cur) {
    res.locals.currency = await CurrencyApi.getCurrency({
      code: req.query.cur,
    });
    req.session.currency = req.query.cur;
  } else {
    const currency = await CurrencyApi.getDefaultCurrency();
    res.locals.currency = currency;
  }
  next();
};
