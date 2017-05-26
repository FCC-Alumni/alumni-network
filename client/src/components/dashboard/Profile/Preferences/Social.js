import React from 'react';
import { isEqual } from 'lodash';
import FormField from './common/FormField';
import ListItem from '../../common/ListItem';
import MessageBox from '../../common/MessageBox';
import Ribbon from '../Preferences/common/RibbonHeader';
import { TransitionContainer } from '../../../../styles/style-utils';

import { APP_HOST } from '../../../../actions/chat';

const INPUT_OPTIONS = 'small left icon';

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
      saveChanges,
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
          onClick={() => toggle('showSocial')} />
        <TransitionContainer isExpanded={showSocial}>
          <MessageBox
            type="info"
            hide={!codepen && !twitter && !linkedin ? false : true}
            dismissable={true}
            message="Stay connected with campers on other networks! Let us know where your profiles live." />
          <div style={{ marginBottom: 16 }} className="ui list">
            <ListItem>
              <FormField
                name="codepen"
                value={codepen}
                errors={errors}
                tooltip="CodePen"
                icon='codepen icon'
                placeholder="Enter CodePen"
                inputOptions={INPUT_OPTIONS}
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
                saveChanges={saveChanges}
                placeholder="Enter Twitter"
                disabled={twitter ? false : true}
                actionUrl={`${APP_HOST}/connect/twitter`}
                inputOptions={INPUT_OPTIONS + ' corner labeled'}
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
                saveChanges={saveChanges}
                placeholder="Enter LinkedIn"
                disabled={linkedin ? false : true}
                actionUrl={`${APP_HOST}/connect/linkedin`}
                inputOptions={INPUT_OPTIONS + ' corner labeled'}
                reactionIcon={<i style={{ cursor: 'pointer' }} className="remove icon" />}
                actionIcon={<i style={{ cursor: 'pointer' }} className="check mark icon" />} />
            </ListItem>
          </div>
        </TransitionContainer>
      </div>
    );
  }
}
