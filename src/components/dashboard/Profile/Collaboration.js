import React from 'react';
import MessageBox from '../../common/MessageBox';
import RepoList from '../../common/RepoList';

const Collaboration = ({ toggle, showCollaboration, saveProjectsList, username, projects }) => {
  return (
    <div>
      <div className="ui teal ribbon label collaborationWrapper" onClick={() => { toggle('showCollaboration')}}>Collaboration</div>
      <div className={`collaborationPane ${showCollaboration ? 'show' : 'hide'}`}>
        <MessageBox
          type="info"
          dismissable={true}
          message="Share links to repos for projects that you could use some help with!" />
        <RepoList
          saveListToParent={saveProjectsList}
          username={username}
          prePopulateList={projects} />
      </div>
    </div>
  );
}

export default Collaboration;