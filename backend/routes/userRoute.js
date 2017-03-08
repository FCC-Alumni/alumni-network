import express from 'express';
import passport from 'passport';
import axios from 'axios';
import User from '../models/user';
import { 
  getFrontEndCert, 
  getBackEndCert, 
  getDataVisCert 
} from './getCerts';

const router = express.Router();

// example of an authentication middleware:
function isAuthenticated(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
}

router.get('/api/user', (req, res) => {
  res.send(req.user);
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
      return false;
    } else {
      return {
        frontEnd: frontCert.request._redirectCount === 0 ? true : false,
        backEnd: backCert.request._redirectCount === 0 ? true : false,
        dataVis: dataCert.request._redirectCount === 0 ? true : false,
      }
    }
  })).then(certs => {
    if (!certs) {
      // user not verified, res with error
      User.findById(mongoId, (err, user) => {
        if (err) throw err;
        
        user.fccUsername = username;
        user.verifiedUser = false;
        user.save();
        
        res.status(401).json({ error: 'User cannot be verified' });
      });
    } else {
      // verified user, proceed
      User.findById(mongoId, (err, user) => {
        if (err) throw err;
        
        user.fccCerts = certs;
        user.fccUsername = username;
        user.verifiedUser = true;
        user.save();
        
        res.json({ user });
      });
    }
  });
});

export default router;
