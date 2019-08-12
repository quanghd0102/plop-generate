'use strict';

const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');

console.log(process.env.FB_ID);
passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FB_ID || '555268428256971',
      clientSecret: process.env.FB_SECRET || '61db5360bb10072796784532dc16f018'
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

function passportFaceBook(request) {
  return new Promise((resolve, reject) => {
    passport.authenticate('facebook-token', (error, user, info) => {
      if (error) {
        resolve(error);
      }
      resolve(user);
    })(request);
  });
}

module.exports = { passportFaceBook };
