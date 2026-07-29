import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getPortalData, updateProfile } from '../controllers/portalController.js';

const router = Router();

router.get('/me', authMiddleware, getPortalData);
router.put('/me', authMiddleware, updateProfile);

export default router;