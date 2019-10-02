const express = require('express');
const http = require('http');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const moment = require('moment');
moment().format();

// Used for formatting dates
const dateFormat = require('dateformat');
let now = new Date();

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

// Connect to mysql
// Host - when in production mode change this to your host
// User - username of the database
// Password - database password
// Database - the name of the database

const con = mysql.createConnection({
  host: "localhost",
  user: "newuser",
  password: "password",
  database: "event_app",
});

// Global site title and base url
const siteTitle = "Simple Event App"
const baseURL = "http://localhost:3000/"

// When page is loaded, dafault page is loaded
// and data is being called from mysql database
// I also adding some javascripts and css styles
app.get('/', (req, res) => {
  // get the event list
  con.query("SELECT * FROM events ORDER BY start_date DESC", (err, result) => {
    res.render('pages/index', {
      siteTitle: siteTitle,
      pageTitle: 'Event List',
      items: result,
    });
  })
})

// Render add new event page
app.get('/event/add', (req, res) => {
  res.render('pages/add-event.ejs', {
    siteTitle: siteTitle,
    pageTitle: 'Add New Event',
    items: '',
  });
})

// Post new event
app.post('/event/add', (req, res) => {
  let query = "INSERT INTO `events` (name, start_date, end_date, description, location) VALUES (";
      query += " '"+req.body.name+"',";
      query += " DATE_FORMAT('" + req.body.start_date +"', '%Y-%m-%d %H:%i:%s'),";
      query += " DATE_FORMAT('" + req.body.end_date +"', '%Y-%m-%d %H:%i:%s'),";
      query += " '"+req.body.description+"',";
      query += " '"+req.body.location+"');"
  
  con.query(query, (err, result) => {
    res.redirect(baseURL);
  });
})

// Get event & render edit event page
app.get('/event/edit/:id', (req, res) => {
  // Get the record base on ID
  con.query("SELECT * FROM events WHERE id='"+req.params.id+"'", (err, result) => {
    result[0].start_date = dateFormat(result[0].start_date, "yyyy-mm-dd") + "T"+ dateFormat(result[0].start_date, "HH:MM");
    result[0].end_date = dateFormat(result[0].end_date, "yyyy-mm-dd") +"T"+ dateFormat(result[0].end_date, "HH:MM");
    console.log(result);
    
    res.render('pages/edit-event', {
      siteTitle: siteTitle,
      pageTitle: 'Editing event : ' + result[0].name,
      item: result,
    })
  })
})

// Connect to the server
const server = app.listen(3000, () => {
  console.log('Your port is listening to 3000');
})
