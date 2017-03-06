import express from 'express';
import passport from 'passport';
import { Strategy } from 'passport-github2'
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

passport.use(new Strategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: 'http://localhost:8080/auth/github/callback'
}, function(accesstoken, refreshToken, profile, done) {
    User.findOne({ gihubId: profile.id }, function(err, user) {
      
      if (err) return done(err);
      
      if (user) {
        console.log('done')
        return done(err, user);
      } else {
        user = new User({ 
          githubId: profile.id,
          username: profile.username,
          avatarUrl: profile._json.avatar_url,
          githubUrl: profile.profileUrl
        });
        console.log(user);
        user.save(function(err) {
          if (!err) {
            return done(err, user);
          }
        });
      }
    });
}))

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), ((req, res) => {
  //successfull authentication from github
  //make token 
  console.log('success', req.user);
  res.redirect('http://localhost:3000/account');
}));

export default router;