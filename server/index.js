




/**
 * SecurePass API Server
 * 
 * Main entry point for the Express server.
 * Configures security middleware, routes, and starts the server.
 * 
 * SECURITY: No passwords are ever stored or logged.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passwordRoutes = require('./routes/passwordRoutes');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ────────────────────────────────────────
app.use(helmet());                              // Security headers
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.CLIENT_URL || 'http://localhost:5173',
  ].filter(Boolean),
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '1kb' }));        // Limit body size for security
app.use(generalLimiter);                        // Rate limiting

// ─── Disable powered-by header ─────────────────────────────────
app.disable('x-powered-by');

// ─── Health check ───────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ─────────────────────────────────────────────────
app.use('/api/password', passwordRoutes);

// ─── Global Error Handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ─── 404 Handler ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Start Server (only when running locally, not on Vercel) ────
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🔐 SecurePass API running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
