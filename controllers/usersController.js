const passport = require('passport');
const bcrypt = require('bcryptjs');

const { ensureAuthLogin } = require('../config/ensureAuth');

// Load user model
const User = require('../models/User')

module.exports = function(app, siteTitle) {
  // Render Login Page
  app.get('/', ensureAuthLogin, (req, res) => {
    res.render('pages/login', {
      siteTitle,
      pageTitle: 'Login'
    });
  });

  // Render Register Page
  app.get('/register', ensureAuthLogin, (req, res) => {
    res.render('pages/register', {
      siteTitle,
      pageTitle: 'Register'
    });
  });

  // Login handle
  app.post('/', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/home',
      failureRedirect: '/',
      failureFlash: true,
    })(req, res, next);
  });

  // Register handle
  app.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please fill in all fields' });
    };

    // Check pass Match
    if (password !== password2) {
      errors.push({ msg: "Password don't match" });
    }

    // Check pass length
    if (password.length < 6) {
      errors.push({ msg: 'Password should be at least 6 characters'});
    };

    if (errors.length > 0) {
      res.render('pages/register', {
        errors,
        name,
        email,
        password,
        password2,
        siteTitle,
        pageTitle: 'Register',
      });
    } else {
      // Validation passed
      User.findAll({ where: { email: email } })
        .then((user) => {
          if (user.length > 0) {
            errors.push({ msg: 'Email is already registered' })
            res.render('pages/register', {
              errors,
              name,
              email,
              password,
              password2,
              siteTitle,
              pageTitle: 'Register',
            })
          } else {
            const newUser = User.build({
              name,
              email,
              password,
            })

            bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              // Set password to hashed
              newUser.password = hash;
              // Save user
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered');
                  res.redirect('/');
                })
                .catch(err => console.log(err))
            }));
          }
        })
        .catch(err => console.log(err))
    }
  })
};
