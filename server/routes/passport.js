import express from 'express';
import passport from 'passport';
import mongoose from 'mongoose';
import GitHubStrategy from 'passport-github2'
import TwitterStrategy from 'passport-twitter';
import LinkedInStrategy from 'passport-linkedin';
import Session from 'express-session';
import User from '../models/user';
import dotenv from 'dotenv';
dotenv.config();

const APP_HOST = 'https://safe-cliffs-78756.herokuapp.com';
const CLIENT_URL = process.env.NODE_ENV === 'production' ? APP_HOST : 'http://localhost:3000';
const SERVER_URL = process.env.NODE_ENV === 'production' ? APP_HOST : 'http://localhost:8080';

// authentication middleware using express-session:
export const isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect(`${CLIENT_URL}/login`);
  }
}

const router = express.Router();

// this may work for session persistence:
var MongoStore = require('connect-mongo')(Session);
router.use(Session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 8 }, // 8 hours
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) { done(null, user) });
passport.deserializeUser(function(user, done) { done(null, user) });

// GITHUB
passport.use(new GitHubStrategy({
  clientID: process.env.NODE_ENV === 'production' ?
    process.env.GITHUB_PROD_ID : process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.NODE_ENV === 'production' ?
    process.env.GITHUB_PROD_SECRET : process.env.GITHUB_SECRET,
  callbackURL: `${SERVER_URL}/auth/github/callback`
}, (accesstoken, refreshToken, profile, done) => {
    User.findOne({ githubId: profile.id }, (err, user) => {

      if (err) return done(err);

      if (!user) {
        // new registration: create and save user in database
        user = new User({
          githubId: profile.id,
          username: profile.username,
          personal: {
            memberSince: new Date(),
            avatarUrl: profile._json.avatar_url,
            profileUrl: profile.profileUrl,
            displayName: profile._json.name ? profile._json.name : '',
            email: profile._json.email ? profile._json.email : '',
            location: profile._json.location ? profile._json.location : '',
            bio: profile._json.bio ? profile._json.bio : '',
          },
          career: {
            company: profile._json.company ? profile._json.company : '',
          }
        });
        user.save((err) => {
          if (!err) {
            return done(err, user);
          }
        });
      } else {
        // user registered previously and exists in database
        console.log('user already exists');
        return done(err, user);
      }
    });
}));

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: `${CLIENT_URL}/login` }), ((req, res) => {
  // successfull authentication from github
  res.redirect(`${CLIENT_URL}/verify_account`);
}));

// TWITTER
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: `${SERVER_URL}/connect/twitter/callback`
}, (token, tokenSecret, profile, done) => {
  return done(null, profile)
}));

router.get('/connect/twitter', isAuthenticated, passport.authorize('twitter'));

router.get('/connect/twitter/callback',
  passport.authorize('twitter', { failureRedirect: `${CLIENT_URL}/dashboard/preferences` }), ((req, res) => {
    const { user, account } = req;

    User.findOne({ githubId: user.githubId }, (err, updatedUser) => {
      if (!err) {
        updatedUser.social.twitter = account.username;
        updatedUser.save();
        res.redirect(`${CLIENT_URL}/dashboard/preferences`);
        console.log('updated user with twitter handle');
      } else {
        console.log(err);
      }
    });
}));

// LinkedIn
passport.use(new LinkedInStrategy({
  consumerKey: process.env.LINKEDIN_KEY,
  consumerSecret: process.env.LINKEDIN_SECRET,
  callbackURL: `${SERVER_URL}/connect/linkedin/callback`
}, (token, tokenSecret, profile, done) => {
  return done(null, profile)
}));

router.get('/connect/linkedin', isAuthenticated, passport.authorize('linkedin'));

router.get('/connect/linkedin/callback',
  passport.authorize('linkedin', { failureRedirect: `${CLIENT_URL}/dashboard/preferences` }), ((req, res) => {

    User.findOne({ githubId: req.user.githubId }, (err, updatedUser) => {
      if (!err) {
        updatedUser.social.linkedin = req.account.displayName;
        updatedUser.save();
        res.redirect(`${CLIENT_URL}/dashboard/preferences`);
        console.log('updated user with linkedin handle');
      } else {
        console.log(err);
      }
    });
}));

// logout user & redirect to home page
router.get('/logout', function(req, res){
  req.logout();
  res.redirect(`${CLIENT_URL}/`);
});

export default router;
