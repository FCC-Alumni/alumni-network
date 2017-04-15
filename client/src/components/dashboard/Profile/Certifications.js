import React from 'react';
import styled from 'styled-components';
import Ribbon from './common/RibbonHeader';
import ListItem from '../../common/ListItem';

const Item = styled.h5`
  margin-top: 2px !important;
`;

const Certifications = ({ toggle, fccCerts, showFCC }) => {
  var certs = [];
  for (var cert in fccCerts) {
    if (fccCerts[cert]) {
      certs.push(cert.replace(/_/g, ' ') + ' Certified');
    }
  }
  const certificates = certs.map((item, index) => {
    return (
      <ListItem key={index} icon="orange large certificate icon">
        <Item className="ui header">
          {item}
        </Item>
      </ListItem>
    );
  });
  return (
    <div>
      <Ribbon
        showSave={false}
        wrapperClass="fccWrapper"
        content="freeCodeCamp Certifications"
        onClick={() => { toggle('showFCC')}} />
      <div className={`ui list fccPane ${showFCC ? 'show' : 'hide'}`}>
        {certificates}
      </div>
    </div>
  );
}

export default Certifications;
