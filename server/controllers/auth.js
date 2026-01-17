const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    try {
        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.registerInitialAdmin = async (req, res) => {
    // HIDDEN ROUTE JUST FOR SEEDING FIRST ADMIN
    const { name, email, password, role } = req.body;
    try {
        const user = await User.create({ name, email, password, role });
        sendTokenResponse(user, 201, res);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true
    };

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};
