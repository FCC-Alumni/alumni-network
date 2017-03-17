import React from 'react';
import ListItem from '../../common/ListItem';
import MessageBox from '../../common/MessageBox';

const Social = ({ showSocial, handleInputChange, codepen, twitter, linkedin, toggle }) => {
  return (
    <div>
      <div className="ui teal ribbon label socialWrapper" onClick={() => { toggle('showSocial')}}>Social</div>
      <div className={`socialPane ${showSocial ? 'show' : 'hide'}`}>
        <MessageBox
          type="info"
          dismissable={true}
          message="Stay connected with campers on other networks! Let us know where your profiles live." />
        <div className="ui list">
          <ListItem>
            <div className="ui left icon input mini">
              <i className="codepen icon" />
              <input
                onChange={handleInputChange}
                type="text"
                placeholder="Enter CodePen"
                title="CodePen"
                name="codepen"
                value={codepen} />
            </div>
          </ListItem>
          <ListItem>
            <div className="ui left icon input mini">
              <i className="twitter icon" />
              <input
                onChange={handleInputChange}
                type="text"
                placeholder="Enter Twitter"
                title="Twitter"
                name="twitter"
                value={twitter} />
            </div>
          </ListItem>
          <ListItem>
            <div className="ui left icon input mini">
              <i className="linkedin icon" />
              <input
                onChange={handleInputChange}
                type="text"
                placeholder="Enter LinkedIn"
                title="LinkedIn"
                name="linkedin"
                value={linkedin} />
            </div>
          </ListItem>
        </div>
      </div>
    </div>
  );
}

export default Social;