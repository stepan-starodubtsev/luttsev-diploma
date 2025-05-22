const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {userToDto} = require("../dtos/user.dto");
require('dotenv').config();

exports.login = async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await User.findOne({where: {username}});

        if (!user) {
            return res.status(400).json({message: 'Invalid Credentials'});
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(400).json({message: 'Invalid Credentials'});
        }

        const payload = {user: userToDto(user)};

        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 36000}, (err, token) => {
            if (err) throw err;
            console.log(`Created token: ${token}`);
            res.json({token});
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getMe = async (req, res) => {
    try {
        if (!req.user || !req.user.user || !req.user.user.id) {
            return res.status(400).json({ message: 'User ID not found in token payload' });
        }
        const userId = req.user.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(userToDto(user));
    } catch (err) {
        console.error("GetMe error:", err.message);
        res.status(500).send('Server error');
    }
};
