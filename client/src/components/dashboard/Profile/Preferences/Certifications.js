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
    const certificates = certs.map(item => {
      return (
        <ListItem icon="orange large certificate icon" key={item.slice(0, 3)}>
          <h5 className="ui header" style={{ marginTop: 2 }}>
            {item}
          </h5>
        </ListItem>
      );
    });
    return (
      <div> 
        <Ribbon
          content="freeCodeCamp Certifications"
          onClick={() => toggle('showFCC')}
          showSave={false} />
        <TransitionContainer
          className="ui list"
          isExpanded={showFCC}
          style={{ margin: 0 }}>
          {certificates}
        </TransitionContainer>
      </div>
    );
  }
}
