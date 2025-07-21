import express from 'express';
import userController from '../controllers/user.controller.js';

const router = express.Router();

router.post('/', userController.handleUserSignup);
router.post('/login', userController.handleLoginUser);




export default router;
