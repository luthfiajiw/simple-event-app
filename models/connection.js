const mysql = require('mysql');

// Connect to mysql
// Host - when in production mode change this to your host
// User - username of the database
// Password - database password
// Database - the name of the database

const connDB = mysql.createConnection({
  host: 'localhost',
  user: 'newuser',
  password: 'password',
  database: 'event_app',
});

module.exports = connDB;
