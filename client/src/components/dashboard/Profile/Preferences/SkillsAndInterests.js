import React from 'react';
import { isEqual } from 'lodash';
import { isEmpty } from 'lodash';
import Ribbon from './common/RibbonHeader';
import MessageBox from '../../common/MessageBox';
import DropdownMulti from '../../common/DropdownMulti';
import { TransitionContainer } from '../../../../styles/style-utils';

export default class SkillsAndInterests extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }
  render() {
    const {
      toggle,
      showPopUp,
      coreSkills,
      showSkills,
      saveSection,
      skillsOptions,
      handleAddSkill,
      codingInterests,
      interestsOptions,
      handleAddInterest,
      handleSkillsChange,
      handleInterestsChange,
    } = this.props;
    return (
      <div>
        <Ribbon
          showPopUp={showPopUp}
          showSave={showSkills}
          content="Skills & Interests"
          saveSection={saveSection}
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
            allowAdditions
            value={coreSkills}
            options={skillsOptions}
            placeholder="Choose Skills"
            onAddItem={handleAddSkill}
            onChange={handleSkillsChange} />
          <div className="ui horizontal divider">Coding Interests</div>
          <MessageBox
            type="info"
            dismissable={true}
            hide={!isEmpty(codingInterests) ? true : false}
            message="Let other users know what you're into so you can find others with similar interetsts!" />
          <DropdownMulti
            search={true}
            allowAdditions
            value={codingInterests}
            options={interestsOptions}
            placeholder="Choose Interests"
            onAddItem={handleAddInterest}
            onChange={handleInterestsChange} />
          <div className="spacer" />
        </TransitionContainer>
      </div>
    );
  }
}
