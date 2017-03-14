import React from 'react';
import { getUserData, verifyUser, saveUser } from '../actions/loginActions';
import { addFlashMessage } from '../actions/flashMessages';
import { connect } from 'react-redux';

class PassportPage extends React.Component {
  state = {
    username: '',
    avatarUrl: '',
    mongoId: ''
  }

  componentDidMount() {
    getUserData().then(
      (res) => {
        if (res) {
          if (res.verifiedUser) {
            const user = res;
            this.props.saveUser(user);
            this.props.addFlashMessage({
              type: 'success',
              text: {
                header: 'Welcome to the freeCodeCamp Alumni Network!',
                message: 'Welcome back to the app!'
              }
            });
            this.props.history.push('/dashboard');
          } else {
            const { username, avatarUrl, _id } = res;
            this.setState({ username, avatarUrl, mongoId: _id });
          }
        }
      },
    ).catch(console.log); // do something with error? display in UI?
  }

  handleClick = (e) => {
    e.preventDefault();
    const { username, mongoId } = this.state;
    verifyUser(username, mongoId).then(
      (res) => {
        const user = res.data.user;
        this.props.saveUser(user);
        this.props.addFlashMessage({
          type: 'success',
          text: {
            header: 'Welcome to the freeCodeCamp Alumni Network!',
            message: 'Your account is now verified!'
          }
        });
        this.props.history.push('/dashboard');
      },
      (err) => {
        this.props.addFlashMessage({
          type: 'error',
          text: {
            header: 'User verification error!',
            message: 'Either you have not earned any freeCodeCamp certifications, or you do not have a freeCodeCamp account. Please visit us again when you have resolved these issues.'
          }
        });
        this.props.history.push('/');
      }
    )
  }

  render() {
    return (
      <div className="ui container">

        <h1>{`Welcome ${this.state.username}!`}</h1>

        { this.state.avatarUrl.length > 0 && <div className="ui small image"><img src={this.state.avatarUrl} alt="github avatar"/></div> }

        <br /><br />
        <p>This extension of the freeCodeCamp Community is a network of like-minded individuals, who are serious about coding and about taking their skills to the next level.</p>
        <p>While our goal is to be as inclusive as possible, to ensure that this network maintains its integrity as a serious place for serious campers, we do have some requirements that limit who can and cannot join.</p>

        <div className="ui info message">
          <div className="header">To join the freeCodeCamp Alumni Network, you must have earned at least one of the following:</div>
          <ul className="list">
            <li>freeCodeCamp Front End Certification</li>
            <li>freeCodeCamp Data Visualization Certification</li>
            <li>freeCodeCamp Back End Certification</li>
            <li>freeCodeCamp Full Stack Certification</li>
          </ul>
        </div>

        <p>To continue, please click the button below, which will verify your eligibility to join based on the above gudilines. Thanks!</p>

        <button onClick={this.handleClick} type="submit" className="ui button">Verify freeCodeCamp User Data</button>

      </div>
    )
  }
}

PassportPage.propTypes = {
  saveUser: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.isRequired
}

export default connect(null, { saveUser, addFlashMessage })(PassportPage);