import { Router } from 'express';

import * as userController from '../../controllers/userController';

const router = Router();

router.route('/register/basic').post(userController.registerBasic);

export default router;
