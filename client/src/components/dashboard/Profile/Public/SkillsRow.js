import React from 'react';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

const Label = styled.div`
  margin: 5px !important;
  transition: all 200ms ease-in-out !important;
  &:hover {
    background: #007E00 !important;
    color: white !important;
  }
`;

const LabelDark = styled.div`
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

const SkillsRow = ({ skillsAndInterests }) => {

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
          ? <a
              key={skill}
              target="_blank"
              title="Look up on Wikipedia"
              href={`https://en.wikipedia.org/w/index.php?search=${skill}`}>
              <Label className="ui label">{skill}</Label>
            </a>
          : <a
              key={skill}
              target="_blank"
              title="Look up on Wikipedia"
              href={`https://en.wikipedia.org/w/index.php?search=${skill}`}>
              <LabelDark className="ui label">{skill}</LabelDark>
            </a> )}
      </div> }
      { !isEmpty(codingInterests) &&
      <div className={`${ isEmpty(coreSkills) ? 'sixteen' : 'eight' } wide center aligned column`}>
        <SubHeader className="ui top attached header">
          Coding Interests
        </SubHeader>
        { codingInterests && codingInterests.map((interest, i) =>
          i % 2 === 0
          ? <a
              key={interest}
              target="_blank"
              title="Look up on Wikipedia"
              href={`https://en.wikipedia.org/w/index.php?search=${interest}`}>
              <Label className="ui label">{interest}</Label>
            </a>
          :  <a
              key={interest}
              target="_blank"
              title="Look up on Wikipedia"
              href={`https://en.wikipedia.org/w/index.php?search=${interest}`}>
              <LabelDark className="ui label">{interest}</LabelDark>
            </a> )}
      </div> }
    </div>
  );
}

SkillsRow.propTypes = {
  skillsAndInterests: React.PropTypes.object.isRequired
}

export default SkillsRow;
