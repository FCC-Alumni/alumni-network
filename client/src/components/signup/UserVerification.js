import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { socket } from '../../actions/chat';
import { mapScreenSizeToProps } from '../Navbar';
import { connectScreenSize } from 'react-screen-size';
import { addFlashMessage } from '../../actions/flashMessages';
import { getUserData, verifyUser, saveUser, deleteUser } from '../../actions/user';

class UserVerification extends React.Component {
  state = {
    mongoId: '',
    username: '',
    avatarUrl: '',
    loading: true,
  }

  componentDidMount() {
    getUserData().then(user => {
    this.setState({ loading: false });
      if (user) {
        // redirect on subsequent login
        if (user.verifiedUser) {
          this.props.saveUser(user);
          this.props.addFlashMessage({
            type: 'success',
            text: {
              header: 'Welcome to the freeCodeCamp Alumni Network!',
              message: 'Welcome back to the app!'
            }
          });
          this.props.history.push('/dashboard');
          // verification process
        } else if (user.username) {
          const { personal, username, _id } = user;
          const { avatarUrl } = personal;
          this.setState({ displayName: username, username, avatarUrl, mongoId: _id });
        }
      } else {
        this.props.history.push('/login');
      }
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { username, mongoId } = this.state;
    this.setState({ loading: true });
    verifyUser(username, mongoId).then(res => {
      this.setState({ loading: false });
      const user = res.data.user;
      this.props.saveUser(user);
      this.props.addFlashMessage({
        type: 'success',
        text: {
          header: 'Welcome to the freeCodeCamp Alumni Network!',
          message: 'Your account is now verified!'
        }
      });
      socket.emit('announce-new-user', { user });
      this.props.history.push('/dashboard');
    })
    // failed verification:
    .catch(err => {
      this.setState({ loading: false });
      this.props.addFlashMessage({
        type: 'error',
        text: {
          header: 'User verification error!',
          message: 'Either you have not earned any freeCodeCamp certifications, or you do not have a freeCodeCamp account. Please visit us again when you have resolved these issues.'
        }
      });
      this.props.history.push('/login');
      deleteUser().then(res => {
        console.log('user deleted');
      }).catch(err => {
        console.log('Some error occurred trying to delete the unverified user...');
      });
    });
  }

  render() {
    const { isDesktop, isMobile } = this.props.screen;

    const Container = styled.div`
      margin-top: ${isDesktop ? '100px': '150px' } !important;
      margin-bottom: ${isMobile && '50px !important;'}
    `;

    const loader = (
      <div className="ui active dimmer">
        <div className="ui text huge loader">Loading</div>
      </div>
    );

    const pageContent = (
      <Container className='ui container'>
        <div className='ui segment'>
        { this.state.avatarUrl &&
          <div className="ui small floated left image">
            <img src={this.state.avatarUrl} alt="github avatar"/>
          </div> }
          <h1 style={{ marginTop: 0 }}>{`Welcome ${this.state.displayName}!`}</h1>
          <p style={{ fontSize: 16 }}>This extension of the freeCodeCamp Community is a network of like-minded individuals, who are serious about coding and about taking their skills to the next level.</p>
          <p style={{ fontSize: 16 }}>While our goal is to be as inclusive as possible, to ensure that this network maintains its integrity as a serious place for serious campers, we do have some requirements that limit who can and cannot join.</p>
          <div style={{ marginTop: 0 }} className="ui compact info message">
            <div className="header">To join the freeCodeCamp Alumni Network, your profile must be public and you must have earned at least one of the following:</div>
            <ul className="list">
              <li>freeCodeCamp Front End Certification</li>
              <li>freeCodeCamp Data Visualization Certification</li>
              <li>freeCodeCamp Back End Certification</li>
              <li>freeCodeCamp Full Stack Certification</li>
            </ul>
          </div>
          <br />
          <button onClick={this.handleSubmit} className="ui positive button">Verify freeCodeCamp Certifications for {this.state.username}</button>
          <p style={{ fontSize: 15, marginTop: 15, marginBottom: 15 }}>
            <i className="red warning circle icon" /><strong>Note:</strong> If your freeCodeCamp username is not <strong>{this.state.username}</strong>, please send an email to Pete's Computer.
          </p>
        </div>
      </Container>
    );

    return (
      <div>
        { this.state.loading ? loader : pageContent }
      </div>
    );
  }
}

UserVerification.propTypes = {
  saveUser: propTypes.func.isRequired,
  addFlashMessage: propTypes.func.isRequired
}

export default connectScreenSize(mapScreenSizeToProps)(
  connect(null, { saveUser, addFlashMessage })(UserVerification));
