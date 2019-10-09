const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load user model
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({
      usernameField: 'email'
    }, (email, password, done) => {
      // Match user
      User.findAll({ where: { email: email }})
        .then(user => {
          if (user.length === 0) {
            return done(null, false, { message: 'That email is not registered' });
          };

          // Match password
          bcrypt.compare(password, user[0].dataValues.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password incorrect' });
            }
          });
        })
        .catch(err => console.log(err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user[0].dataValues.uuid);
  });

  passport.deserializeUser((uuid, done) => {
    User.findAll({ where: { uuid: uuid } })
      .then(user => {
        done(null, user[0].dataValues)
      })
  })
};
