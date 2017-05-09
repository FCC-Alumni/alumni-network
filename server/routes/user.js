import express from 'express';
import passport from 'passport';
import axios from 'axios';
import User from '../models/user';
import Chat from '../models/chat';
import PrivateChat from '../models/private-chat';
import { isAuthenticated } from './passport';
import {
  getFrontEndCert,
  getBackEndCert,
  getDataVisCert,
} from '../helpers/getCerts';
import {
  whitelist,
  honoraryMembers,
} from '../helpers/user-whitelist';

const router = express.Router();

// we post to avoid browser caching
router.post('/api/user', (req, res) => {
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
  // if user is whitelisted, use their alternate username:
  const username = whitelist[username] ? whitelist[username] : req.body.username;
  const { mongoId } = req.body;

  console.log(`processing verification for ${username}`);
  // process FCC verification...
  axios.all([getFrontEndCert(username), getBackEndCert(username), getDataVisCert(username)])
  .then(axios.spread((frontCert, backCert, dataCert) => {
    let totalRedirects =
      frontCert.request._redirectCount +
      backCert.request._redirectCount +
      dataCert.request._redirectCount;
    if (username.toLowerCase() in honoraryMembers || totalRedirects < 3) {
      return {
        Front_End: frontCert.request._redirectCount === 0 ? true : false,
        Back_End: backCert.request._redirectCount === 0 ? true : false,
        Data_Visualization: dataCert.request._redirectCount === 0 ? true : false,
      }
    } else {
      // NOTE: temporarily set to true to allow anyone in (for development):
      return false;
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
      /* we need to overwrite their session username too
        (only matters for whitelisted users) */
        req.user.username = username;
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

router.post('/api/update-user', (req, res) => {
  const { user } = req.body;

  User.findById(user._id, (err, updatedUser) => {
    if (!err) {
      updatedUser.personal = user.personal;
      updatedUser.mentorship = user.mentorship;
      updatedUser.career = user.career;
      updatedUser.skillsAndInterests = user.skillsAndInterests;
      updatedUser.projects = user.projects;
      updatedUser.social = user.social;
      updatedUser.save();
      res.json({ updatedUser })
    } else {
      res.status(401).json({ error: 'User could not be saved' });
    }
  });
});

router.post('/api/update-user-partial', (req, res) => {
  const { id, section, sectionData } = req.body;
  User.findById(id, (err, updatedUser) => {
    if (!err) {
      updatedUser[section] = sectionData;
      updatedUser.save();
      res.json({ updatedUser })
    } else {
      res.status(401).json({ error: 'User could not be saved' });
    }
  });
});

/* if a user deletes their account we need to remove them from chat and private chats as well
   because these rely on user data derived from the community in some places. And presumably
   we can assume if they want to remove their account they want their chat history removed as
   well. */
router.post('/api/delete-user', (req, res) => {
  const { username } = req.user;
  console.log('deleting', username)
  User.findByIdAndRemove(req.user._id, (err, user) => {
    if (!err) {
      console.log(`${username} deleted`);
      Chat.findOne({}, (err, chat) => {
        if (!err) {
          if (chat) {
            console.log(`${username} removed from Global Chat`);
            chat.history = chat.history.filter(m => m.author !== username);
            chat.markModified('history');
            chat.save();
          }
        }
        PrivateChat.remove({ members: username }, (err, history) => {
          if (!err) {
            console.log(`${username}'s Private Chat deleted`);
            req.session.destroy();
            res.sendStatus(200);
          };
        });
      });
    } else {
      res.sendStatus(500);
    }
  });
});

export default router;
