const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id);
            if (!user) return res.status(401).json({ msg: 'Not authorized, user not found' });
            if (user.isBanned) return res.status(403).json({ msg: 'Your account is banned. Contact support.' });

            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ msg: 'Not authorized' });
        }
    }
    if (!token) res.status(401).json({ msg: 'No token, authorization denied' });
};

module.exports = { protect };