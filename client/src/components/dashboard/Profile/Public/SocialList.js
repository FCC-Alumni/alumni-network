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
    <Link href={href} target="_blank" className="item">
      <SocialIcon className={`${icon} icon`} />
      <InlineContent className="content">
        <div className="header">{text}</div>
      </InlineContent>
    </Link>
  );
}

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
        <div className="header">Gitter</div>
      </InlineContent>
    </StyledItem>
  );
  return (
    <div className="ui relaxed horizontal list">
    { !isPrivate && email &&
      <Item
        icon="mail"
        text={email}
        href={`mailto:${email}?subject=fCC%20Alumni%20Network%20/%20Contact%20Request`} /> }
    { !contactsOnly &&
      <Item
        icon="free code camp"
        text="freeCodeCamp"
        href={`https://freecodecamp.org/${username}`} /> }
    { contactsOnly && username !== currentUser &&
      <Popup
        trigger={ChatIcon}
        flowing
        inverted
        position="bottom left"
        content={disableChat
          ? `${username} does not have a Gitter account`
          : `Start a Gitter chat with ${username}`} /> }
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
