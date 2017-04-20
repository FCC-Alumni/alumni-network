import React from 'react';
import isEmpty from 'lodash/isEmpty';
import Ribbon from './common/RibbonHeader';
import RepoList from './RepoList';
import MessageBox from '../../common/MessageBox';

const Collaboration = ({
  toggle,
  projects,
  username,
  showPopUp,
  saveChanges,
  subSaveClick,
  saveProjectsList,
  showCollaboration,
}) => {
  return (
    <div>
      <Ribbon
        id="projectsPopUp"
        content="Collaboration"
        showPopUp={showPopUp}
        subSaveClick={subSaveClick}
        showSave={showCollaboration}
        wrapperClass="collaborationWrapper"
        onClick={()=>{toggle('showCollaboration')}} />
      <div className={`collaborationPane ${showCollaboration ? 'show' : 'hide'}`}>
        <MessageBox
          type="info"
          dismissable={true}
          hide={!isEmpty(projects) ? true : false}
          message="Share links to repos for projects that you could use some help with!" />
        <RepoList
          username={username}
          prePopulateList={projects}
          saveChanges={saveChanges}
          saveListToParent={saveProjectsList} />
      </div>
    </div>
  );
}

export default Collaboration;
