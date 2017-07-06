import { connectScreenSize } from 'react-screen-size';
import { isEqual } from 'lodash';
import { mapScreenSizeToProps } from '../../../Navbar';
import MessageBox from '../../common/MessageBox';
import propTypes from 'prop-types';
import React from 'react';
import Ribbon from './common/RibbonHeader';
import SliderToggle from './common/SliderToggle';
import { TransitionContainer } from '../../../../styles/style-utils';

class Mentorship extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }
  render() {
    const {
      error,
      handleInputChange,
      isMentee,
      isMentor,
      mentorshipSkills,
      saveSection,
      screen: { isMobile, isTablet },
      showMentorship,
      showPopUp,
      toggle,
      toggleMentorship,
    } = this.props;
    return (
      <div>
        <Ribbon
          content="Mentorship Program"
          id="mentorshipPopUp"
          onClick={() => toggle('showMentorship')}
          saveSection={saveSection}
          showPopUp={showPopUp}
          showSave={showMentorship} />
        <TransitionContainer isExpanded={showMentorship}>
          <MessageBox
            header="Would you like to be a mentor?"
<<<<<<< 0f5c92c7cb73056e3aedd0a775f3d72099ddb2e4
            message="The main goal of this community is to bring together
            programmers of varying degrees of skill, and connect them with
            one another to form meaningful mentor/mentee relationships. If
            you are interested in becoming a mentor, please toggle the switch
            and provide a short description of the core competencies you feel
            comortable mentoring others in. Your profile will be searchable
            based on all the criteria provided here for prospective mentees
            who can contact you via private chat, or your email if you provide
            it. We encourage all members to be proactive and creative in
            building these relationships!"
            type="info" />
=======
            message="The main goal of this community is to bring together programmers of varying degrees of skill,
            and connect them with one another to form meaningful mentor/mentee relationships. If you are interested
            in becoming a mentor, please toggle the switch and provide a short description of the core competencies
            you feel comortable mentoring others in. Your profile will be searchable based on all the criteria
            provided here for prospective mentees who can contact you via private Giter chat, or your email if you provide
            it. We encourage all members to be proactive and creative in building these relationships!" />
>>>>>>> remove chat from codebase
          <SliderToggle
            defaultOn={isMentor ? true : false}
            id="mentorship"
            label="I would like to be a mentor."
            saveStateToParent={toggleMentorship} />
          <SliderToggle
            defaultOn={isMentee ? true : false}
            id="menteeship"
            label="I would like to be mentored."
            saveStateToParent={toggleMentorship} />
          <div className="ui form">
            <TransitionContainer
              className={`ui ${isMobile
                ? 'fluid'
                : isTablet
                ? 'eight wide'
                : 'six wide'} field`}
              isExpanded={isMentor || isMentee}>
              <label>{'Mentorship Bio'}</label>
              <textarea
                name="mentorshipSkills"
                onChange={handleInputChange}
                placeholder="Please provide a short description of the skills
                you feel comfortable providing mentorship for and / or the
                areas you are looking for mentorship in."
                rows="3"
                style={{ marginBottom: 8 }}
                value={mentorshipSkills} />
              { error &&
                <div
                  className="ui red basic label"
                  style={{ marginTop: 10 }}>
                  {error}
                </div> }
            </TransitionContainer>
          </div>
        </TransitionContainer>
      </div>
    );
  }
}

Mentorship.propTypes = {
  error: propTypes.string,
  handleInputChange: propTypes.func.isRequired,
  isMentor: propTypes.bool.isRequired,
  isMobile: propTypes.bool,
  isTablet: propTypes.bool,
  mentorshipSkills: propTypes.string.isRequired,
  saveSection: propTypes.func.isRequired,
  showMentorship: propTypes.bool.isRequired,
  showPopUp: propTypes.bool.isRequired,
  toggle: propTypes.func.isRequired,
  toggleMentorship: propTypes.func.isRequired,
}

Mentorship.defaultProps = {
  error: ''
}

export default connectScreenSize(mapScreenSizeToProps)(Mentorship);
