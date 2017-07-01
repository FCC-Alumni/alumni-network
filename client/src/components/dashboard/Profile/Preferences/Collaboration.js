import React from 'react';
import { isEqual } from 'lodash';
import { isEmpty } from 'lodash';
import RepoContainer from './common/RepoContainer';
import Ribbon from './common/RibbonHeader';
import MessageBox from '../../common/MessageBox';
import { TransitionContainer } from '../../../../styles/style-utils';

export default class Collaboration extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }
  render() {
    const {
      toggle,
      projects,
      username,
      saveChanges,
      saveProjectsList,
      showCollaboration
    } = this.props;
    return (
      <div>
        <Ribbon
          content="Collaboration"
          showSave={false}
          onClick={() => toggle('showCollaboration')} />
        <TransitionContainer isExpanded={showCollaboration}>
          <MessageBox
            type="info"
            dismissable={true}
            hide={!isEmpty(projects) ? true : false}
            message="Share links to repos for projects that you could use some help with!" />
          <RepoContainer
            username={username}
            prePopulateList={projects}
            saveChanges={saveChanges}
            saveListToParent={saveProjectsList} />
        </TransitionContainer>
      </div>
    );
  }
}
