import { Router } from 'express';
import {
  getSocios,
  getSocioById,
  createSocio,
  updateSocio,
  deleteSocio,
} from '../controllers/sociosController.js';

const router = Router();

router.get('/', getSocios);
router.get('/:id', getSocioById);
router.post('/', createSocio);
router.put('/:id', updateSocio);
router.delete('/:id', deleteSocio);

export default router;
