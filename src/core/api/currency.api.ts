import CurrencyModel, { Currency } from '../../models/currency.model';

class CurrencyApi {
  static async getAllCurrencies(): Promise<Currency[]> {
    return await CurrencyModel.find({}).lean();
  }

  static async getCurrencyById(id: string): Promise<Currency> {
    return await CurrencyModel.findById(id).lean();
  }

  static async createCurrency(currency: Currency): Promise<Currency> {
    const newCurrency = new CurrencyModel(currency);
    return await newCurrency.save();
  }

  static async updateCurrency(
    id: string,
    currency: Currency,
  ): Promise<Currency> {
    return await CurrencyModel.findByIdAndUpdate(id, currency, {
      new: true,
    }).lean();
  }

  static async deleteCurrency(id: string): Promise<Currency> {
    return await CurrencyModel.findByIdAndDelete(id).lean();
  }
}

Object.freeze(CurrencyApi);
export default CurrencyApi;
