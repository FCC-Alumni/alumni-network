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
          id="mentorshipPopUp"
          showPopUp={showPopUp}
          showSave={showMentorship}
          content="Mentorship Program"
          saveSection={saveSection}
          onClick={() => toggle('showMentorship')} />
        <TransitionContainer isExpanded={showMentorship}>
          <MessageBox
            type="info"
            header="Would you like to be a mentor?"
            message="The main goal of this community is to bring together programmers of varying degrees of skill,
            and connect them with one another to form meaningful mentor/mentee relationships. If you are interested
            in becoming a mentor, please toggle the switch and provide a short description of the core competencies
            you feel comortable mentoring others in. Your profile will be searchable based on all the criteria
            provided here for prospective mentees who can contact you via private chat, or your email if you provide
            it. We encourage all members to be proactive and creative in building these relationships!" />
          <SliderToggle
            id="mentorship"
            defaultOn={isMentor ? true : false}
            saveStateToParent={toggleMentorship}
            label="I would like to be a mentor." />
          <SliderToggle
            id="menteeship"
            defaultOn={isMentee ? true : false}
            saveStateToParent={toggleMentorship}
            label="I would like to be mentored." />
          <div className="ui form">
            <TransitionContainer isExpanded={isMentor || isMentee} className={`ui ${isMobile ? 'fluid' : isTablet ? 'eight wide' : 'six wide'} field`}>
              <label>Mentorship Bio</label>
              <textarea
                rows="3"
                name="mentorshipSkills"
                value={mentorshipSkills}
                style={{ marginBottom: 8 }}
                onChange={handleInputChange}
                placeholder="Please provide a short description of the skills you feel comfortable providing mentorship for and / or the areas you are looking for mentorship in." />
              { error &&
                <div style={{ marginTop: 10 }} className="ui red basic label">
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
