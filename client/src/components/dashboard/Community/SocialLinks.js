import { hoverTransition } from '../../../styles/style-utils';
import React from 'react';
import styled from 'styled-components';

export const Icon = styled.i`
  color: grey;
  ${ hoverTransition() }
`;

const IconLinks = ({ user, handleClick }) => {
  const { social } = user;
  return(
    <div>
      <a
        href={user.personal.profileUrl}
        onClick={handleClick}
        rel="noreferrer noopener"
        target="_blank" >
        <Icon className="github icon" />
      </a>
      <a
        href={`https://www.freecodecamp.org/${user.username}`}
        onClick={handleClick}
        rel="noreferrer noopener"
        target="_blank" >
        <Icon className="free code camp icon" />
      </a>
      {
      /* will only render the following links if
      user has entered info for these fields */
    }
      { social.codepen &&
      <a
        href={`https://www.codepen.io/${social.codepen}`}
        onClick={handleClick}
        rel="noreferrer noopener"
        target="_blank" >
        <Icon className="codepen icon" />
      </a> }
      { social.linkedin &&
      <a
        href={`https://www.linkedin.com/search/results/index/?keywords=${encodeURIComponent(social.linkedin)}&origin=GLOBAL_SEARCH_HEADER`}
        onClick={handleClick}
        rel="noreferrer noopener"
        target="_blank" >
        <Icon className="linkedin icon" />
      </a> }
      { social.twitter &&
      <a
        href={`https://www.twitter.com/${social.twitter}`}
        onClick={handleClick}
        rel="noreferrer noopener"
        target="_blank" >
        <Icon className="twitter icon" />
      </a> }
    </div>
  );
}

export default IconLinks;
