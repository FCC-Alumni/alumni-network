import { isEqual } from 'lodash';
import ListItem from '../../common/ListItem';
import React from 'react';
import Ribbon from './common/RibbonHeader';
import { TransitionContainer } from '../../../../styles/style-utils';

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
