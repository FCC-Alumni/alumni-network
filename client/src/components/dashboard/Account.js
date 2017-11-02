import { connect } from 'react-redux';
import { connectScreenSize } from 'react-screen-size';
import { mapScreenSizeToProps } from '../Navbar';
import React from 'react';
import styled from 'styled-components';

import { addFlashMessage, clearFlashMessage } from '../../actions/flashMessages';
import { Button, Modal } from 'semantic-ui-react';
import { deleteUser, logoutUser } from '../../actions/user';

const Input = styled.input`
  width: 100%;
  border: 1px solid rgba(5,5,5,0.25);
  padding: 4px 6px !important;
  font-size: 22px !important;
`;

const ConfirmModal = ({ open, input, handleInput, deleteUser, close }) => {
  return (
    <Modal open={open} size="small">

      <Modal.Header style={{ background: 'rgb(225,225,225)' }}>
        <h1>
          <span>
            <i className="red warning sign icon" />
            {'Type your username to confirm:'}
          </span>
        </h1>
      </Modal.Header>

      <Modal.Content>
        <form onSubmit={deleteUser}>
          <Input
            autoComplete='off'
            autoFocus
            id="deleteInput"
            onChange={handleInput}
            type="text"
            value={input} />
        </form>
      </Modal.Content>

      <Modal.Actions style={{ textAlign: 'center' }}>
        <Button
          color="red"
          content='Delete Account'
          icon='remove'
          labelPosition='right'
          onClick={deleteUser} />
        <Button
          color="green"
          content='Nevermind'
          icon='undo'
          labelPosition='right'
          onClick={close}
          positive />
      </Modal.Actions>

    </Modal>
  );
};


class Account extends React.Component {
  state = {
    flashMessageCleared: false,
    input: '',
    modal: false,
  }
  componentWillMount() {
    /* bit of a hack here in CWM, just manually removing this node
    from dom (if it exists), since there should never be a flash
    message rendered when first rendering this route. This will
    only need to happen if user does not manually clear whatever
    flash message is there before switching routes. */
    document.getElementsByClassName('flashMessage')[0] &&
    document.getElementsByClassName('flashMessage')[0].remove();
  }
  componentDidMount = () => {
    document.addEventListener('click', this.handleClick);
  }
  componentWillUnmount = () => {
    document.removeEventListener('click', this.handleClick)
  }
  // 'close' is className of close icon in flash message
  handleClick = (e) => {
    e.target.classList.contains('close')
    ? this.setState({ flashMessageCleared: true })
    : this.setState({ flashMessageCleared: false });
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
          text: {
            header: 'Your account has been deleted.',
            message: 'Goodbye!'
          },
          type: 'error',
        });
        this.props.history.push('/login');
      }).catch(err => {
        this.props.addFlashMessage({
          text: {
            header: 'Something went wrong...',
            message: 'Hmmm...'
          },
          type: 'error',
        });
      })
    } else {
      this.toggleModal();
      this.props.addFlashMessage({
        text: {
          header: 'Delete User Error.',
          message: `You must enter your username
          correctly if you want to delete your account.`
        },
        type: 'error',
      });
    }
  }
  handleInput = (e) => this.setState({ input: e.target.value });
  toggleModal = () => this.setState({ modal: !this.state.modal });
  render() {
    const { isDesktop } = this.props.screen;
    const { flashMessageCleared } = this.state;
    /* handles margins when flash messages are rendered and also
    when subsequently removed. handleClick and flashMessageCleared
    state of this component are all related to this. */
    const Container = styled.div`
      margin-top: ${document.getElementsByClassName('flashMessage').length > 0
        && !flashMessageCleared
        ? '53px' : isDesktop
        ? '200px': '175px' } !important;
    `;
    return (
      <Container className="ui main text center aligned container">
        <div className='ui segment' style={{ padding: '25px' }}>
          <h1 className="ui header">
            {`Account Settings for: ${this.props.user}`}
          </h1>
          <button className="ui red button" onClick={this.toggleModal}>
            {'Delete My Account'}
          </button>
          <br /><br />
          <p>{'This cannot be undone.'}</p>
          <ConfirmModal
            close={this.toggleModal}
            deleteUser={this.deleteUser}
            handleInput={this.handleInput}
            input={this.state.input}
            open={this.state.modal} />
        </div>
      </Container>
    );
  }
};

const mapStateToProps = (state) => ({
  user: state.user.username
});

const dispatch = {
  addFlashMessage,
  clearFlashMessage,
  logoutUser
};

export default connectScreenSize(mapScreenSizeToProps)(
  connect(mapStateToProps, dispatch)(Account)
);
