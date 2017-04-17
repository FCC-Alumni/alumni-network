import React from 'react';
import propTypes from 'prop-types';
import { getUserData, verifyUser, saveUser, deleteUser } from '../../actions/user';
import { addFlashMessage } from '../../actions/flashMessages';
import { connect } from 'react-redux';
import { socket } from '../../actions/chat';

class PassportPage extends React.Component {
  state = {
    loading: true,
    username: '',
    avatarUrl: '',
    mongoId: ''
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
    .catch(err => {
      this.setState({ loading: false });
      this.props.addFlashMessage({
        type: 'error',
        text: {
          header: 'User verification error!',
          message: 'Either you have not earned any freeCodeCamp certifications, or you do not have a freeCodeCamp account. Please visit us again when you have resolved these issues.'
        }
      });
      deleteUser().then(res => {
        console.log('user deleted');
      }).catch(err => {
        console.log('Some error occurred trying to delete the unverified user...');
      });
    });
  }

  render() {
    const loader = (
      <div className="ui active dimmer">
        <div className="ui text huge loader">Loading</div>
      </div>
    );

    const pageContent = (
      <div className='ui container'>

        <div className='ui segment' style={{ fontSize: '18px', minHeight: '235px' }}>
          <h1>{`Welcome ${this.state.displayName}!`}</h1>
          { this.state.avatarUrl.length > 0 &&
            <div className="ui small floated left image">
              <img src={this.state.avatarUrl} alt="github avatar"/>
            </div> }
          <p>This extension of the freeCodeCamp Community is a network of like-minded individuals, who are serious about coding and about taking their skills to the next level.</p>
          <p>While our goal is to be as inclusive as possible, to ensure that this network maintains its integrity as a serious place for serious campers, we do have some requirements that limit who can and cannot join.</p>
        </div>

        <div className="ui info message">
          <div className="header">To join the freeCodeCamp Alumni Network, you must have earned at least one of the following:</div>
          <ul className="list">
            <li>freeCodeCamp Front End Certification</li>
            <li>freeCodeCamp Data Visualization Certification</li>
            <li>freeCodeCamp Back End Certification</li>
            <li>freeCodeCamp Full Stack Certification</li>
          </ul>
        </div>

        <button onClick={this.handleSubmit} className="ui positive button">Verify freeCodeCamp Certifications for {this.state.username}</button>
        <p style={{ marginTop: '15px', marginBottom: '15px' }}>
          <b>Note:</b> If your freeCodeCamp username is not <b>{this.state.username}</b>, please send an email to Pete's Computer.
        </p>
      </div>
    );

    return (
      <div>

        { this.state.loading ? loader : pageContent }

      </div>
    );
  }
}

PassportPage.propTypes = {
  saveUser: propTypes.func.isRequired,
  addFlashMessage: propTypes.func.isRequired
}

export default connect(null, { saveUser, addFlashMessage })(PassportPage);
