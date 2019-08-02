import {
  OK,
  CREATED,
  BAD_REQUEST,
  ACCEPTED,
  CONFLICT,
  UNAUTHORIZED,
} from 'http-status';
import jwt from 'jsonwebtoken';

import * as UserService from '../services/UserService';
import {
  registerBasicSchema,
  loginBasicSchema,
  loginFacebookSchema,
  emailSchema,
  resetPasswordSchema,
} from '../validators/userValidator';
import { formatJoiError } from '../lib/utils';
import { VERIFICATION_SECRET } from '../config';

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

    const alreadyExists = await UserService.userEmailExists(req.body.email);
    if (alreadyExists) {
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

export async function verifyEmail(req, res) {
  const token = req.body.token || '';
  try {
    const { email } = await jwt.verify(token, VERIFICATION_SECRET);
    if (!(await UserService.userEmailExists(email))) {
      throw new Error('not found');
    }
    await UserService.verifyEmail(email, token);
    res.status(ACCEPTED).json({
      status: ACCEPTED,
      response: null,
    });
  } catch (e) {
    res.status(UNAUTHORIZED).json({
      status: UNAUTHORIZED,
      errors: {
        form: ['Invalid or expired token'],
      },
    });
  }
}

export async function loginFacebook(req, res, next) {
  try {
    const { error } = loginFacebookSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        errors: formatJoiError(error),
      });
    }

    const user = await UserService.loginFacebook(req.body.token);

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

export async function sendPasswordResetEmail(req, res, next) {
  try {
    const { error } = emailSchema.validate(req.body);
    if (error) {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        errors: formatJoiError(error),
      });
    }

    const user = await UserService.findByEmail(req.body.email);
    if (user) {
      await user.sendPasswordResetEmail();
    }

    return res.status(OK).json({
      status: OK,
      response: null,
    });
  } catch (e) {
    return next(e);
  }
}

export async function resetPassword(req, res) {
  try {
    const { error } = resetPasswordSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        errors: formatJoiError(error),
      });
    }

    const { token, password } = req.body;
    await UserService.resetPasswordByToken(token, password);

    return res.status(ACCEPTED).json({
      status: ACCEPTED,
      response: null,
    });
  } catch (e) {
    return res.status(UNAUTHORIZED).json({
      status: UNAUTHORIZED,
      errors: {
        form: ['Invalid or expired token'],
      },
    });
  }
}
