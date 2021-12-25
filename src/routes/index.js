import { Router } from 'express';
import { join } from 'path';
import DirScanner from '../utils/directory-scanner';

const router = Router();

DirScanner(join(__dirname, '*/*.route.js')).forEach(path => {
    let AppRoute = require(path);
    let appRoute = new AppRoute();
    router.use(appRoute.baseUrl, appRoute.router);
});


export default router;