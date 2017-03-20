import React from 'react';
import { connect } from 'react-redux';

import UserLabel from '../common/UserLabel';
import ListItem from '../common/ListItem';
import Modal from '../common/Modal';


import PersonalInfo from './Profile/PersonalInfo';
import Certifications from './Profile/Certifications';
import Mentorship from './Profile/Mentorship';
import SkillsAndInterests from './Profile/SkillsAndInterests';
import Collaboration from './Profile/Collaboration';
import Social from './Profile/Social';
import Career from './Profile/Career';

import { saveUser, updateUser } from '../../actions/user';

/*
TODO:
  1) save all √
  2) save individual section
  3) connect to DB √
  4) connect to redux √
  5) add career form / questionaire √
  7) areas of mentorship √
  8) folder icon behavior - open when any field expanded
*/

class Profile extends React.Component {
  constructor(props) {
    super(props);
    const user = this.props.user.toJS();
    this.state = {
      user,
      errors: {},
      showAll: true,
      showProfile: true,
      showFCC: false,
      showMentorship: false,
      showSkills: false,
      showSocial: false,
      showCareer: false,
      showCollaboration: false,
      modalOpen: false 
    }
  }


  saveProjectsList = (items_list) => {
    const { user } = this.state;
    user.projects = items_list;
    this.setState({ user });
  }

  toggleMentorship = (bool) => {
    const { user } = this.state;
    user.mentorship.isMentor = bool;
    this.setState({ user });
  }

  handleSkillsChange = (e, data) => {
    const { user } = this.state;
    user.skillsAndInterests.coreSkills = data.value;
    this.setState({ user });
  }

  handleInterestsChange = (e, data) => {
    const { user } = this.state;
    user.skillsAndInterests.codingInterests = data.value;
    this.setState({ user });
  }
  
  handleTenureChange = (e, data) => {
    let { user } = this.state;
    user.career.tenure = data.value;
    this.setState({ user });
  }

  handleRadioChange = (e) => {
    let { user } = this.state;
    if (e.target.name === 'working') {
      if (e.target.id === 'Yes') {
        user.career.working = 'yes';
        user.career.jobSearch = '';
      } else if (e.target.id === 'No') {
        user.career.working = 'no';
        user.career.company = '';
        user.career.tenure = '';
      }
    } else if (e.target.name === 'jobSearch') {
      user.career.jobSearch = e.target.id.replace(/_/g, ' ');
    }
    this.setState({ user });
  }
  
  handleInputChange = (e) => {
    let { user } = this.state;
    
    if (e.target.name === 'company') {
      user.career.company = e.target.value;
    } else if (e.target.name === 'codepen' || e.target.name === 'linkedin' || e.target.name === 'twitter') {
      user.social[e.target.name] = e.target.value;
    } else if (e.target.name === 'mentorshipSkills' ) {
      user.mentorship.mentorshipSkills = e.target.value;
    } else {
      user.personal[e.target.name] = e.target.value; 
    }
    
    this.setState({ user });
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
  
  saveChanges = () => {
    updateUser(this.state.user).then(res => {
      const { updatedUser } = res.data;
      this.props.saveUser(updatedUser);
    })
    .catch(console.log);
  
    this.setState({ modalOpen: true });
  }
  
  closeModal = () => {
    this.setState({ modalOpen: false });
  }

  render() {
    const { mentorship, username, personal, social, career, skillsAndInterests } = this.state.user;
    const { errors } = this.state;

    return (
      <div id="profile-page-main-container" className="ui container">

        <UserLabel
          label={mentorship.mentor ? 'Mentor' : 'Member'}
          username={username}
          size="huge"
          image={personal.avatarUrl}
          folder={this.state.showAll}
          toggleAll={this.toggleAll} />

        {/* Does nothing for the time being */}
        <div onClick={this.saveChanges} id="saveButton" className="ui huge teal label">
          Save
          <div className="detail">
            <i className="save icon" />
          </div>
        </div>
        
        <Modal size="small" open={this.state.modalOpen} close={this.closeModal} />

        <div className="ui raised segment">

          <PersonalInfo
            {...personal}
            showProfile={this.state.showProfile}
            toggle={this.toggle}
            handleInputChange={this.handleInputChange}
            username={username}
            errors={errors }/>

          <Certifications
            toggle={this.toggle}
            showFCC={this.state.showFCC}
            fccCerts={this.state.user.fccCerts} />

          <Mentorship
            {...mentorship}
            toggle={this.toggle}
            showMentorship={this.state.showMentorship}
            toggleMentorship={this.toggleMentorship}
            handleInputChange={this.handleInputChange} />

          {/* Think about allowing additions by user to dropdowns */}
          <SkillsAndInterests
            {...skillsAndInterests}
            showSkills={this.state.showSkills}
            toggle={this.toggle}
            handleSkillsChange={this.handleSkillsChange}
            handleInterestsChange={this.handleInterestsChange} />

          <Collaboration
            username={username}
            saveProjectsList={this.saveProjectsList}
            toggle={this.toggle}
            projects={this.state.user.projects}
            showCollaboration={this.state.showCollaboration} />

          <Social
            {...social}
            showSocial={this.state.showSocial}
            toggle={this.toggle}
            handleInputChange={this.handleInputChange}
            errors={errors} />

          <Career
            {...career}
            toggle={this.toggle}
            showCareer={this.state.showCareer}
            handleRadioChange={this.handleRadioChange}
            handleInputChange={this.handleInputChange}
            handleTenureChange={this.handleTenureChange} 
            errors={errors} />

        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

Profile.propTypes = {
  user: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, { saveUser })(Profile);
