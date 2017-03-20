import express from 'express';
import axios from 'axios';
import User from '../models/user.js';

const router = express.Router();

router.get('/api/community', (req, res)  => {
    User.find({}, (err, users) => {
      if (!err) {
        res.send({ users });
      }
    });
});

export default router;
