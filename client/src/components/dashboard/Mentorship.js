import { addFlashMessage } from '../../actions/flashMessages';
import { connect } from 'react-redux';
import { defaultState } from '../../reducers/search';
import DropDown from '../dashboard/common/DropdownMulti';
import filterOptions from '../../assets/helpers/filterOptions';
import Filters from './Mentorship/SearchFilters';
import { isEmpty } from 'lodash';
import { Popup } from 'semantic-ui-react';
import React from 'react';
import { saveSearchState } from '../../actions/search';
import SearchResults from './Mentorship/SearchResults';
import searchTypes from '../../assets/dropdowns/searchTypes';
<<<<<<< 0f5c92c7cb73056e3aedd0a775f3d72099ddb2e4
import styled from 'styled-components';

import {
  CenterAlignedWrapper as CenteredWrapper,
  extendCenterAlignedWrapper,
=======
import { addFlashMessage } from '../../actions/flashMessages';
import filterOptions from '../../assets/helpers/filterOptions';

import {
>>>>>>> remove chat from codebase
  transitionIn,
  transitionOut,
} from '../../styles/style-utils';

/*
===============    ***   =================
*** *** *** <==== STYLES ====> *** *** ***
===============    ***   =================
*/

const ButtonWrapper = styled.div`
  ${ extendCenterAlignedWrapper() }
  padding-bottom: 15px;
`;

const SlideAway = styled.div`
  position: fixed !important;
  left: -291px;
  ${ props => props.showFilters && 'left: 0 !important' }
  transition: .5s;
`;

const FiltersContainer = styled.div`
  @media (${props => props.media}: 1265px) {
    display: none;
  }
`;

const FiltersDesktop = styled.div`
  display: inline-block !important;
`;

const FiltersMobile = styled.div`
  ${ props => props.showFilters ? transitionOut() : transitionIn() }
  ${ extendCenterAlignedWrapper() }
`;

const SearchInput = styled.div`
  @media (max-width: 452px) {
    margin-top: 13px !important;
  }
`;

const Tab = styled.div`
  position: absolute !important;
  top: 70px;
  cursor: pointer;
  padding: 50px 5px 50px 15px !important;
  margin-left: 0 !important;
  box-shadow: 0 2px 4px 0 rgba(34,36,38,.12), 0 2px 10px 0 rgba(34,36,38,.15);
`;

const searchApi = {
  filter: (regex, array) => {
    return array.filter(item => regex.test(item) && item);
  },
  match: (regex, string) => {
    return regex.test(string) ? true : false;
  },
  names: (regex, username, name) => {
    return regex.test(username) || regex.test(name) ? true : false;
  }
}

const FiltersHeader = ({ onClick, icon }) => {
  const cursor = !onClick ? { cursor: 'default ' } : {};
  const iconTrigger = ( <i
    className={`${icon} icon`}
    style={{ background: 'none', borderLeft: '1px solid green' }} />
  );
  return (
    <CenteredWrapper style={{ marginBottom: 14 }}>
      <div
        className="ui right labeled basic large green icon button"
        onClick={onClick && onClick}
        style={cursor}>
        {'Search Filters'}
        <Popup
          content="Define your search filters here. Results
          will update as you select or deselect filters."
          inverted
          trigger={iconTrigger}
          wide />
      </div>
    </CenteredWrapper>
  );
}

class Mentorship extends React.Component {
  constructor(props) {
    super(props);
    const { searchState } = this.props;
    this.state = {
      ...searchState
    // STATE STRUCTURE:
    // backendOnly: false,
    // dataVisOnly: false,
    // disableClear: true,
    // dropdownValue: ['all'],
    // frontendOnly: false,
    // isLoading: false,
    // mentorsOnly: false,
    // prosOnly: false,
    // results: [],
    // showFilters: false,
    // value: '',
    // searchCriteria: {
    //   all: true,
    //   company: false,
    //   interests: false,
    //   location: false,
    //   mentorshipBio: false,
    //   name: false,
    //   skills: false,
    // }
    }
  }

  componentDidMount() {
    this.props.addFlashMessage({
<<<<<<< 0f5c92c7cb73056e3aedd0a775f3d72099ddb2e4
      text: {
        header: 'Welcome to Mentorship Search!',
        message: `Utilize our mentorship match engine to identify the right
        mentor for you. Narrow down your results by searching a specific
        category or by enabling filters. If you think you've found a good
        match, feel free to reach out through private chat!`
      },
      type: 'info'
=======
      type: 'info',
        text: {
          header: 'Welcome to Mentorship Search!',
          message: `Utilize our mentorship match engine to identify the right mentor for you.
                    Narrow down your results by searching a specific category or by enabling
                    filters. If you think you've found a good match, feel free to reach out
                    through a private chat!`
        }
>>>>>>> remove chat from codebase
    });
    if (this.state.value) {
      this.search(this.state.value);
    }
  }

  componentWillUnmount() {
    this.props.saveSearchState(this.state);
  }

  isStateless = () => {
    if (!this.state.value &&
      !this.state.prosOnly &&
      !this.state.dataVisOnly &&
      !this.state.mentorsOnly &&
      !this.state.menteesOnly &&
      !this.state.backendOnly &&
      !this.state.frontendOnly) {
      return true;
    } else {
      return false;
    }
  }

  disableClear = () => {
    if (this.isStateless() &&
      (this.state.dropdownValue[0] === 'all' &&
      this.state.dropdownValue.length === 1)) {
      this.setState({ disableClear: true });
    } else {
      this.setState({ disableClear: false });
    }
  }

  handleChange = (e) => {
    this.setState({ value: e.target.value }, () => {
      this.disableClear();
      if (this.state.value) this.search(this.state.value)
      else if (this.isStateless()) {
        this.setState({ results: [] });
      }
    });
  }

  search = (searchString) => {
    this.setState({ isLoading: true });

    const { searchCriteria } = this.state;

    var
    matchCompany = false,
    matchInterest = [],
    matchLocation = false,
    matchName = false,
    matchSkill = [],
    mentorshipBio = false,
    { community } = this.props,
    regexArray = searchString && searchString.split(' ').map(escapedRegex => {
      return new RegExp(escapedRegex, 'i')
    });

    // search filters:
    if (this.state.mentorsOnly) {
      community = community.filter(user => user.mentorship.isMentor && user);
    }
    if (this.state.menteesOnly) {
      community = community.filter(user => user.mentorship.isMentee && user);
    }
    if (this.state.prosOnly) {
      community = community.filter(user => user.career.working === 'yes' && user);
    }
    if (this.state.frontendOnly) {
      community = community.filter(user => user.fccCerts.Front_End && user);
    }
    if (this.state.backendOnly) {
      community = community.filter(user => user.fccCerts.Back_End && user);
    }
    if (this.state.dataVisOnly) {
      community = community.filter(user => user.fccCerts.Data_Visualization && user);
    }

    // regex search:
    regexArray && regexArray.forEach(regex => {
      community = community.filter(user => {

        const {
          username,
          career: { company },
          mentorship: { mentorshipSkills },
          personal: { displayName, location, country },
          skillsAndInterests: { coreSkills, codingInterests }
        } = user;

        if (searchCriteria.all) {
          matchCompany = searchApi.match(regex, company);
          matchSkill = searchApi.filter(regex, coreSkills);
          mentorshipBio = searchApi.match(regex, mentorshipSkills);
          matchInterest = searchApi.filter(regex, codingInterests);
          matchName = searchApi.names(regex, username, displayName);
          matchLocation = searchApi.match(regex, location)
            || searchApi.match(regex, country);
        } else {
          if (searchCriteria.company) {
            matchCompany = searchApi.match(regex, company);
          }
          if (searchCriteria.location) {
            matchLocation = searchApi.match(regex, country)
              || searchApi.match(regex, location);
          }
          if (searchCriteria.skills) {
            matchSkill = searchApi.filter(regex, coreSkills);
          }
          if (searchCriteria.mentorshipBio) {
            mentorshipBio = searchApi.match(regex, mentorshipSkills);
          }
          if (searchCriteria.interests) {
            matchInterest = searchApi.filter(regex, codingInterests);
          }
          if (searchCriteria.name) {
            matchName = searchApi.names(regex, username, displayName);
          }
        }

        return (
          !isEmpty(matchSkill) ||
          !isEmpty(matchInterest) ||
          matchName ||
          matchLocation ||
          mentorshipBio ||
          matchCompany
        ) && user;
      });
    });

    this.setState({ isLoading: false, results: community });
  }

  handleSliderChange = (e, data) => {

    // pass in callback function to this.setState to be sure changes
    // have taken effect when search is run, otherwise search will be
    // delivering results that are one action behind users actual
    this.setState({ [data.name]: data.checked }, () => {
      this.disableClear();
      if (this.isStateless()) {
        this.setState({ results: [] });
      } else {
        this.search(this.state.value);
      }
    });
  }

  handleDropdownChange = (e, data) => {
    const { searchCriteria } = this.state;

    // make "all" only tag when selected
    if (data.value.indexOf('all') === data.value.length - 1 && data.value.length > 1) {
      data.value = ['all']
      // remove "all" when other tags selected
    } else if (data.value.indexOf('all') > -1 && data.value.length > 1) {
      data.value.splice(data.value.indexOf('all'), 1);
      // switch to "all" when all other tags are removed
    } else if (isEmpty(data.value)) {
      data.value = ['all']
    }

    // match state to selection(s)
    for (var criteria in searchCriteria) {
      if (data.value.indexOf(criteria) > -1) {
        searchCriteria[criteria] = true;
      } else {
        searchCriteria[criteria] = false;
      }
    }

    this.setState({
      dropdownValue: data.value,
      searchCriteria,
    }, () => this.disableClear());
  }

  showFilters = () => {
    this.setState({ showFilters: !this.state.showFilters });
  }

  clearSearch = () => {
    this.setState({
      ...defaultState,
      showFilters: this.state.showFilters
    });
  }

  initiatePrivateChat = (recipient) => {
    this.props.history.push(`chat/${recipient}`);
  }

  handleClick = (user) => {
    this.props.history.push(`/dashboard/profile/${user.username}`)
  }

  render() {
    const { results, value, showFilters } = this.state;
    return (
      <div className="ui container">
        {/* Disappears under 1265px viewport width. See
        FiltersContainer Styled-Component definition. */}
        <FiltersContainer media="max-width">
          <SlideAway showFilters={showFilters}>
            <div className="position: relative">
              <FiltersDesktop className="ui padded compact green raised segment">
                <FiltersHeader icon="red info circle" />
                <Filters
                  filterOptions={filterOptions}
                  handleChange={this.handleSliderChange}
                  state={this.state} />
              </FiltersDesktop>
              <Tab className="ui label" onClick={this.showFilters}>
                <i className={`large green ${!showFilters
                    ? 'right'
                    : 'left'} arrow icon`} />
              </Tab>
            </div>
          </SlideAway>
        </FiltersContainer>

        <div className="ui form">
          {/* Disappears over 1265px viewport width. See
          FiltersContainer Styled-Component definition. */}
          <FiltersContainer media="min-width">
            <FiltersHeader
              icon={`${showFilters
                ? 'red hide'
                : 'green unhide'}`}
              onClick={this.showFilters} />
            <FiltersMobile showFilters={showFilters}>
              <div style={{ marginBottom: 5 }}>
                <Filters
                  filterOptions={filterOptions}
                  handleChange={this.handleSliderChange}
                  state={this.state} />
              </div>
            </FiltersMobile>
          </FiltersContainer>
          <CenteredWrapper className="ui inline fields">
            <div className="field">
              <DropDown
                fluid={false}
                onChange={this.handleDropdownChange}
                options={searchTypes}
                value={this.state.dropdownValue} />
            </div>
            <SearchInput className="field">
              <div className={`ui fluid search ${this.state.isLoading && 'loading'}`}>
                <div className="ui icon input">
                  <input
                    autoFocus
                    onChange={this.handleChange}
                    placeholder="Search Community"
                    type="text"
                    value={value} />
                  <i className="search icon" />
                </div>
              </div>
            </SearchInput>
          </CenteredWrapper>
        </div>

        <ButtonWrapper>
          <div
            className={`ui labeled button ${this.state.disableClear && 'disabled'}`}
            onClick={this.clearSearch}>
            <div className="ui basic green button">
              <i className="remove icon" />
              {'Clear All Fields'}
            </div>
            <div className="ui basic left pointing green label">
              {`${results.length} results`}
            </div>
          </div>
        </ButtonWrapper>

        <CenteredWrapper>
          <SearchResults
            currentUser={this.props.currentUser}
            handleClick={this.handleClick}
            initiatePrivateChat={this.initiatePrivateChat}
            noResults={!isEmpty(value) && isEmpty(results)}
            results={results} />
        </CenteredWrapper>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
<<<<<<< 0f5c92c7cb73056e3aedd0a775f3d72099ddb2e4
    community: state.community.toJS(),
=======
    searchState: state.search,
>>>>>>> remove chat from codebase
    currentUser: state.user.username,
    searchState: state.search,
  }
}

const dispatch = {
  addFlashMessage,
  saveSearchState,
};

export default connect(mapStateToProps, dispatch)(Mentorship);
