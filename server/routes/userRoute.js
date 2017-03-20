import express from 'express';
import passport from 'passport';
import axios from 'axios';
import User from '../models/user';
import { 
  getFrontEndCert, 
  getBackEndCert, 
  getDataVisCert 
} from '../helper_functions/getCerts';

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
        
        res.json({ user });
      });
      
    }
  });
});

router.post('/api/update-user', (req, res) => {
  const { user } = req.body;
  
  User.findById(user._id, (err, updatedUser) => {
    if (err) throw err;

    updatedUser.personal = user.personal;
    updatedUser.mentorship = user.mentorship;
    updatedUser.career = user.career;
    updatedUser.skillsAndInterests = user.skillsAndInterests;
    updatedUser.projects = user.projects;
    updatedUser.social = user.social;
    
    updatedUser.save();
    
    res.json({ updatedUser })
  });
})

export default router;
