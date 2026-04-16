const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Auth থেকে আসবে
    busId: { type: String, required: true },  // যেমন: CSE, EEE
    journeyDate: { type: String, required: true }, // Format: YYYY-MM-DD
    from: { type: String, required: true },
    to: { type: String, required: true },
    seatIds: [{ type: Number, required: true }],
    busType: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    
    // New fields for Coupon & Payment
    couponApplied: { type: String, default: "" },
    paymentStatus: { type: String, default: "Pending" },
    transactionId: { type: String, default: "" },

    isCheckedIn: { type: Boolean, default: false },

    bookedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);