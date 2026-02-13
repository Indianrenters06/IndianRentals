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
app.use(cors());
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

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/indian_rentals');
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

connectDB();

// Routes
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


