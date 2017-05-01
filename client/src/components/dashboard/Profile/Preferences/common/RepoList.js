import React from 'react';
import { isEmpty } from 'lodash';
import { indexOf } from 'lodash';
import Validator from 'validator';
import propTypes from 'prop-types';
import styled from 'styled-components';
import { Dropdown, Input } from 'semantic-ui-react';
import { connectScreenSize } from 'react-screen-size';
import repoHosts from '../../../../../assets/dropdowns/repoHosts';
import { mapScreenSizeToProps } from '../../../Community/UserCard';

import {
  validateGithubRepo,
  searchGithubCommits,
  validateOtherRepos
} from '../../../../../actions/repoValidations';

/*
TODO:
  1) Refactor addItem() code
  2) Create RegExp's to replace long if statements in addItem()
*/

export const Container = styled.div`
  margin: 16px 0 !important;
`;

const List = styled.div`
  margin: 8px 0 0 0 !important;
`;

const StyledItem = styled.div`
  color: black !important;
  font-weight: bold !important;
  .icon {
    color: black !important;
  }
  cursor: pointer;
  &:hover {Styled
    background: #E0E0E0 !important;
    .icon {
      color: #FF4025 !important;
      transition: color 200ms ease-in-out !important;
    }
  }
`;

export const ErrorLabel = ({ isMobile, error }) => (
  <div
    style={{ marginTop: 10 }}
    className={`ui ${!isMobile ? 'left pointing' : ''} red basic label`}>
    {error}
  </div>
);

class RepoList extends React.Component {
  state = {
    item: '',
    error: {},
    icon: 'github',
    items_list: [],
    isLoading: false,
    label: 'https://github.com/',
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
          header: `Our bad, it seems like we really messed this one up! Try again never. Just kidding, give us a few.`,
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
      // CHALLENGE!!! anyone up for the challenge of writing a regex that covers all of this?
      // I was unable to, would def clean this up. -Pete

      if (
      // GitLab naming conventions:
      repo.slice(-4) === '.git' ||
      repo.slice(-5) === '.atom' ||
      repo.slice(-1) === '.' ||
      repo.slice(0, 1) === '-' ||
      namespace.slice(-4) === '.git' ||
      namespace.slice(-5) === '.atom' ||
      namespace.slice(0, 1) === '-' ||
      namespace.slice(-1) === '.' ||
      !Validator.matches(item, /[\d\w-.]+\/[\d\w-.]+\/?/)
      ) {
        this.setState({
          error: {
            header: 'Please enter a valid GitLab repository path: namespace/repo',
            repo: "Namespace: This value can only contain letters, digits, '_', '-' and '.'. Cannot start with '-' or end in '.', '.git' or '.atom'",
            namespace: "Repo: This value can only contain letters, digits, '_', '-' and '.'. Cannot start with '-' or end in '.', '.git' or '.atom'"
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
      if (
        // BitBucket naming conventions:
        (repo.length === 1 && repo.slice(0, 1) === '.') ||
        !Validator.matches(item, /[\d\w-]+\/[\d\w-.]+\/?/)
      ) {
        this.setState({
          error: {
            header: 'Please enter a valid BitBucket repository path: namespace/repo',
            repo: 'Repo: This value must contain only ASCII letters, numbers, dashes, underscores and periods.',
            namespace: 'Namespace: This value must contain only ASCII letters, numbers, dashes and underscores.'
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
        repo.slice(0, 1) === '.' ||
        namespace.slice(0, 1) === '-' ||
        namespace.slice(-1) === '-' ||
        namespace.search(/--/) > -1 ||
        !Validator.matches(item, /[\d\w-.]+\/[\d\w-]+\/?/)
      ) {
        this.setState({
          error: {
            header: 'Please enter a valid GitHub repository path: namespace/repo',
            repo: 'Repo: This value may only contain alphanumeric characters, periods, and hyphens, and cannot begin with a period.',
            namespace: 'Namespace: This value may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.'
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
        <StyledItem key={index} className="item">
          <div className="right floated content">
            <a><i onClick={this.removeItem.bind(this, el)} className="remove icon"/></a>
            <a><i onClick={this.editItem.bind(this, el)} className="edit icon"/></a>
          </div>
          <a href={`${el.label}${el.item}`} target="_blank" className="content">{`${el.label}${el.item}`}</a>
        </StyledItem>
      );
    });
    return (
      <Container>
        <Input
          icon={icon}
          value={item}
          loading={isLoading}
          labelPosition="left"
          onChange={this.handleChange}
          placeholder="Namespace / Repo"
          fluid={isMobile ? true : false}
          label={<Dropdown
            options={repoHosts}
            className="basic green"
            defaultValue="https://github.com/"
            onChange={this.handleLabelChange} />} />
      { !isEmpty(error) && !error.repo && !error.namespace &&
        <ErrorLabel isMobile={isMobile} error={error.header} /> }
        <List className="ui middle aligned divided selection list">
          {listItems}
        </List>
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

RepoList.propTypes = {
  prePopulateList: propTypes.array,
  username: propTypes.string.isRequired,
  saveChanges: propTypes.func.isRequired,
  saveListToParent: propTypes.func.isRequired,
}

RepoList.defaultProps = {
  prePopulateList: []
}

export default connectScreenSize(mapScreenSizeToProps)(RepoList);
