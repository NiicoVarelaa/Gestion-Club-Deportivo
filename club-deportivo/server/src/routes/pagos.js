import { Router } from 'express';
import {
  getPagos,
  createPago,
  getDeudasBySocio,
  generateMonthlyPayments,
  getDashboardStats,
} from '../controllers/pagosController.js';

const router = Router();

router.get('/', getPagos);
router.post('/', createPago);
router.get('/deudas/:socioId', getDeudasBySocio);
router.post('/generar', generateMonthlyPayments);
router.get('/dashboard', getDashboardStats);

export default router;
