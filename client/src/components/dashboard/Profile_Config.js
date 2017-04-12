/* eslint-disable */
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import Social from './Profile/Social';
import UserLabel from '../common/UserLabel';
import PersonalInfo from './Profile/PersonalInfo';
import SkillsAndInterests from './Profile/SkillsAndInterests';
import { saveUser, updateUser } from '../../actions/user';
import { ThickPaddedBottom } from '../../styles/globalStyles';
import { countryCodes } from '../../assets/data/countries';
import Certifications from './Profile/Certifications';
import { savePreferencesViewState } from '../../actions/views';
import Collaboration from './Profile/Collaboration';
import Modal from './Profile/common/SaveModal';
import Mentorship from './Profile/Mentorship';
import Career from './Profile/Career';
import Validator from 'validator';

/*
TODO:
  - MENTORSHIP / VALIDATION: Require mentorship bio if either slider is toggled!
  - MENTORSHIP: Revisit copy! Some of this info should be moved to the "about us" public page.
  - PERSONAL: Add info icon to email field, saying email will be publicly displayed if you provide it
  - add title and description fields for sharing repos
  - add error popup and modal for error on save
  - folder icon behavior - open when any field expanded
  - add validations for form fields - should be loose validations since nothing is strictly required
  - error handling if save to server fails?
  - use passport to pull in LinkedIn and Twitter handles √
  - we need to look at how users enter location (should have zip code or somehting and get location name by API - for D3 map as well!) √
  - MENTORSHIP: Looking for mentorship? If so, in what? Add new sliderToggle √
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
    this.props.savePreferencesViewState(this.state.viewState);
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

  toggleMenteeship = (bool) => {
    var { user } = this.state;
    user.mentorship.isMentee = bool;
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

  handleCountryChange = (e, data) => {
    var { user } = this.state;
    user.personal.flag = data.value;
    user.personal.country = countryCodes[data.value.replace(' ', '_')];
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
    }

    if (e.target.name === 'jobSearch') {
      user.career.jobSearch = e.target.id.replace(/_/g, ' ');
    }

    this.setState({ user });
  }

  handleInputChange = (e) => {
    var { user } = this.state;
    var { name, value } = e.target;

    if (e.target.name === 'company') {
      user.career.company = value;
    } else if (
      name === 'codepen' ||
      name === 'linkedin' ||
      name === 'twitter') {
      user.social[name] = value;
    } else if (name === 'mentorshipSkills' ) {
      if (this.isValid(name, value)) {
        user.mentorship.mentorshipSkills = value;
      }
    } else {
      if (this.isValid(name, value)) {
        user.personal[name] = value;
      }
    }

    this.setState({ user });
  }

  isValid = (field, str) => {
    var { errors } = this.state;

    if (field === 'bio') {
      if (Validator.isLength(str, { min: 0, max: 380 })) {
        errors.bio = '';
        this.setState({ errors });
        return true;
      } else {
        errors.bio = "Bio must be 380 characters or less."
        this.setState({ errors });
        return false;
      }
    }
    if (field === 'displayName') {
      if (Validator.isLength(str, { min: 0, max: 40 })) {
        errors.displayName = '';
        this.setState({ errors });
        return true;
      } else {
        errors.displayName = "Display name must be 50 characters or less."
        this.setState({ errors });
        return false;
      }
    }
    if (field === 'mentorshipSkills') {
      if (Validator.isLength(str, { min: 0, max: 200 })) {
        errors.mentorshipSkills = '';
        this.setState({ errors });
        return true;
      } else {
        errors.mentorshipSkills = "Mentorshio bio must be 200 characters or less."
        this.setState({ errors });
        return false;
      }
    }

    return true;
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

  saveChanges = (openModal) => {
    updateUser(this.state.user).then(res => {
      const { updatedUser } = res.data;
      this.props.saveUser(updatedUser);
      openModal && this.setState({ modalOpen: true });
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
      <ThickPaddedBottom className="ui container">

        <UserLabel
          size="huge"
          username={username}
          image={personal.avatarUrl}
          toggleAll={this.toggleAll}
          folder={this.state.viewState.showAll}
          label={mentorship.mentor ? 'Mentor' : 'Member'} />

        <div onClick={this.saveChanges} id="saveButton" className="ui huge green label">
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
            country={personal.flag}
            showPopUp={this.state.personalPopUp}
            subSaveClick={this.handleSubSaveClick}
            handleInputChange={this.handleInputChange}
            showProfile={this.state.viewState.showProfile}
            handleCountryChange={this.handleCountryChange} />

          <Certifications
            toggle={this.toggle}
            showPopUp={this.state.fccPopUp}
            fccCerts={this.state.user.fccCerts}
            showFCC={this.state.viewState.showFCC} />

          <Mentorship
            {...mentorship}
            toggle={this.toggle}
            error={errors.mentorshipSkills}
            subSaveClick={this.handleSubSaveClick}
            showPopUp={this.state.mentorshipPopUp}
            toggleMentorship={this.toggleMentorship}
            toggleMenteeship={this.toggleMenteeship}
            handleInputChange={this.handleInputChange}
            handleRadioChange={this.handleRadioChange}
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
            saveChanges={this.saveChanges}
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
      </ThickPaddedBottom>
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
  user: propTypes.object.isRequired,
  viewState: propTypes.object
}

export default connect(mapStateToProps, { saveUser, savePreferencesViewState })(Profile);
