const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const prisma = require('./config/db');
const { requestLogger } = require('./middlewares/logger');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const storeRoutes = require('./routes/storeRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const addressRoutes = require('./routes/addressRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
  app.use(requestLogger);
}

// Health Check Endpoint (For Docker & Kubernetes Liveness/Readiness Probes)
const healthCheckHandler = async (req, res) => {
  try {
    // Ping PostgreSQL via Prisma
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected (PostgreSQL)',
      environment: process.env.NODE_ENV || 'development',
      memoryUsage: process.memoryUsage(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'DOWN',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message,
    });
  }
};

app.get('/health', healthCheckHandler);
app.get('/api/health', healthCheckHandler);

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to GoCart API Service',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      stores: '/api/stores',
      orders: '/api/orders',
      coupons: '/api/coupons',
      addresses: '/api/addresses',
      ratings: '/api/ratings',
      admin: '/api/admin',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes);

// 404 & Error Handlers
app.use(notFound);
app.use(errorHandler);

// Server startup
let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 GoCart Backend running on port ${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🗄️ Database: PostgreSQL via Prisma ORM`);
    console.log(`===============================================`);
  });

  // Graceful Shutdown for DevOps / Container management
  const gracefulShutdown = async (signal) => {
    console.log(`\n[${signal}] Received. Shutting down gracefully...`);
    if (server) {
      server.close(async () => {
        console.log('HTTP server closed.');
        try {
          await prisma.$disconnect();
          console.log('PostgreSQL Prisma connection closed.');
          process.exit(0);
        } catch (err) {
          console.error('Error disconnecting database:', err);
          process.exit(1);
        }
      });
    }
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

module.exports = app;
