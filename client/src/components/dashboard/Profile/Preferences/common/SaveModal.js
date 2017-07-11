import React from 'react';
import { Button, Modal } from 'semantic-ui-react';

const SaveModal = ({ size, close, open, warning, isValid }) => {

  const context = {
    buttonColor: isValid ? 'green' : 'red',
    header: isValid ? 'Success' : 'Error(s)',
    headerColor: isValid ? '#007E00' : '#FF4025',
    text: isValid
      ? 'Your profile has been successfully updated!'
      : 'Please review the page, correct any errors, and then try again.',
  }

  return (
    <div>
      <Modal size={size} open={open} onClose={close}>
        <Modal.Header style={{ background: context.headerColor, color: 'white'}}>
          { context.header }
        </Modal.Header>
        <Modal.Content>
          <h3 className="ui header">{context.text}</h3>
        { warning &&
          <div>
          { !warning.slice(0, 4) === 'Nice' &&
            <h4 className="ui header">
              <i className="small red warning sign icon" />
              But, your profile looks a bit bare...
            </h4> }
            <p>{warning}</p>
          </div> }
        </Modal.Content>
        <Modal.Actions>
          <Button
            content='Ok'
            onClick={close}
            icon='checkmark'
            labelPosition='right'
            color={context.buttonColor} />
        </Modal.Actions>
      </Modal>
    </div>
  );
}

export default SaveModal;
