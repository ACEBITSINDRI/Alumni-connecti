// Alumni Connect API Server - v1.3 (Ticker Database Fixed)
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { onRequest } from 'firebase-functions/v2/https';

// Routes
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import connectionRoutes from './routes/connectionRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import tickerRoutes from './routes/tickerRoutes.js';
import emailCampaignRoutes from './routes/emailCampaignRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Initialize Cron Jobs for automated tasks
import { initializeCronJobs } from './services/cronService.js';
if (process.env.NODE_ENV === 'production') {
  // Only run cron jobs in production to avoid multiple instances in development
  initializeCronJobs();
  console.log('📅 Cron jobs initialized (Production mode)');
} else {
  console.log('⏰ Cron jobs disabled (Development mode)');
  console.log('   Use POST /api/notifications/test/* endpoints to test manually');
}

// Trust proxy for Render deployment
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS - Support multiple origins
const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim());

// Add production frontend domain
const productionFrontend = 'https://alumniconnect.acebits.in';
if (!allowedOrigins.includes(productionFrontend)) {
  allowedOrigins.push(productionFrontend);
}

console.log('✅ Allowed CORS Origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600, // 10 minutes
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting (disabled in development, enabled in production)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || (process.env.NODE_ENV === 'production' ? 100 : 10000), // Limit each IP to 100 requests per windowMs in production, 10000 in development
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => process.env.NODE_ENV !== 'production', // Skip rate limiting in development
});

app.use('/api/', limiter);

// Health check routes (both /health and /api/health)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/ticker', tickerRoutes);
app.use('/api/email-campaigns', emailCampaignRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Alumni Connect API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      posts: '/api/posts',
      events: '/api/events',
      opportunities: '/api/opportunities',
      messages: '/api/messages',
      notifications: '/api/notifications',
    },
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

// Only start the server if NOT in Firebase environment
let server;
if (!process.env.FIREBASE_CONFIG && !process.env.FUNCTIONS_EMULATOR) {
  server = app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║        Alumni Connect API Server                        ║
║                                                          ║
║        Environment: ${process.env.NODE_ENV || 'development'}                         ║
║        Port: ${PORT}                                          ║
║        URL: http://localhost:${PORT}                         ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    if (server) {
      server.close(() => process.exit(1));
    } else {
      process.exit(1);
    }
  });
}

// Export the app as a Firebase Cloud Function
export const api = onRequest({
  region: 'us-central1',
  memory: '1GiB',
  maxInstances: 10,
  minInstances: typeof process.env.NODE_ENV === 'production' ? 1 : 0
}, app);

export default app;
