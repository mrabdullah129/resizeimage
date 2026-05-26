import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import imageRoutes from './routes/image.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(helmet());
const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : null;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!allowedOrigins) return callback(null, true);
      if (!origin) return callback(null, true);
      return allowedOrigins.includes(origin) ? callback(null, true) : callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  })
);

// Ensure preflight requests are handled for all routes
app.options('*', cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 160,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'smart-image-resizer-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/admin', adminRoutes);
app.use(errorHandler);

export default app;
