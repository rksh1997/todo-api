import { BAD_REQUEST } from 'http-status';

import { formatJoiError } from '../lib/utils';

export default schema => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    res.status(BAD_REQUEST).json({
      status: BAD_REQUEST,
      errors: formatJoiError(error),
    });
  } else {
    next();
  }
};
