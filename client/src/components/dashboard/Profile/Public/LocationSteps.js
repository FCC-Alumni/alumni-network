import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';
import {
  CenterAlignedWrapper
} from '../../../../styles/globalStyles';

const Flag = styled.a `
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
            { personal.country
            ? <Flag
              target="_blank"
              href={`https://wikipedia.org/wiki/${personal.country && personal.country.replace(' ', '_')}`}
              className={`flag-icon-background flag-icon-${personal.flag && personal.flag.replace(' ', '-')}`} />
            : <div className="title"><i className="large help icon" /></div> }
          </CenterAlignedWrapper>
          <div className="description">{personal.country && personal.country}</div>
        </div>
      </div>
      <div className="step">
        <i className="marker icon"/>
        <div className="content">
          <div className="title">Location</div>
        </div>
      </div>
      <div className="step">
        <div className="content">
          <CenterAlignedWrapper>
            <div className="title">
              {personal.location ? personal.location : 'Earth'}
            </div>
          </CenterAlignedWrapper>
        </div>
      </div>
    </div>
  );
}

Steps.propTypes = {
  personal: propTypes.object.isRequired
}

export default Steps;
