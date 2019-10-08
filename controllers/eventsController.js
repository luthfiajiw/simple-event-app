const connDB = require('../models/connection')
const dateFormat = require('dateformat');
const passport = require('passport');

const { ensureAuthenticated } = require('../config/ensureAuth')
const EventModel = require('../models/event')

module.exports = function(app, siteTitle, baseURL) {
  // Render home page
  app.get('/home', ensureAuthenticated, (req, res) => {
    const query = new EventModel();

    // Get datas
    connDB.query(query.getEvents(), (err, result) => {
      res.render('pages/index', {
        siteTitle,
        pageTitle: 'Event List',
        items: result,
      });
    });
  });

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
    const query = new EventModel(req);

    connDB.query(query.postEvent(), (err, result) => {
      if (err) {
        console.log(err);
      }
      res.redirect(baseURL);
    });
  });

  // Get data
  app.get('/event/edit/:id', (req, res) => {
    const query = new EventModel(req);

    connDB.query(query.getEvent(), (err, result) => {
      result[0].start_date = dateFormat(result[0].start_date, "yyyy-mm-dd") + "T"+ dateFormat(result[0].start_date, "HH:MM");
      result[0].end_date = dateFormat(result[0].end_date, "yyyy-mm-dd") +"T"+ dateFormat(result[0].end_date, "HH:MM");

      // Render edit event page
      res.render('pages/edit-event', {
        siteTitle: siteTitle,
        pageTitle: 'Editing event : ' + result[0].name,
        item: result,
      });
    });
  });

  // Patch event
  app.post('/event/edit/:id', (req, res) => {
    const query = new EventModel(req);

    connDB.query(query.patchEvent(), (err, result) => {
      if (result.affectedRows) {
        res.redirect(baseURL)
      };
    });
  });

  // Delete Event
  app.get('/event/delete/:id', (req, res) => {
    const query = new EventModel(req);

    connDB.query(query.deleteEvent(), (err, result) => {
      if (result.affectedRows) {
        res.redirect(baseURL);
      };
    });
  });
};
