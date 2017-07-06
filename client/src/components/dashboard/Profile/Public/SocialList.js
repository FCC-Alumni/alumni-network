import { Popup } from 'semantic-ui-react';
import propTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { StyledItem as StyledLink } from '../../../../styles/style-utils';

const InlineContent = styled.div`
  display: inline-block !important;
`;

const Link = styled(StyledLink)`
  &:hover {
    background: white !important;
  }
`;

export const SocialIcon = styled.i`
  font-size: 22px !important;
  color: black !important;
`;

const StyledItem = styled.div`
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
  ${props => props.disableChat && `
    cursor: default;
    .header {
      color: lightgrey !important;
    }
    .icon {
      color: lightgrey !important;
    }
    &:hover {
      .icon {
        color: lightgrey !important;
      }
    }
  `}
`;

const Item = ({ href, icon, text }) => {
  return (
    <Link
      className="item"
      href={href} 
      rel="noreferrer noopener"
      target="_blank" >
      <SocialIcon className={`${icon} icon`} />
      <InlineContent className="content">
        <div className="header">{text}</div>
      </InlineContent>
    </Link>
  );
}

<<<<<<< 0f5c92c7cb73056e3aedd0a775f3d72099ddb2e4
const SocialList = ({
  contactsOnly,
  currentUser,
  disableChat,
  email,
  initiatePrivateChat,
  isPrivate,
  social,
  username,
 }) => {
  const ChatIcon = (
    <StyledItem
      className="item"
      disableChat={disableChat}
      onClick={() => !disableChat && initiatePrivateChat(username)}>
      <SocialIcon className="comments icon" />
      <InlineContent className="content">
        <div className="header">{'Gitter'}</div>
      </InlineContent>
    </StyledItem>
  );
=======
const SocialList = ({ username, social, email, isPrivate, initiatePrivateChat, contactsOnly, currentUser }) => {
>>>>>>> remove chat from codebase
  return (
    <div className="ui relaxed horizontal list">
      { !isPrivate && email &&
      <Item
        href={`mailto:${email}?subject=fCC%20Alumni%20Network%20/%20Contact%20Request`}
        icon="mail"
        text={email} /> }
      { !contactsOnly &&
      <Item
        href={`https://freecodecamp.org/${username}`}
        icon="free code camp"
<<<<<<< 0f5c92c7cb73056e3aedd0a775f3d72099ddb2e4
        text="freeCodeCamp" /> }
      { contactsOnly && username !== currentUser &&
      <Popup
        content={disableChat
          ? `${username} does not have a Gitter account`
          : `Start a Gitter chat with ${username}`}
        flowing
        inverted
        position="bottom left"
        trigger={ChatIcon} /> }
=======
        text="freeCodeCamp"
        href={`https://freecodecamp.org/${username}`} /> }
    { contactsOnly && username !== currentUser &&
      <StyledItem onClick={() => initiatePrivateChat(username)} className="item">
        <SocialIcon className="comments icon" />
        <InlineContent className="content">
          <div className="header">Private Gitter Chat</div>
        </InlineContent>
      </StyledItem> }
>>>>>>> remove chat from codebase
      <Item
        href={`https://github.com/${username}`}
        icon="github"
        text="GitHub" />
      { social.codepen && !contactsOnly &&
      <Item
        href={`https://codepen.io/${social.codepen}`}
        icon="codepen"
        text="Codepen" /> }
      { social.twitter &&
      <Item
        href={`https://twitter.com/${social.twitter}`}
        icon="twitter"
        text="Twitter" /> }
      { social.linkedin &&
      <Item
        href={`https://www.linkedin.com/search/results/index/?keywords=${encodeURIComponent(social.linkedin)}&origin=GLOBAL_SEARCH_HEADER`}
        icon="linkedin"
        text="LinkedIn" /> }
    </div>
  );
}

SocialList.propTypes = {
  contactsOnly: propTypes.bool,
  email: propTypes.string,
  isPrivate: propTypes.bool,
  social: propTypes.object.isRequired,
  username: propTypes.string.isRequired,
}

SocialList.defaultProps = {
  contactsOnly: false
}

export default SocialList;
