import React from 'react';
import { isEqual } from 'lodash';
import isEmpty from 'lodash/isEmpty';
import Ribbon from './common/RibbonHeader';
import MessageBox from '../../common/MessageBox';
import DropdownMulti from '../../common/DropdownMulti';
import DividingHeader from '../../common/DividingHeader';
import { TransitionContainer } from '../../../styles/globalStyles';

import {
  skills as skillsOptions,
  interests as interestsOptions
} from '../../../assets/data/dropdownOptions';

export default class SkillsAndInterests extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }
  render() {
    const {
      showSkills,
      subSaveClick,
      showPopUp,
      toggle,
      handleSkillsChange,
      handleInterestsChange,
      coreSkills,
      codingInterests
    } = this.props;
    return (
      <div>
        <Ribbon
          showPopUp={showPopUp}
          id="skillsAndInterestsPopUp"
          showSave={showSkills}
          subSaveClick={subSaveClick}
          content="Skills & Interests"
          onClick={() => toggle('showSkills')} />
        <TransitionContainer isExpanded={showSkills}>
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
        </TransitionContainer>
      </div>
    );
  }
}
