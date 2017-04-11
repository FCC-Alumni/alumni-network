import React from 'react';
import propTypes from 'prop-types';
import Item from './SocialListItem';

const SocialList = ({ profileUrl, username, social, email, contactsOnly }) => {
  return (
    <div className="ui relaxed horizontal list">
    { email &&
      <Item
        icon="mail"
        text={email}
        href={`mailto:${email}?subject=fCC%20Alumni%20Network%20/%20Contact%20Request`} /> }
    { !contactsOnly &&
      <Item
        icon="fcc"
        text="freeCodeCamp"
        href={`https://freeCodeCamp.com/${username}`} /> }
      <Item
        icon="github"
        href={profileUrl}
        text="GitHub" />
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
  profileUrl: propTypes.string.isRequired,
}

SocialList.defaultProps = {
  contactsOnly: false
}

export default SocialList;
