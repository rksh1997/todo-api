import { CREATED, BAD_REQUEST } from 'http-status';

import * as TodoService from '../services/TodoService';
import { createTodoSchema } from '../validators/todoValidator';
import { formatJoiError } from '../lib/utils';

export async function createTodo(req, res, next) {
  try {
    const { error } = createTodoSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        errors: formatJoiError(error),
      });
    }

    const data = { ...req.body, user: req.userID };
    const todo = await TodoService.createTodo(data);
    return res.status(CREATED).json({
      status: CREATED,
      response: { todo },
    });
  } catch (e) {
    return next(e);
  }
}
