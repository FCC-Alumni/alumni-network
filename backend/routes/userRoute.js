import express from 'express';
const router = express.Router();

router.get('/api/user', (req, res) => {
  res.send(req.user);
});

export default router;