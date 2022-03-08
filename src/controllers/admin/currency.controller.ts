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

  const isCurrencyExists = await CurrencyApi.getCurrency({
    code: bodyObj.code,
  });

  if (isCurrencyExists) {
    req.flash('error', 'Currency already exists');
    return res.render('admin/settings/currencies/add-edit', {
      currency: bodyObj,
      _errors: req.flash('error'),
    });
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

  await CurrencyApi.setDefaultCurrency(currencyId);

  res.redirect('/admin/settings/currencies');
};
