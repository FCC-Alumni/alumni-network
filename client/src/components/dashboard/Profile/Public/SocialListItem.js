import React from 'react';
import styled from 'styled-components';
import { StyledItem } from '../../../../styles/globalStyles';
// import { Item } from '../../Profile_Public';

export const SocialIcon = styled.i`
  font-size: 22px !important;
  color: black !important;
`;

const FCCIcon = styled.i`
  font-size: 20px !important;
  color: black !important;
  padding: 0 .75em 0 0 !important;
  vertical-align: middle !important;
`;

const InlineContent = styled.div`
  display: inline-block !important;
`;

const Item = styled(StyledItem)`
  &:hover {
    background: white !important;
  }
`;

const SocialListItem = ({ href, icon, text }) => {
  return (
    <Item href={href} className="item">
      { icon === 'fcc'
        ? <FCCIcon className="fa fa-free-code-camp" />
        : <SocialIcon className={`${icon} icon`} /> }
      <InlineContent className="content">
        <div className="header">{text}</div>
      </InlineContent>
    </Item>
  );
}

export default SocialListItem;
