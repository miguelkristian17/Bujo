const express = require("express");
const app = express();
const router = express.Router();
const {validationResult, check} = require("express-validator")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const User = require("../../models/User")
var dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(bodyParser.json());
 
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//@route GET api/users
//desc Get all users
//@access Public
router.get("/", (req, res) => {
    User.find((err, users) => {
        if(err){
            res.send(err)
        } else {
            res.send(users)
        }
    })
});

//route POST api/users
//desc Create a user (REGISTER) and send back a token 
//@access Public
router.post('/', urlencodedParser,[
    check("name", "Please include a name").isLength({min: 3}),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 8 or more characters").isLength({min: 8}),
    check("confirmPassword", "Passwords do not match").custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error("Passwords do not match")
        }
        return true
    })
], async (req, res) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()){

        const alert = errors.array();
        return res.render('register', {alert} );    
    }

    const {name, email, password} = req.body

    try {
        let user = await User.findOne({email})

        if(user){
            return res.render('register', {alert: [{msg: "User already exists"}]})
        }

        user = new User({
            name,
            email,
            password,
        })

        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(password, salt)

        await user.save()
        req.session.user = user;


        return res.redirect('/index')
        } catch (err) {

        console.error(err.message)
        return res.status(500).send("Server Error")
    }
})
//@route GET api/users/:id
//desc Get a user by id 
//@access Public
router.get("/:id", (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(err){
            res.send(err)
        } else {
            res.send(user)
        }
    })
});

//@route DELETE api/users/:id
//desc Delete a user by id 
//@access Public
router.delete("/:id", (req, res) => {
    User.findByIdAndDelete(req.params.id, (err, user) => {
        if(err){
            res.send(err)
        } else {
            res.json("User Deleted Successfuly.")
        }
    })
});

module.exports = router;
