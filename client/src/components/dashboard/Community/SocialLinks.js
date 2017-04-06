import React from 'react';
import styled from 'styled-components';

export const IconLink = styled.a`
color: grey;
  &:hover {
    color: rgb(0,225,225) !important;
    transition: color 100ms ease-in-out;
  }
`;

const IconLinks = ({ user, handleClick }) => {
  const { social } = user;
  return(
    <div>
      <IconLink
        target="_blank"
        onClick={handleClick}
        href={user.personal.profileUrl}>
        <i className="github icon"/>
      </IconLink>
      <IconLink
        target="_blank"
        onClick={handleClick}
        href={`https://www.freecodecamp.com/${user.username}`}>
        <i className="fa fa-free-code-camp"/>
      </IconLink>
      {/* will only render the following links if user has entered info for these fields */}
      { social.codepen &&
        <IconLink
          target="_blank"
          onClick={handleClick}
          href={`https://www.codepen.io/${social.codepen}`}>
          <i className="codepen icon"/>
        </IconLink> }
      { social.linkedin &&
        <IconLink
          target="_blank"
          onClick={handleClick}
          href={`https://www.linkedin.com/search/results/index/?keywords=${encodeURIComponent(social.linkedin)}&origin=GLOBAL_SEARCH_HEADER`}>
          <i className="linkedin icon"/>
        </IconLink> }
      { social.twitter &&
        <IconLink
          target="_blank"
          onClick={handleClick}
          href={`https://www.twitter.com/${social.twitter}`}>
          <i className="twitter icon"/>
        </IconLink> }
    </div>
  );
}

export default IconLinks;
