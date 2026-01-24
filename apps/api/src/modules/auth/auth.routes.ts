import {Router} from 'express'
import {authController} from './auth.controller'
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();


  router.post('/register', authController.register);
  router.post('/login', authController.login);
  router.post('/change-password', authMiddleware, authController.changePassword);

  export default router;