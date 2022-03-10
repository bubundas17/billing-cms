import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import CurrencyApi from '@core/api/currency.api';
import CurrencyDto from '@dto/currency.dto';
import mappedErrors from '@utils/mapped-errors';

export const getCurrencies = async (_req: Request, res: Response) => {
  const currencies = await CurrencyApi.getAllCurrencies();

  res.render('admin/settings/currencies/index', {
    currencies,
  });
};

export const getAddCurrency = async (_req: Request, res: Response) => {
  res.render('admin/settings/currencies/add-edit');
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

  const bodyObj = { ...req.body, rate: req.body.rate * 1 };
  if (!defaultCurrency) {
    bodyObj.default = true;
  }

  const currencyInput = plainToInstance(CurrencyDto, bodyObj);

  let errors: { [key: string]: string } | ValidationError[];

  errors = await validate(currencyInput);
  if (errors.length > 0) {
    return res.render('admin/settings/currencies/add-edit', {
      errors: mappedErrors(errors),
      currency: currencyInput,
    });
  }

  errors = {};
  const isCurrencyNameExist = await CurrencyApi.getCurrency({
    name: currencyInput.name,
  });
  if (isCurrencyNameExist) errors.name = 'Currency name already exist';

  const isCurrencyCodeExist = await CurrencyApi.getCurrency({
    code: currencyInput.code,
  });
  if (isCurrencyCodeExist) errors.code = 'Currency code already exist';

  if (Object.keys(errors).length > 0) {
    req.flash('error', 'Currency already exists');
    return res.render('admin/settings/currencies/add-edit', {
      currency: bodyObj,
      _errors: req.flash('error'),
      errors,
    });
  }

  await CurrencyApi.createCurrency(bodyObj);
  res.redirect('/admin/settings/currencies');
};

export const postEditCurrency = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!isValidObjectId(id)) {
    req.flash('error', 'Currency id is not valid');
    return res.redirect('/admin/settings/currencies');
  }

  const currency = await CurrencyApi.getCurrencyById(id);

  if (!currency) {
    req.flash('error', 'Currency not found');
    return res.redirect('/admin/settings/currencies');
  }

  const currencyInput = plainToInstance(CurrencyDto, {
    ...req.body,
    rate: req.body.rate * 1,
  });

  let errors: { [key: string]: string } | ValidationError[];
  errors = await validate(currencyInput);

  if (errors.length > 0) {
    return res.render('admin/settings/currencies/add-edit', {
      edit: true,
      currency: { ...currencyInput, _id: currency._id },
      errors: mappedErrors(errors),
    });
  }

  if (
    currency.code.toUpperCase() !== String(req.body.code).toUpperCase() ||
    currency.name.toLowerCase() !== String(req.body.name).toLowerCase()
  ) {
    errors = {};

    if (currencyInput.name.toLowerCase() !== currency.name.toLowerCase()) {
      const isCurrencyNameExist = await CurrencyApi.getCurrency({
        name: currencyInput.name,
      });
      if (isCurrencyNameExist) errors.name = 'Currency name already exist';
    }

    if (currencyInput.code.toUpperCase() !== currency.code.toUpperCase()) {
      const isCurrencyCodeExist = await CurrencyApi.getCurrency({
        code: currencyInput.code,
      });
      if (isCurrencyCodeExist) errors.code = 'Currency code already exist';
    }

    if (Object.keys(errors).length > 0) {
      req.flash('error', 'Currency already exists');
      return res.render('admin/settings/currencies/add-edit', {
        edit: true,
        currency: { ...currencyInput, _id: currency._id },
        _errors: req.flash('error'),
        errors,
      });
    }
  }

  await CurrencyApi.updateCurrency(id, req.body);

  if (
    currency.code.toUpperCase() !== currencyInput.code.toUpperCase() ||
    currency.name.toLowerCase() !== currencyInput.name.toLowerCase()
  )
    req.flash('success', 'Currency updated successfully');
  return res.redirect('/admin/settings/currencies');
};

export const postDeleteCurrency = async (req: Request, res: Response) => {
  const currencyId = req.body.currencyId;

  if (!isValidObjectId(currencyId)) {
    req.flash('error', 'Invalid currency id');
    return res.redirect('/admin/settings/currencies');
  }

  const defaultCurrency = await CurrencyApi.getDefaultCurrency();

  if (defaultCurrency._id.toString() === currencyId) {
    req.flash('error', 'Cannot delete default currency');
    return res.redirect('/admin/settings/currencies');
  }

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
