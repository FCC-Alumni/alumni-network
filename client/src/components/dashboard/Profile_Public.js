import React from 'react';
import { connect } from 'react-redux';
import UserLabel from '../common/UserLabel';
import { CenterAlignedWrapper } from '../../styles/globalStyles';
import styled from 'styled-components';
import htmlToJson from 'html-to-json';
import axios from 'axios';

const ERROR = "Sorry, we encountered an error.";

const Flag = styled.div`
  width: 50px;
  height: 50px;
`;

const InfoIcon = styled.i`
  font-size: 14px !important;
  margin-left: 4px !important;
  transition: color 100ms ease-in-out;
  cursor: pointer;
  color: grey;
  &:hover {
    color: rgb(0,225,225);
    transition: color 100ms ease-in-out;
  }
`;

class PublicProfile extends React.Component {
  state = {
    firstChallenge: '',
    totalChallneges: '',
    longestStreak: '',
    currentStreak: '',
    browniePoints: '',
    isLoadingA: true,
    isLoadingB: true,
    isLoadingC: true,
    isLoadingD: true,
    isLoadingE: true,
  }

  componentWillMount() {
    this.firstChallenge();
    this.totalChallneges();
    this.longestStreak();
    this.currentStreak();
    this.browniePoints();
  }

  firstChallenge = () => {
    axios.get(`https://www.freecodecamp.com/${this.props.user.username}`)
    .then(res => {
      htmlToJson.parse(res.data, {
        'text': (doc) => {
          return doc.find('div').text();
        }
      })
      .done(result => {
        result = result.text.match(/Challenges\s*Completed.*?\d{4}/)[0];
        this.setState({
          firstChallenge: result.slice(-12),
          isLoadingA: false
        });
      }, err => {
        this.setState({
          firstChallenge: ERROR,
          isLoadingA: false
        });
      });
    });
  }

  totalChallneges = () => {
    axios.get(`https://www.freecodecamp.com/${this.props.user.username}`)
    .then(res => {
      htmlToJson.parse(res.data, function () {
        return this.map('tr .col-xs-5', (item) => {
          return item.text();
        });
      })
      .done(items => {
        this.setState({
          totalChallneges: items.length,
          isLoadingB: false
        });
      }, err => {
        this.setState({
          firstChallenge: ERROR,
          isLoadingB: false
        });
      });
    });
  }

  longestStreak = () => {
    axios.get(`https://www.freecodecamp.com/${this.props.user.username}`)
    .then(res => {
      htmlToJson.parse(res.data, {
        'text': function (doc) {
          return doc.find('h4').text();
        }
      })
      .done(result => {
        result = result.text.match(/Longest\sStreak:\s\d+/)[0];
        var dayOrDays = result.slice(16) === "1" ? " Day" : " Days";
        this.setState({
          longestStreak: result.slice(16) + dayOrDays,
          isLoadingC: false
        });
      }, err => {
        this.setState({
          longestStreak: ERROR,
          isLoadingC: false
        });
      });
    });
  }

  currentStreak = () => {
    axios.get(`https://www.freecodecamp.com/${this.props.user.username}`)
    .then(res => {
      htmlToJson.parse(res.data, {
        'text': function (doc) {
          return doc.find('h4').text();
        }
      })
      .done(result => {
        result = result.text.match(/Current\sStreak:\s\d+/)[0];
        var dayOrDays = result.slice(16) === "1" ? " Day" : " Days";
        this.setState({
          currentStreak: result.slice(16) + dayOrDays,
          isLoadingD: false
        });
      }, err => {
        this.setState({
          currentStreak: ERROR,
          isLoadingD: false
        });
      });
    });
  }

  browniePoints = () => {
    axios.get(`https://www.freecodecamp.com/${this.props.user.username}`)
    .then(res => {
      htmlToJson.parse(res.data, {
        'text': function (doc) {
          return doc.find('h1').text();
        }
      })
      .done(result => {
        result = result.text.match(/\[\s\d*\s\]/)[0];
        this.setState({
          browniePoints: result.slice(2, -2),
          isLoadingE: false
        });
      }, err => {
        this.setState({
          browniePoints: ERROR,
          isLoadingE: false
        });
      });
    });
  }

  isLoading = () => {
    if (
    !this.state.isLoadingA &&
    !this.state.isLoadingB &&
    !this.state.isLoadingC &&
    !this.state.isLoadingD &&
    !this.state.isLoadingE ) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const { user } = this.props;

    const loader = (
      <div className="ui active inverted dimmer">
        <div className="ui text huge loader">Loading</div>
      </div>
    );

    return (
      <div className="ui celled stackable grid container">
        <div className="row">
          <div className="four wide center aligned column">
            <img className="ui fluid circular bordered image" src={user.personal.avatarUrl} alt={`${user.username}'s avatar'`} />
            <div className="ui horizontal divider">{user.personal.displayName}</div>
            <UserLabel
              username={user.username}
              showAvatar={false}
              label={user.mentorship.isMentor ? "Mentor" : "Member"} />
          </div>
          <div className="six wide center aligned column">
            <div className="ui steps">
              <div className="step">
                <i className="world icon" />
                <div className="content">
                  <div className="title">Country</div>
                  <div className="description">of origin</div>
                </div>
              </div>
              <div className="step">
                <div className="content">
                  <CenterAlignedWrapper>
                    <Flag className={`flag-icon-background flag-icon-${user.personal.flag.replace(' ', '-')}`}></Flag>
                  </CenterAlignedWrapper>
                  <div className="description">{user.personal.country}</div>
                </div>
              </div>
            </div>
            <CenterAlignedWrapper>
              <table className="ui very basic collapsing celled table">
                <thead>
                  <tr><th>freeCodeCamp</th>
                  <th>Certified</th></tr>
                </thead>
                <tbody>
                  <tr><td>
                    <h4 className="ui image header">
                      <i className="desktop icon" />
                      <div className="content">Frontend</div>
                    </h4>
                  </td><td>
                  { user.fccCerts.Front_End ?
                    <i className="large green check mark icon"/> :
                    <i className="large red remove icon"/> }
                  </td></tr>
                  <tr><td>
                    <h4 className="ui image header">
                      <i className="small bar chart icon" />
                      <div className="content">Data Visualization</div>
                    </h4>
                  </td><td>
                  { user.fccCerts.Data_Visualization ?
                    <i className="large green check mark icon"/> :
                    <i className="large red remove icon"/> }
                  </td></tr>
                  <tr><td>
                    <h4 className="ui image header">
                      <i className="small database icon" />
                      <div className="content">Backend</div>
                    </h4>
                  </td><td>
                  { user.fccCerts.Back_End ?
                    <i className="large green check mark icon"/> :
                    <i className="large red remove icon"/> }
                  </td></tr>
                </tbody>
              </table>
            </CenterAlignedWrapper>
          </div>
          <div className="six wide middle aligned column">
            { this.isLoading() ? loader :
            <CenterAlignedWrapper>
              <table className="ui very basic collapsing celled table">
                <tbody>
                  <tr><td>
                    <h4 className="ui header">
                      <div className="content">First Challenge</div>
                    </h4>
                  </td><td>
                  { this.state.firstChallenge }
                  </td></tr>
                  <tr><td>
                    <h4 className="ui header">
                      <div className="content">Total Challenges</div>
                    </h4>
                  </td><td>
                  { this.state.totalChallneges }
                  {/* Replace with popup !*/}
                  <InfoIcon
                    title="This value includes the total number of all projects, algorithms, and challenges combined."
                    className="info circle icon" />
                  </td></tr>
                  <tr><td>
                    <h4 className="ui header">
                      <div className="content">Longest Streak</div>
                    </h4>
                  </td><td>
                  { this.state.longestStreak }
                  </td></tr>
                  <tr><td>
                    <h4 className="ui header">
                      <div className="content">Current Streak</div>
                    </h4>
                  </td><td>
                  { this.state.currentStreak }
                  </td></tr>
                  <tr><td>
                    <h4 className="ui header">
                      <div className="content">Brownie Points</div>
                    </h4>
                  </td><td>
                  { this.state.browniePoints }
                  </td></tr>
                </tbody>
              </table>
            </CenterAlignedWrapper> }
          </div>
        </div>
      </div>
    );
  }
}

PublicProfile.propTypes = {
  user: React.PropTypes.object.isRequired
}

const findUser = (community, username) => {
  return community.filter(user =>
    (user.username === username) && user)[0];
};

const mapStateToProps = ({ community }, props) => {
  const { username } = props.match.params;
  return {
    user: findUser(community.toJS(), username)
  }
}

export default connect(mapStateToProps)(PublicProfile);
