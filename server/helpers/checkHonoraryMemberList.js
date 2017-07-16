import HonoraryMember from '../models/honoraryMember';

export default (username) => {
  return new Promise(resolve => {
    HonoraryMember.findOne({ username: username.toLowerCase() },
    (err, user) => {
      if (err) {throw err;}
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }).catch(err => console.error(err));
};
