import React from 'react';
import DropdownMultiSelect from '../../common/DropdownMultiSelect';
import MessageBox from '../../common/MessageBox';

import { skills, interests } from '../../../assets/data/dropdownOptions';

const SkillsAndInterests = ({ showSkills, toggle, handleSkillsChange, handleInterestsChange }) => {
  return (
    <div>
      <div className="ui teal ribbon label skillsWrapper" onClick={() => { toggle('showSkills') }}>Skills & Interests</div>
      <div className={`skillsPane ${showSkills ? 'show' : 'hide'}`}>
        <h4 className="ui horizontal divider header">
          <i className="checkmark box icon" />
          Core Skills
        </h4>
        <MessageBox
          type="info"
          dismissable={true}
          message="Enter information about your coding skills below, so other users know your strengths!" />
        <DropdownMultiSelect
          onChange={handleSkillsChange}
          options={skills}
          placeholder="Choose Skills" />
        <h4 className="ui horizontal divider header">
          <i className="checkmark box icon" />
          Coding Interests
        </h4>
        <MessageBox
          type="info"
          dismissable={true}
          message="Let other users know what you're into so you can find others with similar interetsts!" />
        <DropdownMultiSelect
          onChange={handleInterestsChange}
          options={interests}
          placeholder="Choose Interests" />
      </div>
    </div>
  );
}

export default SkillsAndInterests;