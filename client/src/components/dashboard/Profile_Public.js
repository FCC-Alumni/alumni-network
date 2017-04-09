import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import UserLabel from '../common/UserLabel';
import LocationSteps from './Profile/Public/LocationSteps';
import { ThickPaddedBottom } from '../../styles/globalStyles';
import { saveProfileStats } from '../../actions/views';
import FCCStatTables from './Profile/Public/FCCTables';
import CodeProfile from './Profile/Public/CodeProfile';
import SocialList from './Profile/Public/SocialList';
import styled from 'styled-components';
import htmlToJson from 'html-to-json';
import axios from 'axios';

const ERROR = "Sorry, we encountered an error.";

const HeaderWrapper = styled.div`
  background-color: #006400 !important;
  color: white;
`;

const Loader = styled.div`
  height: 200px !important;
  padding-bottom:  !important;
`;

class PublicProfile extends React.Component {
  constructor(props) {
    super(props);
    const { initialState } = this.props;
    this.state = {
      ...initialState
    }
  }

  componentDidMount() {
    if (this.state.firstLoad) {
      this.longestStreak();
      this.currentStreak();
      this.browniePoints();
      this.firstChallenge();
      this.totalChallneges();
      this.setState({
        firstLoad: false
      });
    }
  }

  componentWillUnmount() {
    this.props.saveProfileStats({ [this.props.user.username]: this.state });
  }

  firstChallenge = () => {
    axios.get(`https://www.freecodecamp.com/${this.props.user.username}`).then(res => {
      htmlToJson.parse(res.data, {
        'text': (doc) => {
          return doc.find('div').text();
        }
      }).done(result => {
        if (!/Challenges\s*Completed/.test(result.text)) {
          this.setState({firstChallenge: "Sorry, no data", isLoadingA: false});
        } else {
          result = result.text.match(/Challenges\s*Completed.*?\d{4}/)[0];
          this.setState({firstChallenge: result.slice(-12), isLoadingA: false});
        }
      }, err => {
        this.setState({firstChallenge: ERROR, isLoadingA: false});
      });
    });
  }

  totalChallneges = () => {
    axios.get(`https://www.freecodecamp.com/${this.props.user.username}`).then(res => {
      htmlToJson.parse(res.data, function() {
        return this.map('tr .col-xs-5', (item) => {
          return item.text();
        });
      }).done(items => {
        this.setState({totalChallneges: items.length, isLoadingB: false});
      }, err => {
        this.setState({firstChallenge: ERROR, isLoadingB: false});
      });
    });
  }

  longestStreak = () => {
    axios.get(`https://www.freecodecamp.com/${this.props.user.username}`).then(res => {
      htmlToJson.parse(res.data, {
        'text': function(doc) {
          return doc.find('h4').text();
        }
      }).done(result => {
        result = result.text.match(/Longest\sStreak:\s\d+/)[0];
        var dayOrDays = result.slice(16) === "1"
          ? " Day"
          : " Days";
        this.setState({
          longestStreak: result.slice(16) + dayOrDays,
          isLoadingC: false
        });
      }, err => {
        this.setState({longestStreak: ERROR, isLoadingC: false});
      });
    });
  }

  currentStreak = () => {
    axios.get(`https://www.freecodecamp.com/${this.props.user.username}`).then(res => {
      htmlToJson.parse(res.data, {
        'text': function(doc) {
          return doc.find('h4').text();
        }
      }).done(result => {
        result = result.text.match(/Current\sStreak:\s\d+/)[0];
        var dayOrDays = result.slice(16) === "1"
          ? " Day"
          : " Days";
        this.setState({
          currentStreak: result.slice(16) + dayOrDays,
          isLoadingD: false
        });
      }, err => {
        this.setState({currentStreak: ERROR, isLoadingD: false});
      });
    });
  }

  browniePoints = () => {
    axios.get(`https://www.freecodecamp.com/${this.props.user.username}`).then(res => {
      htmlToJson.parse(res.data, {
        'text': function(doc) {
          return doc.find('h1').text();
        }
      }).done(result => {
        result = result.text.match(/\[\s\d*\s\]/)[0];
        this.setState({
          browniePoints: result.slice(2, -2),
          isLoadingE: false
        });
      }, err => {
        this.setState({browniePoints: ERROR, isLoadingE: false});
      });
    });
  }

  isLoading = () => {
    if (
      !this.state.isLoadingA &&
      !this.state.isLoadingB &&
      !this.state.isLoadingC &&
      !this.state.isLoadingD &&
      !this.state.isLoadingE) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const {user} = this.props;

    const loader = (
      <Loader className="ui active inverted dimmer">
        <div className="ui text huge loader">Loading</div>
      </Loader>
    );

    return (
      <ThickPaddedBottom>
        <div className="ui celled stackable grid container">
          <div className="row">

            <div className="four wide center aligned column">
              <img
                src={user.personal.avatarUrl}
                alt={`${user.username}'s avatar'`}
                className="ui fluid circular bordered image" />
              <div className="ui horizontal divider">{user.personal.displayName}</div>
              <UserLabel
                showAvatar={false}
                username={user.username}
                label={user.mentorship.isMentor ? "Mentor" : "Member"}/>
            </div>

            <div className="twelve wide column">
              <LocationSteps personal={user.personal} />
              <div className="ui center aligned segment">
                <div className="ui horizontal divider">About Me:</div>
                <div className="ui segment">
                  {user.personal.bio}
                </div>
              </div>
              <SocialList
                social={user.social}
                username={user.username}
                profileUrl={user.personal.profileUrl} />
            </div>

          </div>
        </div>

        <div className="ui celled stackable grid container">
          <div className="row">
            <HeaderWrapper className="sixteen wide center aligned column">
              <h2 className="ui">freeCodeCamp <i className="fa fa-free-code-camp" /></h2>
            </HeaderWrapper>
          </div>
          { this.isLoading()
            ? <div style={{ marginBottom: 200 }} className="row">{loader}</div>
            : <FCCStatTables { ...this.state } username={user.username} fccCerts={user.fccCerts} /> }
        </div>

        <div className="ui celled stackable grid container">
          <div className="row">
            <HeaderWrapper className="sixteen wide center aligned column">
              <h2 className="ui">Coding Profile <i className="code icon" /></h2>
            </HeaderWrapper>
          </div>
          <CodeProfile career={user.career} skillsAndInterests={user.skillsAndInterests} />
        </div>

      </ThickPaddedBottom>
    );
  }
}

PublicProfile.propTypes = {
  user: propTypes.object.isRequired
}

const findUser = (community, username) => {
  return community.filter(user => (user.username === username) && user)[0];
};

const mapStateToProps = ({ community, publicProfileStats }, props) => {
  const { username } = props.match.params;
  return {
    initialState: publicProfileStats[username],
    user: findUser(community.toJS(), username),
  }
}

export default connect(mapStateToProps, { saveProfileStats })(PublicProfile);
