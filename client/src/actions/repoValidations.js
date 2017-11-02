import axios from 'axios';

// GITHUB:
export const validateGithubRepo = (owner, repo) => {
  return axios.get(`https://api.github.com/repos/${owner}/${repo}`)
  .then((res) => isContributorGithub(owner, repo));
}

const isContributorGithub = (owner, repo) => {
  return axios.get(`https://api.github.com/repos/${owner}/${repo}/stats/contributors`)
  .then((res) => {
    return { contributorsList: res.data }
  });
}

export const searchGithubCommits = (owner, repo, user) => {
  return axios.get(`https://api.github.com/search/commits?q=repo:${owner}/${repo}+author:${user}`, {
    headers:  { 'Accept' : 'application/vnd.github.cloak-preview' }
  });
}

//GITLAB && BITBUCKET:
export const validateOtherRepos = (repo_path, host_site) => {
  return axios.post('/api/verify-other-repos', { host_site, repo_path })
  .then((res) => {
    if (res.data.validPublicRepo === 'true') {
      return true;
    } else {
      return false;
    }
  });
}
