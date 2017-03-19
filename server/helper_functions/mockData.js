import express from 'express';
import axios from 'axios';
import User from '../models/user';

export function mockData(){
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
fakeUsers.forEach((user) => {
  axios.get(`https://api.github.com/users/${user}?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_SECRET}`)
  .then((res) => {
    const data = res.data;

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
    }
  }, ((err, newUser) => {
    if(err) console.log(err);
      }));

  }).catch((err) => console.log(err));
 });
}
