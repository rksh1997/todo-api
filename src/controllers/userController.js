import { OK, CREATED, BAD_REQUEST, CONFLICT, UNAUTHORIZED } from 'http-status';

import * as UserService from '../services/UserService';
import {
  registerBasicSchema,
  loginBasicSchema,
} from '../validators/userValidator';
import { formatJoiError } from '../lib/utils';

export async function registerBasic(req, res, next) {
  try {
    const { error } = registerBasicSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        errors: formatJoiError(error),
      });
    }

    const alreadExists = await UserService.userEmailExists(req.body.email);
    if (alreadExists) {
      return res.status(CONFLICT).json({
        status: CONFLICT,
        errors: {
          email: ['email already exists'],
        },
      });
    }

    await UserService.registerBasic(req.body);
    return res.status(CREATED).json({ status: CREATED, response: null });
  } catch (e) {
    return next(e);
  }
}

export async function loginBasic(req, res, next) {
  try {
    const { error } = loginBasicSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        errors: formatJoiError(error),
      });
    }

    const user = await UserService.loginBasic(req.body);
    if (!user) {
      return res.status(UNAUTHORIZED).json({
        status: UNAUTHORIZED,
        errors: {
          form: ['Invalid email or password'],
        },
      });
    }

    return res.status(OK).json({
      status: OK,
      response: {
        user,
        token: user.generateLoginToken(),
      },
    });
  } catch (e) {
    return next(e);
  }
}
