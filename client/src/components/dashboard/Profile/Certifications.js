import React from 'react';
import ListItem from '../../common/ListItem';
import Ribbon from './common/RibbonHeader';
import styled from 'styled-components';

const Item = styled.h5`
  margin-top: 2px !important;
`;

const Certifications = ({ toggle, fccCerts, subSaveClick, showPopUp, showFCC }) => {
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
        showPopUp={showPopUp}
        id="fccPopUp"
        showSave={showFCC}
        subSaveClick={subSaveClick}
        content="freeCodeCamp Certifications"
        wrapperClass="fccWrapper"
        onClick={() => { toggle('showFCC')}} />
      <div className={`ui list fccPane ${showFCC ? 'show' : 'hide'}`}>
        {certificates}
      </div>
    </div>
  );
}

export default Certifications;
