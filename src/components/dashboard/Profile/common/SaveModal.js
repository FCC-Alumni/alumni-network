import React from 'react';
import { Modal, Button } from 'semantic-ui-react';

const SaveModal = ({ size, close, open }) => {
  const teal = '#00b5ad';
  return(
    <div>
      <Modal size={size} open={open} onClose={close}>
        <Modal.Header>
          Success
        </Modal.Header>
        <Modal.Content>
          <p>Your profile has been successfully updated!</p>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            content='Ok'
            onClick={close}
            icon='checkmark'
            labelPosition='right'
            style={{ background: teal }} />
        </Modal.Actions>
      </Modal>
    </div>
  );
}

export default SaveModal;
