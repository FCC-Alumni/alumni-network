import axios from 'axios';
import express from 'express';

const router = express.Router();

router.post('/api/verify-other-repos', (req, res) => {
  const { repo_path, host_site } = req.body;

  axios.get(`${host_site}/${repo_path}`)
  .then((response) => {
    if (response.request._redirectCount === 0) {
      res.json({ validPublicRepo: 'true' });
    } else {
      res.json({ validPublicRepo: 'false' });
    }
  })
  .catch((err) => {
    if (err) {res.json({ validPublicRepo: 'false' });}
  });

});

export default router;
