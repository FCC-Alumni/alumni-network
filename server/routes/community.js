import express from 'express';
import { isAuthenticated } from './passport';
import User from '../models/user';

const router = express.Router();

router.get('/api/community', isAuthenticated, (req, res)  => {
  User.find({}, (err, users) => {
    if (!err) {
      users = users.filter(user => {
        if (user.personal.email.private) {
          user.personal.email.email = null;
        }
        if (user.verifiedUser) {
          return user;
        } else {
          // delete unverified users from DB when populating community
          User.deleteOne({ _id: user._id }, (err) => {
            if (err) console.log('Failed to delete unverified user');
            else console.log(`Deleted unverified user ${user.username} from db`);
          });
        }
      });
      res.send({ users });
    } else {
      res.status(500);
    }
  });
});

export default router;
