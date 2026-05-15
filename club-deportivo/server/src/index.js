import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import sociosRoutes from './routes/socios.js';
import deportesRoutes from './routes/deportes.js';
import inscripcionesRoutes from './routes/inscripciones.js';
import pagosRoutes from './routes/pagos.js';
import authRoutes from './routes/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP',
});
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/socios', sociosRoutes);
app.use('/api/deportes', deportesRoutes);
app.use('/api/inscripciones', inscripcionesRoutes);
app.use('/api/pagos', pagosRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
