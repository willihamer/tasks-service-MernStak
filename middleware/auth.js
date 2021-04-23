const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // read the header token
    const token = req.header('x-auth-token');

    // check if there is no token
    if (!token) {
        return res.status(401).json({ msg: 'You do not have permissions for this' });
    }

    // check the token
    try {
        const chipper = jwt.verify(token, process.env.SECRET);
        req.user = chipper.user;
        next();
    } catch (error) {
        return res.status(401).json({ msg: 'The token is not valid' });
    }
}