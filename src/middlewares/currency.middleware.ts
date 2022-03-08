import * as express from 'express';
import CurrencyApi from '@core/api/currency.api';
import { Currency } from '@models/currency.model';

// TODO: Impliment Get Currency From IP address
// TODO: Impliment Get Currency From User Preferences
// TODO: Impliment Get Currency From User Session

export const CurrencySelector = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  req.getCurrency = async () => {
    const currencies = await CurrencyApi.getAllCurrencies();
    let currency = currencies.find(
      (currency: Currency) => currency.default === true,
    );
    if (!currency) {
      currency = currencies[0];
    }
    res.locals.currency = currency;
    return currency;
  };
  next();
};
