import React from 'react';
import MessageBox from '../../common/MessageBox';
import RepoList from '../../common/RepoList';
import Ribbon from './common/RibbonHeader';

const Collaboration = ({ toggle, showCollaboration, subSaveClick, showPopUp, saveProjectsList, username, projects }) => {
  return (
    <div>
      <Ribbon 
        showPopUp={showPopUp} 
        id="collaboPopUp"
        showSave={showCollaboration}
        subSaveClick={subSaveClick}
        content="Collaboration" 
        wrapperClass="collaborationWrapper" 
        onClick={()=>{toggle('showCollaboration')}} />
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