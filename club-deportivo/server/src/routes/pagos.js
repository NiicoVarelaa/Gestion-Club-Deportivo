import { Router } from 'express';
import {
  getPagos,
  createPago,
  getDeudasBySocio,
  generateMonthlyPayments,
  getDashboardStats,
} from '../controllers/pagosController.js';
import { authMiddleware, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, requireAdmin, getPagos);
router.post('/', authMiddleware, requireAdmin, createPago);
router.get('/deudas/:socioId', authMiddleware, requireAdmin, getDeudasBySocio);
router.post('/generar', authMiddleware, requireAdmin, generateMonthlyPayments);
router.get('/dashboard', authMiddleware, requireAdmin, getDashboardStats);

export default router;
