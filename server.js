const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const connection = require('./config/connection');
const eventsController = require('./controllers/eventsController');
const usersController = require('./controllers/usersController');

const app = express();

// Parse all form data
app.use(bodyParser.urlencoded({ extended: true }));

// View engine
app.set('view engine', 'ejs');

// Static Files
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.static(__dirname + '/views'))
app.use(express.static(__dirname + '/public'))

// Global site title and base url
const siteTitle = "Simple Event App"
const baseURL = "http://localhost:3000/"

// Express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));

// Connect flash
app.use(flash());

// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

// Passport config
require('./config/passport')(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Controllers
eventsController(app, siteTitle, baseURL);
usersController(app, siteTitle);

// Connect to the server
connection
  .authenticate()
  .then(() => {
    const server = app.listen(3000, () => {
      console.log('Your port is listening to 3000');
    })
  })
  .catch((err) => {
    console.log('Unable to connect to the database ', err);
  })
