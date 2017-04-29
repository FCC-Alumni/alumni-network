import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';
import { StyledItem as StyledLink } from '../../../../styles/globalStyles';

export const SocialIcon = styled.i`
  font-size: 22px !important;
  color: black !important;
`;

const InlineContent = styled.div`
  display: inline-block !important;
`;

const Link = styled(StyledLink)`
  &:hover {
    background: white !important;
  }
`;

const StyledItem = styled.div`
  color: black !important;
  font-weight: bold !important;
  .icon {
    color: black !important;
  }
  cursor: pointer;
  &:hover {
    background: white !important;
    .icon {
      color: #FF4025 !important;
      transition: color 200ms ease-in-out !important;
    }
  }
`;

const Item = ({ href, icon, text }) => {
  return (
    <Link href={href} target="_blank" className="item">
      <SocialIcon className={`${icon} icon`} />
      <InlineContent className="content">
        <div className="header">{text}</div>
      </InlineContent>
    </Link>
  );
}

const SocialList = ({ username, social, email, contactsOnly, notifications, currentUser, initiatePrivateChat }) => {
  return (
    <div className="ui relaxed horizontal list">
    { email &&
      <Item
        icon="mail"
        text={email}
        href={`mailto:${email}?subject=fCC%20Alumni%20Network%20/%20Contact%20Request`} /> }
    { !contactsOnly &&
      <Item
        icon="free code camp"
        text="freeCodeCamp"
        href={`https://freeCodeCamp.com/${username}`} /> }
    { contactsOnly && username !== currentUser &&
      <StyledItem onClick={() => initiatePrivateChat(username, notifications)} className="item">
        <SocialIcon className="comments icon" />
        <InlineContent className="content">
          <div className="header">Mess Hall Chat</div>
        </InlineContent>
      </StyledItem> }
      <Item
        icon="github"
        text="GitHub"
        href={`https://github.com/${username}`} />
    { social.codepen && !contactsOnly &&
      <Item
        icon="codepen"
        text="Codepen"
        href={`https://codepen.io/${social.codepen}`} /> }
    { social.twitter &&
      <Item
        icon="twitter"
        text="Twitter"
        href={`https://twitter.com/${social.twitter}`} /> }
    { social.linkedin &&
      <Item
        icon="linkedin"
        text="LinkedIn"
        href={`https://www.linkedin.com/search/results/index/?keywords=${encodeURIComponent(social.linkedin)}&origin=GLOBAL_SEARCH_HEADER`} /> }
    </div>
  );
}

SocialList.propTypes = {
  email: propTypes.string,
  contactsOnly: propTypes.bool,
  social: propTypes.object.isRequired,
  username: propTypes.string.isRequired,
}

SocialList.defaultProps = {
  contactsOnly: false
}

export default SocialList;
