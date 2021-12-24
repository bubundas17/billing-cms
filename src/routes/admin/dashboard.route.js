import { Router } from 'express';

import { getDashboard } from '../../controllers';

class AppRoute {
    constructor() {
        this.router = Router();
        this.baseUrl = '/admin/dashboard';
        this.init();
    }
    init() {
        this.router.get("/", getDashboard);
    }
}

export default AppRoute;
module.exports = AppRoute;
