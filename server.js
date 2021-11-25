const express = require("express");
const connectDB = require("./config/db");
const path = require('path');
const app = express();
const User = require('./models/User');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const Template = require('./models/Template');

app.use(express.static(path.join(__dirname + '/views')));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

//Connect Database
connectDB();

//Init Middleware
app.use(express.json({extended: false}))

//Define API Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/templates", require("./routes/api/templates"));

app.get("/login", (req, res) => {
    res.render('login');
});

 
app.get("/register", (req, res) => {
    res.render('register');
});

app.get("/journal", async (req, res) => {
    if (req.session.user) {
        res.render('journal');
    }
    res.redirect('/login');
});


app.get("/index", (req, res) => {
    if (req.session.user) {
        Template.find({user: req.session.user._id}, (err, templates) => {
            if(err) console.log(err);
            else {
                res.render('index', {templates: templates});
            }
        })
    } else {
        res.redirect('/login');
    }

});




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));