// Routes to authenticate users
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController')
const auth = require('../middleware/auth');


// creating an user
// api/auth
router.post('/',
    authController.authUser
);


// Get authenticated user
router.get('/',
    auth,
    authController.userAuthenticated
)

module.exports = router;