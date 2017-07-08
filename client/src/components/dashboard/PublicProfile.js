import Career from './Profile/Public/CareerRow';
import { connect } from 'react-redux';
import { connectScreenSize } from 'react-screen-size';
import { defaultUser } from '../../reducers/user';
import FCCStatTables from './Profile/Public/FCCTables';
import { isEmpty } from 'lodash';
import { isGitterUser } from '../../actions/user';
import LocationSteps from './Profile/Public/LocationSteps';
import MainHeader from '../dashboard/Profile/Public/ProfileHeader';
import { mentorshipSearchQuery } from '../../actions/search';
import propTypes from 'prop-types';
import React from 'react';
import { scrapeFccStats } from '../../actions/scrape-fcc.js';
import SkillsAndInterests from './Profile/Public/SkillsRow';
import SocialList from './Profile/Public/SocialList';
import styled from 'styled-components';
import { SubHeader } from './Profile/Public/SkillsRow';
import Table from '../dashboard/Profile/Public/Table';
import TableRow from '../dashboard/Profile/Public/TableRow';
import UserLabel from '../dashboard/common/UserLabel';
import { StyledItem, ThickPaddedBottom } from '../../styles/style-utils';

// STYLED COMPONENTS:
const Avatar = styled.img`
  margin: 8px auto auto !important;
  max-height: 270px !important;
  max-width: 270px !important;`;

const Loader = styled.div`
  height: 200px !important;
  padding-bottom:  !important;
  z-index: 0 !important;`;

const NoPadding = styled.div`
  padding: 0 !important;`;

const OneColumnRepoList = styled.div`
  margin-top: 0 !important;
  margin-bottom: 14px !important;`;

const StyledSubHeader = styled(SubHeader)`
  margin-bottom: 0 !important;`;

class PublicProfile extends React.Component {
  constructor(props) {
    super(props);
    const { initialState } = this.props;
    this.state = {
      ...initialState,
      isTablet: false,
      disableChat: false
    }
  }

  componentWillMount() {
    this.handleDisableChat();
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
    // cover page fresh
    this.handleDisableChat();
  }

  componentDidUpdate() {
    // dynamically determine height of div with less content
    // & keep side by side divs equal height to keep ui clean
    const bioDiv = document.getElementById('mentorshipBioDiv');
    const contactDiv = document.getElementById('contactDiv');
    const bioHeight = bioDiv &&
      window.getComputedStyle(bioDiv).getPropertyValue('height');
    const contactHeight = contactDiv &&
      window.getComputedStyle(contactDiv).getPropertyValue('height');
    if (parseInt(bioHeight, 10) > parseInt(contactHeight, 10)) {
      this.dynamicHeight = bioHeight;
    } else {
      this.dynamicHeight = contactHeight;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleDisableChat = () => {
    isGitterUser(this.props.user.username)
    .then(res => {
      if (!res.data.isGitterUser) {
        this.setState({ disableChat: true });
      }
    })
    .catch(err => console.error(err));
  }

  handleResize = (e) => {
    if (e.target.innerWidth < 992 && e.target.innerWidth > 767) {
      this.setState({ isTablet: true });
    } else {
      this.setState({ isTablet: false });
    }
  }

  handleQuery = (query, category) => {
    // handle click for skills and interests labels:
    // click => set mentorship search state and redirect
    this.props.mentorshipSearchQuery({ query, category });
    this.props.history.push('/dashboard/mentorship');
  }

  initiatePrivateChat = (recipient) => {
    this.props.history.push(`/dashboard/chat/${recipient}`);
  }

  mapRepoList = (array) => {
    return array.map(project => {
      return (
        <StyledItem
          className="item"
          href={project.label + project.item}
          key={project.item}
          target="_blank">
          <i className={`${project.label.slice(8, -5)} large icon`} />
          <div className="content">
            { project.label + project.item }
          </div>
        </StyledItem>
      )
    });
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
      <Loader
        className="ui active inverted dimmer"
        style={{ marginTop: '100px' }}>
        <div className="ui text huge loader">Loading</div>
      </Loader>
    );

    return (
      <ThickPaddedBottom id="public-profile-container">
        {/* AVATAR & FCCDATA */}
        <div className="ui celled stackable grid container">
          <div className={`${this.state.isTablet
            ? 'sixteen'
            : 'four'} wide center aligned column`}>
            <Avatar
              alt={`${user.username}'s avatar'`}
              className="ui fluid circular bordered image"
              src={user.personal.avatarUrl} />
            <div className="ui horizontal divider">
              {user.personal.displayName}
            </div>
            <UserLabel
              label={this.props.isTablet
                ? ''
                : user.mentorship.isMentor
                ? "Mentor"
                : "Member"}
              showAvatar={false}
              username={user.username} />
          </div>
          <div className={`${this.state.isTablet
            ? 'sixteen'
            : 'twelve'} wide column`}>
            <LocationSteps personal={user.personal} />
            <NoBottomMargin className="ui celled stackable grid">
              <NoPadding className="sixteen wide center aligned column">
                <StyledSubHeader className="ui top attached header">
                  freeCodeCamp Profile <i className="free code camp icon" />
                </StyledSubHeader>
              </NoPadding>
              { !this.props.initialState
                ? <div className="row">{loader}</div>
                : <FCCStatTables
                    { ...this.state }
                    fccCerts={user.fccCerts}
                    username={user.username}
                    width="eight" /> }
            </NoBottomMargin>
          </div>
        </div>

        {/* ABOUT & SOCIAL */}
        <div className="ui celled stackable center aligned grid container">
          <MainHeader icon="user icon" text={`Find Me ${bio && '/ Bio'}`} />
        { bio &&
          <div className="row">
            <div className="fourteen wide column">
              <div className="ui segment" id="userBio">
                <div className="ui horizontal divider">Bio:</div>
                {bio}
              </div>
            </div>
          </div> }
          <NoTopPadding className="sixteen wide column">
            <div className="ui padded segment">
              <SocialList
                profileUrl={user.personal.profileUrl}
                social={user.social}
                username={user.username} />
            </div>
          </NoTopPadding>
        </div>

        {/* CODING PROFILE */}
      { (!isEmpty(coreSkills) || !isEmpty(codingInterests)) &&
        <div className="ui celled stackable center aligned grid container">
          <MainHeader icon="code" text="Coding Profile" />
          <SkillsAndInterests
            handleQuery={this.handleQuery}
            skillsAndInterests={user.skillsAndInterests} />
        </div> }

        {/* CAREER */}
      { !isEmpty(user.career.working) &&
        <div className="ui celled stackable center aligned grid container">
          <MainHeader icon="suitcase" text="Career" />
          <Career career={user.career} />
        </div>
      }

        {/* MENTORSHIP */}
        <div className="ui celled stackable center aligned grid container">
          <MainHeader icon="student" text="Mentorship" />
          <Table columnWidth="sixteen">
            <TableRow
              content={ user.mentorship.isMentor
                ? <i className="large green check mark icon"/>
                : <i className="large red remove icon"/> }
              header="I am a freeCodeCamp Alumni Network Mentor" />
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
              <DynamicHeightDiv
                className="ui attached segment"
                id="mentorshipBioDiv">
                { user.mentorship.mentorshipSkills }
              </DynamicHeightDiv>
            </div> }
            <div className={`${user.mentorship.mentorshipSkills
              ? 'eight'
              : 'sixteen'} wide center aligned column`}>
              <SubHeader className="ui top attached header">
                Contact for Mentorship & Other Requests
              </SubHeader>
              <DynamicHeightDiv
                className="ui attached segment"
                id="contactDiv">
                <SocialList
                  contactsOnly={true}
                  currentUser={this.props.currentUser}
                  disableChat={this.state.disableChat}
                  email={user.personal.email.email}
                  initiatePrivateChat={this.initiatePrivateChat}
                  isPrivate={user.personal.email.private}
                  social={user.social}
                  username={user.username} />
              </DynamicHeightDiv>
            </div>
          </div>
        </div>

        {/* COLLABORATION */}
      { !isEmpty(user.projects) &&
        <div className="ui celled stackable center aligned grid container">
          <MainHeader icon="users" text="Collaboration" />
          <div className="sixteen wide column">
            <div className="ui segment">
              <i className="large info circle icon" />
              The following open source projects are projects that
              {<strong>{ user.username }</strong>} either contributes
              to or is the owner of. If they are posted here, these projects
              welcome other open source contributions. Visit the repos, check
              out the projects, and start collaborating! Please remember to be
              respectful, and to carefully read any contribution guidelines
              before opening an issue or making a PR. Happy coding!
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
}

const findUser = (community, username) => {
  return community.size
    ? community.filter(user =>
    user.username.toLowerCase() === username.toLowerCase() && user).first()
    : null;
};

const mapStateToProps = ({
  community,
  publicProfileStats,
  user: currentUser
}, props) => {
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
  }
}

const mapScreenSizeToProps = (screenSize) => {
  return {
    isTablet: screenSize['medium'],
  }
}

const dispatch = {
  mentorshipSearchQuery,
  scrapeFccStats,
}

export default connectScreenSize(mapScreenSizeToProps)(
  connect(mapStateToProps, dispatch)(PublicProfile));
