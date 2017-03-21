import React from 'react';
import { Modal, Button } from 'semantic-ui-react';

export default ({ size, close, open }) => {
  return(
    <div>
      <Modal size={size} open={open} onClose={close}>
        
        <Modal.Header>
            Mess Hall Chat
        </Modal.Header>
        
        <Modal.Content>

          <p><b>Here you can chat with other users in real time.</b></p>
          <p>The goal of the Mess Hall is to allow Free Code Camp alumni to discuss
              anything they want: interviews, algorithms, employment, salary negotiation,
              new technologies — you name it! This area should also serve as a place to
              cultivate mentorship opportunities. All the normal Code of Conduct guidelines
              for the Free Code Camp forum and Gitter channels apply here as well.
          </p>

        </Modal.Content>
        
        <Modal.Actions>
          <Button
            positive
            onClick={close}
            color='teal'
            icon='checkmark'
            labelPosition='right'
            content='Ok' />
        </Modal.Actions>

      </Modal>
    </div>
  );
};