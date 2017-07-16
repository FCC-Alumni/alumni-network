import MessageBox from '../../common/MessageBox';
import React from 'react';
import RepoContainer from './common/RepoContainer';
import Ribbon from './common/RibbonHeader';
import { TransitionContainer } from '../../../../styles/style-utils';
import { isEmpty, isEqual } from 'lodash';

export default class Collaboration extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }
  render() {
    const {
      projects,
      saveChanges,
      showCollaboration,
      toggle,
      username,
    } = this.props;
    return (
      <div>
        <Ribbon
          content="Collaboration"
          onClick={() => toggle('showCollaboration')}
          showSave={false} />
        <TransitionContainer isExpanded={showCollaboration}>
          <MessageBox
            dismissable={true}
            hide={ isEmpty(projects) ? false : true }
            message="Share links to repos for projects
            that you could use some help with!"
            type="info" />
          <RepoContainer
            prePopulateList={projects}
            saveChanges={saveChanges}
            username={username} />
        </TransitionContainer>
      </div>
    );
  }
}
