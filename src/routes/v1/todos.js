import { Router } from 'express';

import * as todoController from '../../controllers/todoController';

const router = Router();

router.route('/').post(todoController.createTodo);

export default router;
