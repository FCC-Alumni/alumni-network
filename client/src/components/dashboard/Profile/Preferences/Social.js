<<<<<<< 0f5c92c7cb73056e3aedd0a775f3d72099ddb2e4
import { APP_HOST } from '../../../../actions/chat';
=======
import APP_HOST from '../../../../assets/helpers/defineHost';
import React from 'react';
import { isEqual } from 'lodash';
>>>>>>> remove chat from codebase
import FormField from './common/FormField';
import { isEqual } from 'lodash';
import ListItem from '../../common/ListItem';
import MessageBox from '../../common/MessageBox';
import React from 'react';
import Ribbon from '../Preferences/common/RibbonHeader';
import { TransitionContainer } from '../../../../styles/style-utils';

const INPUT_OPTIONS = 'small left icon';

export default class Social extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }
  render() {
    const {
      clear,
      codepen,
      errors,
      handleInputChange,
      linkedin,
      saveChanges,
      saveSection,
      showPopUp,
      showSocial,
      toggle,
      twitter,
    } = this.props;
    const removeIcon = (
      <i className="remove icon" style={{ cursor: 'pointer' }} />
    );
    const checkmarkIcon = (
      <i className="check mark icon" style={{ cursor: 'pointer' }} />
    );
    return (
      <div>
        <Ribbon
          content="Social"
          id="socialPopUp"
          onClick={() => toggle('showSocial')}
          saveSection={saveSection}
          showPopUp={showPopUp}
          showSave={showSocial} />
        <TransitionContainer isExpanded={showSocial}>
          <MessageBox
            dismissable={true}
            hide={!codepen && !twitter && !linkedin ? false : true}
            message="Stay connected with campers on other
            networks! Let us know where your profiles live."
            type="info" />
          <div
            className="ui list"
            style={{ marginBottom: 16 }}>
            <ListItem>
              <FormField
                errors={errors}
                icon='codepen icon'
                inputOptions={INPUT_OPTIONS}
                name="codepen"
                onChange={handleInputChange}
                placeholder="Enter CodePen"
                tooltip="CodePen"
                value={codepen} />
            </ListItem>
            <ListItem>
              <FormField
                actionIcon={checkmarkIcon}
                actionUrl={`${APP_HOST}/connect/twitter`}
                clear={clear}
                disabled={twitter ? false : true}
                errors={errors}
                icon='twitter icon'
                inputOptions={INPUT_OPTIONS + ' corner labeled'}
                name="twitter"
                placeholder="Enter Twitter"
                reactionIcon={removeIcon}
                saveChanges={saveChanges}
                tooltip="Twitter"
                value={twitter} />
            </ListItem>
            <ListItem>
              <FormField
                actionIcon={checkmarkIcon}
                actionUrl={`${APP_HOST}/connect/linkedin`}
                clear={clear}
                disabled={linkedin ? false : true}
                errors={errors}
                icon='linkedin icon'
                inputOptions={INPUT_OPTIONS + ' corner labeled'}
                name="linkedin"
                placeholder="Enter LinkedIn"
                reactionIcon={removeIcon}
                saveChanges={saveChanges}
                tooltip="LinkedIn"
                value={linkedin} />
            </ListItem>
          </div>
        </TransitionContainer>
      </div>
    );
  }
}
