import { Router } from 'express';
import {
  getInscripciones,
  createInscripcion,
  cancelInscripcion,
} from '../controllers/inscripcionesController.js';
import { authMiddleware, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, requireAdmin, getInscripciones);
router.post('/', authMiddleware, requireAdmin, createInscripcion);
router.delete('/:id', authMiddleware, requireAdmin, cancelInscripcion);

export default router;
