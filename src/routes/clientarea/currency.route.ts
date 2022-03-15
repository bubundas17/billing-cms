import BaseRoute from '@routes/base.route';
import { getCurrency } from '@middlewares/currency.middleware';

class HomeRoute extends BaseRoute {
  constructor() {
    super('/');
    this.init();
  }

  init() {
    this.router.use(getCurrency);
    this.router.post('/setcurrency', async (req, res) => {
      req.session.currency = req.body.currency;
      // redirect to referrar
      res.redirect(req.headers.referer || '/');
    });
  }
}

export default HomeRoute;
