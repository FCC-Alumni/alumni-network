import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import { Strategy } from 'passport-github2'
import Session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use(Session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Strategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: 'http://localhost:8080/auth/github/callback'
}, function(accesstoken, refreshToken, profile, cb){
  //find user in database
  return cb(done, null);
}));

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', passport.authenticate('github'), ((req, res) => {
  //successfull authentication from github
  //make token 
  res.send('Successful login');
}))

app.listen(8080, () => console.log('Server is running on localhost:8080'));