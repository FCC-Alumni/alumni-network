import express from 'express'
import axios from 'axios';

const router = express.Router();

router.post('/api/verify-other-repos', (req, res) => {
  const { repo_path } = req.body;
  
  axios.get(`https://bitbucket.org/${repo_path}`)
  .then((response) => {
    console.log(response.request._redirectCount)
    if (response.request._redirectCount === 0) {
      res.json({ validPublicRepo: 'true' });
    } else {
      res.json({ validPublicRepo: 'false' });
    }
  })
  .catch((err) => {
    if (err) res.json({ validPublicRepo: 'false' });
  });
  
});

export default router;
