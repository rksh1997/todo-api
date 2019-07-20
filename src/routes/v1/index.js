import { Router } from 'express';

import { isAuthenticated } from '../../middlewares/authMiddlewares';

import userRoutes from './users';
import todoRoutes from './todos';

const router = Router();

router.use('/users', userRoutes);
router.use('/todos', isAuthenticated, todoRoutes);

export default router;
