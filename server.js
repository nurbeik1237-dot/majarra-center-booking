/* ==========================================================================
   MAJARRA COMMUNITY CENTER - PROFESSIONAL PRODUCTION EXPRESS SERVER (v6.0)
   - Complete API, Database, Nodemailer Email Notifications & Multer Uploads
   - Helmet Security Headers & CORS Configuration
   - Rate Limiting & Brute Force Protection
   - Dual Admin Auth (PIN Code: 1234 & Credentials: admin@majarra.org / Admin@2026)
   - Modular Controllers & Express Routers
   - SQLite3 Promisified Database Connection & Attachments Support
   - SPA Fallback & Global 404/500 Error Handlers
   ========================================================================== */

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import Custom Modules & Middlewares
const { apiLimiter } = require('./middleware/rateLimiter');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

// Import Routers
const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust reverse proxies (Render, Cloudflare, localtunnel)
app.set('trust proxy', 1);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 1. Helmet Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow CDNs & Google Fonts
    crossOriginEmbedderPolicy: false
  })
);

// 2. CORS Middleware
app.use(cors());

// 3. Request Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. HTTP Logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 5. Rate Limiting Middleware
app.use('/api', apiLimiter);

// 6. Serve Static Frontend Files & Uploads
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));

// 7. Mount API Routes
app.use('/api/public', publicRoutes);
app.use('/api/bookings', publicRoutes); // Public bookings submission, availability check, tracking
app.use('/api/auth', authRoutes);
app.use('/api/admin', authRoutes); // Compatibility for /api/admin/login-pin, /api/admin/login, /api/admin/users
app.use('/api/admin/bookings', bookingRoutes);
app.use('/api/admin/settings', settingsRoutes);

// 8. Healthcheck Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    server: 'Majarra Booking Enterprise Backend v6.0',
    timestamp: new Date().toISOString()
  });
});

// 9. Handle SPA Fallback Middleware
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.originalUrl.startsWith('/api/')) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }
  next();
});

// 10. Global Error Handling Middlewares
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Express Production Server
const server = app.listen(PORT, () => {
  console.log(`===========================================================`);
  console.log(`🚀 MAJARRA ENTERPRISE BACKEND SERVER IS RUNNING!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔒 Security Headers, Nodemailer Email Service & Uploads Enabled`);
  console.log(`===========================================================`);
});

module.exports = app;
