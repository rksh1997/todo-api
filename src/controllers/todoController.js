import { OK, CREATED, NOT_FOUND, ACCEPTED } from 'http-status';

import * as TodoService from '../services/TodoService';
import { NotFoundError } from '../lib/errors';

export async function listTodos(req, res, next) {
  try {
    const todos = await TodoService.getUserTodos(req.userID);
    res.status(OK).json({
      status: OK,
      response: { todos },
    });
  } catch (e) {
    next(e);
  }
}

export async function createTodo(req, res, next) {
  try {
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

export async function ensureTodoExists(req, res, next, id) {
  try {
    const todo = await TodoService.findById(id);
    if (!todo) {
      res.status(NOT_FOUND).json(NotFoundError);
    } else {
      req.todo = todo;
      next();
    }
  } catch (e) {
    next(e);
  }
}

export async function trashTodo(req, res, next) {
  const { id } = req.params;
  try {
    const todo = await TodoService.updateById(id, { trashed: true });
    res.status(ACCEPTED).json({
      status: ACCEPTED,
      response: { todo },
    });
  } catch (e) {
    next(e);
  }
}

export async function untrashTodo(req, res, next) {
  const { id } = req.params;
  try {
    const todo = await TodoService.updateById(id, { trashed: false });
    res.status(ACCEPTED).json({
      status: ACCEPTED,
      response: { todo },
    });
  } catch (e) {
    next(e);
  }
}

export async function completeTodo(req, res, next) {
  const { id } = req.params;
  try {
    const todo = await TodoService.updateById(id, { complete: true });
    res.status(ACCEPTED).json({
      status: ACCEPTED,
      response: { todo },
    });
  } catch (e) {
    next(e);
  }
}

export async function deleteTodo(req, res, next) {
  const { id } = req.params;
  try {
    await TodoService.deleteById(id);
    res.status(ACCEPTED).json({
      status: ACCEPTED,
      response: { todo: req.todo },
    });
  } catch (e) {
    next(e);
  }
}
