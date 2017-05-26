import React from 'react';
import { isEmpty } from 'lodash';
import propTypes from 'prop-types';
import styled from 'styled-components';

const Label = styled.div`
  cursor: pointer;
  margin: 5px !important;
  transition: all 200ms ease-in-out !important;
  &:hover {
    background: #007E00 !important;
    color: white !important;
  }
`;

const LabelDark = styled.div`
  cursor: pointer;
  margin: 5px !important;
  color: white !important;
  background: #939393 !important;
  transition: all 200ms ease-in-out !important;
  &:hover {
    background: #007E00 !important;
  }
`;

export const SubHeader = styled.div`
  background: #939393 !important;
  color: white !important;
  margin-bottom: 5px !important;
`;

const SkillsRow = ({ skillsAndInterests, handleQuery }) => {

  const { coreSkills, codingInterests } = skillsAndInterests;

  return (
    <div className="row">
      { !isEmpty(coreSkills) &&
      <div className={`${ isEmpty(codingInterests) ? 'sixteen' : 'eight' } wide center aligned column`}>
        <SubHeader className="ui top attached header">
          Core Skills
        </SubHeader>
    { coreSkills && coreSkills.map((skill, i) =>
      i % 2 === 0
      ? <Label
          key={skill}
          title="Search community for other members with this skill!"
          className="ui label"
          onClick={() => handleQuery(skill, 'skills')}>
            {skill}
        </Label>
      : <LabelDark
          key={skill}
          title="Search community for other members with this skill!"
          className="ui label"
          onClick={() => handleQuery(skill, 'skills')}>
            {skill}
        </LabelDark> )}
      </div> }
      { !isEmpty(codingInterests) &&
      <div className={`${ isEmpty(coreSkills) ? 'sixteen' : 'eight' } wide center aligned column`}>
        <SubHeader className="ui top attached header">
          Coding Interests
        </SubHeader>
    { codingInterests && codingInterests.map((interest, i) =>
      i % 2 === 0
      ? <Label
          key={interest}
          title="Search community for other members with this interest!"
          className="ui label"
          onClick={() => handleQuery(interest, 'interests')}>
            {interest}
        </Label>
      : <LabelDark
          key={interest}
          title="Search community for other members with this interest!"
          className="ui label"
          onClick={() => handleQuery(interest, 'interests')}>
            {interest}
        </LabelDark> )}
      </div> }
    </div>
  );
}

SkillsRow.propTypes = {
  handleQuery: propTypes.func.isRequired,
  skillsAndInterests: propTypes.object.isRequired
}

export default SkillsRow;
