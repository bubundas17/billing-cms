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
  await CurrencyApi.createCurrency({
    ...req.body,
    default: req.body.default === 'on',
  });
  res.redirect('/admin/settings/currencies');
};

export const postEditCurrency = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!isValidObjectId(id)) return res.redirect('/admin/settings/currencies');

  await CurrencyApi.updateCurrency(id, {
    ...req.body,
    default: req.body.default === 'on',
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
