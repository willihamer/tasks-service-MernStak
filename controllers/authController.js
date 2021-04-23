const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


exports.authUser = async (req, res) => {
    // check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // extract email and password
    const { email, password } = req.body;

    try {
        // check the user is alreadY registered
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'the user or password is incorrect' });
        }

        // check the password
        const correctPass = await bcryptjs.compare(password, user.password);

        if (!correctPass) {
            return res.status(400).json({ msg: 'the user or password is incorrect' });
        }

        // Create and sign the JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;
            return res.json({ token });
        })

    } catch (error) {
        console.log(error);
    }
}

// get authenticated user
exports.userAuthenticated = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ user });
    } catch (error) {
        res.status(500).json({ msg: 'there was an error' })
    }
}