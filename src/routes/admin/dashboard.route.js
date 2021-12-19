import { Router } from 'express';

import { getDashboard } from '../../controllers';

const router = Router();

router.get('/dashboard', getDashboard);

export default router;
