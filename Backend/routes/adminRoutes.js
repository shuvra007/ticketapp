const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

// Get Dashboard Analytics
router.get('/analytics', protect, isAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find();

        // aggregate stats
        const totalTickets = bookings.reduce((sum, b) => sum + b.seatIds.length, 0);
        const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

        // aggregate popular routes
        const routeCount = {};
        bookings.forEach(b => {
            const r = `${b.from} - ${b.to}`;
            routeCount[r] = (routeCount[r] || 0) + b.seatIds.length;
        });

        const popularRoutes = Object.keys(routeCount).map(r => ({
            name: r,
            ticketsSold: routeCount[r]
        })).sort((a, b) => b.ticketsSold - a.ticketsSold).slice(0, 5);

        res.json({ totalTickets, totalRevenue, popularRoutes });

    } catch (error) {
        res.status(500).json({ message: "Analytics fetch failed", error: error.message });
    }
});

// Validate Ticket API
router.post('/validate-ticket', protect, isAdmin, async (req, res) => {
    try {
        const { ticketId } = req.body;
        // Search the booking using provided ID
        const ticket = await Booking.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({ message: "Invalid or Fake Ticket!" });
        }

        const status = ticket.isCheckedIn ? "Already Used" : "Valid";
        res.json({ valid: true, status, ticketDetails: ticket });

    } catch (err) {
        res.status(500).json({ message: "Error validating ticket", error: err.message });
    }
});

// Phase 1: User & Role Management APIs
// 1. Get all users
router.get('/users', protect, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ _id: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed to load users", error: err.message });
    }
});

// 2. Change Role
router.put('/users/:id/role', protect, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.role = req.body.role;
        await user.save();
        res.json({ message: "Role updated successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Error updating role", error: err.message });
    }
});

// 3. Toggle Ban Status
router.put('/users/:id/ban', protect, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.isBanned = !user.isBanned;
        await user.save();
        res.json({ message: `User ${user.isBanned ? 'Banned' : 'Unbanned'} successfully`, user });
    } catch (err) {
        res.status(500).json({ message: "Error toggling ban status", error: err.message });
    }
});

module.exports = router;
