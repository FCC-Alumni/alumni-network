import React from 'react';
import ListItem from '../../common/ListItem';
import MessageBox from '../../common/MessageBox';
import FormField from '../../common/FormField';
import Ribbon from './common/RibbonHeader';

import { APP_HOST } from '../../../actions/chat';

const inputOptions = 'small left icon';

const Social = ({ showSocial, handleInputChange, subSaveClick, showPopUp, codepen, twitter, linkedin, toggle, errors, clear }) => {
  return (
    <div>
      <Ribbon
        content="Social"
        id="socialPopUp"
        showSave={showSocial}
        showPopUp={showPopUp}
        subSaveClick={subSaveClick}
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
              name="codepen"
              value={codepen}
              errors={errors}
              tooltip="CodePen"
              icon='codepen icon'
              placeholder="Enter CodePen"
              inputOptions={inputOptions}
              onChange={handleInputChange} />
          </ListItem>
          <ListItem>
            <FormField
              clear={clear}
              name="twitter"
              errors={errors}
              value={twitter}
              tooltip="Twitter"
              icon='twitter icon'
              placeholder="Enter Twitter"
              disabled={twitter ? false : true}
              inputOptions={inputOptions + ' corner labeled'}
              actionUrl={`${APP_HOST}/connect/twitter`}
              reactionIcon={<i style={{ cursor: 'pointer' }} className="remove icon" />}
              actionIcon={<i style={{ cursor: 'pointer' }} className="check mark icon" />} />
          </ListItem>
          <ListItem>
            <FormField
              clear={clear}
              errors={errors}
              name="linkedin"
              value={linkedin}
              tooltip="LinkedIn"
              icon='linkedin icon'
              placeholder="Enter LinkedIn"
              disabled={linkedin ? false : true}
              inputOptions={inputOptions + ' corner labeled'}
              actionUrl={`${APP_HOST}/connect/linkedin`}
              reactionIcon={<i style={{ cursor: 'pointer' }} className="remove icon" />}
              actionIcon={<i style={{ cursor: 'pointer' }} className="check mark icon" />} />
          </ListItem>
        </div>
      </div>
    </div>
  );
}

export default Social;
