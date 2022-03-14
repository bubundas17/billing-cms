import { Request, Response, NextFunction } from 'express';

import CurrencyApi from '@core/api/currency.api';

// TODO: Impliment Get Currency From IP address
// TODO: Impliment Get Currency From User Preferences
// TODO: Impliment Get Currency From User Session

export const getCurrency = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currency = await CurrencyApi.getDefaultCurrency();
  res.locals.currency = currency;
  next();
};
