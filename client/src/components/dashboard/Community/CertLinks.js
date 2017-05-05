import React from 'react';
import propTypes from 'prop-types';
import { Icon } from './SocialLinks';

const FCC_URL = "https://freeCodeCamp.com/";

const CertLinks = ({ handleClick, fccCerts, username }) => {
  return(
    <div className="right floated">
      <span>
      { fccCerts.Front_End &&
        <a
          target="_blank"
          onClick={handleClick}
          href={`${FCC_URL + username}/front-end-certification`}>
          <Icon title="Frontend Certified" className="desktop small icon" />
        </a> }
      { fccCerts.Data_Visualization &&
        <a
          target="_blank"
          onClick={handleClick}
          href={`${FCC_URL + username}/data-visualization-certification`}>
          <Icon title="Data Visualization Certified" className="bar chart small icon" />
        </a> }
      { fccCerts.Back_End &&
        <a
          target="_blank"
          onClick={handleClick}
          href={`${FCC_URL + username}/back-end-certification`}>
          <Icon title="Backend Certified" className="database small icon" />
        </a> }
      </span>
    </div>
  );
}

CertLinks.propTypes = {
  username: propTypes.string.isRequired,
  fccCerts: propTypes.oneOfType([
    propTypes.bool,
    propTypes.object
  ]),
}

export default CertLinks;
