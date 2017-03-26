import express from 'express';
import passport from 'passport';
import axios from 'axios';
import _merge from 'lodash/merge';
import User from '../models/user';
import {
  getFrontEndCert,
  getBackEndCert,
  getDataVisCert
} from '../helpers/getCerts';

const router = express.Router();

// authentication middleware using express-session:
export const isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
}

router.get('/api/user', (req, res) => {
  if (req.user) {
    User.findOne({ username: req.user.username }, (err, user) => {
      if (!err) {
        res.send(user)
      } else {
        res.sendStatus(401);
      }
    });
  } else {
    res.sendStatus(401);
  }
});

router.post('/api/verify-credentials', isAuthenticated, (req, res) => {
  const { username, mongoId } = req.body;

  console.log(`processing verification for ${username}`);

  // process FCC verification...
  axios.all([getFrontEndCert(username), getBackEndCert(username), getDataVisCert(username)])
  .then(axios.spread((frontCert, backCert, dataCert) => {
    if ((frontCert.request._redirectCount +
      backCert.request._redirectCount +
      dataCert.request._redirectCount) >= 3 ) {
      // NOTE: change back to false:
      return true;
    } else {
      return {
        Front_End: frontCert.request._redirectCount === 0 ? true : false,
        Back_End: backCert.request._redirectCount === 0 ? true : false,
        Data_Visualization: dataCert.request._redirectCount === 0 ? true : false,
      }
    }
  })).then(certs => {
    if (!certs) {
      // user not verified, res with error
      User.findById(mongoId, (err, user) => {
        if (err) throw err;

        user.verifiedUser = false;
        user.save();

        res.status(401).json({ error: 'User cannot be verified' });
      });
    } else {
      // verified user, proceed
      User.findById(mongoId, (err, user) => {
        if (err) throw err;

        user.username = username;
        user.fccCerts = certs;
        user.verifiedUser = true;
        user.save();

        req.user.verifiedUser = true;
        req.user.fccCerts = certs;

        res.json({ user });
      });

    }
  });
});

router.post('/api/update-user', isAuthenticated, (req, res) => {
  const updatedUser = req.body.user;
  User.findById(updatedUser._id, (err, user) => {
    if (!err) {
      _merge(user, updatedUser);
      user.save()
      res.json({ updatedUser: user });
    } else {
      res.status(401).json({ error: 'User could not be saved' });
    };
  });
});

export default router;
