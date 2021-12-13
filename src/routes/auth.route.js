import { Router } from 'express';

import authControllers from '../controllers/auth.controller';

const router = Router();

router.get('/signup', authControllers.getSignUp);

// export
export default router;
