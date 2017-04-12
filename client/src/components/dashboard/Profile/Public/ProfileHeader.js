import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';

const HeaderWrapper = styled.div`
  background-color: #006400 !important;
  color: white;
`;

const ProfileHeader = ({ text, icon }) => {
  return (
    <div className="row">
      <HeaderWrapper className="sixteen wide center aligned column">
        <h2 className="ui">{text} <i className={`${icon} ${icon !== 'fa fa-free-code-camp' && 'icon'}`} /></h2>
      </HeaderWrapper>
    </div>
  );
}

ProfileHeader.propTypes = {
  text: propTypes.string.isRequired,
  icon: propTypes.string.isRequired,
}

export default ProfileHeader;
