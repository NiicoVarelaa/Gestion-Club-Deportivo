import { Router } from 'express';
import {
  getDeportes,
  getDeporteById,
  createDeporte,
  updateDeporte,
  deleteDeporte,
} from '../controllers/deportesController.js';

const router = Router();

router.get('/', getDeportes);
router.get('/:id', getDeporteById);
router.post('/', createDeporte);
router.put('/:id', updateDeporte);
router.delete('/:id', deleteDeporte);

export default router;
