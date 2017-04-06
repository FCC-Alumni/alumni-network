import React from 'react';
import Ribbon from './common/RibbonHeader';
import MessageBox from '../../common/MessageBox';
import SliderToggle from '../../common/SliderToggle';

const Mentorship = ({
  error,
  toggle,
  isMentor,
  showPopUp,
  subSaveClick,
  showMentorship,
  mentorshipSkills,
  toggleMentorship,
  handleInputChange,
}) => {
  return (
    <div>
      <Ribbon
        id="mentorshipPopUp"
        showPopUp={showPopUp}
        showSave={showMentorship}
        content="Mentorship Program"
        subSaveClick={subSaveClick}
        wrapperClass="mentorshipWrapper"
        onClick={()=>{toggle('showMentorship')}} />
      <form className={`mentorshipPane ui form ${showMentorship ? 'show' : 'hide'}`}>
        <MessageBox
          type="info"
          header="Would you like to be a mentor?"
          message="The primary goal of this community is to bring together programmers of varying degrees of skill, and connect them with one another to form meaningful mentor/mentee relationships. If you are interested in becoming a mentor, please toggle the switch below. If your skills match with a prospective mentee, you will both be notified, and the rest will be up to you! We will try our best to match you based on interests, skills, location, and language. This feature can be turned off at any time here in your dashboard settings." />
        <SliderToggle
          defaultOn={isMentor ? true : false}
          saveStateToParent={toggleMentorship}
          label="Sign me up! I want to be a mentor!" />
        <div className={`ui six wide field mentorshipSkillsPane ${isMentor ? 'show' : 'hide'}`}>
          <label>Mentorship Skills</label>
          <textarea
            rows="3"
            name="mentorshipSkills"
            value={mentorshipSkills}
            onChange={handleInputChange}
            placeholder="Please provide a short description of the skills you feel comfortable providing mentorship for." />
          { error &&
            <div style={{ marginTop: 10 }} className="ui red basic label">
              {error}
            </div> }
        </div>
      </form>
    </div>
  );
}

Mentorship.propTypes = {
  error: React.PropTypes.string,
  toggle: React.PropTypes.func.isRequired,
  isMentor: React.PropTypes.bool.isRequired,
  showPopUp: React.PropTypes.bool.isRequired,
  subSaveClick: React.PropTypes.func.isRequired,
  showMentorship: React.PropTypes.bool.isRequired,
  toggleMentorship: React.PropTypes.func.isRequired,
  handleInputChange: React.PropTypes.func.isRequired,
  mentorshipSkills: React.PropTypes.string.isRequired,
}

Mentorship.defaultProps = {
  error: ''
}

export default Mentorship;
