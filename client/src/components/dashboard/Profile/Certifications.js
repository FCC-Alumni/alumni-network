import React from 'react';
import { isEqual } from 'lodash';
import Ribbon from './common/RibbonHeader';
import ListItem from '../../common/ListItem';
import { TransitionContainer } from '../../../styles/globalStyles';

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
          <h5 style={{ marginTop: 2 }} className="ui header">
            {item}
          </h5>
        </ListItem>
      );
    });
    return (
      <div>
        <Ribbon
          showSave={false}
          content="freeCodeCamp Certifications"
          onClick={() => toggle('showFCC')} />
        <TransitionContainer
          isExpanded={showFCC}
          style={{ margin: 0 }}
          className="ui list">
          {certificates}
        </TransitionContainer>
      </div>
    );
  }
}
