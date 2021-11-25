const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
var dotenv = require('dotenv');
const app = express();
const cookieParser = require('cookie-parser');
dotenv.config();


app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(bodyParser.json());
 
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(cookieParser());
// @route   GET api/auth
// @desc    Get logged in user info
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        console.log(req.cookies);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth 
// @desc    Authenticate user & get token (login)
// @access  Public 
router.post('/', urlencodedParser,[
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please include a password').exists()
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const alert = errors.array();
        console.log(alert);
        return res.render('login', { alert });
    }

    const { email, password } = req.body;
    try {
        // See if user exists with email
        let user = await User.findOne({ email });

        if (!user) {

            return res.render('login', {alert: [{msg: "Invalid Credentials"}]});
        }

        // Check if password matches 
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render('login',  {alert: [{msg: "Invalid Credentials"}]});
        }
        //save user in session
        req.session.user = user;
        return res.redirect('/index');

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/logout
// @desc    Logout user & clear session
// @access  Public
router.post('/logout', (req, res) => {
    req.session.destroy();
    return res.redirect('/login');
});

module.exports = router;
