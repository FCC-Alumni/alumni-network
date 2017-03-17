import React from 'react';

const Certifications = ({ toggle, certificates, showFCC }) => {
  return (
    <div>
      <div className="ui teal ribbon label fccWrapper" onClick={ () => { toggle('showFCC') } }>freeCodeCamp Certifications</div>
      <div className={`ui list fccPane ${showFCC ? 'show' : 'hide'}`}>
        {certificates}
      </div>
    </div>
  );
}

export default Certifications;