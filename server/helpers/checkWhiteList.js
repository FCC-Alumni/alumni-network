import WhiteListedUser from '../models/whitelistedUser';

export default (githubUsername) => {
  return new Promise(resolve => {
    WhiteListedUser.findOne({ githubUsername },
      (err, user) => {
      if (err) throw err;
      if (user) {
        resolve(user.fccUsername);
      } else {
        resolve(githubUsername);
      }
    });
  }).catch(err => console.log(err));
}
