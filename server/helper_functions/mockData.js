import express from 'express';
import axios from 'axios';
import User from '../models/user';
import {
  getFrontEndCert,
  getBackEndCert,
  getDataVisCert
} from '../routes/getCerts';

const credentials = `client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET}`;

const fakeUsers = [
  'weezlo',
  'mmhansen',
  'forkerino',
  'Margaret2',
  'sjames1958gm',
  'JLuboff',
  '0x0936',
  'hkuz',
  'coymeetsworld',
  'hay-dee'
];

function getCertifications(username) {
  return axios.all([getFrontEndCert(username), getBackEndCert(username), getDataVisCert(username)])
  .then(axios.spread((frontCert, backCert, dataCert) => {
    if ((frontCert.request._redirectCount +
      backCert.request._redirectCount +
      dataCert.request._redirectCount) >= 3 ) {
      return false;
    } else {
      return {
        Front_End: frontCert.request._redirectCount === 0 ? true : false,
        Back_End: backCert.request._redirectCount === 0 ? true : false,
        Data_Visualization: dataCert.request._redirectCount === 0 ? true : false,
      }
    }
  }));
};

export function mockData() {
  var users = 0;
  fakeUsers.forEach(user => {
    axios.get(`https://api.github.com/users/${user}?${credentials}`)
    .then(response => {
      const { data } = response;
      User.find({ username: data.login }, (err, user) => {
        if (!user) {
          getCertifications(data.login).then(certs => {
            users++;
            User.create({
              githubId: data.id,
              username: data.login,
              avatarUrl: data.avatar_url,
              email: data.email,
              joinedOn: new Date(),
              githubData: {
                name: data.name,
                profileUrl: data.html_url,
                location: data.location,
                bio: data.bio,
                company: data.company,
                numPublicRepos: data.public_repos,
                numFollowers: data.followers,
                numFollowing: data.following
              },
              fccCerts: certs,
              verifiedUser: true
            }, ((err, newUser) => {
              if(err) console.log(err);
            }));
          }).catch(err => console.log(err));
        }
      });
    }).catch(err => console.log(err));
   });
  console.log(users.length > 0 ?
    `${users} mock users created in database` :
    `${fakeUsers.length} mock users exist in databse`
  );
};
