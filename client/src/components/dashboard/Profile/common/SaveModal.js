import React from 'react';
import { Modal, Button } from 'semantic-ui-react';

const SaveModal = ({ size, close, open, isValid }) => {

  const context = {
    header: isValid ? 'Success' : 'Error',
    headerColor: isValid ? '#007E00' : '#FF4025',
    text: isValid ? 'Your profile has been successfully updated!' : 'Please correct the errors and try again.',
    buttonColor: isValid ? 'green' : 'red'
  }

  return (
    <div>
      <Modal size={size} open={open} onClose={close}>
        <Modal.Header style={{ background: context.headerColor, color: 'white'}}>
          { context.header }
        </Modal.Header>
        <Modal.Content>
          <h4 className="ui header">{context.text}</h4>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
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
