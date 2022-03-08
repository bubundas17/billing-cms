import { QueryOptions } from 'mongoose';

import CurrencyModel, { Currency } from '../../models/currency.model';

class CurrencyApi {
  static async getAllCurrencies(): Promise<Currency[]> {
    return await CurrencyModel.find({}).lean();
  }

  static async setDefaultCurrency(id: string): Promise<Currency> {
    await CurrencyModel.updateMany({ default: true }, { default: false });
    return await CurrencyModel.findOneAndUpdate(
      { _id: id },
      { default: true },
    ).lean();
  }

  static async getCurrencyById(id: string): Promise<Currency> {
    return await CurrencyModel.findById(id).lean();
  }

  static async getDefaultCurrency(): Promise<Currency> {
    return await CurrencyModel.findOne({ default: true }).lean();
  }

  static async getCurrency(options: object = {}): Promise<Currency> {
    return await CurrencyModel.findOne(options).lean();
  }

  static async createCurrency(currency: Currency): Promise<Currency> {
    const newCurrency = new CurrencyModel(currency);
    return await newCurrency.save();
  }

  static async updateCurrency(
    id: string,
    currency: Partial<Currency>,
    options: QueryOptions = {},
  ): Promise<Currency> {
    return await CurrencyModel.findByIdAndUpdate(id, currency, {
      new: true,
      ...options,
    }).lean();
  }

  static async deleteCurrency(id: string): Promise<Currency> {
    return await CurrencyModel.findByIdAndDelete(id).lean();
  }
}

Object.freeze(CurrencyApi);
export default CurrencyApi;
