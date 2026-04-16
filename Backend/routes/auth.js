require('dotenv').config()
const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authLimiter, resetPasswordLimiter } = require('../middlewares/rateLimiter');
const multer = require('multer');
const { protect } = require('../middlewares/authMiddleware');
const path = require('path');
const sendEmail = require('../mailser');

// --- Cloudinary Setup Start ---
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { error } = require('console');

// Cloudinary Configuration (.env থেকে ডাটা নেবে)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// Cloudinary Storage Setup
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ticket_app_users', // Cloudinary-তে এই নামে ফোল্ডার তৈরি হবে
        allowed_formats: ['jpg', 'png', 'jpeg']
    }
});

const upload = multer({ storage: storage });
// --- Cloudinary Setup End ---


router.post('/register', upload.single('profilePic'), async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // লোকাল ফাইলের বদলে Cloudinary-এর লিংকের জন্য req.file.path ব্যবহার করা হয়েছে
        const profilePic = req.file ? req.file.path : "";

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            profilePic: profilePic,
            otp,
            otpExpires: Date.now() + 3600000
        });
        await newUser.save();
        await sendEmail(
            newUser.email,
            "Verify Your Account",
            otp,
            newUser.name,
            "verify"
        );

        res.status(201).json({ msg: "OTP sent to your email!" });
    } catch (err) {
        console.log(error)
        res.status(500).json({ error: err });
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ msg: "Account verified successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ msg: "User not found" });
        if (!user.isVerified) return res.status(401).json({ msg: "Please verify your email first" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, profilePic: user.profilePic, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/forgot-password', resetPasswordLimiter, async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 3600000;
    await user.save();
    await sendEmail(
        user.email,
        "Verify Your Account",
        otp,
        user.name,
        "verify"
    );

    res.json({ msg: "Reset OTP sent to email" });
});

router.post('/reset-password', resetPasswordLimiter, async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email, otp });

    if (!user || user.otpExpires < Date.now()) {
        return res.status(400).json({ msg: "Invalid OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    await user.save();

    res.json({ msg: "Password reset successful" });
});

router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: "User not found" });
        // Cleanly returning exact payload strictly matched to localStorage structures
        res.json({ id: user._id, name: user.name, email: user.email, profilePic: user.profilePic, role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/update-profile', protect, upload.single('profilePic'), async (req, res) => {
    try {
        const { name } = req.body;
        const updateData = { name };

        if (req.file) {
            // লোকাল ফাইলের বদলে Cloudinary-এর লিংকের জন্য req.file.path ব্যবহার করা হয়েছে
            updateData.profilePic = req.file.path;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true }
        ).select('-password');

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ msg: "Update failed", error: error.message });
    }
});

module.exports = router;