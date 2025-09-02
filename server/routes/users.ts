import express, { Response } from 'express';
import { UserService } from '../services/userService';
import { authenticateToken, AuthenticatedRequest } from '../helpers/auth';
import { getUserProfile, loginUser, registerUser } from '../controller/userController';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/user', authenticateToken, getUserProfile);

export default router;
