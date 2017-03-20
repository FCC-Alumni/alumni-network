import express from 'express';
import axios from 'axios';
import User from '../models/user';
import {
  getFrontEndCert,
  getBackEndCert,
  getDataVisCert
} from './getCerts';

const credentials = `client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET}`;

const fakeUsers = [
  'quincylarson',
  'berkeleytrue',
  'weezlo',
  'mmhansen',
  'forkerino',
  'Margaret2',
  'sjames1958gm',
  'JLuboff',
  '0x0936',
  'hkuz',
  'coymeetsworld',
  'hay-dee',
  'p1xt',
  'bengitter',
  'josh5231',
];

function getCertifications(username) {
  return axios.all([getFrontEndCert(username), getBackEndCert(username), getDataVisCert(username)])
  .then(axios.spread((frontCert, backCert, dataCert) => {

    if (username === 'quincylarson') {
      return {
        Front_End: true,
        Back_End: true,
        Data_Visualization: true
      };
    };

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

function logResult(users, completed) {
  if (users === fakeUsers.length) {
    console.log(`${users} out of ${fakeUsers.length} total users successfully pre-populated in database`);
  } else if (completed === fakeUsers.length) {
    console.log(`${completed} mock users exist in database`);
  };
};

export function mockData() {
  let users = 0;
  let completed = 0;
  fakeUsers.forEach(user => {
    axios.get(`https://api.github.com/users/${user}?${credentials}`)
    .then(response => {
      const { data } = response;
      User.findOne({ username: data.login }, (err, user) => {
        if (!user) {
          getCertifications(data.login).then(certs => {
            console.log(`${data.login} created in database.`);
            users++;
            completed++;
            logResult(users, completed);
            User.create({
              githubId: data.id,
              username: data.login,
              fccCerts: certs,
              verifiedUser: true,
              personal: {
                memberSince: new Date(),
                avatarUrl: data.avatar_url,
                profileUrl: data.Url,
                displayName: data.name ? data.name : '',
                email: data.email ? data.email : '',
                location: data.location ? data.location : '',
                bio: data.bio ? data.bio : '',
              },
              career: {
                company: data.company ? data.company : '',
              }
            }, ((err, newUser) => {
              if(err) console.log(err);
            }));
          }).catch(err => console.log(err));
        } else {
          completed++;
          logResult(users, completed);
        };
      });
    }).catch(err => console.log(err));
   });
};
