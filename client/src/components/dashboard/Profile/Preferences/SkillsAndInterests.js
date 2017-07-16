import DropdownMulti from '../../common/DropdownMulti';
import MessageBox from '../../common/MessageBox';
import React from 'react';
import Ribbon from './common/RibbonHeader';
import { TransitionContainer } from '../../../../styles/style-utils';
import { isEmpty, isEqual } from 'lodash';

export default class SkillsAndInterests extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }
  render() {
    const {
      codingInterests,
      coreSkills,
      handleAddInterest,
      handleAddSkill,
      handleInterestsChange,
      handleSkillsChange,
      interestsOptions,
      saveSection,
      showPopUp,
      showSkills,
      skillsOptions,
      toggle,
    } = this.props;
    return (
      <div>
        <Ribbon
          content="Skills & Interests"
          id="skillsAndInterestsPopUp"
          onClick={() => toggle('showSkills')}
          saveSection={saveSection}
          showPopUp={showPopUp}
          showSave={showSkills} />
        <TransitionContainer isExpanded={showSkills}>
          <div className="ui horizontal divider">{'Core Skills'}</div>
          <MessageBox
            dismissable={true}
            hide={!isEmpty(coreSkills) ? true : false}
            message="Enter information about your coding
            skills below, so other users know your strengths!"
            type="info" />
          <DropdownMulti
            allowAdditions
            onAddItem={handleAddSkill}
            onChange={handleSkillsChange}
            options={skillsOptions}
            placeholder="Choose Skills"
            search={true}
            value={coreSkills} />
          <div className="ui horizontal divider">
            {'Coding Interests'}
          </div>
          <MessageBox
            dismissable={true}
            hide={!isEmpty(codingInterests) ? true : false}
            message="Let other users know what you're into so
            you can find others with similar interetsts!"
            type="info" />
          <DropdownMulti
            allowAdditions
            onAddItem={handleAddInterest}
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
