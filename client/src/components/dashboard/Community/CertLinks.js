import React from 'react';
import { IconLink } from './SocialLinks';

const CertLinks = ({ handleClick, fccCerts, username }) => {
  return(
    <div className="right floated">
        <span>
          { fccCerts.Front_End &&
            <IconLink
              target="_blank"
              onClick={handleClick}
              href={`https://freeCodeCamp.com/${username}/front-end-certification`}>
              <i title="Frontend Certified" className="desktop small icon" />
            </IconLink> }
          { fccCerts.Data_Visualization &&
            <IconLink
              target="_blank"
              onClick={handleClick}
              href={`https://freeCodeCamp.com/${username}/back-end-certification`}>
              <i title="Data Visualization Certified" className="bar chart small icon" />
            </IconLink> }
          { fccCerts.Back_End &&
            <IconLink
              target="_blank"
              onClick={handleClick}
              href={`https://freeCodeCamp.com/${username}/data-visualization-certification`}>
              <i title="Backend Certified" className="database small icon" />
            </IconLink> }
        </span>
    </div>
  );
}

CertLinks.propTypes = {
  fccCerts: React.PropTypes.object.isRequired,
  username: React.PropTypes.string.isRequired
}

export default CertLinks;
