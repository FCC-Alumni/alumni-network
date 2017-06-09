// beginning to alphabetize imports for best practices
import { Button } from 'semantic-ui-react';
import Career from './Profile/Preferences/Career';
import Certifications from './Profile/Preferences/Certifications';
import Collaboration from './Profile/Preferences/Collaboration';
import { connect } from 'react-redux';
import { connectScreenSize } from 'react-screen-size';
import { countryCodes } from '../../assets/dropdowns/countries';
import { findIndex } from 'lodash';
import interests from '../../assets/dropdowns/interests';
import { isEmpty } from 'lodash';
import { mapScreenSizeToProps } from '../Navbar';
import Mentorship from './Profile/Preferences/Mentorship';
import Modal from './Profile/Preferences/common/SaveModal';
import PersonalInfo from './Profile/Preferences/PersonalInfo';
import propTypes from 'prop-types';
import React from 'react';
import { savePreferencesViewState } from '../../actions/views';
import { saveUser, updateUser, updateUserPartial } from '../../actions/user';
import skills from '../../assets/dropdowns/skills';
import SkillsAndInterests from './Profile/Preferences/SkillsAndInterests';
import Social from './Profile/Preferences/Social';
import styled from 'styled-components';
import swearjar from '../../assets/helpers/swearjar-lite';
import { ThickPaddedBottom } from '../../styles/style-utils';
import UserLabel from '../dashboard/common/UserLabel';
import Validator from 'validator';
import __ from '../../assets/helpers/validations';

/*
TODO:
  - PERSONAL INFO: validation to require user to enter country to collect data for D3 map?
  - GENERAL: Refactor validation code, kind of reduntant and could be improved (isPageValid && isSectionValid)
*/

const BottomButton = styled(Button)`
  right: 0;
  bottom: 35px;
`;

const Container = styled(ThickPaddedBottom)`
  @media (max-width: 770px) {
    padding: 0 10px 50px 10px !important;
  }
`;

const TopButton = styled(Button)`
  height: 42px !important;
  padding: 10px !important;
  @media (max-width: 959px) {
    margin-top: 10px !important;
  }
  @media (min-width: 959px) {
    float: right !important;
  }
`;

class Preferences extends React.Component {
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
      showBottomButton: false,
      skillsAndInterestsPopUp: false,
      interestsOptions: [],
      skillsOptions: [],
    }
    // SHARED VALIDATION ERRORS:
    this.EMAIL_ERROR = 'Please enter a valid email address.';
    this.LOCATION_ERROR = 'Location must be 25 characters or less.';
    this.DISPLAY_NAME_ERROR = 'Display name must be 40 characters or less.';
    this.CAREER_ERROR = 'Please complete the entire section or clear the form.';
    this.CODEPEN_ERROR = 'Please enter your username only, not your profile url.';
    this.COUNTRY_ERROR = 'Please select your country (so we can make a cool D3 map!).';
    this.MENTORSHIP_ERROR = 'To complete your mentorship prorgram enrollment, please complete the section above.';
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handleScroll);
    var { user } = this.state;
    /* add user-added, non-default skills to skillsOptions for
    correct rendering of multi-select dropdown component... */
    let skillsOptions = skills;
    user.skillsAndInterests.coreSkills.forEach(value => {
      if (findIndex(skillsOptions, { text: value, value }) === -1) {
        skillsOptions = [{ text: value, value }, ...skillsOptions];
      }
    });
    // ...then add non-default interests
    let interestsOptions = interests;
    user.skillsAndInterests.codingInterests.forEach(value => {
      if (findIndex(interestsOptions, { text: value, value }) === -1) {
        interestsOptions = [{ text: value, value }, ...interestsOptions];
      }
    });
    this.setState({ skillsOptions, interestsOptions });
  }

  componentWillUnmount() {
    this.props.savePreferencesViewState(this.state.viewState);
    document.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (e) => {
    if (e.target.scrollingElement.scrollTop >= 60) {
      this.setState({ showBottomButton: true });
    } else {
      this.setState({ showBottomButton: false });
    }
  }

  /**********************
  HANDLE CHANGE FUNCTIONS
  **********************/

  handleSkillsChange = (e, { value }) => {
    var { user } = this.state;
    user.skillsAndInterests.coreSkills = value;
    this.setState({ user });
  }

  // lets user add skill not in dropdown
  handleAddSkill = (e, { value }) => {
    if (!swearjar.profane(value)) {
      var { user, skillsOptions } = this.state;
      /* if skill not already in dropdown options, temporarily
      add it to options list so that semantic-ui-react component
      will display it as choice and add new choice to user object */
      if (findIndex(skillsOptions, { text: value, value }) === -1) {
        skillsOptions = [{ text: value, value }, ...skillsOptions];
        user.skillsAndInterests.coreSkills.push(value);
      }
      this.setState({ skillsOptions, user });
    }
  }

  handleInterestsChange = (e, { value }) => {
    var { user } = this.state;
    user.skillsAndInterests.codingInterests = value;
    this.setState({ user });
  }

  // lets user add interest not in dropdown
  handleAddInterest = (e, { value }) => {
    if (!swearjar.profane(value)) {
      var { user, interestsOptions } = this.state;
      /* if interest not already in dropdown options, temporarily
      add it to options list so that semantic-ui-react component
      will display it as choice and add new choice to user object */
      if (findIndex(interestsOptions, { text: value, value }) === -1) {
        interestsOptions = [{ text: value, value }, ...interestsOptions];
        user.skillsAndInterests.codingInterests.push(value);
      }
      this.setState({ interestsOptions, user });
    }
  }

  handleCountryChange = (e, { value }) => {
    var { user } = this.state;
    user.personal.flag = value;
    user.personal.country = countryCodes[value.replace(' ', '_')];
    this.setState({ user });
  }

  handleTenureChange = (e, { value }) => {
    var { user } = this.state;
    user.career.tenure = value;
    this.setState({ user });
  }

  handleRadioChange = ({ target: { name, id }}) => {
    var { user } = this.state;
    switch (name) {
      case 'isEmployed':
        if (id === 'Yes') {
          user.career.jobSearch = '';
          user.career.working = 'yes';
        }
        if (id === 'No') {
          user.career.tenure = '';
          user.career.company = '';
          user.career.working = 'no';
        }
        break;
      default:
        user.career.jobSearch = id.replace(/_/g, ' ');
        break;
    }
    this.setState({ user });
  }

  handleInputChange = ({target: { name, value }}) => {
    var { user } = this.state;
    switch (name) {
      case 'company':
        // validation happens on save action for these
        if (this.isFieldValid(name, value))
          user.career.company = swearjar.censor(value);
        break;
      case 'codepen':
        user.social.codepen = value;
        break;
      case 'email':
        user.personal.email.email = value;
        break;
      case 'mentorshipSkills':
        // these require real-time validations
        if (this.isFieldValid(name, value))
          user.mentorship.mentorshipSkills = swearjar.censor(value);
        break;
      default:
        if (this.isFieldValid(name, value))
          user.personal[name] = swearjar.censor(value);
        break;
    }
    this.setState({ user });
  }

  /*************
  SAVE FUNCTIONS
  *************/

  handleSaveSection = (e) => {
    e.stopPropagation();
    e.persist();
    const { user, user: { _id } } = this.state;
    const section = e.target.id.slice(0, -5);
    if (this.isSectionValid(section)) {
      updateUserPartial(_id, section, user[section]).then(res => {
        const { updatedUser } = res.data;
        this.props.saveUser(updatedUser);
        // open "saved" popup
        this.setState({ [e.target.id]: true });
        // close popup 1 second later
        setTimeout( _ => this.resetPopUp(e.target.id), 1200);
      }).catch(err => console.log(err));
    }
  }

  handleSaveAll = (openModal = false) => {
    if (this.isPageValid()) {
      // if no errors, determine profile strength
      this.profileStrenth();
      // then update user in mongo and update store
      updateUser(this.state.user).then(res => {
        const { updatedUser } = res.data;
        this.props.saveUser(updatedUser);
        /* this function is shared. only open success modal
        when called from profile page "save" buttons. pass
        in "open modal" to override default argument */
        openModal && this.setState({ modalOpen: true });
      }).catch(err => console.log(err));
    } else {
      /* open error modal and
      reveal sections with errors */
      openModal && this.showErrors();
    }
  }

  saveProjectsList = (items_list) => {
    var { user } = this.state;
    user.projects = items_list;
    this.setState({ user });
  }

  /*******************
  VALIDATIOR FUNCTIONS
  *******************/

  isFieldValid = (field, str) => {
    // reset errors on change
    this.setState({ errors: {} });
    var errors = {};
    // validations:
    switch (field) {
      case 'location':
        if (!__.validateTwentyFiveChars(str))
          errors.location = this.LOCATION_ERROR;
        break;
      case 'displayName':
        if (!__.validateDisplayName(str))
          errors.displayName = this.DISPLAY_NAME_ERROR;
        break;
      case 'bio':
        if (!__.validateBio(str))
          errors.bio = 'Bio must be 300 characters or less.';
        break;
      case 'company':
        if (!__.validate25Chars(str))
          errors.company = 'Company must be 25 characters or less.';
        break;
      case 'mentorshipSkills':
        if (!__.validateMentorshipBio(str))
          errors.mentorshipSkills = 'Mentorshio bio must be 200 characters or less.';
        break;
      default: return;
    }
    return this.setErrors(errors);
  }

  isSectionValid = (section, str) => {
    var errors = {};
    const { user } = this.state;
    const { email } = this.state.user.personal;
    const { personal, social } = this.state.user;

    switch (section) {
      case 'career':
        if (!__.validateCareer(user.career))
          errors.career = this.CAREER_ERROR;
        break;
      case 'social':
        if (!__.validateCodePen(social.codepen))
          errors.codepen = this.CODEPEN_ERROR;
        break;
      case 'personal':
        if (!__.validateEmail(email.email))
          errors.email = this.EMAIL_ERROR;
        if (!__.validateCountry(personal.country))
          errors.country = this.COUNTRY_ERROR;
        if (!__.validate25Chars(personal.location))
          errors.location = this.LOCATION_ERROR;
        if (!__.validateDisplayName(personal.displayName))
          errors.displayName = this.DISPLAY_NAME_ERROR;
        break;
      case 'mentorship':
        if (!__.validateMentorshipSection(user.mentorship))
          errors.mentorshipSkills = this.MENTORSHIP_ERROR;
        break;
      default: return;
    }
    return this.setErrors(errors);
  }

  /* locations & displayName validations in isPageValid & in isSectionValid
  seem reduntant with onChange isFieldValid validations but are needed
  in case pre-loaded github data breaks validatiion rules - this
  would not trigger an onChange error */

  isPageValid = () => {
    var errors = {};
    const { user } = this.state;
    const { email } = this.state.user.personal;
    const { personal, social } = this.state.user;

    if (!__.validateCareer(user.career))
      errors.career = this.CAREER_ERROR;
    if (!__.validateEmail(email.email))
      errors.email = this.EMAIL_ERROR;
    if (!__.validateCodePen(social.codepen))
      errors.codepen = this.CODEPEN_ERROR;
    if (!__.validateCountry(personal.country))
      errors.country = this.COUNTRY_ERROR;
    if (!__.validate25Chars(personal.location))
      errors.location = this.LOCATION_ERROR;
    if (!__.validateDisplayName(personal.displayName))
      errors.displayName = this.DISPLAY_NAME_ERROR;
    if (!__.validateMentorshipSection(user.mentorship))
      errors.mentorshipSkills = this.MENTORSHIP_ERROR;

    return this.setErrors(errors, 'page validator');
  }

  setErrors = (errors, isPageValidation = false) => {
    this.setState({ errors });
    if (!isPageValidation) {
      if (isEmpty(errors)) {
        return true;
      } else {
        return false;
      }
    } else {
      if (isEmpty(errors)) {
        this.setState({ isPageValid: true });
        return true;
      } else {
        this.setState({ errors, isPageValid: false });
        return false;
      }
    }
  }

  /*****************
  HELPERS FUNCTIONS
  *****************/

  showErrors = () => {
    // reveals errors on page => global "save" buttons
    this.setState({ modalOpen: true }, () => {
      var { viewState, errors } = this.state;
      if (errors.email || errors.country ||
            errors.location || errors.displayName)
        viewState.showProfile = true;
      if (errors.codepen)
        viewState.showSocial = true;
      if (errors.career)
        viewState.showCareer = true;
      if (errors.mentorshipSkills)
        viewState.showMentorship = true;
      this.setState({ viewState });
    });
  }

  profileStrenth = () => {
    const {
      user: {
        career,
        personal,
        skillsAndInterests: {
          codingInterests,
          coreSkills
        }
      }
    } = this.state;
    var profileStrength = 0;
    if (personal.bio) profileStrength++;
    if (personal.country) profileStrength++;
    if (personal.location) profileStrength++;
    /* determine profile strength on save and show
    gentle warnings about making profile stronger */
    if (isEmpty(codingInterests) && isEmpty(coreSkills)) {
      this.setState({
        profileWarning:
          `Stronger profiles make for a stronger and
           more effective community — consider telling
           us about your skills and interests so other
           members know what you rock at!`
      });
    } else if (!career.working) {
      this.setState({
        profileWarning:
          `Stronger profiles make for a stronger and
           more effective community — consider telling
           us about where you are in your programming
           career so other members will know how long
           you've been coding for!`
      });
    } else if (profileStrength < 3) {
      this.setState({
        profileWarning:
          `Nice work! Your profile is looking pretty
           strong. Why not round it off with some
           information about yourself (bio, region, etc.)
           so other members can learn more about you?`
      });
    }
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  }

  resetPopUp = (id) => {
    this.setState({ [id]: false });
  }

  toggleMentorship = (bool, id) => {
    var { user } = this.state;
    if (id === 'mentorship') {
      user.mentorship.isMentor = bool;
    } else {
      user.mentorship.isMentee = bool;
    }
    this.setState({ user });
  }

  toggleEmailVisibilty = () => {
    var { user } = this.state;
    if (user.personal.email.private)
    user.personal.email.private = false;
    else user.personal.email.private = true;
    this.setState({ user });
  }

  clearSocialInput = (site) => {
    // clear LI / twitter field
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
    // reset career form
    var { user, errors } = this.state;
    user.career.working = '';
    user.career.tenure = '';
    user.career.jobSearch = '';
    user.career.company = '';
    errors.career = '';
    this.setState({ user, errors });
  }

  toggleShowSection = (target) => {
    const { viewState } = this.state;
    /* we pass callback to setState to catch
    state after update in case all sections
    are open or all sections are closed */
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

  toggleShowAllSections = () => {
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
    } = this.state;

    const { isDesktop } = this.props.screen;

    return (
      <Container className="ui container">
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
          toggleAll={this.toggleShowAllSections}
          folder={isDesktop ? this.state.viewState.showAll : ''}
          label={!isDesktop ? '' : mentorship.mentor ? 'Mentor' : 'Member'} />
        <TopButton
          icon="save"
          size="large"
          color="green"
          content="Save"
          labelPosition="right"
          onClick={() => this.handleSaveAll('open modal')} />
          {/* floated prop throws invalid propType warning - expects only 'right' or 'left' */}
        <div className="ui raised segment">
          <PersonalInfo
            {...personal}
            errors={errors}
            country={personal.flag}
            email={personal.email.email}
            toggle={this.toggleShowSection}
            isPrivate={personal.email.private}
            saveSection={this.handleSaveSection}
            showPopUp={this.state.personalPopUp}
            handleInputChange={this.handleInputChange}
            showProfile={this.state.viewState.showProfile}
            toggleEmailVisibilty={this.toggleEmailVisibilty}
            handleCountryChange={this.handleCountryChange} />
          <Certifications
            toggle={this.toggleShowSection}
            fccCerts={this.state.user.fccCerts}
            showFCC={this.state.viewState.showFCC} />
          <Mentorship
            {...mentorship}
            toggle={this.toggleShowSection}
            error={errors.mentorshipSkills}
            saveSection={this.handleSaveSection}
            showPopUp={this.state.mentorshipPopUp}
            toggleMentorship={this.toggleMentorship}
            toggleMenteeship={this.toggleMenteeship}
            handleInputChange={this.handleInputChange}
            handleRadioChange={this.handleRadioChange}
            showMentorship={this.state.viewState.showMentorship} />
          <SkillsAndInterests
            {...skillsAndInterests}
            toggle={this.toggleShowSection}
            saveSection={this.handleSaveSection}
            handleAddSkill={this.handleAddSkill}
            skillsOptions={this.state.skillsOptions}
            handleAddInterest={this.handleAddInterest}
            showSkills={this.state.viewState.showSkills}
            handleSkillsChange={this.handleSkillsChange}
            interestsOptions={this.state.interestsOptions}
            showPopUp={this.state.skillsAndInterestsPopUp}
            handleInterestsChange={this.handleInterestsChange} />
          <Collaboration
            username={username}
            toggle={this.toggleShowSection}
            saveChanges={this.handleSaveAll}
            projects={this.state.user.projects}
            showPopUp={this.state.projectsPopUp}
            saveSection={this.handleSaveSection}
            saveProjectsList={this.saveProjectsList}
            showCollaboration={this.state.viewState.showCollaboration} />
          <Social
            {...social}
            errors={errors}
            clear={this.clearSocialInput}
            toggle={this.toggleShowSection}
            saveChanges={this.handleSaveAll}
            showPopUp={this.state.socialPopUp}
            saveSection={this.handleSaveSection}
            handleInputChange={this.handleInputChange}
            showSocial={this.state.viewState.showSocial} />
          <Career
            {...career}
            errors={errors}
            toggle={this.toggleShowSection}
            clearForm={this.clearCareerForm}
            showPopUp={this.state.careerPopUp}
            saveSection={this.handleSaveSection}
            handleInputChange={this.handleInputChange}
            handleRadioChange={this.handleRadioChange}
            showCareer={this.state.viewState.showCareer}
            handleTenureChange={this.handleTenureChange}
            bigBottomMargin={this.state.showBottomButton} />
       { this.state.showBottomButton &&
         <BottomButton
            icon="save"
            color="green"
            content="Save"
            floated="right"
            labelPosition="right"
            onClick={() => this.handleSaveAll('open modal')} /> }
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    viewState: state.profileViewState
  }
}

Preferences.propTypes = {
  viewState: propTypes.object,
  user: propTypes.object.isRequired,
}

export default connectScreenSize(mapScreenSizeToProps)(
  connect(mapStateToProps, { saveUser, savePreferencesViewState })(Preferences));
