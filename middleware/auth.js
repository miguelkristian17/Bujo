const jwt = require('jsonwebtoken');
var dotenv = require('dotenv');
dotenv.config();

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    const secret = process.env.JWT_SECRET;

    if (!token) {
        return res.render( 'login', {alert: [{msg: "Please log in"}]});
    }

    try {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.render( 'login',{ alert: 'Please log in ' });
            } else {
            req.user = decoded.user;
            
            next();
            }
        });
    } catch (err) {
        res.status(500).json({ alert: 'Server error' });
    }
};

