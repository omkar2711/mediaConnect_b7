import { Router } from 'express';
import { login, register } from '../controller/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);

// Example protected route
router.get('/protected', protect, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

export default router;
