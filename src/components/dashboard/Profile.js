import React from 'react';
import { connect } from 'react-redux';

import RepoList from '../common/RepoList';
import MessageBox from '../common/MessageBox';
import DividingHeader from '../common/DividingHeader';
import SliderToggle from '../common/SliderToggle';
import DropdownMultiSelect from '../common/DropdownMultiSelect';
import UserLabel from '../common/UserLabel';
import ListItem from '../common/ListItem';
import { saveUser } from '../../actions/loginActions';

import { skills, interests } from '../../assets/data/dropdownOptions';

class Profile extends React.Component {
  state = {
    projects: [
      // this is example data and will eventually come from redux store via db
      {item: 'Example/Example', label: 'https://github.com/'},
      {item: 'Replace/With', label: 'https://gitlab.com/'},
      {item: 'User/Data', label: 'https://bitbucket.com/'},
    ],
    interests: [],
    skills: [],
    certs: [],
    mentor: false,
  }
  componentDidMount() {
    const { fccCerts } = this.props.user;
    var certs = [];
    for (var cert in fccCerts) {
      if (fccCerts[cert]) {
        certs.push(cert.replace(/_/g, ' ') + ' Certified');
      }
    }
    this.setState({ certs });
  }

  saveList = (items_list) => {
    this.setState({ projects: items_list });
  }

  toggleMentorship = (bool) => {
    this.setState({ mentor: bool });
  }

  handleSkillsChange = (e, data) => {
    this.setState({ skills: data.value });
  }

  handleInterestsChange = (e, data) => {
    this.setState({ interests: data.value });
  }

  render() {
    const { avatarUrl, username, email } = this.props.user;

    const certificates = this.state.certs.map((item, index) => {
      return (
        <ListItem key={index} icon="certificate yellow icon">
          {item}
        </ListItem>
      );
    });

    return (
      <div id="profile-page-main-container" className="ui container">
        <UserLabel
          label="Contributor"
          username={username}
          size="huge"
          image={avatarUrl}
        />

        <div className="ui raised segment">

          <div className="ui teal ribbon label">Personal Info</div>
          
          <div className="ui list">
            <ListItem icon="spy icon">
              {username}
            </ListItem>
            <ListItem icon="github icon">
              <a href={this.props.githubData.profileUrl} target="_blank">GitHub Profile</a>
            </ListItem>
            <ListItem>
              <div className="ui left icon input mini">
                <i className="user icon" />
                <input type="text" placeholder="Display Name" value={this.props.githubData.name} />
              </div>
            </ListItem>
            <ListItem>
              <div className="ui left icon input mini">
                <i className="mail icon" />
                <input type="email" placeholder="Enter Email" value={email} />
              </div>
            </ListItem>
            <ListItem>
              <div className="ui left icon input mini">
                <i className="marker icon" />
                <input type="text" placeholder="Enter Location" value={this.props.githubData.location} />
              </div>
            </ListItem>
          </div>

          <div className="ui teal ribbon label">freeCodeCamp Certifications</div>
          <div className="ui list">
            {certificates}
          </div>

          <div className="ui teal ribbon label">Mentorship Program</div>
          <MessageBox
            type="info"
            header="Would you like to be a mentor?"
            message="The primary goal of this community is to bring together programmers of varying degrees of skill, and connect them with one another to form meaningful mentor/mentee relationships. If you are interested in becoming a mentor, please toggle the switch below. If your skills match with a prospective mentee, you will both be notified, and the rest will be up to you! We will try our best to match you based on interests, skills, location, and language. This feature can be turned off at any time here in your dashboard settings."
          />
          <SliderToggle 
            label="Sign me up! I want to be a mentor!"
            saveStateToParent={this.toggleMentorship} 
          />
          
        <div className="ui teal ribbon label">Social Networks</div>

          <div className="ui teal ribbon label">Skills & Interests</div>
          <DividingHeader text="Core Skills" />
          <MessageBox
            type="info"
            dismissable={true}
            message="Enter information about your coding skills below, so other users know your strengths!"
          />
          <DropdownMultiSelect
            onChange={this.handleSkillsChange}
            options={skills}
            placeholder="Choose Skills"
          />

          <DividingHeader text="Coding Interests" />
          <MessageBox
            type="info"
            dismissable={true}
            message="Let other users know what you're into so you can find others with similar interetsts!"
          />
          <DropdownMultiSelect
            onChange={this.handleInterestsChange}
            options={interests}
            placeholder="Choose Interests"
          />

          <DividingHeader text="Open Collaborative Projects" />
          <MessageBox
            type="info"
            dismissable={true}
            message="Share links to repos for projects that you could use some help with!"
          />
          <RepoList
            saveListToParent={this.saveList}
            username={username}
            prePopulateList={this.state.projects}
          />

        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    githubData: state.user.githubData
  }
}

Profile.propTypes = {
  user: React.PropTypes.object.isRequired,
  githubData: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, { saveUser })(Profile);
