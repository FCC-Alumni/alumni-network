import React from 'react';
import { isEmpty, indexOf } from 'lodash';
import propTypes from 'prop-types';
import styled from 'styled-components';
import { connectScreenSize } from 'react-screen-size';
import repoHosts from '../../../../../assets/dropdowns/repoHosts';
import { mapScreenSizeToProps } from '../../../Community/UserCard';
import RepoListItem from './RepoListItem';
import RepoInput from './RepoInput';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';

import {
  validateGithubRepo as validateRepo,
  searchGithubCommits,
  validateOtherRepos as validateOther
} from '../../../../../actions/repoValidations';

/*
TODO:
  1) Refactor addItem() code
*/

export const Container = styled.div`
  margin: 16px 0 !important;
`;

class RepoContainer extends React.Component {
  state = {
    item: '',
    error: {},
    icon: 'github',
    items_list: [],
    isLoading: false,
    label: 'https://github.com/'
  }

  componentWillMount() {
    const items = this.props.prePopulateList;
    if (items.length > 0) {
      this.setState({ items_list: items });
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  componentWillReceiveProps (nextProps) {
    console.log(nextProps)
  }

  addItem = () => {
    this.setState({ isLoading: true });
    const { item, items_list, label } = this.state;
    const [ namespace, repo ] = item.split('/');
    // check if nothing entered
    if (!item) {
      this.setState({ isLoading: false });
      return;
    }
    // check if format is valid: NAMESPACE/REPO
    if (!this.isFormatValid(repo)) {
      return;
    }
    // check if item already exists on list
    if (this.repoAlreadyAdded(item, items_list, label)) {
      return;
    }
    // HANDLE GITLAB:
    if (label === 'https://gitlab.com/' && this.isValidGitlabNaming(item, namespace, repo)) {
      this.validateOtherRepos('GitLab');
    }
    // HANDLE BITBUCKET:
    if (label === 'https://bitbucket.org/' && this.isValidBitbucketNaming(item, repo)) {
      this.validateOtherRepos('BitBucket');
    }
    // HANDLE GITHUB:
    if (label === 'https://github.com/' && this.isValidGithubNaming(item, namespace, repo)) {
      this.validateGithubRepos();
    }
  }

  editItem = (item) => {
    const items_list = this.spliceList(item);
    this.setState({ items_list, item: item.item });
  }

  handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      this.addItem();
    }
  }

  handleChange = (e) => {
    this.setState({ item: e.target.value, error: '' });
  }

  handleLabelChange = (e) => {
    let icon;
    if (e.target.innerText === 'https://github.com/') icon = 'github'
    if (e.target.innerText === 'https://gitlab.com/') icon = 'gitlab'
    if (e.target.innerText === 'https://bitbucket.org/') icon = 'bitbucket'
    this.setState({ label: e.target.innerText, icon });
  }

  isFormatValid = (repo) => {
    if (!repo) {
      this.setState({
        error: {
          header: `Invalid entry. Plese enter a valid repo
                   in the format: namespace/repo.`,
        },
        item: '',
        isLoading: false
      });
      return false;
    }
    return true;
  }

  isValidGitlabNaming = (item, namespace, repo) => {
    if (
      /(^-)|(\.((git)|(atom))?$)/.test(repo) ||
      /(^-)|(\.((git)|(atom))?$)/.test(namespace) ||
      !/[\d\w-.]+\/[\d\w-.]+\/?/.test(item)
    ) {
      this.setState({
        error: {
          header:    'Please enter a valid GitLab repository path: namespace/repo',
          repo:      `Namespace: This value can only contain letters, digits, '_', '-'
                      and '.'. Cannot start with '-' or end in '.', '.git' or '.atom'`,
          namespace: `Repo: This value can only contain letters, digits, '_', '-'
                      and '.'. Cannot start with '-' or end in '.', '.git' or '.atom'`
        },
        item: '',
        isLoading: false
      });
      return false;
    } else {
      return true;
    }
  }

  isValidBitbucketNaming = (item, repo) => {
    if ((repo.length === 1 && /^\./.test(repo)) || !/[\d\w-]+\/[\d\w-.]+\/?/.test(item)) {
      this.setState({
        error: {
          header:    'Please enter a valid BitBucket repository path: namespace/repo',
          repo:      `Repo: This value must contain only ASCII letters, numbers,
                      dashes, underscores and periods.`,
          namespace: `Namespace: This value must contain only ASCII letters,
                      numbers, dashes and underscores.`
        },
        item: '',
        isLoading: false
      });
      return false;
    } else {
      return true;
    }
  }

  isValidGithubNaming = (item, namespace, repo) => {
    if (
      // GitHub naming conventions:
      /^\./.test(repo) === '.' ||
      /^-|--|-$/.test(namespace) ||
      !/[\d\w-.]+\/[\d\w-]+\/?/.test(item)
    ) {
      this.setState({
        error: {
          header:    'Please enter a valid GitHub repository path: namespace/repo',
          repo:      `Repo: This value may only contain alphanumeric characters,
                      periods, and hyphens, and cannot begin with a period.`,
          namespace: `Namespace: This value may only contain alphanumeric
                      characters or single hyphens, and cannot begin or
                      end with a hyphen.`
        },
        item: '',
        isLoading: false
      });
      return false;
    }
    return true;
  }

  repoAlreadyAdded = (item, items_list, label) => {
    for (var obj of items_list) {
      if (obj.item.toLowerCase() === item.toLowerCase() && obj.label === label) {
        this.setState({
          error: {
            header: 'You have already added this repo to your list!',
          },
          item: '',
          isLoading: false
        });
        return true;
      }
    }
    return false;
  }

  saveRepoList = (items_list) => {
    this.props.saveChanges();
    // also save list to parent component for proper rendering
    this.props.saveListToParent(items_list);
  }

  validateOtherRepos = (hostSite) => {
    const { item, items_list, label } = this.state;
    const hostUrl = hostSite === 'BitBucket'
      ? 'https://bitbucket.org/'
      : 'https://gitlab.com/';
    validateOther(item, hostUrl).then((res) => {
      if (res) {
        items_list.push({item, label});
        this.setState({
          items_list,
          item: '',
          isLoading: false
        }, () => this.saveRepoList(items_list));
      } else {
        this.setState({
          error: {
            header: `Repository is private or invalid. Please enter a public,
                     valid ${hostSite} repo.`,
          },
          item: '',
          isLoading: false
        });
      }
    })
    .catch(err => {
      this.setState({
        error: {
          header: `Our bad, it seems like we really messed
                   this one up! Try again soon.`,
        },
        item: '',
        isLoading: false
      });
    });
  }

  validateGithubRepos = () => {
    const { username } = this.props;
    const { item, items_list, label } = this.state;
    const [ namespace, repo ] = item.split('/');
    validateRepo(namespace, repo, username)
    .then((res) => {
      const contributors = res.contributorsList;
      let isContributor = false;
      // first check if user is listed as contributor
      // if yes, setState & continue
      for (var contributor of contributors) {
        if (contributor.author.login === username) {
          isContributor = true;
          items_list.push({item, label});
          this.setState({
            items_list,
            item: '',
            isLoading: false
          }, () => this.saveRepoList(items_list));
        }
      }
      // if user is not listed, repo may have > 100 contributors...
      // then search commit history of repo for commits by user.
      // prefer to use both checks, becuase this one is in "preview",
      // github warns changes could happen at any time with no notice.
      if (!isContributor) {
        searchGithubCommits(namespace, repo, username)
        .then((res) => {
          const commits = res.data.items;
          if (commits.length > 0) {
            isContributor = true;
            items_list.push({item, label});
            this.setState({
              items_list,
              item: '',
              isLoading: false
            }, () => this.saveRepoList(items_list));
          }
        })
        .catch((err) => {
          console.warn('There was a problem with GitHub\'s API: ' + err.message);
        });
      }
      // if user/repo does not pass either check, reject with error
      if (!isContributor) {
        this.setState({
          item: '',
          error: {
            header: 'You must be a contributor to the repo you would like to collaborate on.',
          },
          isLoading: false
        });
      }
    })
    // this should catch on the first axios.get request if repo does not exist
    // also handle mystery problem here (hopefully)
    .catch((err) => {
      err = 'contributors[Symbol.iterator]';
      console.log(err, /\[Symbol.iterator\]/.test(err))
      if (/\[Symbol.iterator\]/.test(err)) {
        this.setState({
          item: '',
          error: {
            header: 'There was a problem with GitHub\'s API, please try again.',
          },
          isLoading: false
        });
      } else {
        this.setState({
          item: '',
          error: {
            header: 'Repository is private or invalid. Please enter a public, valid GitHub repo.',
          },
          isLoading: false
        });
      }
    });
  }

  removeItem = (item) => {
    const items_list = this.spliceList(item);
    this.setState({ items_list }, () => this.saveRepoList(items_list));
  }

  spliceList = (item) => {
    const { items_list } = this.state;
    const index = indexOf(items_list, item);
    items_list.splice(index, 1);
    return items_list;
  }

  render() {
    const { isMobile } = this.props.screen;
    const { item, isLoading, icon, error } = this.state;
    const listItems = this.state.items_list.map((el, index) => {
      return (
        <RepoListItem
          key={index}
          el={el}
          index={index}
          removeItem={this.removeItem.bind(this, el)}
          editItem={this.editItem.bind(this, el)} />
      );
    });
    return (
      <Container>
        <RepoInput
          item={item}
          handleChange={this.handleChange}
          isMobile={isMobile}
          repoHosts={repoHosts}
          handleDropdownChange={this.handleLabelChange}
          addItem={this.addItem}
          icon={icon}
          error={error} />
        <Segment style={{ minHeight: 50, marginTop: 5, padding: 0 }} basic>
          <Dimmer active={isLoading && true}>
            <Loader />
          </Dimmer>
          <div
            style={{ margin: 0 }}
            className="ui middle aligned divided selection list">
            {listItems}
          </div>
        </Segment>
      { !isEmpty(error) && error.repo && error.namespace &&
        <div className="ui error message">
          <div className="header">{error.header}</div>
          <ul className="list">
            <li>{error.namespace}</li>
            <li>{error.repo}</li>
          </ul>
        </div> }
      </Container>
    );
  }
}

RepoContainer.propTypes = {
  prePopulateList: propTypes.array,
  saveChanges: propTypes.func.isRequired,
  saveListToParent: propTypes.func.isRequired,
  username: propTypes.string.isRequired,
}

RepoContainer.defaultProps = {
  prePopulateList: []
}

export default connectScreenSize(mapScreenSizeToProps)(RepoContainer);
