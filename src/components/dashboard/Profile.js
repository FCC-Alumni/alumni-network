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
    /* technically not cool, but not seeing the choice if we want to autofill and manage state */
    displayName: this.props.githubData.name ? this.props.githubData.name : '',
    email: this.props.email ? this.props.email : '',
    location: this.props.githubData.location ? this.props.githubData.location : '',
    bio: this.props.githubData.bio ? this.props.githubData.bio : '',
    /****/
    codepen: '',
    twitter: '',
    linkedin: '',
    /****/
    showAll: false,
    showProfile: true,
    showFCC: false,
    showMentorship: false,
    showSkills: false,
    showSocial: false,
    showCareer: false
    // ^^ was thinking about putting these into an object for organization of the state object...
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

  saveProjectsList = (items_list) => {
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
  
  handleInputChange = (e) => {
    this.setState({ [e.target.name] : e.target.value });
  }

  toggle = (target) => {
    /* we pass callback to setState to catch state after update
      in case all the modals are now open or closed */
    this.setState({ [target]: !this.state[target] }, () => {
      const { showProfile, showFCC, showMentorship, showSkills } = this.state;
      if (!showProfile && !showFCC && !showMentorship && !showSkills) {
        this.setState({
          showAll: false
        });
      } else if (showProfile && showFCC && showMentorship && showSkills) {
        this.setState({
          showAll: true
        });
      }
    });
  }

  toggleAll = () => {
    this.setState({
      showAll: !this.state.showAll,
      showProfile: !this.state.showAll,
      showFCC: !this.state.showAll,
      showMentorship: !this.state.showAll,
      showSkills: !this.state.showAll,
      showSocial: !this.state.showAll,
      showCareer: !this.state.showAll
    });
  }

  render() {
    console.log(this.state)
    const { username } = this.props.user;
    const { githubData } = this.props;

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
          label={this.state.mentor ? 'Mentor' : 'Member'}
          username={username}
          size="huge"
          image={this.props.user.avatarUrl}
          folder={this.state.showAll}
          toggleAll={this.toggleAll}
        />
      
      {/* Does nothing for the time being */}
      <div style={{ float: 'right' }} className="ui huge teal label">
        Save
        <div className="detail">
          <i className="save icon" />
        </div>
      </div>

        <div className="ui raised segment">
          
          <form className="ui form">
            
            <div className="ui teal ribbon label profileWrapper" onClick={this.toggle.bind(this, 'showProfile')}>Personal Info</div>
            <div className={`profilePane ${this.state.showProfile ? 'show' : 'hide'}`}>
              <div className="ui list">
                
                <ListItem icon="spy icon">
                  {username}
                </ListItem>
                
                <ListItem icon="github icon">
                  <a href={githubData.profileUrl} target="_blank">GitHub Profile</a>
                </ListItem>
                
                <ListItem>
                  <div className="ui transparent left icon input">
                    <i className="user icon" />
                    <input
                      onChange={this.handleInputChange} 
                      type="text" 
                      placeholder="Enter Display Name..." 
                      title="Display Name" 
                      name="displayName" 
                      value={this.state.displayName} 
                      />
                  </div>
                </ListItem>
                
                <ListItem>
                  <div className="ui transparent left icon input">
                    <i className="mail icon" />
                    <input
                      onChange={this.handleInputChange} 
                      type="email" 
                      placeholder="Enter Email..." 
                      title="Email" 
                      name="email" 
                      value={this.state.email} 
                      />
                  </div>
                </ListItem>
                
                <ListItem>
                  <div className="ui transparent left icon input">
                    <i className="marker icon" />
                    <input
                      onChange={this.handleInputChange} 
                      type="text" 
                      placeholder="Enter Location..." 
                      title="Location" 
                      name="location" 
                      value={this.state.location} 
                      />
                  </div>
                </ListItem>
                
              </div>
              <div className="ui six wide field">
                <label>Bio</label>
                <textarea
                  onChange={this.handleInputChange} 
                  name='bio'
                  rows="4"
                  value={this.state.bio}
                  />
              </div>
            </div>
            
            <div className="ui teal ribbon label fccWrapper" onClick={this.toggle.bind(this, 'showFCC')}>freeCodeCamp Certifications</div>
            <div className={`ui list fccPane ${this.state.showFCC ? 'show' : 'hide'}`}>
              {certificates}
            </div>
            
            <div className="ui teal ribbon label mentorshipWrapper" onClick={this.toggle.bind(this, 'showMentorship')}>Mentorship Program</div>
            <div className={`mentorshipPane ${this.state.showMentorship ? 'show' : 'hide'}`}>
              <MessageBox
                type="info"
                header="Would you like to be a mentor?"
                message="The primary goal of this community is to bring together programmers of varying degrees of skill, and connect them with one another to form meaningful mentor/mentee relationships. If you are interested in becoming a mentor, please toggle the switch below. If your skills match with a prospective mentee, you will both be notified, and the rest will be up to you! We will try our best to match you based on interests, skills, location, and language. This feature can be turned off at any time here in your dashboard settings."
                />
              <SliderToggle
                label="Sign me up! I want to be a mentor!"
                saveStateToParent={this.toggleMentorship}
                />
            </div>
            
            <div className="ui teal ribbon label skillsWrapper" onClick={this.toggle.bind(this, 'showSkills')}>Skills & Interests</div>
            
            <div className={`skillsPane ${this.state.showSkills ? 'show' : 'hide'}`}>
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
                saveListToParent={this.saveProjectsList}
                username={username}
                prePopulateList={this.state.projects}
                />
            </div>
            
            <div className="ui teal ribbon label socialWrapper" onClick={this.toggle.bind(this, 'showSocial')}>Social</div>
            <div className={`socialPane ${this.state.showSocial ? 'show' : 'hide'}`}>
              <MessageBox 
                type="info"
                dismissable={true}
                message="Stay connected with campers on other networks! Let us know where your profiles live."
              />
              <div className="ui list">
                
                <ListItem>
                  <div className="ui left icon input mini">
                    <i className="codepen icon" />
                    <input
                      onChange={this.handleInputChange} 
                      type="text" 
                      placeholder="Enter CodePen" 
                      title="CodePen" 
                      name="codepen"
                      value={this.state.codepen} 
                      />
                  </div>
                </ListItem>
                
                <ListItem>
                  <div className="ui left icon input mini">
                    <i className="twitter icon" />
                    <input
                      onChange={this.handleInputChange} 
                      type="text" 
                      placeholder="Enter Twitter" 
                      title="Twitter" 
                      name="twitter"
                      value={this.state.twitter} 
                      />
                  </div>
                </ListItem>
                
                <ListItem>
                  <div className="ui left icon input mini">
                    <i className="linkedin icon" />
                    <input
                      onChange={this.handleInputChange} 
                      type="text" 
                      placeholder="Enter LinkedIn" 
                      title="LinkedIn" 
                      name="linkedin"
                      value={this.state.linkedin} 
                      />
                  </div>
                </ListItem>
                
              </div>
            </div>
            
            <div className="ui teal ribbon label careerWrapper" onClick={this.toggle.bind(this, 'showCareer')}>Career</div>
            <div className={`careerPane ${this.state.showCareer ? 'show' : 'hide'}`}>
              <h4>Career form goes here...</h4>
            </div>
            
          </form>

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
