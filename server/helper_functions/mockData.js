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
  fakeUsers.forEach(user => {
    axios.get(`https://api.github.com/users/${user}?${credentials}`)
    .then(response => {
      const { data } = response;
      User.findOne({ githubId: data.id }, (err, user) => {
        if (!user) {
          getCertifications(data.login).then(certs => {
            console.log(`mock user ${data.login} added to database`);
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
        }
      });
    }).catch(err => console.log(err));
  });
};
