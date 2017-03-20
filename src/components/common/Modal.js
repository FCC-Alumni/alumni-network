import React from 'react';
import { Modal, Button } from 'semantic-ui-react';

const MyModal = ({ size, close, open }) => {
  return(
    <div>
      <Modal size={size} open={open} onClose={close}>
        <Modal.Header>
          Success!
        </Modal.Header>
        <Modal.Content>
          <p>Your profile has been successfully updated!</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={close} positive icon='checkmark' labelPosition='right' content='Ok' />
        </Modal.Actions>
      </Modal>
    </div>
  );
}

export default MyModal;