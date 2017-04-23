import React from 'react';
import styled from 'styled-components';
import Ribbon from './common/RibbonHeader';
import ListItem from '../../common/ListItem';
import { isEqual } from 'lodash';

const Item = styled.h5`
  margin-top: 2px !important;
`;

const List = styled.div`
  margin: 0 !important;
`;

export default class Certifications extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }
  render() {
    const { toggle, fccCerts, showFCC } = this.props;
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
          content="freeCodeCamp Certifications"
          onClick={() => { toggle('showFCC')}} />
        <List className={`ui list fccPane ${showFCC ? 'show' : 'hide'}`}>
          {certificates}
        </List>
      </div>
    );
  }
}
