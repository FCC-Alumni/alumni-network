import React from 'react';
import { connect } from 'react-redux';

import UserLabel from '../common/UserLabel';
import ListItem from '../common/ListItem';

import PersonalInfo from './Profile/PersonalInfo';
import Certifications from './Profile/Certifications';
import Mentorship from './Profile/Mentorship';
import SkillsAndInterests from './Profile/SkillsAndInterests';
import Collaboration from './Profile/Collaboration';
import Social from './Profile/Social';
import Career from './Profile/Career';

import { saveUser } from '../../actions/loginActions';

/*
TODO:
  1) save all
  2) save individual section
  3) connect to DB
  4) connect to redux
  5) add career form / questionaire ***
  6) add personal info > timezones ***
  7) areas of mentorship ***
  8) folder icon behavior - open when any field expanded
*/

class Profile extends React.Component {
  state = {
    errors: {
      displayName: 'error goes here!'
    },
    projects: [
      {item: 'Example/Example', label: 'https://github.com/'},
      {item: 'Replace/With', label: 'https://gitlab.com/'},
      {item: 'User/Data', label: 'https://bitbucket.com/'},
    ],
    interests: [],
    skills: [],
    displayName: this.props.githubData.name ? this.props.githubData.name : '',
    email: this.props.email ? this.props.email : '',
    location: this.props.githubData.location ? this.props.githubData.location : '',
    bio: this.props.githubData.bio ? this.props.githubData.bio : '',
    /****/
    mentor: false,
    mentorshipSkills: '',
    career: {
      working: '',
      company: '',
      tenure: '',
      jobSearch: '',
    },
    social: {
      codepen: '',
      twitter: '',
      linkedin: '',
    },
    showAll: true,
    showProfile: true,
    showFCC: false,
    showMentorship: false,
    showSkills: false,
    showSocial: false,
    showCareer: false,
    showCollaboration: false
    // ^^ was thinking about putting these into an object for organization of the state object...
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
  
  handleTenureChange = (e, data) => {
    let { career } = this.state;
    career.tenure = data.value;
    this.setState({ career });
  }

  handleRadioChange = (e) => {
    let { career } = this.state;
    if (e.target.name === 'working') {
      if (e.target.id === 'Yes') {
        career.working = 'yes';
        career.jobSearch = '';
        this.setState({ career });
      } else {
        career.working = 'no';
        career.company = '';
        career.tenure = '';
        this.setState({ career });
      }
    } else if (e.target.name === 'jobSearch') {
      career.jobSearch = e.target.id;
      this.setState({ career });
    }
  }
  
  handleInputChange = (e) => {
    let { career, social } = this.state;
    if (e.target.name === 'company') {
      career.company = e.target.value;
      this.setState({ career });
    } else if (e.target.name === 'codepen' || e.target.name === 'linkedin' || e.target.name === 'twitter') {
      social[e.target.name] = e.target.value;
      this.setState({ social });
    } else {
      this.setState({ [e.target.name] : e.target.value });
    }
  }

  toggle = (target) => {
    /* we pass callback to setState to catch state after update
      in case all the modals are now open or closed */
    this.setState({ [target]: !this.state[target] }, () => {
      const { showProfile, showFCC, showMentorship, showSkills, showCollaboration, showSocial, showCareer } = this.state;
      if (!showProfile && !showFCC && !showMentorship && !showSkills && !showSocial && !showCareer && !showCollaboration) {
        this.setState({
          showAll: false
        });
      } else if (showProfile && showFCC && showMentorship && showSkills && showSocial && showCareer && showCollaboration) {
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
      showCareer: !this.state.showAll,
      showCollaboration: !this.state.showAll
    });
  }

  render() {
    const { username } = this.props.user;
    const { githubData } = this.props;

    return (
      <div id="profile-page-main-container" className="ui container">

        <UserLabel
          label={this.state.mentor ? 'Mentor' : 'Member'}
          username={username}
          size="huge"
          image={this.props.user.avatarUrl}
          folder={this.state.showAll}
          toggleAll={this.toggleAll} />

        {/* Does nothing for the time being */}
        <div style={{ float: 'right' }} className="ui huge teal label">
          Save
          <div className="detail">
            <i className="save icon" />
          </div>
        </div>

        <div className="ui raised segment">

          <PersonalInfo
            {...this.state}
            toggle={this.toggle}
            handleInputChange={this.handleInputChange}
            username={username}
            githubData={githubData} 
            errors={this.state.errors }/>

          <Certifications
            toggle={this.toggle}
            showFCC={this.state.showFCC}
            fccCerts={this.props.user.fccCerts} />

          <Mentorship
            toggle={this.toggle}
            showMentorship={this.state.showMentorship}
            toggleMentorship={this.toggleMentorship}
            mentorshipSkills={this.state.mentorshipSkills}
            handleInputChange={this.handleInputChange}
            isMentor={this.state.mentor} />

          <SkillsAndInterests
            {...this.state}
            toggle={this.toggle}
            handleSkillsChange={this.handleSkillsChange}
            handleInterestsChange={this.handleInterestsChange} />

          <Collaboration
            username={username}
            saveProjectsList={this.saveProjectsList}
            toggle={this.toggle}
            projects={this.state.projects}
            showCollaboration={this.state.showCollaboration} />

          <Social
            {...this.state.social}
            showSocial={this.state.showSocial}
            toggle={this.toggle}
            handleInputChange={this.handleInputChange} />

          <Career
            toggle={this.toggle}
            showCareer={this.state.showCareer}
            handleInputChange={this.handleRadioChange}
            isWorking={this.state.career.working}
            company={this.state.career.company} 
            errors={this.state.errors}
            handleTenureChange={this.handleTenureChange} />

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
