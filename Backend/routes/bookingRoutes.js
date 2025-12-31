const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect } = require('../middlewares/authMiddleware');
const sendEmail = require('../mailser');
const User = require('../models/User'); // আপনার User মডেলটি ইমপোর্ট করুন
router.get('/availability', async (req, res) => {
    try {
        const { busId, date, from, to } = req.query;
        
        // ওই নির্দিষ্ট বাসের ওই তারিখের সব বুকিং খুঁজে বের করা
        const bookings = await Booking.find({ busId, journeyDate: date, from, to });
        
        // সব বুকিং থেকে সিট আইডিগুলো একটা অ্যারেতে নেওয়া
        let bookedSeats = [];
        bookings.forEach(b => {
            bookedSeats = [...bookedSeats, ...b.seatIds];
        });

        res.json({ bookedSeats });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

router.post('/book-seats', protect, async (req, res) => {
    console.log("User ID:", req.user.id);
    console.log("Body:", req.body);

    try {
        // ১. ফ্রন্টএন্ড থেকে route আসছে, তাই সেটিকে split করে from/to নিতে হবে অথবা সরাসরি route ব্যবহার করতে হবে।
        // আপনার ফ্রন্টএন্ড কোডে route: `${from} to ${to}` এভাবে আছে।
        const { busId, seatIds, journeyDate, route, totalAmount } = req.body;
        
        // রুট থেকে from এবং to আলাদা করা (যদি আপনার মডেলে from/to আলাদা থাকে)
        const [from, to] = route.split(' to ');

        const userId = req.user.id; // 'const' বা 'let' যোগ করতে হবে

        // ২. ডাবল বুকিং চেক করার সময় একই ফিল্ড ব্যবহার করুন
        const existingBookings = await Booking.find({ 
            busId, 
            journeyDate, 
            from, 
            to 
        });

        let alreadyBooked = [];
        existingBookings.forEach(b => {
            alreadyBooked = [...alreadyBooked, ...b.seatIds];
        });

        const isTaken = seatIds.some(id => alreadyBooked.includes(id));
        if (isTaken) {
            return res.status(400).json({ message: "দুঃখিত, এক বা একাধিক সিট ইতিমধ্যে বুক হয়ে গেছে!" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "ইউজার খুঁজে পাওয়া যায়নি!" });
        }
                const newBooking = new Booking({
            userId,
            busId,
            seatIds,
            journeyDate,
            from, 
            to,
            totalAmount,
            busType: req.body.busType || "Standard" // যদি ফ্রন্টএন্ড থেকে না আসে তবে ডিফল্ট
        });

        await newBooking.save();
        await sendEmail(
            user.email, 
            "RUET Transit - Booking Confirmation", 
            newBooking, // পুরো অবজেক্টটি otp প্যারামিটার হিসেবে যাবে
         user.name, 
            "booking"
        );
    
        res.status(201).json({ message: "বুকিং সফল হয়েছে!", booking: newBooking });

    } catch (err) {
        console.error("Booking Error:", err.message);
        res.status(500).json({ message: "বুকিং ব্যর্থ হয়েছে", error: err.message });
    }
});
module.exports = router;