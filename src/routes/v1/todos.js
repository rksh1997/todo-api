import { Router } from 'express';

import * as todoController from '../../controllers/todoController';

const router = Router();

router.param('id', todoController.ensureTodoExists);

router
  .route('/')
  .post(todoController.createTodo)
  .get(todoController.listTodos);

router.route('/:id').delete(todoController.deleteTodo);
router.route('/:id/trash').put(todoController.trashTodo);
router.route('/:id/untrash').put(todoController.untrashTodo);
router.route('/:id/complete').put(todoController.completeTodo);

export default router;
