import React from 'react';
import ListItem from '../../common/ListItem';

const Certifications = ({ toggle, fccCerts, showFCC }) => {
  var certs = [];
  for (var cert in fccCerts) {
    if (fccCerts[cert]) {
      certs.push(cert.replace(/_/g, ' ') + ' Certified');
    }
  }
  const certificates = certs.map((item, index) => {
    return (
      <ListItem key={index} icon="certificate yellow icon">
        {item}
      </ListItem>
    );
  });
  return (
    <div>
      <div className="ui teal ribbon label fccWrapper" onClick={ () => { toggle('showFCC') } }>freeCodeCamp Certifications</div>
      <div className={`ui list fccPane ${showFCC ? 'show' : 'hide'}`}>
        {certificates}
      </div>
    </div>
  );
}

export default Certifications;