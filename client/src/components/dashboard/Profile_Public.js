import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import UserLabel from '../common/UserLabel';
import { Header } from './Profile/Public/SkillsRow';
import LocationSteps from './Profile/Public/LocationSteps';
import { ThickPaddedBottom } from '../../styles/globalStyles';
import SkillsAndInterests from './Profile/Public/SkillsRow';
import TableRow from '../dashboard/Profile/Public/TableRow';
import { SocialIcon } from './Profile/Public/SocialList';
import { saveProfileStats } from '../../actions/views';
import FCCStatTables from './Profile/Public/FCCTables';
import Table from '../dashboard/Profile/Public/Table';
import SocialList from './Profile/Public/SocialList';
import Career from './Profile/Public/CareerRow';
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

const A = styled.a`
  color: black !important;
  font-weight: bold;
  margin-left: 5px;
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
    // document.body.scrollTop = 0;
    // *** *** *** *** *** *** *** *** *** ***
    //                    ==> UNCOMMENT WHEN DONE WORKING ON COMPONENT <==
    // *** *** *** *** *** *** *** *** *** ***
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

  componentDidUpdate() {
    // dynamically determine height of div with less content
    // & keep side by side divs equal height to keep ui clean
    const bioDiv = document.getElementById('mentorshipBioDiv');
    const contactDiv = document.getElementById('contactDiv');
    const bioHeight = bioDiv && window.getComputedStyle(bioDiv).getPropertyValue('height');
    const contactHeight = contactDiv && window.getComputedStyle(contactDiv).getPropertyValue('height');
    if (parseInt(bioHeight) > parseInt(contactHeight)) {
      this.dynamicHeight = bioHeight;
    } else {
      this.dynamicHeight = contactHeight;
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

    // dynamically set height of divs per CDM logic
    const DynamicHeightDiv = styled.div`
      height: ${ this.dynamicHeight }
    `;

    return (
      <ThickPaddedBottom id="public-profile-container">

        {/* AVATAR & INTRO */}
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
                <div className="ui horizontal divider">Bio:</div>
                <div className="ui segment">
                  {user.personal.bio}
                </div>
              </div>
              <div className="ui center aligned segment">
                <SocialList
                  social={user.social}
                  username={user.username}
                  profileUrl={user.personal.profileUrl} />
              </div>
            </div>
          </div>
        </div>

        {/* FCC PROFILE */}
        <div className="ui celled stackable grid container">
          <div className="row">
            <HeaderWrapper className="sixteen wide center aligned column">
              <h2 className="ui">freeCodeCamp Profile <i className="fa fa-free-code-camp" /></h2>
            </HeaderWrapper>
          </div>
          { this.isLoading()
            ? <div style={{ marginBottom: 200 }} className="row">{loader}</div>
            : <FCCStatTables { ...this.state } username={user.username} fccCerts={user.fccCerts} /> }
        </div>

        {/* CODING PROFILE */}
        <div className="ui celled stackable center aligned grid container">
          <div className="row">
            <HeaderWrapper className="sixteen wide center aligned column">
              <h2 className="ui">Coding Profile <i className="code icon" /></h2>
            </HeaderWrapper>
          </div>
          <SkillsAndInterests skillsAndInterests={user.skillsAndInterests} />
        </div>

        {/* CAREER */}
        <div className="ui celled stackable center aligned grid container">
          <div className="row">
            <HeaderWrapper className="sixteen wide center aligned column">
              <h2 className="ui">Career <i className="suitcase icon" /></h2>
            </HeaderWrapper>
          </div>
          <Career career={user.career} />
        </div>

        {/* MENTORSHIP */}
        <div className="ui celled stackable center aligned grid container">
          <div className="row">
            <HeaderWrapper className="sixteen wide center aligned column">
              <h2 className="ui">Mentorship <i className="student icon" /></h2>
            </HeaderWrapper>
          </div>
          <div className="row">
            <Table columnWidth="sixteen">
              <TableRow
                header="I am a freeCodeCamp Alumni Network Mentor"
                content={ user.mentorship.isMentor
                  ? <i className="large green check mark icon"/>
                  : <i className="large red remove icon"/> } />
              <TableRow
                header="I am open to being Mentored by other Members"
                content={ user.mentorship.isMentee
                  ? <i className="large green check mark icon"/>
                  : <i className="large red remove icon"/> } />
            </Table>
          </div>
          <div className="row">
          { user.mentorship.mentorshipSkills &&
            <div className="eight wide center aligned column">
              <Header className="ui top attached header">
                Mentorship Bio
              </Header>
              <DynamicHeightDiv id="mentorshipBioDiv" className="ui attached segment">
                { user.mentorship.mentorshipSkills }
              </DynamicHeightDiv>
            </div> }
            <div className={`${user.mentorship.mentorshipSkills ? 'eight' : 'sixteen'} wide center aligned column`}>
              <Header className="ui top attached header">
                Contact for Mentorship & Other Requests
              </Header>
              <DynamicHeightDiv id="contactDiv" className="ui attached segment">
                <SocialList
                  contactsOnly={true}
                  social={user.social}
                  username={user.username}
                  email={user.personal.email}
                  profileUrl={user.personal.profileUrl} />
              </DynamicHeightDiv>
            </div>
          </div>
        </div>

      </ThickPaddedBottom>
    );
  }
}

import { defaultUser } from '../../reducers/user';

PublicProfile.propTypes = {
  user: propTypes.object.isRequired
}

const findUser = (community, username) => {
  return community ? community.filter(user =>
    (user.username === username) && user)[0] : '';
};

const mapStateToProps = ({ community, publicProfileStats }, props) => {
  const { username } = props.match.params;
  let initialState, user = '';
  try {
    initialState = publicProfileStats[username];
  } catch (e) {
    console.log(e)
  }
  try {
    user = findUser(community.toJS(), username);
  } catch (e) {
    console.log(e)
  }
  return {
    user: user ? user : defaultUser,
    initialState
  }
}

export default connect(mapStateToProps, { saveProfileStats })(PublicProfile);
