import { Router } from 'express';
import {
  getSocios,
  getSocioById,
  createSocio,
  updateSocio,
  deleteSocio,
} from '../controllers/sociosController.js';
import { authMiddleware, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, requireAdmin, getSocios);
router.get('/:id', authMiddleware, requireAdmin, getSocioById);
router.post('/', authMiddleware, requireAdmin, createSocio);
router.put('/:id', authMiddleware, requireAdmin, updateSocio);
router.delete('/:id', authMiddleware, requireAdmin, deleteSocio);

export default router;
