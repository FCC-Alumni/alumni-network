import React from 'react';
import { getUserData, verifyUser } from '../actions/loginActions';

class PassportPage extends React.Component {
  state = {
    username: '',
    avatarUrl: '',
    githubUrl: ''
  }

  componentDidMount() {
    getUserData().then(
      (res) => {
        if (res) {
          const { avatarUrl, githubUrl, username } = res;
          this.setState({ username, avatarUrl, githubUrl });
        }
      },
      (err) => console.log // do something with error? display in UI?
    );
  }

  handleChange = (e) => {
    this.setState({ username: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    verifyUser(this.state.username).then(
      (res) => {
        console.log(res);
      },
      (error) => {
        // redirect somehow with react router back to the login back, ?
        console.log('user is not authenticated...');
      }
    )
    // here, we need to do 3 things:
    //  1) see if user updated username, once we determine this, update db to reflect change
    //  2) possibly in same route, ping fcc cert URLs to see which earned
    //  3) return up to date user info, along with FCC cert info and set
    //     all of this to db & redux store for access on client for setting up profile page.
    //     Optionally, we can also get even more info from github passport auth, such as:
    //                                                                             - # of repos
    //                                                                             - bio
    //                                                                             - organizations
    //                                                                             - # followers
    //                                                                             - location
    //                                                                             - etc
    //    we can do this when we first authenticate via passport and build it in to the user schema as an array or object
    //    possibly so that we can pre-populate some profile information when we finally get to that step
    //    and just like the username, let them change it if they'd like to.
  }

  render() {
    return (
      <div className="ui container">
        <h1>{`Welcome ${this.state.username}!`}</h1>

        { this.state.avatarUrl.length > 0 && <div className="ui small image"><img src={this.state.avatarUrl} alt="github avatar"/></div> }

        <h4>If your freeCodeCamp username is not the same as what is listed below, please change it so that we can pull the correct data from freeCodeCamp.</h4>

        <form onSubmit={this.handleSubmit} className="ui form">
          <div className="four wide field">
            <input
              value={this.state.username}
              onChange={this.handleChange} />
          </div>
          <button type="submit" className="ui button">Verify Free Code Camp User Data</button>
        </form>

      </div>
    );
  }
}

export default PassportPage;
