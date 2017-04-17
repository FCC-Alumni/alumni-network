/* eslint-disable */
import React from 'react';
import { connect } from 'react-redux';
import { deleteUser, logoutUser } from '../../actions/user';
import { Modal, Button } from 'semantic-ui-react';
import { addFlashMessage, clearFlashMessage } from '../../actions/flashMessages';

const ConfirmModal = ({ open, input, handleInput, deleteUser, close }) => {
  return (
    <Modal size="small" open={open}>

      <Modal.Header style={{ background: 'rgb(225,225,225)' }}>
        <h1>
          <span>Type your username to confirm:</span>
        </h1>
      </Modal.Header>

      <Modal.Content>
        <form onSubmit={deleteUser}>
          <input
            autoFocus
            autoComplete='off'
            id="deleteInput"
            type="text"
            value={input}
            onChange={handleInput} />
        </form>
      </Modal.Content>

      <Modal.Actions style={{ textAlign: 'center' }}>
        <Button
          content='Delete Account'
          color="red"
          onClick={deleteUser}
          icon='remove'
          labelPosition='right' />
        <Button
          positive
          content='Nevermind'
          color="green"
          onClick={close}
          icon='undo'
          labelPosition='right' />
      </Modal.Actions>

    </Modal>
  );
};


class Account extends React.Component {
  state = {
    modal: false,
    input: ''
  }
  deleteUser = (e) => {
    if (e) e.preventDefault();
    const { input } = this.state;
    this.setState({ input: '' });
    if (input === this.props.user) {
      deleteUser().then(res => {
        this.props.logoutUser();
        this.props.clearFlashMessage();
        this.props.addFlashMessage({
          type: 'error',
          text: {
            header: 'Your account has been deleted.',
            message: 'Goodbye!'
          }
        });
        this.props.history.push('/login');
      }).catch(err => {
        this.props.addFlashMessage({
          type: 'error',
          text: {
            header: 'Something went wrong...',
            message: 'Hmmm...'
          }
        });
      })
    } else {
      this.toggleModal();
      this.props.addFlashMessage({
        type: 'error',
        text: {
          header: 'Delete User Error.',
          message: 'You must enter your username correctly if you want to delete your account.'
        }
      });
    }
  }
  handleInput = (e) => this.setState({ input: e.target.value });
  toggleModal = () => this.setState({ modal: !this.state.modal });
  render() {
    return (
      <div className="ui main text container" id="accountSettings">
        <div className='ui segment' style={{ padding: '25px' }}>
          <h1 className="ui header">Account Settings for: {this.props.user}</h1>
          <button className="ui red button" onClick={this.toggleModal}>Delete My Account</button>
          <br /><br />
          <p>This cannot be undone.</p>
          <ConfirmModal
            open={this.state.modal}
            input={this.state.input}
            handleInput={this.handleInput}
            deleteUser={this.deleteUser}
            close={this.toggleModal} />
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  user: state.user.username
});

const dispatchProps = {
  addFlashMessage,
  clearFlashMessage,
  logoutUser
};

export default connect(mapStateToProps, dispatchProps)(Account);
