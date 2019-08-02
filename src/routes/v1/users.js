import { Router } from 'express';
import ExpressBrute, { MemoryStore } from 'express-brute';
import { TOO_MANY_REQUESTS } from 'http-status';

import * as userController from '../../controllers/userController';

const router = Router();
const store = new MemoryStore();
const brute = new ExpressBrute(store, {
  freeRetries: 5,
  maxWait: 5 * 60 * 1000,
  failCallback: (_, res) => {
    res.status(TOO_MANY_REQUESTS).json({
      status: TOO_MANY_REQUESTS,
      errors: {
        form: ['Too many login attempts'],
      },
    });
  },
});

router.route('/register/basic').post(userController.registerBasic);
router.route('/login/basic').post(brute.prevent, userController.loginBasic);

router.route('/verify').post(userController.verifyEmail);

export default router;
