import express from 'express';
import axios from 'axios';
import User from '../models/user';
import {
  getFrontEndCert,
  getBackEndCert,
  getDataVisCert
} from './getCerts';

const clientID = process.env.NODE_ENV === 'production'
  ? process.env.GITHUB_PROD_ID : process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.NODE_ENV === 'production'
  ? process.env.GITHUB_PROD_SECRET : process.env.GITHUB_SECRET;
const credentials = `client_id=${clientID}&client_secret=${clientSecret}`;

const skills = [
  'Angular',
  'Backbone',
  'C++',
  'CSS',
  'D3',
  'Ember',
  'HTML',
  'Java',
  'Javascript',
  'jQuery',
  'Less',
  'Meteor',
  'MongoDB',
  'Vue',
  'NodeJS',
  'PHP',
  'Python',
  'Rails',
  'React',
  'Ruby',
  'SASS',
  'SQL',
  'ThreeJS',
];

const interests = [
  'Behavior Driven Development',
  'Big Data / NOSQL',
  'Bitcoin / Digital Currency',
  'Data Science',
  'DevOps',
  'Game Development',
  'Internet of Things (IoT)',
  'Machine Learning / AI',
  'QA / Testing',
  'Test Driven Development',
  'UI Design',
  'User Experience',
  'Virtual / Augmented Reality',
];

const generate = (type, threshold) => {
  return type.reduce((accum, curr) => {
    return Math.random() < threshold ? accum.concat(curr) : accum;
  }, []);
};

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

const mentorshipSource = [
  'I want to help people learn to code.',
  'I am really good with D3 and can help people with that',
  'I know React really well and can mentor people in React',
  'I would love to help someone learn about serverside code',
  'I am very good at database design',
  'I would like to mentor someone in creating a full stack app',
  'I can help someone practice algorithms',
  'I would be happy to help someone practice interview questions',
  'I can advise someone on the job search',
  'I am very good with CSS and responsive design',
  'I know Redux very well and can help mentor someone on that',
  'I am really good with Express and Node.',
  'I am great at mobile app design',
  'I am very knowledgeable in Ruby and Rails',
  'I am a Python master and can help you with data science problems'
];

const mentorshipSkillsList = [];

(function randomizeMentorship() {
  while (mentorshipSource.length > 0) {
    var index = Math.floor(Math.random() * (mentorshipSource.length - 0));
    var bio = mentorshipSource.splice(index, 1);
    mentorshipSkillsList.push(bio);
  }
})();

const getCertifications = (username) => {
  return axios.all([getFrontEndCert(username), getBackEndCert(username), getDataVisCert(username)])
  .then(axios.spread((frontCert, backCert, dataCert) => {

    if (username === 'QuincyLarson' || username === 'P1xt') {
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

const logResult = (users, completed) => {
  if (users === fakeUsers.length) {
    console.log(`${users} out of ${fakeUsers.length} total users successfully pre-populated in database`);
  } else if (completed === fakeUsers.length) {
    console.log(`${completed} mock users exist in database`);
  };
};

(function() {
  let users = 0;
  let completed = 0;
  fakeUsers.forEach(user => {
    axios.get(`https://api.github.com/users/${user}?${credentials}`)
    .then(response => {
      const { data } = response;

      const isMentor = Math.random() > 0.5;
      let mentorshipSkills = '';

      if (isMentor) mentorshipSkills = mentorshipSkillsList.pop();

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
              mentorship: {
                isMentor,
                mentorshipSkills
              },
              skillsAndInterests: {
                coreSkills: generate(skills, 0.2),
                codingInterests: generate(interests, 0.5)
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
})();
