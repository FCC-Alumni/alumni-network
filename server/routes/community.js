import express from 'express';
import axios from 'axios';
import { isAuthenticated } from './passport';
import User from '../models/user';
import Chat from '../models/chat';

const router = express.Router();

router.get('/api/community', isAuthenticated, (req, res)  => {
    User.find({}, (err, users) => {
      if (!err) {
        res.send({ users });
      } else {
        res.status(500);
      }
    });
});

export default router;
