import { Router } from 'express';
import {
  getDeportes,
  getDeporteById,
  createDeporte,
  updateDeporte,
  deleteDeporte,
} from '../controllers/deportesController.js';
import { authMiddleware, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getDeportes);
router.get('/:id', authMiddleware, requireAdmin, getDeporteById);
router.post('/', authMiddleware, requireAdmin, createDeporte);
router.put('/:id', authMiddleware, requireAdmin, updateDeporte);
router.delete('/:id', authMiddleware, requireAdmin, deleteDeporte);

export default router;
