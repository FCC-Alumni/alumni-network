import React from 'react';
import { Dropdown, Input } from 'semantic-ui-react';
import Validator from 'validator';
import { validateGithubRepo, searchGithubCommits, validateOtherRepos } from '../../actions/repoValidations';
import isEmpty from 'lodash/isEmpty';
import indexOf from 'lodash/indexOf';
import { repoOptions } from '../../assets/data/dropdownOptions';

/*
 TODO: 
 1) Make sure user cannot add the same item twice
*/

class RepoList extends React.Component {
  state = {
    item: '',
    items_list: [],
    error: {},
    label: 'https://github.com/',
    icon: 'github',
    isLoading: false
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
  
  handleChange = (e, data) => {
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
    
    validateOtherRepos(item).then((res) => {
      if (res) {
        items_list.push({item, label});
        this.setState({ items_list, item: '', isLoading: false });
      } else {
        this.setState({ 
          error: {
            header: `Repository is private or invalid. Please enter a public, valid ${hostSite} repo.`,
            repo: '',
            owner: ''
          }, 
          item: '',
          isLoading: false 
        });
      }
    });
  }
  
  addItem = () => {
    this.setState({ isLoading: true });
    const { item, items_list, label } = this.state;
    const { saveListToParent } = this.props;
    const [ owner, repo ] = item.split('/');
    
    if(!item) {
      this.setState({ isLoading: false }); 
      return;
    }
    
    // GITLAB VALIDATIONS:
    if (label === 'https://gitlab.com/') {
      // CHALLENGE!!! anyone up for the challenge of writing a regex that covers all of this? 
      // I was unable to, would def clean this up. -Pete
      if (
      repo.endsWith('.git') || 
      repo.endsWith('.atom') || 
      repo.endsWith('.') ||
      repo.startsWith('-') ||
      owner.endsWith('.git') || 
      owner.endsWith('.atom') || 
      owner.startsWith('-') ||
      owner.endsWith('.') ||
      !Validator.matches(item, /[\d\w-.]+\/[\d\w-.]+\/?/)
      ) {
        this.setState({ 
          error: {
            header: 'Please enter a valid GitLab repository path: namespace/repo',
            repo: "Owner: This value can only contain letters, digits, '_', '-' and '.'. Cannot start with '-' or end in '.', '.git' or '.atom'",
            owner: "Repo: This value can only contain letters, digits, '_', '-' and '.'. Cannot start with '-' or end in '.', '.git' or '.atom'"
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
        (repo.length === 1 && repo.startsWith('.')) || 
        !Validator.matches(item, /[\d\w-]+\/[\d\w-.]+\/?/)
      ) {
        this.setState({ 
          error: { 
            header: 'Please enter a valid BitBucket repository path: namespace/repo',
            repo: 'Repo: This value must contain only ASCII letters, numbers, dashes, underscores and periods.',
            owner: 'Owner: This value must contain only ASCII letters, numbers, dashes and underscores.'
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
        repo.startsWith('.') ||
        owner.startsWith('-') ||
        owner.endsWith('-') ||
        owner.search(/--/) > -1 || 
        !Validator.matches(item, /[\d\w-.]+\/[\d\w-]+\/?/)
      ) {
        this.setState({ 
          error: { 
            header: 'Please enter a valid GitHub repository path: namespace/repo',
            repo: 'Repo: This value may only contain alphanumeric characters, periods, and hyphens, and cannot begin with a period.',
            owner: 'Owner: This value may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.'
          }, 
          item: '',
          isLoading: false 
        });
      } else {
        const { username } = this.props;
        // test with FreeCodeCamp/FreeCodeCamp repo
        // const username = 'tommygebru' // <-- control for testing reject() - has not contributed to repo 
        // const username = 'bonham000' // <-- control for testing searchGithubCommits() (bonham000 does not appear in 1st 100 FCC contributors)
        validateGithubRepo(owner, repo, username)
        .then((res) => {
          const contributors = res.contributorsList;
          let isContributor = false;
          // first check if user is listed 
          // if yes, resolve and continue
          for(var contributor of contributors) {
            if (contributor.author.login === username) {
              isContributor = true;
              items_list.push({item, label});
              this.setState({ items_list, item: '', isLoading: false });
            }
          }
          // if user is not listed, repo may have > 100 contributors
          // then search commit history of repo for commits by user.
          // prefer to use both checks, becuase this one in "preview"
          // github warns changes could happen at any time with no notice
          if (!isContributor) {
            searchGithubCommits(owner, repo, username)
            .then((res) => {
              const commits = res.data.items;
              if (commits.length > 0) {
                isContributor = true;
                items_list.push({item, label});
                this.setState({ items_list, item: '', isLoading: false });
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
                owner: ''
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
              owner: ''
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
    this.setState({ items_list });
  
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

    const { item, isLoading, icon, error } = this.state;
    
    const listItems = this.state.items_list.map((el, index) => {
      return (
        <div key={index} className="item">
          <div className="right floated content">
            <a><i onClick={this.removeItem.bind(this, el)} className="remove icon"/></a>
            <a><i onClick={this.editItem.bind(this, el)} className="edit icon"/></a>
          </div>
          <a href={`${el.label}${el.item}`} target="_blank" className="content">{`${el.label}${el.item}`}</a>
        </div>
      );
    });
    
    return (
      <div>
        
        <Input 
          onChange={this.handleChange}
          label={<Dropdown onChange={this.handleLabelChange} defaultValue="https://github.com/" options={repoOptions} />}
          labelPosition="left"
          placeholder="Namespace / Repo"
          value={item}
          loading={isLoading}
          icon={icon}
        />
        
        <div className="ui middle aligned divided list">
          {listItems}
        </div>
        
        { 
          !isEmpty(error) && 
          <div className="ui error message">
            <div className="header">{error.header}</div>
            {
              error.repo.length > 0 &&
              <ul className="list">
                <li>{error.owner}</li> 
                <li>{error.repo}</li> 
              </ul>
            }
          </div> 
        }
        
      </div>
    );
  }
}

RepoList.propTypes = {
  saveListToParent: React.PropTypes.func.isRequired, 
  username: React.PropTypes.string.isRequired, 
  prePopulateList: React.PropTypes.array 
}

RepoList.defaultProps = {
  prePopulateList: []
}

export default RepoList;