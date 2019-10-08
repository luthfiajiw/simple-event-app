const Sequelize = require('sequelize');
const connection = require('../config/connection');

const Event = connection.define('event', {
  uuid: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  name: Sequelize.STRING,
  start_date: Sequelize.DATE,
  end_date: Sequelize.DATE,
  description: Sequelize.TEXT,
  location: Sequelize.TEXT,
});

module.exports = Event;
