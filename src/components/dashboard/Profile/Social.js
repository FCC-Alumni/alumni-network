import React from 'react';
import ListItem from '../../common/ListItem';
import MessageBox from '../../common/MessageBox';
import FormField from '../../common/FormField';
import Ribbon from './common/RibbonHeader';

const inputOptions = 'small left icon';

const Social = ({ showSocial, handleInputChange, subSaveClick, showPopUp, codepen, twitter, linkedin, toggle, errors }) => {
  return (
    <div>
      <Ribbon 
        showPopUp={showPopUp} 
        subSaveClick={subSaveClick}
        id="socialPopUp"
        showSave={showSocial}
        content="Social" 
        wrapperClass="socialWrapper" 
        onClick={()=>{toggle('showSocial')}} />
      <div className={`socialPane ${showSocial ? 'show' : 'hide'}`}>
        <MessageBox
          type="info"
          dismissable={true}
          message="Stay connected with campers on other networks! Let us know where your profiles live." />
        <div className="ui list">
          <ListItem>
            <FormField
              onChange={handleInputChange}
              placeholder="Enter CodePen"
              name="codepen"
              value={codepen}
              errors={errors}
              inputOptions={inputOptions}
              icon='codepen icon'
              tooltip="CodePen" />
          </ListItem>
          <ListItem>
            <FormField
              onChange={handleInputChange}
              placeholder="Enter Twitter"
              name="twitter"
              value={twitter}
              errors={errors}
              inputOptions={inputOptions}
              icon='twitter icon'
              tooltip="Twitter" />
          </ListItem>
          <ListItem>
            <FormField
              onChange={handleInputChange}
              placeholder="Enter LinkedIn"
              name="linkedin"
              value={linkedin}
              errors={errors}
              inputOptions={inputOptions}
              icon='linkedin icon'
              tooltip="LinkedIn" />
          </ListItem>
        </div>
      </div>
    </div>
  );
}

export default Social;