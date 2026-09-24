const path = require('path'); // Import path
const express = require('express'); // server entry point
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const winston = require('winston');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Behind Nginx on the VPS — trust its X-Forwarded-For so req.ip (and the
// rate limiter) sees the real client IP, not 127.0.0.1.
app.set('trust proxy', 1);
app.disable('x-powered-by');

// Security headers. The API only serves JSON + /uploads images, which the
// storefront/admin (different origins) embed — so allow cross-origin reads.
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Middleware
// Capture the raw request body so the Cashfree webhook can verify its HMAC
// signature against the exact bytes received (JSON.stringify would re-order keys).
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf; },
}));
app.use(express.urlencoded({ extended: true }));

// NoSQL-injection guard: drop any body key starting with '$',
// so e.g. {"email": {"$ne": null}} can't turn into a Mongo operator.
// (Express 5's default query parser is 'simple', so req.query can't nest.)
const stripMongoOperators = (value) => {
  if (Array.isArray(value)) return value.map(stripMongoOperators);
  if (value && typeof value === 'object' && !Buffer.isBuffer(value)) {
    for (const key of Object.keys(value)) {
      if (key.startsWith('$')) delete value[key];
      else value[key] = stripMongoOperators(value[key]);
    }
  }
  return value;
};
app.use((req, res, next) => {
  if (req.body) stripMongoOperators(req.body);
  next();
});
// CORS — allow local dev + deployed frontends
const allowedOrigins = [
  // Local dev (hardcoded + from .env)
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  process.env.LOCAL_FRONTEND_URL,   // http://localhost:3000
  process.env.LOCAL_ADMIN_URL,      // http://localhost:3001
  // Live deployed (Netlify frontend + Vercel admin)
  process.env.FRONTEND_URL,         // https://<your-site>.netlify.app
  process.env.ADMIN_URL,            // https://indian-rentals-vert.vercel.app
  process.env.FRONTEND_URL_2,       // optional second frontend URL
].filter(Boolean);

// Regex for this project's Vercel deployments (main + preview branches)
// Matches: https://indian-rentals<anything>.vercel.app — not every Vercel site,
// since CORS here allows credentials.
const VERCEL_PATTERN = /^https:\/\/indian-rentals[a-z0-9-]*\.vercel\.app$/;

// Regex for Netlify deployments (main + preview branches)
const NETLIFY_PATTERN = /^https:\/\/[a-z0-9-]+\.netlify\.app$/;

// Regex for sslip.io / nip.io IP-based domains (e.g. https://31-97-202-194.sslip.io)
const SSLIP_PATTERN = /^https?:\/\/[\d-]+\.sslip\.io$/;

// Regex for custom domains passed via EXTRA_ORIGINS env (comma-separated)
const extraOrigins = (process.env.EXTRA_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // curl, Postman, mobile apps
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (extraOrigins.includes(origin)) return callback(null, true);
    if (VERCEL_PATTERN.test(origin)) return callback(null, true);
    if (NETLIFY_PATTERN.test(origin)) return callback(null, true);
    if (SSLIP_PATTERN.test(origin)) return callback(null, true);
    console.warn(`[CORS] Blocked origin: ${origin}`);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
// Handle preflight for every route (use regex — bare '*' breaks newer path-to-regexp)
app.options(/.*/, cors(corsOptions));
app.use(cookieParser());
app.use(morgan('combined'));

// Serve Static Uploads
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Logger setup (basic)
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Database Connection — with keepalive & auto-reconnect
const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 10000,
  heartbeatFrequencyMS: 30000,   // ping Atlas every 30s to stay connected
  maxIdleTimeMS: 60000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/indian_rentals', MONGO_OPTIONS);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⏳ Retrying in 5s...');
    setTimeout(connectDB, 5000); // retry instead of crashing
  }
};

// Auto-reconnect on unexpected disconnect
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected — reconnecting...');
  setTimeout(connectDB, 3000);
});
mongoose.connection.on('reconnected', () => console.log('✅ MongoDB reconnected'));

connectDB();

// ── Health check endpoint ─────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: 'ok',
    db: states[mongoose.connection.readyState] || 'unknown',
  });
});

// Routes
const { checkMaintenanceMode } = require('./middleware/maintenanceMiddleware');
app.use(checkMaintenanceMode);

const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);
const rentalRoutes = require('./routes/rentalRoutes');
app.use('/api/rentals', rentalRoutes);
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);
const kycRoutes = require('./routes/kycRoutes');
app.use('/api/kyc', kycRoutes);
const adminRoutes = require('./routes/adminRoutes'); // Admin Dashboard
app.use('/api/admin', adminRoutes);

const testimonialRoutes = require('./routes/testimonialRoutes'); // Testimonials
app.use('/api/testimonials', testimonialRoutes);

const cmsRoutes = require('./routes/cmsRoutes');
app.use('/api/cms', cmsRoutes);

const blogRoutes = require('./routes/blogRoutes');
app.use('/api/blog', blogRoutes);

const settingsRoutes = require('./routes/settingsRoutes');
app.use('/api/settings', settingsRoutes);

const couponRoutes = require('./routes/couponRoutes');
app.use('/api/coupons', couponRoutes);

const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/alerts', notificationRoutes);

const addonRoutes = require('./routes/addonRoutes');
app.use('/api/addons', addonRoutes);

const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reports', reportRoutes);

const emailTemplateRoutes = require('./routes/emailTemplateRoutes');
app.use('/api/email-templates', emailTemplateRoutes);

const smsTemplateRoutes = require('./routes/smsTemplateRoutes');
app.use('/api/sms-templates', smsTemplateRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


