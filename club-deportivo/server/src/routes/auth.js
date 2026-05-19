import { Router } from 'express';
import { signup, login, logout, signupPublic } from '../controllers/authController.js';

const router = Router();

router.post('/signup', signup);
router.post('/signup-public', signupPublic);
router.post('/login', login);
router.post('/logout', logout);

export default router;
