/* eslint-disable */
import React from 'react';
import { Modal, Button } from 'semantic-ui-react';

export default ({ size, close, open }) => {
  return (
    <div>
      <Modal size={size} open={open} onClose={close}>

        <Modal.Header style={{ background: '#007E00', color: 'white' }}>
          <h1>
            <span>Mess Hall Chat &nbsp;</span>
          </h1>
        </Modal.Header>

        <Modal.Content>

        <p style={{ fontSize: '16px' }}>

          <span style={{ fontSize: '20px' }}>Discuss any coding topics you would like and feel free to explore
          mentorship opportunities in new technologies you are learning. To begin a new private chat with
          another member, simply click their name.</span>

          <br/><br/>

          <span>All the normal&nbsp;
          <a rel="noreferrer noopener" target="_blank"  href="https://www.freecodecamp.org/code-of-conduct">Code of Conduct</a>
          &nbsp;guidelines for the freeCodeCamp Forum and Gitter channels apply here as well.</span>

          <br/><br/>

          <i className="student icon mentorIcon" /> These people are mentors<br/>
          <i className="star icon onlineIcon" style={{ color: 'rgb(255, 109, 88)' }} /> These people are currently online

          <br/><br/>

          <strong>Be nice and happy coding!</strong>

          <br/>

        </p>

        <p style={{ fontSize: '14px' }}><strong>Note:</strong> While we enjoyed building this chat, we encourage you to continue
        more in-depth discussions on other platforms that have more robust features.</p>


        </Modal.Content>

        <Modal.Actions>
          <Button
            positive
            content='Ok'
            onClick={close}
            icon='checkmark'
            labelPosition='right'
            color="green" />
        </Modal.Actions>

      </Modal>
    </div>
  );
};
