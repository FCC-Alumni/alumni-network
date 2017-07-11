import axios from 'axios';

// GITHUB:
export function validateGithubRepo(owner, repo) {
  return axios.get(`https://api.github.com/repos/${owner}/${repo}`)
  .then((res) => isContributorGithub(owner, repo));
}

function isContributorGithub(owner, repo) {
  return axios.get(`https://api.github.com/repos/${owner}/${repo}/stats/contributors`)
  .then((res) => {
    return { contributorsList: res.data }
  });
}

export function searchGithubCommits(owner, repo, user) {
  return axios.get(`https://api.github.com/search/commits?q=repo:${owner}/${repo}+author:${user}`, {
    headers:  { 'Accept' : 'application/vnd.github.cloak-preview' }
  });
}

//GITLAB && BITBUCKET:
export function validateOtherRepos(repo_path, host_site) {
  return axios.post('/api/verify-other-repos', { host_site, repo_path })
  .then((res) => {
    if (res.data.validPublicRepo === 'true') {
      return true;
    } else {
      return false;
    }
  });
}
