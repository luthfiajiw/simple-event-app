const Sequelize = require('sequelize');
const connection = require('../config/connection');
const Event = require('./Event')

const User = connection.define('user', {
  uuid: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
});

User.hasMany(Event);

module.exports = User;
