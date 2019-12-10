import { OK, CREATED, ACCEPTED, CONFLICT, UNAUTHORIZED } from 'http-status';
import jwt from 'jsonwebtoken';

import * as UserService from '../services/UserService';

import { VERIFICATION_SECRET, JWT_SECRET } from '../config';

export async function registerBasic(req, res, next) {
  try {
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
    const user = await UserService.loginBasic(req.body);
    if (!user) {
      return res.status(UNAUTHORIZED).json({
        status: UNAUTHORIZED,
        errors: {
          form: ['Invalid email or password'],
        },
      });
    }

    // @TODO: make this with (remeber me) option
    const maxAge = 60000 * 60 * 24 * 60; // 1 month
    res.cookie('refreshToken', user.refreshToken, { maxAge, httpOnly: true });

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

export async function getAccessToken(req, res, next) {
  const { refreshToken } = req.cookies;

  const unAuthorizedResponse = {
    status: UNAUTHORIZED,
    errors: {
      token: ['Invalid or expired token'],
    },
  };

  if (!refreshToken) {
    return res.status(UNAUTHORIZED).json(unAuthorizedResponse);
  }

  try {
    const { sub } = await jwt.verify(refreshToken, JWT_SECRET);
    const user = await UserService.findById(sub);
    if (!user) {
      res.status(UNAUTHORIZED).json(unAuthorizedResponse);
    }

    return res.status(OK).json({
      status: OK,
      response: {
        token: await user.generateLoginToken(),
      },
    });
  } catch (e) {
    return next(e);
  }
}

export function logout(_, res) {
  res.clearCookie('refreshToken');
  res.status(OK).json({ status: OK });
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
    const user = await UserService.loginFacebook(req.body.token);

    // @TODO: make this with (remeber me option)
    const maxAge = 60000 * 60 * 24 * 60; // 1 month
    res.cookie('refreshToken', user.refreshToken, { maxAge, httpOnly: true });

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
