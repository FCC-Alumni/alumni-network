import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import SocialList from './Profile/Public/SocialList';
import UserLabel from '../dashboard/common/UserLabel';
import { SubHeader } from './Profile/Public/SkillsRow';
import LocationSteps from './Profile/Public/LocationSteps';
import { mentorshipSearchQuery } from '../../actions/search';
import { scrapeFccStats } from '../../actions/scrape-fcc.js';
import MainHeader from '../dashboard/Profile/Public/ProfileHeader';
import { initiatePrivateChat, clearNotifications } from '../../actions/chat';
import { ThickPaddedBottom, StyledItem } from '../../styles/style-utils';
import SkillsAndInterests from './Profile/Public/SkillsRow';
import TableRow from '../dashboard/Profile/Public/TableRow';
import FCCStatTables from './Profile/Public/FCCTables';
import Table from '../dashboard/Profile/Public/Table';
import { connectScreenSize } from 'react-screen-size';
import { defaultUser } from '../../reducers/user';
import Career from './Profile/Public/CareerRow';
import styled from 'styled-components';
import { isEmpty } from 'lodash';

// STYLED COMPONENTS:
const Avatar = styled.img`
  margin: 8px auto auto !important;
  max-height: 270px !important;
  max-width: 270px !important;`;

const Loader = styled.div`
  height: 200px !important;
  padding-bottom:  !important;
  z-index: 0 !important;`;

const OneColumnRepoList = styled.div`
  margin-top: 0 !important;
  margin-bottom: 14px !important;`;

const NoPadding = styled.div`
  padding: 0 !important;`;

const StyledSubHeader = styled(SubHeader)`
  margin-bottom: 0 !important;`;

class PublicProfile extends React.Component {
  constructor(props) {
    super(props);
    const { initialState } = this.props;
    this.state = {
      ...initialState,
      isTablet: false
    }
  }

  componentDidMount() {
    document.body.scrollTop = 0;
    // handles navigation to profile
    // through built in FCCAN links
    if (!this.props.initialState) {
      this.props.scrapeFccStats(this.props.user.username);
    }
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  componentWillReceiveProps(nextProps) {
    const { initialState } = nextProps;
    if (initialState) this.setState({ ...initialState });
    // handles manual navigation to profile, i.e. typed url,
    // if username param is invalid, redirects to community
    if (!nextProps.loading && !nextProps.user.username) {
      this.props.history.push('/dashboard/community');
    } else if (!nextProps.loading && !nextProps.initialState) {
      this.props.scrapeFccStats(nextProps.user.username);
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

  handleResize = (e) => {
    if (e.target.innerWidth < 992 && e.target.innerWidth > 767) {
      this.setState({ isTablet: true });
    } else {
      this.setState({ isTablet: false });
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

  initiatePrivateChat = (recipient, notifications) => {
    if (!this.props.privateChat.has(recipient)) {
      this.props.initiatePrivateChat(recipient);
    } else if (notifications) {
      this.props.clearNotifications({
        author: this.props.currentUser,
        recipient
      });
    }
    this.props.history.push(`/dashboard/chat/${recipient}`);
  }

  handleQuery = (query, category) => {
    // handle click for skills and interests labels:
    // click => set mentorship search state and redirect
    this.props.mentorshipSearchQuery({ query, category });
    this.props.history.push('/dashboard/mentorship');
  }

  render() {
    const {
      user,
      user: {
        personal: { bio },
        skillsAndInterests: {
          coreSkills,
          codingInterests
        }
      }
    } = this.props;

    const loader = (
      <Loader className="ui active inverted dimmer">
        <div className="ui text huge loader">Loading</div>
      </Loader>
    );

    const NoTopPadding = styled.div`
      ${ document.getElementById('userBio') && 'padding-top: 0 !important;'}`;

    const NoBottomMargin = styled.div`
      margin-bottom: 0 !important;
      ${ !user.personal.flag && 'margin-top: 20px !important' }`

    // dynamically set height of divs per CDM logic
    const DynamicHeightDiv = styled.div`
      min-height: ${ this.dynamicHeight }`;

    if (user.projects.length > 3) {
      const sliceAt = Math.ceil(user.projects.length / 2);
      this.projectColumnA = user.projects.slice(0, sliceAt);
      this.projectColumnB = user.projects.slice(sliceAt);
    }

    if (this.props.loading) return (
      <Loader className="ui active inverted dimmer" style={{ marginTop: '100px' }}>
        <div className="ui text huge loader">Loading</div>
      </Loader>
    );

    return (
      <ThickPaddedBottom id="public-profile-container">
        {/* AVATAR & FCCDATA */}
        <div className="ui celled stackable grid container">
          <div className={`${this.state.isTablet ? 'sixteen' : 'four'} wide center aligned column`}>
            <Avatar
              src={user.personal.avatarUrl}
              alt={`${user.username}'s avatar'`}
              className="ui fluid circular bordered image" />
            <div className="ui horizontal divider">{user.personal.displayName}</div>
            <UserLabel
              showAvatar={false}
              username={user.username}
              label={this.props.isTablet ? '' : user.mentorship.isMentor ? "Mentor" : "Member"}/>
          </div>
          <div className={`${this.state.isTablet ? 'sixteen' : 'twelve'} wide column`}>
            <LocationSteps personal={user.personal} />
            <NoBottomMargin className="ui celled stackable grid">
              <NoPadding className="sixteen wide center aligned column">
                <StyledSubHeader className="ui top attached header">
                  freeCodeCamp Profile <i className="free code camp icon" />
                </StyledSubHeader>
              </NoPadding>
              { !this.props.initialState
                ? <div className="row">{loader}</div>
                : <FCCStatTables { ...this.state } width="eight" username={user.username} fccCerts={user.fccCerts} /> }
            </NoBottomMargin>
          </div>
        </div>

        {/* ABOUT & SOCIAL */}
        <div className="ui celled stackable center aligned grid container">
          <MainHeader text={`Find Me ${bio && '/ Bio'}`} icon="user icon" />
        { bio &&
          <div className="row">
            <div className="fourteen wide column">
              <div id="userBio" className="ui segment">
                <div className="ui horizontal divider">Bio:</div>
                {bio}
              </div>
            </div>
          </div> }
          <NoTopPadding className="sixteen wide column">
            <div className="ui padded segment">
              <SocialList
                social={user.social}
                username={user.username}
                profileUrl={user.personal.profileUrl} />
            </div>
          </NoTopPadding>
        </div>

        {/* CODING PROFILE */}
      { (!isEmpty(coreSkills) || !isEmpty(codingInterests)) &&
        <div className="ui celled stackable center aligned grid container">
          <MainHeader text="Coding Profile" icon="code" />
          <SkillsAndInterests
            handleQuery={this.handleQuery}
            skillsAndInterests={user.skillsAndInterests} />
        </div> }

        {/* CAREER */}
      { !isEmpty(user.career.working) &&
        <div className="ui celled stackable center aligned grid container">
          <MainHeader text="Career" icon="suitcase" />
          <Career career={user.career} />
        </div>
      }

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
                  email={user.personal.email.email}
                  currentUser={this.props.currentUser}
                  isPrivate={user.personal.email.private}
                  initiatePrivateChat={this.initiatePrivateChat}
                  notifications={this.props.privateChat.getIn([user.username, 'notifications'])} />
              </DynamicHeightDiv>
            </div>
          </div>
        </div>

        {/* COLLABORATION */}
      { !isEmpty(user.projects) &&
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

PublicProfile.propTypes = {
  user: propTypes.object.isRequired,
  privateChat: propTypes.object.isRequired,
}

const findUser = (community, username) => {
  return community.size ? community.filter(user =>
    user.username.toLowerCase() === username.toLowerCase() && user).first() : null;
};

const mapStateToProps = ({ community, publicProfileStats, privateChat, user: currentUser }, props) => {
  let username = findUser(community, props.match.params.username);
  if (username) username = username.username;
  let initialState, user;
  try {
    initialState = publicProfileStats.get(username);
  } catch (e) {
    console.warn('Profile component is waiting on props');
  }
  try {
    user = findUser(community, username);
  } catch (e) {
    console.warn('Profile component is waiting on props');
  }
  return {
    currentUser: currentUser.username,
    user: user ? user : defaultUser,
    loading: !community.size, // mock loading state based on community...
    initialState,
    privateChat,
  }
}

const mapScreenSizeToProps = (screenSize) => {
  return {
    isTablet: screenSize['medium'],
  }
}

const dispatch = {
  scrapeFccStats,
  clearNotifications,
  initiatePrivateChat,
  mentorshipSearchQuery,
}

export default connectScreenSize(mapScreenSizeToProps)(
  connect(mapStateToProps, dispatch)(PublicProfile));
