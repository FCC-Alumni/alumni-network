import React from 'react';
import { getUserData, verifyUser } from '../actions/loginActions';

class PassportPage extends React.Component {
  state = {
    ghUsername: '',
    fccUsername: '',
    avatarUrl: '',
    mongoId: '',
    userIsVerified: false,
    redirect: false
  }

  componentDidMount() {
    getUserData().then(
      (res) => {
        if (res) {
          const { ghUsername, fccUsername, avatarUrl, _id } = res;
          this.setState({ ghUsername, fccUsername, avatarUrl, mongoId: _id });
        }
      },
      (err) => console.log // do something with error? display in UI?
    );
  }

  handleChange = (e) => {
    this.setState({ fccUsername: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { fccUsername, mongoId } = this.state;
    verifyUser(fccUsername, mongoId).then(
      (res) => {
        console.log(res.data.user)
        this.setState({ userIsVerified: true });
      },
      (err) => {
        // redirect somehow with react router back to the login back, ?
        this.setState({ userIsVerified: false });
      }
    )
  }

  render() {
    return (
      <div className="ui container">
      
        <h1>{`Welcome ${this.state.ghUsername}!`}</h1>

        { this.state.avatarUrl.length > 0 && <div className="ui small image"><img src={this.state.avatarUrl} alt="github avatar"/></div> }

        <h4>If your freeCodeCamp username is not the same as what is listed below, please change it so that we can pull the correct data from freeCodeCamp.</h4>

        <form onSubmit={this.handleSubmit} className="ui form">
          <div className="four wide field">
            <input
              value={this.state.fccUsername}
              onChange={this.handleChange} />
          </div>
          <button type="submit" className="ui button">Verify Free Code Camp User Data</button>
        </form>

      </div>
    );
  }
}

export default PassportPage;
