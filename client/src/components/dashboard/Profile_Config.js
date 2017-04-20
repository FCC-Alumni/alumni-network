
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import Social from './Profile/Social';
import UserLabel from '../common/UserLabel';
import PersonalInfo from './Profile/PersonalInfo';
import SkillsAndInterests from './Profile/SkillsAndInterests';
import { saveUser, updateUser, updateUserPartial } from '../../actions/user';
import { savePreferencesViewState } from '../../actions/views';
import { ThickPaddedBottom } from '../../styles/globalStyles';
import { countryCodes } from '../../assets/data/countries';
import Certifications from './Profile/Certifications';
import Collaboration from './Profile/Collaboration';
import { connectScreenSize } from 'react-screen-size';
import { mapScreenSizeToProps } from '../Navbar';
import Modal from './Profile/common/SaveModal';
import Mentorship from './Profile/Mentorship';
import { Button } from 'semantic-ui-react';
import styled from 'styled-components';
import Career from './Profile/Career';
import isEmpty from 'lodash/isEmpty';
import Validator from 'validator';

/*
TODO:
  - MENTORSHIP / VALIDATION: Require mentorship bio if either slider is toggled! √
  - MENTORSHIP: Revisit copy! Some of this info should be moved to the "about us" public page.
  - PERSONAL: Add info icon to email field, saying email will be publicly displayed if you provide it √
  - folder icon behavior - open when any field expanded
  - add validations for form fields - should be loose validations since nothing is strictly required √
  - error handling if save to server fails? √
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

const BottomButton = styled(Button)`
  right: 0;
  bottom: 35px;
`;

class Profile extends React.Component {
  constructor(props) {
    super(props);
    const { user, viewState } = this.props;
    this.state = {
      user,
      viewState,
      errors: {},
      modalOpen: false,
      isPageValid: true,
      profileWarning: '',
      socialPopUp: false,
      careerPopUp: false,
      projectsPopUp: false,
      personalPopUp: false,
      mentorshipPopUp: false,
      skillsAndInterestsPopUp: false,
    }
    // SHARED ERRORS:
    this.EMAIL_ERROR = "Please enter a valid email address."
    this.CAREER_ERROR = "Please complete the entire section or clear the form."
    this.CODEPEN_ERROR = "Please enter your username only, not your profile url.";
    this.MENTORSHIP_ERROR = "To complete your mentorship prorgram enrollment, please fill out the section above.";
  }

  componentWillUnmount() {
    this.props.savePreferencesViewState(this.state.viewState);
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
      if (this.isSectionValid(name, value)) {
        user.mentorship.mentorshipSkills = value;
      }
    } else {
      if (this.isSectionValid(name, value)) {
        user.personal[name] = value;
      }
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
    var { viewState, viewState: { showAll } } = this.state;
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

  saveChanges = (modal) => {
    if (this.isPageValid()) {
      updateUser(this.state.user).then(res => {
        const { updatedUser } = res.data;
        this.props.saveUser(updatedUser);
        modal && this.setState({ modalOpen: true });
      }).catch(err => console.log(err));
    } else {
      modal && this.setState({ modalOpen: true }, () => {
        var { viewState } = this.state;
        // open sections that have errors if they are closed
        if (this.state.errors.mentorshipSkills) {
          viewState.showMentorship = true;
          this.setState({ viewState });
        }
        if (this.state.errors.email) {
          viewState.showProfile = true;
          this.setState({ viewState });
        }
        if (this.state.errors.career) {
          viewState.showCareer = true;
          this.setState({ viewState });
        }
      });
    }
  }

  // now saves only section user clicks button for
  handleSubSaveClick = (e) => {
    e.stopPropagation();
    e.persist();

    const { user, user: { _id } } = this.state;
    const section = e.target.id.slice(0, -5);

    if (this.isSectionValid(section)) {
      updateUserPartial(_id, section, user[section]).then(res => {
        const { updatedUser } = res.data;
        this.props.saveUser(updatedUser);

        // open "Saved" popup
        this.setState({ [e.target.id]: true });

        // close popup 1 second later
        setTimeout( _ => this.resetPopUp(e.target.id), 1200);

      }).catch(err => console.log(err));
    }
  }

  resetPopUp = (id) => {
    this.setState({ [id]: false });
  }

  isSectionValid = (section, str) => {
    this.setState({ errors: {} });
    var errors = {};

    const {
      user: {
        social: { codepen },
        personal: { email },
        mentorship: { isMentor, isMentee, mentorshipSkills },
        career: { working, tenure, company, jobSearch },
      }
    } = this.state;

    if (section === 'social' && codepen && Validator.isURL(codepen)) {
      errors.codepen = this.CODEPEN_ERROR;
    }
    if (section === 'career') {
      if (working && working === 'no' && !tenure && !jobSearch) {
        errors.career = this.CAREER_ERROR;
      }
      if (working && working === 'yes' && !tenure && !company) {
        errors.career = this.CAREER_ERROR;
      }
    }
    if (section === 'personal' && email && !Validator.isEmail(email)) {
      errors.email = this.EMAIL_ERROR;
    }
    if (section === 'mentorship' && (isMentee || isMentor) && !mentorshipSkills) {
      errors.mentorshipSkills = this.MENTORSHIP_ERROR;
    }
    if (section === 'bio' && !Validator.isLength(str, { min: 0, max: 380 })) {
      errors.bio = "Bio must be 380 characters or less."
    }
    if (section === 'displayName' && !Validator.isLength(str, { min: 0, max: 40 })) {
      errors.displayName = "Display name must be 40 characters or less."
    }
    if (section === 'mentorshipSkills' && !Validator.isLength(str, { min: 0, max: 200 })) {
      errors.mentorshipSkills = "Mentorshio bio must be 200 characters or less."
    }

    if (isEmpty(errors)) {
      return true;
    } else {
      this.setState({ errors });
      return false;
    }
  }

  isPageValid = () => {
    this.setState({ errors: {} });
    var errors = {};
    var profileStrength = 0;

    const { user: {
        social: { codepen },
        personal: { email, bio, country, location },
        career: { working, tenure, company, jobSearch },
        skillsAndInterests: { codingInterests, coreSkills },
        mentorship: { isMentor, isMentee, mentorshipSkills },
      }
    } = this.state;

    if (codepen && Validator.isURL(codepen)) {
      errors.codepen = this.CODEPEN_ERROR;
    }
    if (email && !Validator.isEmail(email)) {
      errors.email = this.EMAIL_ERROR;
    }
    if ((isMentee || isMentor) && !mentorshipSkills) {
      errors.mentorshipSkills = this.MENTORSHIP_ERROR;
    }
    if (working && working === 'no' && !tenure && !jobSearch) {
      errors.career = this.CAREER_ERROR;
    }
    if (working && working === 'yes' && !tenure && !company) {
      errors.career = this.CAREER_ERROR;
    }

    if (bio) profileStrength++;
    if (country) profileStrength++;
    if (location) profileStrength++;

    if (isEmpty(codingInterests) && isEmpty(coreSkills)) {
      this.setState({ profileWarning: 'Stronger profiles make for a stronger and more effective community — consider telling us about your skills and interests so other members know what you rock at!' });
    } else if (!working) {
      this.setState({ profileWarning: 'Stronger profiles make for a stronger and more effective community — consider telling us about where you are in your programming career so other members will know how long you\'ve been coding for!' });
    } else if (profileStrength < 3) {
      this.setState({ profileWarning: 'Nice work! Your profile is looking pretty strong. Why not round it off with some information about yourself (bio, region, etc.) so other members can learn more about you?' });
    }

    if (isEmpty(errors)) {
      this.setState({ isPageValid: true });
      return true;
    } else {
      this.setState({ errors, isPageValid: false });
      return false;
    }
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

  clearCareerForm = () => {
    var { user, errors } = this.state;
    user.career.working = '';
    user.career.tenure = '';
    user.career.jobSearch = '';
    user.career.company = '';
    errors.career = '';
    this.setState({ user, errors });
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
        skillsAndInterests,
      },
      dismissedMessages
    } = this.state;

    const { isDesktop, isMobile } = this.props.screen;

    const TopButton = styled(Button)`
      height: 42px !important;
      padding: 10px !important;
      ${ !isDesktop && 'margin-top: 10px !important;'}
    `;

    const mobilePadding = isMobile ? { padding: '0 10px' } : {};

    return (
      <ThickPaddedBottom style={mobilePadding} className="ui container">
        <Modal
          size="small"
          close={this.closeModal}
          open={this.state.modalOpen}
          isValid={this.state.isPageValid}
          warning={this.state.isPageValid && this.state.profileWarning} />
        <UserLabel
          size="huge"
          username={username}
          image={personal.avatarUrl}
          toggleAll={this.toggleAll}
          folder={isDesktop ? this.state.viewState.showAll : ''}
          label={!isDesktop ? '' : mentorship.mentor ? 'Mentor' : 'Member'} />
        <TopButton
          icon="save"
          size="large"
          color="green"
          content="Save"
          floated={isDesktop && "right"}
          labelPosition="right"
          onClick={this.saveChanges} />
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
            clearForm={this.clearCareerForm}
            showPopUp={this.state.careerPopUp}
            subSaveClick={this.handleSubSaveClick}
            handleInputChange={this.handleInputChange}
            handleRadioChange={this.handleRadioChange}
            showCareer={this.state.viewState.showCareer}
            handleTenureChange={this.handleTenureChange} />
          <BottomButton
            icon="save"
            color="green"
            content="Save"
            floated="right"
            labelPosition="right"
            onClick={this.saveChanges} />
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

export default connectScreenSize(mapScreenSizeToProps)(
  connect(mapStateToProps, { saveUser, savePreferencesViewState })(Profile)
);
