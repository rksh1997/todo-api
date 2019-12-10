import { Router } from 'express';
import ExpressBrute, { MemoryStore } from 'express-brute';
import { TOO_MANY_REQUESTS } from 'http-status';

import * as userController from '../../controllers/userController';
import joiValidator from '../../middlewares/joiValidator';

import {
  registerBasicSchema,
  loginBasicSchema,
  loginFacebookSchema,
  emailSchema,
  resetPasswordSchema,
} from '../../validators/userValidator';

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

router
  .route('/register/basic')
  /**
   * @api {post} /users/register/basic Basic Register
   * @apiName RegisterUserBasic
   * @apiGroup User
   * @apiVersion 1.0.0
   *
   * @apiParam {String} email User email address.
   * @apiParam {String{5..50}} password User password.
   *
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 201 CREATED
   *  {
   *    "status": 201,
   *    "response": null
   *  }
   */
  .post(joiValidator(registerBasicSchema), userController.registerBasic);

router
  .route('/login/basic')
  /**
   * @api {post} /users/login/basic Basic Login
   * @apiName LoginUserBasic
   * @apiGroup User
   * @apiVersion 1.0.0
   *
   * @apiParam {String} email User email address.
   * @apiParam {String} password User password.
   *
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 200 OK
   *  {
   *    "status": 200,
   *    "response": {
   *      "user": {
   *        "id": "5d4464950140d62be9fc1d6a",
   *        "email": "rashad@todoapp.com"
   *      },
   *      "token": "eyJhbGc.eyJzdWIi.FlE7K"
   *    }
   *  }
   */
  .post(
    brute.prevent,
    joiValidator(loginBasicSchema),
    userController.loginBasic,
  );

router
  .route('/verify')
  /**
   * @api {post} /users/verify Verify Email
   * @apiName VerifyEmail
   * @apiGroup User
   * @apiVersion 1.0.0
   *
   * @apiParam {String} token Token retrieved from sent email.
   *
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 202 ACCEPTED
   *  {
   *    "status": 202,
   *    "response": null
   *  }
   */
  .post(userController.verifyEmail);

router
  .route('/refresh_token')
  /**
   * @api {get} /users/refresh_token Refresh Token
   * @apiName RefreshToken
   * @apiGroup User
   * @apiVersion 1.0.0
   *
   * @apiParam {String} refreshToken a **Cookie** with the value of user's refresh token.
   *
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 200 OK
   *  {
   *    "status": 200,
   *    "response": {
   *      "token": "eyJhbGc.eyJzdWIi.FlE7K"
   *    }
   *  }
   */
  .get(userController.getAccessToken);

router
  .route('/logout')
  /**
   * @api {get} /users/logout Logout
   * @apiName Logout
   * @apiGroup User
   * @apiVersion 1.0.0
   *
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 200 OK
   *  {
   *    "status": 200
   *  }
   */
  .get(userController.logout);

router
  .route('/login/facebook')
  /**
   * @api {post} /users/login/facebook Facebook Login
   * @apiName LoginUserFacebook
   * @apiGroup User
   * @apiVersion 1.0.0
   *
   * @apiParam {String} token Facebook access token retrieved from frontend popup.
   *
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 200 OK
   *  {
   *    "status": 200,
   *    "response": {
   *      "user": {
   *        "id": "5d4464950140d62be9fc1d6a",
   *        "email": "rashad@todoapp.com"
   *      },
   *      "token": "eyJhbGc.eyJzdWIi.FlE7K"
   *    }
   *  }
   */
  .post(joiValidator(loginFacebookSchema), userController.loginFacebook);

router
  .route('/password/forgot')
  /**
   * @api {post} /users/password/forgot Send Recovery Email
   * @apiName SendRecoveryEmail
   * @apiGroup User
   * @apiVersion 1.0.0
   *
   * @apiParam {String} email User email.
   *
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 200 OK
   *  {
   *    "status": 200,
   *    "response": null
   *  }
   */
  .post(joiValidator(emailSchema), userController.sendPasswordResetEmail);

router
  .route('/password/reset')
  /**
   * @api {post} /users/password/reset Reset Password
   * @apiName ResetPassword
   * @apiGroup User
   * @apiVersion 1.0.0
   *
   * @apiParam {String} token Reset token retrieved from sent email.
   * @apiParam {String{5..50}} password New password.
   *
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 202 ACCEPTED
   *  {
   *    "status": 202,
   *    "response": null
   *  }
   */
  .post(joiValidator(resetPasswordSchema), userController.resetPassword);

export default router;
