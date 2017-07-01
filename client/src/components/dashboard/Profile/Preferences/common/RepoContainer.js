import React from 'react';
import { isEmpty, indexOf } from 'lodash';
import propTypes from 'prop-types';
import styled from 'styled-components';
import { connectScreenSize } from 'react-screen-size';
import repoHosts from '../../../../../assets/dropdowns/repoHosts';
import { mapScreenSizeToProps } from '../../../Community/UserCard';
import RepoListItem from './RepoListItem';
import RepoInput from './RepoInput';

import {
  validateGithubRepo,
  searchGithubCommits,
  validateOtherRepos
} from '../../../../../actions/repoValidations';

/*
TODO:
  1) Refactor addItem() code
*/

export const Container = styled.div`
  margin: 16px 0 !important;
`;

const List = styled.div`
  margin: 8px 0 0 0 !important;
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

  validateGitLab_and_BitBucketRepos = (hostSite) => {
    const { item, items_list, label } = this.state;
    const hostUrl = hostSite === 'BitBucket' ? 'https://bitbucket.org/' : 'https://gitlab.com/';

    validateOtherRepos(item, hostUrl).then((res) => {
      if (res) {
        items_list.push({item, label});
        this.setState({ items_list, item: '', isLoading: false }, () => this.props.saveChanges());
      } else {
        this.setState({
          error: {
            header: `Repository is private or invalid. Please enter a public, valid ${hostSite} repo.`,
            repo: '',
            namespace: ''
          },
          item: '',
          isLoading: false
        });
      }
    })
    .catch(err => {
      this.setState({
        error: {
          header: `Our bad, it seems like we really messed this one up! Try again soon.`,
          repo: '',
          namespace: ''
        },
        item: '',
        isLoading: false
      });
    });
  }

  addItem = () => {
    this.setState({ isLoading: true });
    const { item, items_list, label } = this.state;
    const { saveListToParent } = this.props;
    const [ namespace, repo ] = item.split('/');

    // check if nothing entered
    if (!item) {
      this.setState({ isLoading: false });
      return;
      // or if format is not: NAME_SPACE/REPO
    } else if (!repo) {
      this.setState({
        error: {
          header: 'Invalid entry. Plese enter a valid repo in the format: namespace/repo.',
          repo: '',
          namespace: '',
        },
        item: '',
        isLoading: false
      });
      return;
    }

    // check if item already exists on list
    for (var obj of items_list) {
      if (obj.item === item && obj.label === label) {
        this.setState({
          error: {
            header: 'You have already added this repo to your list!',
            repo: '',
            namespace: '',
          },
          item: '',
          isLoading: false
        });
        return;
      }
    }

    // GITLAB VALIDATIONS:
    if (label === 'https://gitlab.com/') {

      if (
        // GitLab naming conventions:
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
      } else {
        this.validateGitLab_and_BitBucketRepos('GitLab');
      }
    }

    // BITBUCKET VALIDATIONS:
    if (label === 'https://bitbucket.org/') {
      // BitBucket naming conventions:
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
      } else {
        this.validateGitLab_and_BitBucketRepos('BitBucket');
      }
    }

    // GITHUB VALIDATIONS:
    if (label === 'https://github.com/') {
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
      } else {
        const { username } = this.props;
        // first check if user is listed
        // if yes, setState & continue
        validateGithubRepo(namespace, repo, username)
        .then((res) => {
          const contributors = res.contributorsList;
          let isContributor = false;
          for (var contributor of contributors) {
            if (contributor.author.login === username) {
              isContributor = true;
              items_list.push({item, label});
              this.setState({ items_list, item: '', isLoading: false }, () => this.props.saveChanges());
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
                this.setState({ items_list, item: '', isLoading: false }, () => this.props.saveChanges());
              }
            })
            .catch((err) => {
              console.warn('There was a problem with GitHub\'s API: ' + err.message);
            });
          }

          if (!isContributor) {
            // if user/repo does not pass either check, reject with error
            this.setState({
              item: '',
              error: {
                header: 'You must be a contributor to the repo you would like to collaborate on.',
                repo: '',
                namespace: ''
              },
              isLoading: false
            });
          }

        })
        .catch((err) => {
          // this should catch on the first axios.get request if repo does not exist
          this.setState({
            item: '',
            error: {
              header: 'Repository is private or invalid. Please enter a public, valid GitHub repo',
              repo: '',
              namespace: ''
            },
            isLoading: false
          });
        });
      }
    }

    if (saveListToParent) {
      saveListToParent(items_list);
    }
  }

  removeItem = (item) => {
    const items_list = this.spliceList(item);
    this.setState({ items_list }, () => this.props.saveChanges());

  }

  editItem = (item) => {
    const items_list = this.spliceList(item);
    this.setState({ items_list, item: item.item });
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
        <RepoListItem key={index}
                    el={el}
                    index={index}
                    removeItem={this.removeItem.bind(this, el)}
                    editItem={this.editItem.bind(this, el)}
                />
      );
    });
    return (
      <Container>
        <RepoInput item={item}
                  isLoading={isLoading}
                  handleChange={this.handleChange}
                  isMobile={isMobile}
                  repoHosts={repoHosts}
                  handleDropdownChange={this.handleLabelChange}
                  addItem={this.addItem}
                  icon={icon}
                  error={error} />
        <List className="ui middle aligned divided selection list">
          {listItems}
        </List>
        {
          !isEmpty(error) && error.repo && error.namespace &&
          <div className="ui error message">
            <div className="header">{error.header}</div>
            <ul className="list">
              <li>{error.namespace}</li>
              <li>{error.repo}</li>
            </ul>
          </div>
        }
      </Container>
    );
  }
}

RepoContainer.propTypes = {
  prePopulateList: propTypes.array,
  username: propTypes.string.isRequired,
  saveChanges: propTypes.func.isRequired,
  saveListToParent: propTypes.func.isRequired,
}

RepoContainer.defaultProps = {
  prePopulateList: []
}

export default connectScreenSize(mapScreenSizeToProps)(RepoContainer);
