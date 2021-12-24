import { Router } from 'express';

class AppRoute {
    constructor() {
        this.router = Router();
        this.baseUrl = '/posts';
        this.init();
    }
    init() {
        this.router.get("/", (req, res) => {
            res.send('Hello World!');
        });

    }
}

export default AppRoute;
module.exports = AppRoute;