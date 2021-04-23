// Routes to create users
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {check} = require('express-validator');
// creating an user
// api/users

router.post('/', [
    check('name', 'The name is mandatory').not().isEmpty(),
    check('email', 'Add an email').isEmail(),
    check('password', 'The pass must have 6 characters').isLength({min: 6}),

],userController.createUser);

module.exports = router;