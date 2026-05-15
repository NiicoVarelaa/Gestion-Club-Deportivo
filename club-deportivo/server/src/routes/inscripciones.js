import { Router } from 'express';
import {
  getInscripciones,
  createInscripcion,
  cancelInscripcion,
} from '../controllers/inscripcionesController.js';

const router = Router();

router.get('/', getInscripciones);
router.post('/', createInscripcion);
router.delete('/:id', cancelInscripcion);

export default router;
