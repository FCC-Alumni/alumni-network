import React from 'react';
import styled from 'styled-components';
import Ribbon from './common/RibbonHeader';
import ListItem from '../../common/ListItem';
import FormField from '../../common/FormField';
import MessageBox from '../../common/MessageBox';
import { isEqual } from 'lodash';

import { APP_HOST } from '../../../actions/chat';

const inputOptions = 'small left icon';

const List = styled.div`
  margin-bottom: 16px !important;
`;

export default class Social extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }
  render() {
    const {
      clear,
      toggle,
      errors,
      twitter,
      codepen,
      linkedin,
      showPopUp,
      showSocial,
      subSaveClick,
      handleInputChange,
    } = this.props;
    return (
      <div>
        <Ribbon
          content="Social"
          id="socialPopUp"
          showSave={showSocial}
          showPopUp={showPopUp}
          subSaveClick={subSaveClick}
          onClick={()=>{toggle('showSocial')}} />
        <div className={`socialPane ${showSocial ? 'show' : 'hide'}`}>
          <MessageBox
            type="info"
            hide={!codepen && !twitter && !linkedin ? false : true}
            dismissable={true}
            message="Stay connected with campers on other networks! Let us know where your profiles live." />
          <List className="ui list">
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
                actionUrl={`${APP_HOST}/connect/twitter`}
                inputOptions={inputOptions + ' corner labeled'}
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
                actionUrl={`${APP_HOST}/connect/linkedin`}
                inputOptions={inputOptions + ' corner labeled'}
                reactionIcon={<i style={{ cursor: 'pointer' }} className="remove icon" />}
                actionIcon={<i style={{ cursor: 'pointer' }} className="check mark icon" />} />
            </ListItem>
          </List>
        </div>
      </div>
    );
  }
}
