import { addFlashMessage } from '../../actions/flashMessages';
import { connect } from 'react-redux';
import { connectScreenSize } from 'react-screen-size';
import { mapScreenSizeToProps } from '../Navbar';
import propTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import {
  deleteUser,
  getUserData,
  saveUser,
  verifyUser,
} from '../../actions/user';

class UserVerification extends React.Component {
  state = {
    avatarUrl: '',
    loading: true,
    mongoId: '',
    username: '',
  }

  componentDidMount() {
    getUserData().then(user => {
    this.setState({ loading: false });
      if (user) {
        // redirect on subsequent login
        if (user.verifiedUser) {
          this.props.saveUser(user);
          // TEMPORARY FLASH MESSAGE TO NOTIFY MOVE TO GITTER
          // CHANGE BACK IN ABOUT A MONTH
          this.props.addFlashMessage({
            text: {
              header: 'FREECODECAMP ALUMNI NETWORK MOVES TO GITTER!',
              message: `FCCAN now uses Gitter for both Mess Hall and
              Private Chats! If you are not a Gitter user, we recommend
              that you sign up with your GitHub account <a
              href="https://gitter.im/login" rel="noreferrer noopener" target="_blank">here</a>.`
            },
            type: 'announcement',
          });
          this.props.history.push('/dashboard');
          // verification process
        } else if (user.username) {
          const { personal, username, _id } = user;
          const { avatarUrl } = personal;
          this.setState({
            avatarUrl,
            displayName:
            username, mongoId: _id,
            username
          });
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
        text: {
          header: 'Welcome to the freeCodeCamp Alumni Network!',
          message: 'Your account is now verified!'
        },
        type: 'success',
      });
      this.props.history.push('/dashboard');
    })
    // failed verification:
    .catch(err => {
      this.setState({ loading: false });
      this.props.addFlashMessage({
        text: {
          header: 'User verification error!',
          message: `Either you have not earned any freeCodeCamp
          certifications, or you do not have a freeCodeCamp account.
          Please visit us again when you have resolved these issues.`
        },
        type: 'error',
      });
      this.props.history.push('/login');
      deleteUser().then(res => {
        // eslint-disable-next-line
        console.log('user deleted');
      }).catch(err => {
        console.error(
          'Some error occurred trying to delete the unverified user...'
        );
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
        <div className="ui text huge loader">{'Loading'}</div>
      </div>
    );

    const pageContent = (
      <Container className='ui container'>
        <div className='ui segment'>
          { this.state.avatarUrl &&
          <div className="ui small floated left image">
            <img alt="github avatar" src={this.state.avatarUrl} />
          </div> }
          <h1 style={{ marginTop: 0 }}>
            {`Welcome ${this.state.displayName}!`}
          </h1>
          <p style={{ fontSize: 16 }}>
            {`This extension of the freeCodeCamp Community is a network
            of like-minded individuals, who are serious about coding
            and about taking their skills to the next level.`}
          </p>
          <p style={{ fontSize: 16 }}>
            {`While our goal is to be as inclusive as possible, to
            ensure that this network maintains its integrity as a
            serious place for serious campers, we do have some requirements
            that limit who can and cannot join.`}
          </p>
          <div className="ui info message" style={{ marginTop: 0 }}>
            <div className="header">
              {`To join the freeCodeCamp Alumni Network, your freeCodeCamp
              profile must be public and you must have earned at least
              one of the following:`}
            </div>
            <ul className="list">
              <li>{'freeCodeCamp Front End Certification'}</li>
              <li>{'freeCodeCamp Data Visualization Certification'}</li>
              <li>{'freeCodeCamp Back End Certification'}</li>
              <li>{'freeCodeCamp Full Stack Certification'}</li>
            </ul>
          </div>
          <button className="ui positive button" onClick={this.handleSubmit}>
            {`Verify freeCodeCamp Certifications for ${this.state.username}`}
          </button>
          <div className="ui warning message">
            <i className="red warning circle icon" style={{ marginRight: 2 }} />
            <strong>{'IMPORTANT:'}</strong>
            {` If your freeCodeCamp username is not `}
            <strong>{this.state.username}</strong>
            {`, the verification process will fail. To address this, please send an email to `}
            <a href={`mailto:team@fcc-alumni.com?subject=(FCCAN)%20white%20list%20request:%20${this.state.username}`}>
              <strong>{'team@fcc-alumni.com'}</strong>
            </a>
            {` with the subject line "FCCAN white list request:
            ${this.state.username}". We will add you to our white-list and
            notify you as soon as the issue is resolved.`}
          </div>
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
  addFlashMessage: propTypes.func.isRequired,
  saveUser: propTypes.func.isRequired,
}

export default connectScreenSize(mapScreenSizeToProps)(
  connect(null, { addFlashMessage, saveUser })(UserVerification));
