import { Router } from 'express';

import * as todoController from '../../controllers/todoController';

const router = Router();

router
  .route('/')
  .post(todoController.createTodo)
  .get(todoController.listTodos);

export default router;
