const path = require('path'); // Import path
const express = require('express'); // server entry point
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const winston = require('winston');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS — allow local dev + deployed frontends
const allowedOrigins = [
  // Local dev (hardcoded + from .env)
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  process.env.LOCAL_FRONTEND_URL,   // http://localhost:3000
  process.env.LOCAL_ADMIN_URL,      // http://localhost:3001
  // Live deployed
  process.env.FRONTEND_URL,         // https://indian-rentals.vercel.app
  process.env.ADMIN_URL,            // https://indian-rentals-yy8s.vercel.app
].filter(Boolean);

// Regex for Vercel preview deployments
const VERCEL_PATTERN = /^https:\/\/indian-rent(als|ers)(-[a-z0-9]+)?\.vercel\.app$/;

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // curl, Postman, mobile
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (VERCEL_PATTERN.test(origin)) return callback(null, true);
    console.warn(`[CORS] Blocked: ${origin}`);
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
    uptime: Math.floor(process.uptime()) + 's',
    env: process.env.NODE_ENV || 'development',
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

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Temporary Debug Route for Email
const sendEmail = require('./utils/sendEmail');
app.get('/api/test-email', async (req, res) => {
  try {
    const testUser = process.env.EMAIL_USER;
    if (!testUser) throw new Error("EMAIL_USER env var is missing");

    // Remove the timeout logic for this test or make it longer to see real error
    console.log("Attempting to send test email to:", testUser);

    await sendEmail({
      email: testUser,
      subject: "Production Test Email",
      message: "If you get this, Brevo is working on Render!"
    });

    res.json({
      success: true,
      message: "Email sent successfully",
      config: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        // pass: process.env.EMAIL_PASS ? "******" : "MISSING"
      }
    });
  } catch (error) {
    console.error("Test Email Failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
      config: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
      }
    });
  }
});

// Error Handling Middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


