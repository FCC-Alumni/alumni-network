/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';

import UserLabel from '../common/UserLabel';
import Modal from './Profile/common/SaveModal';

import Social from './Profile/Social';
import Career from './Profile/Career';
import Mentorship from './Profile/Mentorship';
import PersonalInfo from './Profile/PersonalInfo';
import Collaboration from './Profile/Collaboration';
import Certifications from './Profile/Certifications';
import SkillsAndInterests from './Profile/SkillsAndInterests';

import { saveUser, updateUser, saveViewState } from '../../actions/user';

/*
TODO:
  - we need to look at how users enter location (should have zip code or somehting and get location name by API - for D3 map as well!)
  - add error popup and modal for error on save
  - folder icon behavior - open when any field expanded
  - add validations for form fields - should be loose validations since nothing is strictly required
  - use passport to pull in LinkedIn and Twitter handles
  - error handling if save to server fails?
  - save individual section √
  - save all √
  - connect to DB √
  - connect to redux √
  - add career form / questionaire √
  - areas of mentorship √
*/

class Profile extends React.Component {
  constructor(props) {
    super(props);
    const { user, viewState } = this.props;
    this.state = {
      user,
      viewState,
      errors: {},
      modalOpen: false,
      fccPopUp: false,
      skillsPopUp: false,
      socialPopUp: false,
      careerPopUp: false,
      collaboPopUp: false,
      personalPopUp: false,
      mentorshipPopUp: false,
    }
  }

  componentWillUnmount() {
    this.props.saveViewState(this.state.viewState);
  }

  handleSubSaveClick = (e) => {
    e.stopPropagation();
    e.persist();
    updateUser(this.state.user).then(res => {
      const { updatedUser } = res.data;
      this.props.saveUser(updatedUser);
      this.setState({ [e.target.id]: true });
      setTimeout( _ => this.resetPopUp(e.target.id), 1000);
    }).catch(err => console.log(err));
  }

  resetPopUp = (id) => {
    this.setState({ [id]: false });
  }

  saveProjectsList = (items_list) => {
    var { user } = this.state;
    user.projects = items_list;
    this.setState({ user });
  }

  toggleMentorship = (bool) => {
    var { user } = this.state;
    user.mentorship.isMentor = bool;
    this.setState({ user });
  }

  handleSkillsChange = (e, data) => {
    var { user } = this.state;
    user.skillsAndInterests.coreSkills = data.value;
    this.setState({ user });
  }

  handleInterestsChange = (e, data) => {
    var { user } = this.state;
    user.skillsAndInterests.codingInterests = data.value;
    this.setState({ user });
  }

  handleTenureChange = (e, data) => {
    var { user } = this.state;
    user.career.tenure = data.value;
    this.setState({ user });
  }

  handleRadioChange = (e) => {
    var { user } = this.state;
    if (e.target.name === 'working') {
      if (e.target.id === 'Yes') {
        user.career.jobSearch = '';
        user.career.working = 'yes';
      } else if (e.target.id === 'No') {
        user.career.tenure = '';
        user.career.company = '';
        user.career.working = 'no';
      }
    } else if (e.target.name === 'jobSearch') {
      user.career.jobSearch = e.target.id.replace(/_/g, ' ');
    }
    this.setState({ user });
  }

  handleInputChange = (e) => {
    var { user } = this.state;

    if (e.target.name === 'company') {
      user.career.company = e.target.value;
    } else if (
      e.target.name === 'codepen' ||
      e.target.name === 'linkedin' ||
      e.target.name === 'twitter') {
      user.social[e.target.name] = e.target.value;
    } else if (e.target.name === 'mentorshipSkills' ) {
      user.mentorship.mentorshipSkills = e.target.value;
    } else {
      user.personal[e.target.name] = e.target.value;
    }

    this.setState({ user });
  }

  toggle = (target) => {
    const { viewState } = this.state;
    /* we pass callback to setState to catch state after update
      in case all the modals are now open or closed */
    viewState[target] = !viewState[target];
    this.setState({ viewState }, () => {
      if (
        !viewState.showFCC &&
        !viewState.showSkills &&
        !viewState.showSocial &&
        !viewState.showCareer &&
        !viewState.showProfile &&
        !viewState.showMentorship &&
        !viewState.showCollaboration
      ) {
          viewState.showAll = false;
          this.setState({ viewState });
      } else if (
        viewState.showFCC &&
        viewState.showSocial &&
        viewState.showSkills &&
        viewState.showCareer &&
        viewState.showProfile &&
        viewState.showMentorship &&
        viewState.showCollaboration
      ) {
          viewState.showAll = true;
          this.setState({ viewState });
      }
    });
  }

  toggleAll = () => {
    const { viewState, viewState: { showAll } } = this.state;
    viewState.showAll = !showAll;
    viewState.showFCC = !showAll;
    viewState.showCareer = !showAll;
    viewState.showSkills = !showAll;
    viewState.showSocial = !showAll;
    viewState.showProfile = !showAll;
    viewState.showMentorship = !showAll;
    viewState.showCollaboration = !showAll;
    this.setState({ viewState });
  }

  saveChanges = () => {
    updateUser(this.state.user).then(res => {
      const { updatedUser } = res.data;
      this.props.saveUser(updatedUser);
      this.setState({ modalOpen: true });
    }).catch(err => console.log(err));
  }

  clearSocialInput = (site) => {
    var { user } = this.state;
    user.social[site] = '';
    this.setState({ user }, () => {
      updateUser(user).then(res => {
        const { updatedUser } = res.data;
        this.props.saveUser(updatedUser);
      });
    });
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  }

  render() {

    const {
      errors,
      user: {
        social,
        career,
        personal,
        username,
        mentorship,
        skillsAndInterests
      }
    } = this.state;

    return (
      <div id="profile-page-main-container" className="ui container">

        <UserLabel
          size="huge"
          username={username}
          image={personal.avatarUrl}
          toggleAll={this.toggleAll}
          folder={this.state.viewState.showAll}
          label={mentorship.mentor ? 'Mentor' : 'Member'} />

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
            errors={errors }
            toggle={this.toggle}
            username={username}
            showPopUp={this.state.personalPopUp}
            subSaveClick={this.handleSubSaveClick}
            handleInputChange={this.handleInputChange}
            showProfile={this.state.viewState.showProfile} />

          <Certifications
            toggle={this.toggle}
            showPopUp={this.state.fccPopUp}
            fccCerts={this.state.user.fccCerts}
            subSaveClick={this.handleSubSaveClick}
            showFCC={this.state.viewState.showFCC} />

          <Mentorship
            {...mentorship}
            toggle={this.toggle}
            subSaveClick={this.handleSubSaveClick}
            showPopUp={this.state.mentorshipPopUp}
            toggleMentorship={this.toggleMentorship}
            handleInputChange={this.handleInputChange}
            showMentorship={this.state.viewState.showMentorship} />

          {/* Think about allowing additions by user to dropdowns */}
          <SkillsAndInterests
            toggle={this.toggle}
            {...skillsAndInterests}
            showPopUp={this.state.skillsPopUp}
            subSaveClick={this.handleSubSaveClick}
            showSkills={this.state.viewState.showSkills}
            handleSkillsChange={this.handleSkillsChange}
            handleInterestsChange={this.handleInterestsChange} />

          <Collaboration
            username={username}
            toggle={this.toggle}
            projects={this.state.user.projects}
            showPopUp={this.state.collaboPopUp}
            subSaveClick={this.handleSubSaveClick}
            saveProjectsList={this.saveProjectsList}
            showCollaboration={this.state.viewState.showCollaboration} />

          <Social
            {...social}
            errors={errors}
            toggle={this.toggle}
            clear={this.clearSocialInput}
            showPopUp={this.state.socialPopUp}
            subSaveClick={this.handleSubSaveClick}
            handleInputChange={this.handleInputChange}
            showSocial={this.state.viewState.showSocial} />

          <Career
            {...career}
            errors={errors}
            toggle={this.toggle}
            showPopUp={this.state.careerPopUp}
            subSaveClick={this.handleSubSaveClick}
            handleInputChange={this.handleInputChange}
            handleRadioChange={this.handleRadioChange}
            showCareer={this.state.viewState.showCareer}
            handleTenureChange={this.handleTenureChange} />

        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    viewState: state.profileViewState
  }
}

Profile.propTypes = {
  user: React.PropTypes.object.isRequired,
  viewState: React.PropTypes.object
}

export default connect(mapStateToProps, { saveUser, saveViewState })(Profile);
