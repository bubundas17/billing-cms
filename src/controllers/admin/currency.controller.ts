import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';

import CurrencyApi from '@core/api/currency.api';

export const getCurrencies = async (_req: Request, res: Response) => {
  const currencies = await CurrencyApi.getAllCurrencies();

  res.render('admin/settings/currencies/index', {
    currencies,
  });
};

export const getAddCurrency = async (_req: Request, res: Response) => {
  res.render('admin/settings/currencies/add-edit', {});
};

export const getEditCurrency = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!isValidObjectId(id)) return res.redirect('/admin/settings/currencies');

  const currency = await CurrencyApi.getCurrencyById(id);

  if (!currency) return res.redirect('/admin/settings/currencies');

  res.render('admin/settings/currencies/add-edit', {
    edit: true,
    currency,
  });
};

export const postAddCurrency = async (req: Request, res: Response) => {
  const defaultCurrency = await CurrencyApi.getDefaultCurrency();

  const bodyObj = { ...req.body };
  if (!defaultCurrency) {
    bodyObj.default = true;
  }

  await CurrencyApi.createCurrency(bodyObj);
  res.redirect('/admin/settings/currencies');
};

export const postEditCurrency = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!isValidObjectId(id)) return res.redirect('/admin/settings/currencies');

  await CurrencyApi.updateCurrency(id, {
    ...req.body,
  });

  res.redirect('/admin/settings/currencies');
};

export const postDeleteCurrency = async (req: Request, res: Response) => {
  const currencyId = req.body.currencyId;

  if (!isValidObjectId(currencyId))
    return res.redirect('/admin/settings/currencies');

  await CurrencyApi.deleteCurrency(currencyId);

  res.redirect('/admin/settings/currencies');
};

export const postUpdateDefaultCurrency = async (
  req: Request,
  res: Response,
) => {
  const currencyId = req.body.currencyId;

  if (!isValidObjectId(currencyId))
    return res.redirect('/admin/settings/currencies');

  let currencies = await CurrencyApi.getAllCurrencies();
  currencies = currencies.filter((currency) => currency._id !== currencyId);

  currencies.forEach(async (currency) => {
    await CurrencyApi.updateCurrency(
      currency._id,
      { default: false },
      { runValidators: false },
    );
  });

  await CurrencyApi.updateCurrency(
    currencyId,
    { default: true },
    { runValidators: false },
  );

  res.redirect('/admin/settings/currencies');
};
