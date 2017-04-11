import React from 'react';
import styled from 'styled-components';
import { hoverTransition } from '../../../../styles/globalStyles';

export const SocialIcon = styled.i`
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

const SocialListItem = ({ href, icon, text }) => {
  return (
    <a href={href} className="item">
      { icon === 'fcc'
        ? <FCCIcon className="fa fa-free-code-camp" />
        : <SocialIcon className={`${icon} icon`} /> }
      <InlineContent className="content">
        <div className="header">{text}</div>
      </InlineContent>
    </a>
  );
}

export default SocialListItem;
