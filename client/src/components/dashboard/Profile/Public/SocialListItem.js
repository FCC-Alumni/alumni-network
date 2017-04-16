import React from 'react';
import styled from 'styled-components';
import { StyledItem } from '../../../../styles/globalStyles';

export const SocialIcon = styled.i`
  font-size: 22px !important;
  color: black !important;
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
    <Item href={href} target="_blank" className="item">
      <SocialIcon className={`${icon} icon`} />
      <InlineContent className="content">
        <div className="header">{text}</div>
      </InlineContent>
    </Item>
  );
}

export default SocialListItem;
