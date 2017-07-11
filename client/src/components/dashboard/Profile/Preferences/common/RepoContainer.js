import { connectScreenSize } from 'react-screen-size';
import { mapScreenSizeToProps } from '../../../Community/UserCard';
import propTypes from 'prop-types';
import React from 'react';
import repoHosts from '../../../../../assets/dropdowns/repoHosts';
import RepoInput from './RepoInput';
import RepoListItem from './RepoListItem';
import styled from 'styled-components';

import { Dimmer, Loader, Segment } from 'semantic-ui-react';
import { indexOf, isEmpty } from 'lodash';
import {
  searchGithubCommits,
  validateOtherRepos as validateOther,
  validateGithubRepo as validateRepo
} from '../../../../../actions/repoValidations';

/*
TODO:
  1) Refactor addItem() code - UPDATE - at least partially done
*/

export const Container = styled.div`
  margin: 16px 0 !important;
`;

class RepoContainer extends React.Component {
  state = {
    error: {},
    icon: 'github',
    isLoading: false,
    item: '',
    items_list: [],
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
    this.setState({ item: item.item, items_list });
  }

  handleChange = (e) => {
    this.setState({ error: '', item: e.target.value });
  }

  handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      this.addItem();
    }
  }

  handleLabelChange = (e) => {
    let icon;
    if (e.target.innerText === 'https://github.com/') icon = 'github'
    if (e.target.innerText === 'https://gitlab.com/') icon = 'gitlab'
    if (e.target.innerText === 'https://bitbucket.org/') icon = 'bitbucket'
    this.setState({ icon, label: e.target.innerText });
  }

  isFormatValid = (repo) => {
    if (!repo) {
      this.setState({
        error: {
          header: `Invalid entry. Plese enter a valid repo
                   in the format: namespace/repo.`,
        },
        isLoading: false,
        item: '',
      });
      return false;
    }
    return true;
  }

  isValidBitbucketNaming = (item, repo) => {
    if ((repo.length === 1 && /^\./.test(repo)) || !/[\d\w-]+\/[\d\w-.]+\/?/.test(item)) {
      this.setState({
        error: {
          header:    'Please enter a valid BitBucket repository path: namespace/repo',
          namespace: `Namespace: This value must contain only ASCII letters,
                      numbers, dashes and underscores.`,
          repo:      `Repo: This value must contain only ASCII letters, numbers,
                      dashes, underscores and periods.`,
        },
        isLoading: false,
        item: '',
      });
      return false;
    } else {
      return true;
    }
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
          namespace: `Repo: This value can only contain letters, digits, '_', '-'
                      and '.'. Cannot start with '-' or end in '.', '.git' or '.atom'`,
          repo:      `Namespace: This value can only contain letters, digits, '_', '-'
                      and '.'. Cannot start with '-' or end in '.', '.git' or '.atom'`,
        },
        isLoading: false,
        item: ''
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
          namespace: `Namespace: This value may only contain alphanumeric
                      characters or single hyphens, and cannot begin or
                      end with a hyphen.`,
          repo:      `Repo: This value may only contain alphanumeric characters,
                      periods, and hyphens, and cannot begin with a period.`,
        },
        isLoading: false,
        item: ''
      });
      return false;
    }
    return true;
  }

  removeItem = (item) => {
    const items_list = this.spliceList(item);
    this.setState({ items_list }, () => this.props.saveChanges(items_list));
  }

  repoAlreadyAdded = (item, items_list, label) => {
    for (var obj of items_list) {
      if (obj.item.toLowerCase() === item.toLowerCase() && obj.label === label) {
        this.setState({
          error: {
            header: 'You have already added this repo to your list!',
          },
          isLoading: false,
          item: ''
        });
        return true;
      }
    }
    return false;
  }

  spliceList = (item) => {
    const { items_list } = this.state;
    const index = indexOf(items_list, item);
    items_list.splice(index, 1);
    return items_list;
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
            isLoading: false,
            item: '',
            items_list,
          }, () => this.props.saveChanges(items_list));
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
              isLoading: false,
              item: '',
              items_list,
            }, () => this.props.saveChanges(items_list));
          }
        })
        .catch((err) => {
          console.warn('There was a problem with GitHub\'s API: ' + err.message);
        });
      }
      // if user/repo does not pass either check, reject with error
      if (!isContributor) {
        this.setState({
          error: {
            header: 'You must be a contributor to the repo you would like to collaborate on.',
          },
          isLoading: false,
          item: '',
        });
      }
    })
    // this should catch on the first axios.get request if repo does not exist
    // also handle mystery problem here (hopefully)
    .catch((err) => {
      err = 'contributors[Symbol.iterator]';
      if (/\[Symbol.iterator\]/.test(err)) {
        this.setState({
          error: {
            header: 'There was a problem with GitHub\'s API, please try again.',
          },
          isLoading: false,
          item: '',
        });
      } else {
        this.setState({
          error: {
            header: 'Repository is private or invalid. Please enter a public, valid GitHub repo.',
          },
          isLoading: false,
          item: '',
        });
      }
    });
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
          isLoading: false,
          item: '',
          items_list,
        }, () => this.props.saveChanges(items_list));
      } else {
        this.setState({
          error: {
            header: `Repository is private or invalid. Please enter a public,
                     valid ${hostSite} repo.`,
          },
          isLoading: false,
          item: '',
        });
      }
    })
    .catch(err => {
      this.setState({
        error: {
          header: `Our bad, it seems like we really messed
                   this one up! Try again soon.`,
        },
        isLoading: false,
        item: '',
      });
    });
  }

  render() {
    const { isMobile } = this.props.screen;
    const { item, isLoading, icon, error } = this.state;
    const listItems = this.state.items_list.map((el, index) => {
      return (
        <RepoListItem
          editItem={() => this.editItem(el)}
          el={el}
          index={index}
          key={index}
          removeItem={() => this.removeItem(el)} />
      );
    });
    return (
      <Container>
        <RepoInput
          addItem={this.addItem}
          error={error}
          handleChange={this.handleChange}
          handleDropdownChange={this.handleLabelChange}
          icon={icon}
          isMobile={isMobile}
          item={item}
          repoHosts={repoHosts} />
        <Segment basic style={{ marginTop: 5, minHeight: 50, padding: 0 }}>
          <Dimmer active={isLoading && true} inverted>
            <Loader />
          </Dimmer>
          <div
            className="ui middle aligned divided selection list"
            style={{ margin: 0 }}>
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
  username: propTypes.string.isRequired,
}

RepoContainer.defaultProps = {
  prePopulateList: []
}

export default connectScreenSize(mapScreenSizeToProps)(RepoContainer);
