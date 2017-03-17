import React from 'react';
import MessageBox from '../../common/MessageBox';
import SliderToggle from '../../common/SliderToggle';

const Mentorship = ({ toggle, showMentorship, toggleMentorship }) => {
  return (
    <div>
      <div className="ui teal ribbon label mentorshipWrapper" onClick={() => { toggle('showMentorship') }}>Mentorship Program</div>
      <div className={`mentorshipPane ${showMentorship ? 'show' : 'hide'}`}>
        <MessageBox
          type="info"
          header="Would you like to be a mentor?"
          message="The primary goal of this community is to bring together programmers of varying degrees of skill, and connect them with one another to form meaningful mentor/mentee relationships. If you are interested in becoming a mentor, please toggle the switch below. If your skills match with a prospective mentee, you will both be notified, and the rest will be up to you! We will try our best to match you based on interests, skills, location, and language. This feature can be turned off at any time here in your dashboard settings." />
        <SliderToggle
          label="Sign me up! I want to be a mentor!"
          saveStateToParent={toggleMentorship} />
      </div>
    </div>
  );
}

export default Mentorship;