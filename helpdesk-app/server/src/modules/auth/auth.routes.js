import { Router } from 'express';
import * as authController from './auth.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', authController.register);
router.post('/verify-email', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/login-verify-2fa', authController.loginVerify2FA);
router.get('/me', protect, authController.getMe);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.put('/change-password', protect, authController.changePassword);
router.post('/enable-2fa', protect, authController.enable2FA);
router.post('/verify-2fa', protect, authController.verify2FA);

export default router;
