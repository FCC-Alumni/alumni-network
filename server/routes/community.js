import express from 'express';
import axios from 'axios';
import { isAuthenticated } from './user';
import User from '../models/user.js';

const router = express.Router();

router.get('/api/community', isAuthenticated, (req, res)  => {
    User.find({}, (err, users) => {
      if (!err) {
        res.send({ users });
      }
    });
});

export default router;
