const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const eventsController = require('./controllers/eventsController');

const app = express();
// Parse all form data
app.use(bodyParser.urlencoded({ extended: true }));

// View engine
app.set('view engine', 'ejs');

// Import all related javascript and css files to inject on our app
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.static(__dirname + '/views'))

// Global site title and base url
const siteTitle = "Simple Event App"
const baseURL = "http://localhost:3000/"

// Controllers
eventsController(app, siteTitle, baseURL);

// Connect to the server
const server = app.listen(3000, () => {
  console.log('Your port is listening to 3000');
})
