import React from 'react';

const Career = ({ toggle, showCareer }) => {
  return (
    <div>
      <div className="ui teal ribbon label careerWrapper" onClick={() => { toggle('showCareer')}}>Career</div>
      <div className={`careerPane ${showCareer ? 'show' : 'hide'}`}>
        <h4>Career form goes here...</h4>
      </div>
    </div>
  );
}

export default Career;