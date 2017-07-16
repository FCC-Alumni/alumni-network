import axios from 'axios';
import checkHonoraryMemberList from '../helpers/checkHonoraryMemberList';
import checkWhiteList from '../helpers/checkWhiteList';
import express from 'express';
import handleProcessedUser from '../helpers/handleProcessedUser';
import { isAuthenticated } from './passport';
import isCertified from '../helpers/processCerts';
import safeHandler from '../helpers/safeHandler';
import User from '../models/user';

const router = express.Router();

// we post to avoid browser caching
router.post('/api/user', (req, res) => {
  if (req.user) {
    User.findOne({ username: req.user.username }, (err, user) => {
      if (!err) {
        res.send(user);
      } else {
        res.sendStatus(401);
      }
    });
  } else {
    res.sendStatus(401);
  }
});

// pass async cb func through safeHandler for error handling
router.post('/api/verify-credentials', isAuthenticated,
  safeHandler(async function initiateVerification(req, res) {
    const { mongoId } = req.body;
    // if user is whitelisted, use their alternate username
    var username = await checkWhiteList(req.body.username);
    var isWhitelistedUser = !(username === req.body.username);
    // if user is honorary member, they will be let in w/o certs
    var isHonoraryMember = await checkHonoraryMemberList(username);
    // process FCC verification...
    isCertified(username, isHonoraryMember, isWhitelistedUser)
    .then(certs => {
      // update user with certs and correct status in DB
      handleProcessedUser(certs, mongoId, req, res, username);
    }).catch(err => res.status(500).send(err.message));
  })
);

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
      res.json({ updatedUser });
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
      res.json({ updatedUser });
    } else {
      res.status(401).json({ error: 'User could not be saved' });
    }
  });
});

router.post('/api/delete-user', (req, res) => {
  const { username } = req.user;
  console.log('deleting', username);
  User.findByIdAndRemove(req.user._id, (err, user) => {
    if (!err) {
      console.log(`${username} deleted`);
    } else {
      res.sendStatus(500);
    }
  });
});

router.post('/api/verify-gitter-user', (req, res) => {
  const { username } = req.body;
  axios.get(`https://gitter.im/${username}`)
  .catch((err) => {
    if (err.response.status === 404) {
      res.json({ isGitterUser: false });
    } else {
      res.json({ isGitterUser: true });
    }
  });
});

export default router;
