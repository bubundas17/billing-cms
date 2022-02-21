import CurrencyModel, { Currency } from '../../models/currency.model';

class CurrencyApi {
  static async getAllCurrencies(): Promise<Currency[]> {
    return await CurrencyModel.find({}).lean();
  }
}

Object.freeze(CurrencyApi);
export default CurrencyApi;
