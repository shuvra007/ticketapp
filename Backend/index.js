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
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/', apiLimiter); 
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET','POST','PUT','DELETE'],
    credentials: true 
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.log("❌ MongoDB Connection Error:", err));

app.get('/', (req, res) => {
    res.send("Todo App Backend is Running...");
});

app.use('/api/auth', authRoutes);
app.use('/api/bookings', require('./routes/bookingRoutes'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: "Something wrong on the server!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is flying on port ${PORT}`);
});

module.exports = app;