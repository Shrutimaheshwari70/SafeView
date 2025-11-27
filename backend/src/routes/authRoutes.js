import express from 'express';
import { signupParent, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signupParent);
router.post('/login', login);

export default router;
