import React from 'react';
import styled from 'styled-components';

const Label = styled.div`
  margin: 5px !important;
`;

const Header = styled.div`
  margin-bottom: 5px !important;
`;

const CodeProfile = ({ career, skillsAndInterests }) => {
  return (
    <div className="row">
      <div className="eight wide center aligned column">
        <Header className="ui top attached header">
          Core Skills
        </Header>
        { skillsAndInterests.coreSkills.map(skill => <Label className="ui label" key={skill}>{skill}</Label>) }
      </div>
      <div className="eight wide center aligned column">
        <Header className="ui top attached header">
          Coding Interests
        </Header>
        { skillsAndInterests.codingInterests.map(interest => <Label className="ui label" key={interest}>{interest}</Label>) }
      </div>

    </div>
  );
}

export default CodeProfile;
