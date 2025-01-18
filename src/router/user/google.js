const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const router = express.Router();
const userModel = require('../../model/user/user');
require('dotenv').config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SEC,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        username: profile.name.familyName,
        password: "dummy123",
        email: profile.emails[0].value,
        isAdmin: false,
      };    

      try {
        let user = await userModel.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = await userModel.create(newUser);          
        } 
        return done(null, user);
      } catch (err) {
        console.error(err);
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id); 
      done(null, user);  
    } catch (err) {
      done(err, null);
    }
  });
  


router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/signup' }),
  async (req, res) => {
    req.session.user = req.user; 
    res.redirect('/home-page'); 
  }
);


router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Logout failed');
    res.redirect('/signup');
  });
});

module.exports = router; 

