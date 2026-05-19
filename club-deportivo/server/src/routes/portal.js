import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getPortalData } from '../controllers/portalController.js';

const router = Router();

router.get('/me', authMiddleware, getPortalData);

export default router;