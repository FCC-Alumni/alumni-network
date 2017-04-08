import React from 'react';
import styled from 'styled-components';
import {
  CenterAlignedWrapper
} from '../../../../styles/globalStyles';

const Flag = styled.div `
  width: 40px;
  height: 40px;
  margin-bottom: 5px;
`;

const Steps = ({ personal }) => {
  return(
    <div className="ui tablet stackable attached steps">
      <div className="step">
        <i className="world icon"/>
        <div className="content">
          <div className="title">Country</div>
        </div>
      </div>
      <div className="step">
        <div className="content">
          <CenterAlignedWrapper>
            <Flag className={`flag-icon-background flag-icon-${personal.flag.replace(' ', '-')}`}></Flag>
          </CenterAlignedWrapper>
          <div className="description">{personal.country}</div>
        </div>
      </div>
      <div className="step">
        <i className="marker icon"/>
        <div className="content">
          <div className="title">City/State</div>
        </div>
      </div>
      <div className="step">
        <div className="content">
          <div className="title">{personal.location}</div>
        </div>
      </div>
    </div>
  );
}

Steps.propTypes = {
  personal: React.PropTypes.object.isRequired
}

export default Steps;
