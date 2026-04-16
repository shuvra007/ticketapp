const User = require('../models/User');

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(401).json({ message: "Not authorized as an admin" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { isAdmin };
