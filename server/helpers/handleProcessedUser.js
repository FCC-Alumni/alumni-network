import User from '../models/user';

export default (certs, mongoId, req, res, username) => {
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
}
