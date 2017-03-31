import express from 'express';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2'
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as LinkedInStrategy } from 'passport-linkedin';
import Session from 'express-session';
import User from '../models/user';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.use(Session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) { done(null, user) });
passport.deserializeUser(function(user, done) { done(null, user) });

// GITHUB
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: 'http://localhost:8080/auth/github/callback'
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

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: 'http://localhost:3000/login' }), ((req, res) => {
  // successfull authentication from github
  res.redirect('http://localhost:3000/verify_account');
}));

// TWITTER
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: 'http://localhost:8080/connect/twitter/callback'
},
(token, tokenSecret, profile, done) => {
  return done(null, profile)
}));

router.get('/connect/twitter', passport.authorize('twitter'));

router.get('/connect/twitter/callback',
  passport.authorize('twitter', { failureRedirect: 'http://localhost:3000/dashboard/profile' }), ((req, res) => {
    const { user, account } = req;

    User.findOne({ githubId: user.githubId }, (err, user) => {
      if (!err) {
        user.social.twitter = account.username;
        user.save();
        res.redirect('http://localhost:3000/dashboard/profile');
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
  callbackURL: 'http://localhost:8080/connect/linkedin/callback'
},
(token, tokenSecret, profile, done) => {
  return done(null, profile)
}));

router.get('/connect/linkedin', passport.authorize('linkedin'));

router.get('/connect/linkedin/callback',
  passport.authorize('linkedin', { failureRedirect: 'http://localhost:3000/dashboard/profile' }), ((req, res) => {
    const { user, account } = req;

    User.findOne({ githubId: user.githubId }, (err, user) => {
      if (!err) {
        user.social.linkedin = account.displayName;
        user.save();
        res.redirect('http://localhost:3000/dashboard/profile');
        console.log('updated user with linkedin handle');
      } else {
        console.log(err);
      }
    });
}));

// logout user & redirect to home page
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('http://localhost:3000/');
});


export default router;
