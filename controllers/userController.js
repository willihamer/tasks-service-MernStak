const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fs = require('fs');

exports.createUser = async (req, res) => {

    // check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // extract email and password
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'The user already exists' })
        }

        // create the new user
        user = User(req.body);

        // hash the password
        const salt = await bcryptjs.genSalt(10);

        user.password = await bcryptjs.hash(password, salt);

        // save user
        await user.save();

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
        return res.status(400).json({ msg: 'Error creating user' });


    }
}