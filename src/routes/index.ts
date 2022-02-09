import { Router } from 'express';
import { join } from 'path';

import DirScanner from '@utils/directory-scanner';

const router = Router();

DirScanner(join(__dirname, '*/*.route.{js,ts}')).forEach(
  async (path: string) => {
    const AppRoute = await import(path);
    const appRoute = new AppRoute.default();
    router.use(appRoute.baseUrl, appRoute.router);
  },
);

export default router;
