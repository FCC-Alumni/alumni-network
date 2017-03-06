import express from 'express';
import passport from 'passport';

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
  const { username } = req.body;
  console.log(`processing verification for ${username}`);
  // process verification with FCC here ...

  res.sendStatus(201);
});

export default router;
