import React from 'react';
import styled from 'styled-components';
import { hoverTransition } from '../../../../styles/globalStyles';

const SocialIcon = styled.i`
  font-size: 22px !important;
  color: black !important;
  ${ hoverTransition() }
`;

const FCCIcon = styled.i`
  font-size: 20px !important;
  color: black !important;
  padding: 0 .75em 0 0 !important;
  vertical-align: middle !important;
  ${ hoverTransition() }
`;

const InlineContent = styled.div`
  display: inline-block !important;
`;

const SocialList = ({ profileUrl, username, social }) => {
  return (
    <div className="ui center aligned segment">
      <div className="ui relaxed horizontal list">
        <a href={`https://freeCodeCamp.com/${username}`} target="_blank" className="item">
          <FCCIcon className="fa fa-free-code-camp" />
          <InlineContent className="content">
            <div className="header">freeCodeCamp</div>
          </InlineContent>
        </a>
        <a href={profileUrl} target="_blank" className="item">
          <SocialIcon className="github icon" />
          <div className="content">
            <div className="header">GitHub</div>
          </div>
        </a>
        { social.codepen &&
          <a href={`https://codepen.io/${social.codepen}`} target="_blank" className="item">
            <SocialIcon className="codepen icon" />
            <div className="content">
              <div className="header">Codepen</div>
            </div>
          </a> }
        { social.twitter &&
          <a href={`https://twitter.com/${social.twitter}`} target="_blank" className="item">
          <SocialIcon className="twitter icon" />
          <div className="content">
            <div className="header">Twitter</div>
          </div>
          </a> }
        { social.linkedin &&
          <a
          target="_blank"
          className="item"
          href={`https://www.linkedin.com/search/results/index/?keywords=${encodeURIComponent(social.linkedin)}&origin=GLOBAL_SEARCH_HEADER`}>
          <SocialIcon className="linkedin icon" />
          <div className="content">
            <div className="header">LinkedIn</div>
          </div>
        </a> }
      </div>
    </div>
  );
}

SocialList.propTypes = {
  social: React.PropTypes.object.isRequired,
  username: React.PropTypes.string.isRequired,
  profileUrl: React.PropTypes.string.isRequired,
}

export default SocialList;
