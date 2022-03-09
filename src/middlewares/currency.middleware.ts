import { Request, Response, NextFunction } from 'express';

import CurrencyApi from '@core/api/currency.api';

// TODO: Impliment Get Currency From IP address
// TODO: Impliment Get Currency From User Preferences
// TODO: Impliment Get Currency From User Session

export const CurrencySelector = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.getCurrency = async () => {
    const currency = await CurrencyApi.getDefaultCurrency();
    res.locals.currency = currency;
    return currency;
  };
  next();
};
