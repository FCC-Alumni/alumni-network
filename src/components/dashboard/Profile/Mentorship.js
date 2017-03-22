import React from 'react';
import MessageBox from '../../common/MessageBox';
import SliderToggle from '../../common/SliderToggle';
import Ribbon from './common/RibbonHeader';

const Mentorship = ({ toggle, showMentorship, subSaveClick, showPopUp, toggleMentorship, handleInputChange, mentorshipSkills, isMentor }) => {
  return (
    <div>
      <Ribbon 
        showPopUp={showPopUp} 
        id="mentorshipPopUp"
        showSave={showMentorship}
        subSaveClick={subSaveClick}
        content="Mentorship Program" 
        wrapperClass="mentorshipWrapper" 
        onClick={()=>{toggle('showMentorship')}} />
      <form className={`mentorshipPane ui form ${showMentorship ? 'show' : 'hide'}`}>
        <MessageBox
          type="info"
          header="Would you like to be a mentor?"
          message="The primary goal of this community is to bring together programmers of varying degrees of skill, and connect them with one another to form meaningful mentor/mentee relationships. If you are interested in becoming a mentor, please toggle the switch below. If your skills match with a prospective mentee, you will both be notified, and the rest will be up to you! We will try our best to match you based on interests, skills, location, and language. This feature can be turned off at any time here in your dashboard settings." />
        <SliderToggle
          label="Sign me up! I want to be a mentor!"
          saveStateToParent={toggleMentorship}
          defaultOn={isMentor ? true : false} />
        <div className={`ui six wide field mentorshipSkillsPane ${isMentor ? 'show' : 'hide'}`}>
          <label>Mentorship Skills</label>
          <textarea 
            onChange={handleInputChange} 
            name="mentorshipSkills" 
            value={mentorshipSkills}
            rows="3"
            placeholder="Please provide a short description of the skills you feel comfortable providing mentorship for." />
        </div>
      </form>
    </div>
  );
}

Mentorship.propTypes = {
  toggle: React.PropTypes.func.isRequired,
  showMentorship: React.PropTypes.bool.isRequired,
  toggleMentorship: React.PropTypes.func.isRequired,
  mentorshipSkills: React.PropTypes.string.isRequired,
  handleInputChange: React.PropTypes.func.isRequired,
  isMentor: React.PropTypes.bool.isRequired
}

export default Mentorship;