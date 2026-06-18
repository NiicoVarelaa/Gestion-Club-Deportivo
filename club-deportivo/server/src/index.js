import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import { pinoHttp } from 'pino-http';
import { logger } from './utils/logger.js';
import { getSupabase } from './utils/supabase.js';
import sociosRoutes from './routes/socios.js';
import deportesRoutes from './routes/deportes.js';
import inscripcionesRoutes from './routes/inscripciones.js';
import pagosRoutes from './routes/pagos.js';
import authRoutes from './routes/auth.js';
import portalRoutes from './routes/portal.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(compression());
app.use(pinoHttp({ logger }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP' },
});
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/portal', portalRoutes);
app.use('/api/socios', sociosRoutes);
app.use('/api/deportes', deportesRoutes);
app.use('/api/inscripciones', inscripcionesRoutes);
app.use('/api/pagos', pagosRoutes);

app.get('/api/health', async (req, res) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('Socio').select('id').limit(1);
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: error ? 'disconnected' : 'connected',
      uptime: process.uptime(),
    });
  } catch {
    res.status(503).json({
      status: 'degraded',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`GesClub server running on http://localhost:${PORT}`);
});

function gracefulShutdown(signal) {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
