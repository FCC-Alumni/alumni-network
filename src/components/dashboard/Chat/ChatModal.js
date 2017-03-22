import React from 'react';
import { Modal, Button } from 'semantic-ui-react';

export default ({ size, close, open }) => {
  const teal = '#00b5ad';
  return(
    <div>
      <Modal size={size} open={open} onClose={close}>

        <Modal.Header style={{ background: teal, color: 'white' }}>
          <h1>
            <span>Mess Hall Chat &nbsp;</span>
            <i style={{ marginBottom: '10px' }} className="em em-fire"></i>
            <i style={{ marginBottom: '10px' }} className="em em-fire"></i>
            <i style={{ marginBottom: '10px' }} className="em em-fire"></i>
          </h1>
        </Modal.Header>

        <Modal.Content>

        <p style={{ fontSize: '20px' }}>
          <b>Here you can chat with other users in real time!</b>
        </p>

        <p style={{ fontSize: '16px' }}>

          The goal of the Mess Hall is to allow
          Free Code Camp alumni to discuss anything they want: <i>interviews, algorithms,
          employment, salary negotiation, new technologies</i> — you name it!
          This area also serves as a place to cultivate mentorship opportunities between campers.

          <br/><br/>

          All the normal&nbsp;
          <a target="_blank" href="https://www.freecodecamp.com/code-of-conduct">Code of Conduct</a>
          &nbsp;guidelines for the Free Code Camp Forum and Gitter channels apply here as well.

          <br/><br/>

          <b>Be nice and happy coding!</b>

          <br/>

        </p>

        <p style={{ fontSize: '14px' }}><b>Note:</b> This is not a fully
        featured chat and long-term chat history is not saved. We encourage you to continue
        more in-depth discussions on other platforms.</p>


        </Modal.Content>

        <Modal.Actions style={{ background: 'rgb(200,200,200)' }}>
          <Button
            positive
            onClick={close}
            icon='checkmark'
            labelPosition='right'
            style={{ background: teal }}
            content='Ok' />
        </Modal.Actions>

      </Modal>
    </div>
  );
};
