import React from 'react';
import isEmpty from 'lodash/isEmpty';
import Ribbon from './common/RibbonHeader';
import MessageBox from '../../common/MessageBox';
import DropdownMulti from '../../common/DropdownMulti';
import DividingHeader from '../../common/DividingHeader';

import {
  skills as skillsOptions,
  interests as interestsOptions
} from '../../../assets/data/dropdownOptions';

const SkillsAndInterests = ({ showSkills, subSaveClick, showPopUp, toggle, handleSkillsChange, handleInterestsChange, coreSkills, codingInterests }) => {
  return (
    <div>
      <Ribbon
        showPopUp={showPopUp}
        id="skillsAndInterestsPopUp"
        showSave={showSkills}
        subSaveClick={subSaveClick}
        content="Skills & Interests"
        wrapperClass="skillsWrapper"
        onClick={()=>{toggle('showSkills')}} />
      <div className={`skillsPane ${showSkills ? 'show' : 'hide'}`}>
        <div className="ui horizontal divider">Core Skills</div>
        <MessageBox
          type="info"
          hide={!isEmpty(coreSkills) ? true : false}
          dismissable={true}
          message="Enter information about your coding skills below, so other users know your strengths!" />
        <DropdownMulti
          onChange={handleSkillsChange}
          options={skillsOptions}
          placeholder="Choose Skills"
          search={true}
          value={coreSkills} />
        <div className="ui horizontal divider">Coding Interests</div>
        <MessageBox
          type="info"
          hide={!isEmpty(codingInterests) ? true : false}
          dismissable={true}
          message="Let other users know what you're into so you can find others with similar interetsts!" />
        <DropdownMulti
          onChange={handleInterestsChange}
          options={interestsOptions}
          placeholder="Choose Interests"
          search={true}
          value={codingInterests} />
        <div className="spacer" />
      </div>
    </div>
  );
}

export default SkillsAndInterests;
