import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import DropDown from '../common/DropdownMulti';
import Filters from './Mentorship/SearchFilters';
import SearchResults from './Mentorship/SearchResults';

import isEmpty from 'lodash/isEmpty';
import { defaultState } from '../../reducers/search';
import { saveSearchState } from '../../actions/views';
import { initiatePrivateChat } from '../../actions/chat';
import { filterOptions } from '../../assets/data/mapArrays';
import { searchTypes } from '../../assets/data/dropdownOptions';

import {
  transitionIn,
  transitionOut,
  extendCenterAlignedWrapper,
  CenterAlignedWrapper as CenteredWrapper,
} from '../../styles/globalStyles';

const SearchFilters = styled.div`
  ${ props => props.showFilters ? transitionIn() : transitionOut() }
  ${ extendCenterAlignedWrapper() }
`;

const ButtonWrapper = styled.div`
  ${ extendCenterAlignedWrapper() }
  padding-bottom: 15px;
`;

const FiltersSelector = styled.div`
  width: 230px;
  font-size: 20px;
  cursor: pointer;
  margin: 5px auto;
  font-weight: bold;
  text-align: center !important;
`;

const searchApi = {
  match: (regex, string) => {
    return regex.test(string) ? true : false;
  },
  filter: (regex, array) => {
    return array.filter(item => regex.test(item) && item);
  },
  names: (regex, username, name) => {
    return regex.test(username) || regex.test(name) ? true : false;
  }
}

class Mentorship extends React.Component {
  constructor(props) {
    super(props);
    const { searchState } = this.props;
    this.state = {
      ...searchState
    // STATE STRUCTURE:
    // value: '',
    // results: [],
    // prosOnly: false,
    // isLoading: false,
    // showFilters: false,
    // disableClear: true,
    // mentorsOnly: false,
    // backendOnly: false,
    // dataVisOnly: false,
    // frontendOnly: false,
    // dropdownValue: ['all'],
    // searchCriteria: {
    //   mentorshipBio: false,
    //   interests: false,
    //   location: false,
    //   company: false,
    //   skills: false,
    //   name: false,
    //   all: true,
    // }
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
    matchSkill = [],
    matchName = false,
    matchInterest = [],
    matchCompany = false,
    matchLocation = false,
    mentorshipBio = false,
    { community } = this.props,
    regexArray = searchString && searchString.split(' ').map(escapedRegex => {
      return new RegExp(escapedRegex, 'i')
    });

    // search filters:
    if (this.state.mentorsOnly) {
      community = community.filter(user => user.mentorship.isMentor && user);
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
          personal: { displayName, location },
          skillsAndInterests: { coreSkills, codingInterests }
        } = user;

        if (searchCriteria.all) {
          matchCompany = searchApi.match(regex, company);
          matchSkill = searchApi.filter(regex, coreSkills);
          matchLocation = searchApi.match(regex, location);
          mentorshipBio = searchApi.match(regex, mentorshipSkills);
          matchInterest = searchApi.filter(regex, codingInterests);
          matchName = searchApi.names(regex, username, displayName);
        } else {
          if (searchCriteria.company) {
            matchCompany = searchApi.match(regex, company);
          }
          if (searchCriteria.location) {
            matchLocation = searchApi.match(regex, location);
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

    this.setState({ results: community, isLoading: false });
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
      searchCriteria,
      dropdownValue: data.value
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

  initiatePrivateChat = (user) => {
    this.props.initiatePrivateChat(user);
    this.props.history.push(`chat/${user}`);
  }

  render() {
    const { results, value, showFilters } = this.state;

    return (
      <div className="ui container">

        <h1 className="text-align-center">
          Search for a mentorship match here!
        </h1>

        <div className="ui form">
          <div className="filters-selector-wrap">
            <FiltersSelector onClick={this.showFilters} >
              <i className={`${!showFilters ? 'green unhide' : 'red hide'} icon`} />
              {`${!showFilters ? 'Show' : 'Hide'} Search Filters`}
            </FiltersSelector>
          </div>
          <SearchFilters showFilters={showFilters} >
            <div className="center-sliders">
              <Filters
                state={this.state}
                filterOptions={filterOptions}
                handleChange={this.handleSliderChange} />
            </div>
          </SearchFilters>

          <CenteredWrapper className="ui inline fields">
            <div className="field">
              <DropDown
                fluid={false}
                options={searchTypes}
                value={this.state.dropdownValue}
                onChange={this.handleDropdownChange} />
            </div>
            <div className="field">
              <div className={`ui fluid search ${this.state.isLoading && 'loading'}`}>
                <div className="ui icon input">
                  <input
                    autoFocus
                    type="text"
                    value={value}
                    onChange={this.handleChange}
                    placeholder="Search Community" />
                  <i className="search icon"></i>
                </div>
              </div>
            </div>
          </CenteredWrapper>

        </div>

        <ButtonWrapper>
          <div
            onClick={this.clearSearch}
            className={`ui labeled button ${this.state.disableClear && 'disabled'}`}>
            <div className="ui basic green button">
              <i className="remove icon"></i>
              Clear All Fields
            </div>
            <div className="ui basic left pointing green label">{`${results.length} results`}</div>
          </div>
        </ButtonWrapper>

        <CenteredWrapper>
          <SearchResults
            results={results}
            currentUser={this.props.currentUser}
            initiatePrivateChat={this.initiatePrivateChat}
            noResults={!isEmpty(value) && isEmpty(results)} />
        </CenteredWrapper>

      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    searchState: state.search,
    currentUser: state.user.username,
    community: state.community.toJS()
  }
}

export default connect(mapStateToProps, { initiatePrivateChat, saveSearchState })(Mentorship);
