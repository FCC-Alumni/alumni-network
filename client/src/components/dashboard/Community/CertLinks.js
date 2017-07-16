import { Icon } from './SocialLinks';
import propTypes from 'prop-types';
import React from 'react';

const FCC_URL = "https://freecodecamp.org/";

const CertLinks = ({ handleClick, fccCerts, username }) => {
  return(
    <div className="right floated">
      <span>
        { fccCerts.Front_End &&
        <a
          href={`${FCC_URL + username}/front-end-certification`}
          onClick={handleClick}
          rel="noreferrer noopener"
          target="_blank" >
          <Icon
            className="desktop small icon"
            title="Frontend Certified" />
        </a> }
        { fccCerts.Data_Visualization &&
        <a
          href={`${FCC_URL + username}/data-visualization-certification`}
          onClick={handleClick}
          rel="noreferrer noopener"
          target="_blank" >
          <Icon
            className="bar chart small icon"
            title="Data Visualization Certified" />
        </a> }
        { fccCerts.Back_End &&
        <a
          href={`${FCC_URL + username}/back-end-certification`}
          onClick={handleClick}
          rel="noreferrer noopener"
          target="_blank" >
          <Icon
            className="database small icon"
            title="Backend Certified" />
        </a> }
      </span>
    </div>
  );
}

CertLinks.propTypes = {
  fccCerts: propTypes.object,
  username: propTypes.string.isRequired
}

export default CertLinks;
