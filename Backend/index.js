const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { apiLimiter } = require('./middlewares/rateLimiter');
const authRoutes = require('./routes/auth');
const path = require('path');

dotenv.config();
const app = express();
app.set('trust proxy', 1);

// 🌟 FIX 1: CORS সবসময় সবার ওপরে থাকবে
app.use(cors({
    origin: process.env.FRONTEND_URL, // .env তে আপনার ফ্রন্টএন্ড URL আছে কিনা শিওর হোন
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🌟 FIX 2: Vercel-এর জন্য Serverless Database Connection Logic
let isConnected = false; // ডাটাবেস কানেকশন ক্যাশ করে রাখার জন্য

const connectDB = async () => {
    if (isConnected) return; // আগে থেকে কানেক্টেড থাকলে নতুন করে করবে না

    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log("✅ MongoDB Connected Successfully");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
    }
};

// প্রতিটি API কল হওয়ার ঠিক আগে ডাটাবেস কানেকশন চেক করবে
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Middleware for rate limiting
app.use('/api/', apiLimiter);

// Test Route
app.get('/', (req, res) => {
    res.send("ECE Ticket App Backend is Running Smoothly... 🚌✈️");
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: "Something wrong on the server!" });
});

// 🌟 FIX 3: Vercel-এ পোর্ট ক্ল্যাশ এড়ানোর জন্য কন্ডিশন
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server is flying on port ${PORT}`);
    });
}

// Vercel Serverless-এর জন্য এই এক্সপোর্টটি বাধ্যতামূলক
module.exports = app;