import BaseRoute from '@routes/base.route';
import {
  getAddCurrency,
  getCurrencies,
  getEditCurrency,
  postAddCurrency,
  postDeleteCurrency,
  postEditCurrency,
  postUpdateDefaultCurrency,
} from '@controllers/admin/currency.controller';
import { ensureLoggedIn } from 'connect-ensure-login';

class CurrencyRoute extends BaseRoute {
  constructor() {
    super('/admin/settings/currencies');
    this.init();
  }

  init() {
    this.router.get(
      '/',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      getCurrencies,
    );

    this.router
      .route('/new')
      .get(ensureLoggedIn({ redirectTo: '/auth/signin' }), getAddCurrency)
      .post(ensureLoggedIn({ redirectTo: '/auth/signin' }), postAddCurrency);

    this.router
      .route('/edit/:id')
      .get(ensureLoggedIn({ redirectTo: '/auth/signin' }), getEditCurrency)
      .post(ensureLoggedIn({ redirectTo: '/auth/signin' }), postEditCurrency);

    this.router.post(
      '/delete',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      postDeleteCurrency,
    );

    this.router.post(
      '/update-default-currency',
      ensureLoggedIn({ redirectTo: '/auth/signin' }),
      postUpdateDefaultCurrency,
    );
  }
}

export default CurrencyRoute;
