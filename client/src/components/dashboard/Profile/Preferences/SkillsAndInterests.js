import React from 'react';
import { isEqual } from 'lodash';
import { isEmpty } from 'lodash';
import Ribbon from './common/RibbonHeader';
import MessageBox from '../../common/MessageBox';
import DropdownMulti from '../../common/DropdownMulti';
import skills from '../../../../assets/dropdowns/skills';
import interests from '../../../../assets/dropdowns/interests';
import { TransitionContainer } from '../../../../styles/globalStyles';

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
          showSave={showSkills}
          content="Skills & Interests"
          subSaveClick={subSaveClick}
          id="skillsAndInterestsPopUp"
          onClick={() => toggle('showSkills')} />
        <TransitionContainer isExpanded={showSkills}>
          <div className="ui horizontal divider">Core Skills</div>
          <MessageBox
            type="info"
            dismissable={true}
            hide={!isEmpty(coreSkills) ? true : false}
            message="Enter information about your coding skills below, so other users know your strengths!" />
          <DropdownMulti
            search={true}
            options={skills}
            value={coreSkills}
            placeholder="Choose Skills"
            onChange={handleSkillsChange} />
          <div className="ui horizontal divider">Coding Interests</div>
          <MessageBox
            type="info"
            dismissable={true}
            hide={!isEmpty(codingInterests) ? true : false}
            message="Let other users know what you're into so you can find others with similar interetsts!" />
          <DropdownMulti
            search={true}
            options={interests}
            value={codingInterests}
            placeholder="Choose Interests"
            onChange={handleInterestsChange} />
          <div className="spacer" />
        </TransitionContainer>
      </div>
    );
  }
}
