import { UNAUTHORIZED } from 'http-status';
import jwt from 'jsonwebtoken';

import { UnAuthorizedError } from '../lib/errors';
import { JWT_SECRET } from '../config';

export async function isAuthenticated(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(UNAUTHORIZED).json(UnAuthorizedError);
  }

  const token = authorization.split(' ')[1];
  if (!token) {
    return res.status(UNAUTHORIZED).json(UnAuthorizedError);
  }

  try {
    const { sub } = await jwt.verify(token, JWT_SECRET);
    req.userID = sub;
    return next();
  } catch (e) {
    return res.status(UNAUTHORIZED).json(UnAuthorizedError);
  }
}
