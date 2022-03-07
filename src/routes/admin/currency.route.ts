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
      res.render('admin/settings/currencies/add-edit', {});
    });

    this.router.get('/edit/:id', async (_req, res) => {
      // TODO check if currency exists & is not null
      // TODO send currency to edit page

      res.render('admin/settings/currencies/add-edit', {
        edit: true,
      });
    });

    this.router.post('/new', async (req, res) => {
      await CurrencyApi.createCurrency(req.body);
      res.redirect('/admin/settings/currencies');
    });
  }
}

export default CurrencyRoute;
