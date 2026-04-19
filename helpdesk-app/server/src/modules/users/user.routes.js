import { Router } from 'express';
import * as userController from './user.controller.js';
import { protect, authorize } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(protect);
// allow admin and super-admin
router.use(authorize('admin', 'super-admin'));

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

export default router;
