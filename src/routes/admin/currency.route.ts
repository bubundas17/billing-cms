import CurrencyApi from '@core/api/currency.api';

import BaseRoute from '@routes/base.route';

class CurrencyRoute extends BaseRoute {
  constructor() {
    super('/admin/settings/currencies');
    this.init();
  }

  init() {
    this.router.get('/', async (_req, res) => {
      const currencies = await CurrencyApi.getAllCurrencies();

      res.render('admin/settings/currencies/index', {
        currencies,
      });
    });

    this.router.get('/new', async (_req, res) => {
      const currencies = await CurrencyApi.getAllCurrencies();

      res.render('admin/settings/currencies/add', {
        currencies,
      });
    });
  }
}

export default CurrencyRoute;
