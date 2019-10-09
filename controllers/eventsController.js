const connDB = require('../models/connection')
const dateFormat = require('dateformat');
const passport = require('passport');
const moment = require('moment');

const connection = require('../config/connection');
const { ensureAuthenticated } = require('../config/ensureAuth');
const Event = require('../models/Event');
const EventModel = require('../models/event');

module.exports = function(app, siteTitle, baseURL) {
  // Render home page
  app.get('/home', ensureAuthenticated, (req, res) => {
    // Get datas
    Event.findAll({ where: { userUuid: req.user.uuid } })
      .then(event => {
        res.render('pages/index', {
          siteTitle,
          pageTitle: 'Event List',
          items: event,
        });
      });
  });

  // Render add new event page
  app.get('/event/add', ensureAuthenticated, (req, res) => {
    res.render('pages/add-event.ejs', {
      siteTitle: siteTitle,
      pageTitle: 'Add New Event',
      items: '',
    });
  })

  // Post new event
  app.post('/event/add', (req, res) => {
    const newEvent = Event.build({
      userUuid: req.user.uuid,
      name: req.body.name,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      location: req.body.location.trim(),
      description: req.body.description.trim(),
    })

    newEvent.save().then(() => {
      res.redirect(baseURL);
    });
  });

  // Get data
  app.get('/event/edit/:uuid', ensureAuthenticated, (req, res) => {
    Event.findAll({ where: { uuid: req.params.uuid } })
      .then(event => {
        event[0].dataValues.start_date = dateFormat(event[0].dataValues.start_date, "yyyy-mm-dd") + "T"+ dateFormat(event[0].dataValues.tart_date, "HH:MM");
        event[0].dataValues.end_date = dateFormat(event[0].dataValues.end_date, "yyyy-mm-dd") +"T"+ dateFormat(event[0].dataValues.end_date, "HH:MM");
        // Render edit event page
        res.render('pages/edit-event', {
          siteTitle: siteTitle,
          pageTitle: 'Editing event : ' + event[0].dataValues.name,
          item: event[0].dataValues,
        });
      })
  });

  // Patch event
  app.post('/event/edit/:uuid', (req, res) => {
    const updatedEvent = {
      name: req.body.name,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      location: req.body.location.trim(),
      description: req.body.description.trim(),
    };

    Event.update(updatedEvent, { where: { uuid: req.params.uuid } })
      .then(() => {
        res.redirect(baseURL);
      });
  });

  // Delete Event
  app.get('/event/delete/:uuid', (req, res) => {
    Event.destroy({ where: { uuid: req.params.uuid } })
      .then(() => {
        res.redirect(baseURL);
      });
  });
};
