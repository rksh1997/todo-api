import { CREATED, BAD_REQUEST, CONFLICT } from 'http-status';

import * as UserService from '../services/UserService';
import { registerBasicSchema } from '../validators/userValidator';
import { formatJoiError } from '../lib/utils';

export async function registerBasic(req, res, next) {
  try {
    const { error } = registerBasicSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        response: formatJoiError(error),
      });
    }

    const alreadExists = await UserService.userEmailExists(req.body.email);
    if (alreadExists) {
      return res.status(CONFLICT).json({
        status: CONFLICT,
        response: {
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
