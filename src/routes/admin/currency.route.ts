import BaseRoute from '@routes/base.route';
import {
  getAddCurrency,
  getCurrencies,
  getEditCurrency,
  postAddCurrency,
  postDeleteCurrency,
  postEditCurrency,
} from '@controllers/admin/currency.controller';

class CurrencyRoute extends BaseRoute {
  constructor() {
    super('/admin/settings/currencies');
    this.init();
  }

  init() {
    this.router.get('/', getCurrencies);

    this.router.route('/new').get(getAddCurrency).post(postAddCurrency);

    this.router.route('/edit/:id').get(getEditCurrency).post(postEditCurrency);

    this.router.post('/delete', postDeleteCurrency);
  }
}

export default CurrencyRoute;
