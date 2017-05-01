import React from 'react';
import styled from 'styled-components';
import { hoverTransition } from '../../../styles/globalStyles';

export const Icon = styled.i`
  color: grey;
  ${ hoverTransition() }
`;

const IconLinks = ({ user, handleClick }) => {
  const { social } = user;
  return(
    <div>
      <a
        target="_blank"
        onClick={handleClick}
        href={user.personal.profileUrl}>
        <Icon className="github icon"/>
      </a>
      <a
        target="_blank"
        onClick={handleClick}
        href={`https://www.freecodecamp.com/${user.username}`}>
        <Icon className="free code camp icon"/>
      </a>
    {/* will only render the following links if user has entered info for these fields */}
    { social.codepen &&
      <a
        target="_blank"
        onClick={handleClick}
        href={`https://www.codepen.io/${social.codepen}`}>
        <Icon className="codepen icon"/>
      </a> }
    { social.linkedin &&
      <a
        target="_blank"
        onClick={handleClick}
        href={`https://www.linkedin.com/search/results/index/?keywords=${encodeURIComponent(social.linkedin)}&origin=GLOBAL_SEARCH_HEADER`}>
        <Icon className="linkedin icon"/>
      </a> }
    { social.twitter &&
      <a
        target="_blank"
        onClick={handleClick}
        href={`https://www.twitter.com/${social.twitter}`}>
        <Icon className="twitter icon"/>
      </a> }
    </div>
  );
}

export default IconLinks;
