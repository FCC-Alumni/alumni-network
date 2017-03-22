/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';

import UserLabel from '../common/UserLabel';
import Modal from './Profile/common/SaveModal';

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
  - save individual section √
  - folder icon behavior - open when any field expanded
  - add validations for form fields - should be loose validations since nothing is strictly required
  - use passport to pull in LinkedIn and Twitter handles
  - save all √
  - connect to DB √
  - connect to redux √
  - add career form / questionaire √
  - areas of mentorship √
  - error handling if save to server fails?
*/

class Profile extends React.Component {
  constructor(props) {
    super(props);
    const user = this.props.user;
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
      modalOpen: false,
      personalPopUp: false,
      fccPopUp: false,
      mentorshipPopUp: false,
      skillsPopUp: false,
      collaboPopUp: false,
      socialPopUp: false,
      careerPopUp: false,
    }
  }

  handleSubSaveClick = (e) => {
    e.stopPropagation();
    e.persist();
    updateUser(this.state.user).then(res => {
      const { updatedUser } = res.data;
      this.props.saveUser(updatedUser);
    }).catch(err => console.log(err));

    this.setState({ [e.target.id]: true });
    setTimeout( _ => this.resetPopUp(e.target.id), 1000);
  }

  resetPopUp = (id) => {
    this.setState({ [id]: false });
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
      this.setState({ modalOpen: true });
    }).catch(err => console.log(err));
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
            subSaveClick={this.handleSubSaveClick}
            showPopUp={this.state.personalPopUp}
            showProfile={this.state.showProfile}
            toggle={this.toggle}
            handleInputChange={this.handleInputChange}
            username={username}
            errors={errors }/>

          <Certifications
            toggle={this.toggle}
            subSaveClick={this.handleSubSaveClick}
            showPopUp={this.state.fccPopUp}
            showFCC={this.state.showFCC}
            fccCerts={this.state.user.fccCerts} />

          <Mentorship
            {...mentorship}
            subSaveClick={this.handleSubSaveClick}
            showPopUp={this.state.mentorshipPopUp}
            toggle={this.toggle}
            showMentorship={this.state.showMentorship}
            toggleMentorship={this.toggleMentorship}
            handleInputChange={this.handleInputChange} />

          {/* Think about allowing additions by user to dropdowns */}
          <SkillsAndInterests
            {...skillsAndInterests}
            subSaveClick={this.handleSubSaveClick}
            showPopUp={this.state.skillsPopUp}
            showSkills={this.state.showSkills}
            toggle={this.toggle}
            handleSkillsChange={this.handleSkillsChange}
            handleInterestsChange={this.handleInterestsChange} />

          <Collaboration
            username={username}
            subSaveClick={this.handleSubSaveClick}
            showPopUp={this.state.collaboPopUp}
            saveProjectsList={this.saveProjectsList}
            toggle={this.toggle}
            projects={this.state.user.projects}
            showCollaboration={this.state.showCollaboration} />

          <Social
            {...social}
            subSaveClick={this.handleSubSaveClick}
            showPopUp={this.state.socialPopUp}
            showSocial={this.state.showSocial}
            toggle={this.toggle}
            handleInputChange={this.handleInputChange}
            errors={errors} />

          <Career
            {...career}
            subSaveClick={this.handleSubSaveClick}
            showPopUp={this.state.careerPopUp}
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
