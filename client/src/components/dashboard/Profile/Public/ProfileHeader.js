import propTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.div`
  background-color: #006400 !important;
  color: white;
`;

const ProfileHeader = ({ text, icon }) => {
  return (
    <div className="row">
      <HeaderWrapper className="sixteen wide center aligned column">
        <h2 className="ui">{text} <i className={`${icon} icon`} /></h2>
      </HeaderWrapper>
    </div>
  );
}

ProfileHeader.propTypes = {
  icon: propTypes.string.isRequired,
  text: propTypes.string.isRequired,
}

export default ProfileHeader;
