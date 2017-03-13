import axios from 'axios';

export function validateRepo(owner, repo) {
  return axios.get(`https://api.github.com/repos/${owner}/${repo}`)
  .then((res) => isContributor(owner, repo));
}

function isContributor(owner, repo) {
  return axios.get(`https://api.github.com/repos/${owner}/${repo}/stats/contributors`)
  .then((res) => {
    return { contributorsList: res.data }
  });
}

export function searchCommits(owner, repo, user) {
  return axios.get(`https://api.github.com/search/commits?q=repo:${owner}/${repo}+author:${user}`, {
    headers:  { 'Accept' : 'application/vnd.github.cloak-preview' }
  });
}
  
  
  

  