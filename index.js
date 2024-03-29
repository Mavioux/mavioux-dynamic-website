let express = require('express');
let mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
var path = require('path'); 
let app = express();
const PORT = 5000;

//Passport Config
require('./config/passport')(passport);

//Set DB
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected!'))
    .catch(err =>  console.log(err));

//EJS       
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded( { extended: false }));

//Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  }))

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash Middleware
app.use(flash());

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Set the server to serve static pages from the public directory
app.use(express.static('public'));

//Routes
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));

app.listen(PORT, () => {
    console.log('Server started on localhost:' + PORT);
}).on('error', () => {
    console.log('Error deploying server - ');
});
