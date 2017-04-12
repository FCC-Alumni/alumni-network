import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import UserLabel from '../common/UserLabel';
import { SubHeader } from './Profile/Public/SkillsRow';
import LocationSteps from './Profile/Public/LocationSteps';
import { ThickPaddedBottom, StyledItem, extendCenterAlignedWrapper } from '../../styles/globalStyles';
import MainHeader from '../dashboard/Profile/Public/ProfileHeader';
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

const Loader = styled.div`
  height: 200px !important;
  padding-bottom:  !important;
`;

const OneColumnRepoList = styled.div`
  margin-top: 0 !important;
  margin-bottom: 14px !important;
`;

const CenteredList = styled.div`
  ${ extendCenterAlignedWrapper() }
`;

const A = styled.div`
  color: black !important;
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
    if (parseInt(bioHeight, 10) > parseInt(contactHeight, 10)) {
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

  mapRepoList = (array) => {
    return array.map(project => {
      return (
        <StyledItem href={project.label + project.item} target="_blank" key={project.item} className="item">
          <i className={`${project.label.slice(8, -5)} large icon`} />
          <div className="content">
            { project.label + project.item }
          </div>
        </StyledItem>
      )
    });
  }

  render() {
    const { user } = this.props;

    const loader = (
      <Loader className="ui active inverted dimmer">
        <div className="ui text huge loader">Loading</div>
      </Loader>
    );

    // dynamically set height of divs per CDM logic
    const DynamicHeightDiv = styled.div`
      height: ${ this.dynamicHeight }
    `;

    if (user.projects.length > 3) {
      const sliceAt = Math.ceil(user.projects.length / 2);
      this.projectColumnA = user.projects.slice(0, sliceAt);
      this.projectColumnB = user.projects.slice(sliceAt);
    }

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
          <MainHeader text="freeCodeCamp Profile" icon="fa fa-free-code-camp" />
        { this.isLoading()
          ? <div style={{ marginBottom: 200 }} className="row">{loader}</div>
          : <FCCStatTables { ...this.state } username={user.username} fccCerts={user.fccCerts} /> }
        </div>

        {/* CODING PROFILE */}
        <div className="ui celled stackable center aligned grid container">
          <MainHeader text="Coding Profile" icon="code" />
          <SkillsAndInterests skillsAndInterests={user.skillsAndInterests} />
        </div>

        {/* CAREER */}
        <div className="ui celled stackable center aligned grid container">
          <MainHeader text="Career" icon="suitcase" />
          <Career career={user.career} />
        </div>

        {/* MENTORSHIP */}
        <div className="ui celled stackable center aligned grid container">
          <MainHeader text="Mentorship" icon="student" />
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
          <div className="row">
          { user.mentorship.mentorshipSkills &&
            <div className="eight wide center aligned column">
              <SubHeader className="ui top attached header">
                Mentorship Bio
              </SubHeader>
              <DynamicHeightDiv id="mentorshipBioDiv" className="ui attached segment">
                { user.mentorship.mentorshipSkills }
              </DynamicHeightDiv>
            </div> }
            <div className={`${user.mentorship.mentorshipSkills ? 'eight' : 'sixteen'} wide center aligned column`}>
              <SubHeader className="ui top attached header">
                Contact for Mentorship & Other Requests
              </SubHeader>
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

        {/* COLLABORATION */}
        { user.projects.length &&
        <div className="ui celled stackable center aligned grid container">
          <MainHeader text="Collaboration" icon="users" />
          <div className="sixteen wide column">
            <div className="ui segment">
              <i className="large info circle icon" />
              The following open source projects are projects that {<strong>{ user.username }</strong>} either contributes to or is the owner of. If they are posted here, these projects welcome other open source contributions. Visit the repos, check out the projects, and start collaborating! Please remember to be respectful, and to carefully read any contribution guidelines before opening an issue or making a PR. Happy coding!
            </div>
          </div>
        { user.projects.length <= 3
        ? <OneColumnRepoList className="ui middle aligned selection list">
            { this.mapRepoList(user.projects) }
          </OneColumnRepoList>
        : <div className="row">
            <div className="eight wide column">
              <div className="ui middle aligned selection list">
                { this.mapRepoList(this.projectColumnA) }
              </div>
            </div>
            <div className="eight wide column">
              <div className="ui middle aligned selection list">
                { this.mapRepoList(this.projectColumnB) }
              </div>
            </div>
          </div> }
        </div> }

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
