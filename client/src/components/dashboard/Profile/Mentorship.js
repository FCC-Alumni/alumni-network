import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';
import Ribbon from './common/RibbonHeader';
import MessageBox from '../../common/MessageBox';
import { mapScreenSizeToProps } from '../../Navbar';
import SliderToggle from '../../common/SliderToggle';
import { connectScreenSize } from 'react-screen-size';
import { isEqual } from 'lodash';

const Textarea = styled.textarea`
  margin-bottom: 8px !important;
`;

class Mentorship extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }
  render() {
    const {
      error,
      toggle,
      isMentor,
      isMentee,
      showPopUp,
      subSaveClick,
      showMentorship,
      mentorshipSkills,
      toggleMentorship,
      toggleMenteeship,
      handleInputChange,
      handleRadioChange,
      screen: { isMobile, isTablet },
    } = this.props;
    return (
      <div>
        <Ribbon
          id="mentorshipPopUp"
          showPopUp={showPopUp}
          showSave={showMentorship}
          content="Mentorship Program"
          subSaveClick={subSaveClick}
          onClick={()=>{toggle('showMentorship')}} />
        <div className={`mentorshipPane ${showMentorship ? 'show' : 'hide'}`}>
          <MessageBox
            type="info"
            header="Would you like to be a mentor?"
            message="The main goal of this community is to bring together programmers of varying degrees of skill,
            and connect them with one another to form meaningful mentor/mentee relationships. If you are interested
            in becoming a mentor, please toggle the switch and provide a short description of the core competencies
            you could mentor others in. Your profile will be searchable based on all the criteria provided here for
            prospective mentees who can contact you via private chat, or your email if you provide it. We encourage
            all members to be proactive and creative in building these relationships!" />
          <SliderToggle
            defaultOn={isMentor ? true : false}
            saveStateToParent={toggleMentorship}
            label="I would like to be a mentor." />
          <SliderToggle
            defaultOn={isMentee ? true : false}
            saveStateToParent={toggleMenteeship}
            label="I would like to be mentored." />
          <div className="ui form">
            <div className={`ui ${isMobile ? 'fluid' : isTablet ? 'eight wide' : 'six wide'} field mentorshipSkillsPane ${isMentor || isMentee ? 'show' : 'hide'}`}>
              <label>Mentorship Bio</label>
              <Textarea
                rows="3"
                name="mentorshipSkills"
                value={mentorshipSkills}
                onChange={handleInputChange}
                placeholder="Please provide a short description of the skills you feel comfortable providing mentorship for and / or the areas you are looking for mentorship in." />
              { error &&
                <div style={{ marginTop: 10 }} className="ui red basic label">
                  {error}
                </div> }
              </div>
          </div>
        </div>
      </div>
    );
  }
}

Mentorship.propTypes = {
  error: propTypes.string,
  isMobile: propTypes.bool,
  isTablet: propTypes.bool,
  toggle: propTypes.func.isRequired,
  isMentor: propTypes.bool.isRequired,
  showPopUp: propTypes.bool.isRequired,
  subSaveClick: propTypes.func.isRequired,
  showMentorship: propTypes.bool.isRequired,
  toggleMentorship: propTypes.func.isRequired,
  toggleMenteeship: propTypes.func.isRequired,
  handleInputChange: propTypes.func.isRequired,
  mentorshipSkills: propTypes.string.isRequired,
}

Mentorship.defaultProps = {
  error: ''
}

export default connectScreenSize(mapScreenSizeToProps)(Mentorship);
