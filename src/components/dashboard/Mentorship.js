import React from 'react';
import { connect } from 'react-redux';
import { initiatePrivateChat } from '../../actions/chat';

import Radio from '../common/RadioButton';
import UserLabel from '../common/UserLabel';
import DropDown from '../common/DropdownMultiSelect';
import SearchResults from './Mentorship/SearchResults';
import { Checkbox } from 'semantic-ui-react';

import { filterSliders } from '../../assets/data/mapArrays';
import { searchTypes } from '../../assets/data/dropdownOptions';
import isEmpty from 'lodash/isEmpty';

/*
TODO:
  - we need to look at location in general (should have zip code or somehting and get location by API - for D3 map as well!)
*/

const searchApi = {
  names: (regex, username, name) => {
    return regex.test(username) || regex.test(name) ? true : false;
  },
  filter: (regex, array) => {
    return array.filter(item => regex.test(item) && item);
  },
  match: (regex, string) => {
    return regex.test(string) ? true : false;
  }
}

class Mentorship extends React.Component {
  state = {
    value: '',
    results: [],
    showFilters: false,
    dropdownValue: ['all'],
    isLoading: false,
    mentorsOnly: false,
    prosOnly: false,
    frontendOnly: false,
    backendOnly: false,
    dataVisOnly: false,
    searchCriteria: {
      skills: false,
      interests: false,
      location: false,
      mentorshipBio: false,
      name: false,
      company: false,
      all: true,
    }
  }

  componentWillUnmount() {
    /*** We would like to store filter state in Redux on component unmounting
     * (when user navigates away), and restore it from state when the component
     * is mounted again (user navigates back)— thoughts?
    */
  }

  handleChange = (e) => {
    var { value } = e.target;
    const {
      mentorsOnly,
      prosOnly,
      frontendOnly,
      backendOnly,
      dataVisOnly
    } = this.state;

    this.setState({ value: value });

    if (e.target.value) this.search(value)
    else if (
      !value &&
      !mentorsOnly &&
      !prosOnly &&
      !frontendOnly &&
      !backendOnly &&
      !dataVisOnly ) {
      this.setState({ results: [] });
    }
  }

  search = (searchString) => {
    this.setState({ isLoading: true });

    const { searchCriteria } = this.state;
    var { community } = this.props,
    regexArray = searchString && searchString.split(' ').map(escapedRegex => new RegExp(escapedRegex, 'i')),
    matchSkill = [],
    matchInterest = [],
    matchAll = [],
    matchLocation = false,
    mentorshipBio = false,
    matchName = false,
    matchCompany = false;

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
          personal: { displayName, location },
          mentorship: { mentorshipSkills },
          skillsAndInterests: { coreSkills, codingInterests },
          career: { company }
        } = user;

        if (searchCriteria.all) {
          matchName = searchApi.names(regex, username, displayName);
          matchSkill = searchApi.filter(regex, coreSkills);
          matchInterest = searchApi.filter(regex, codingInterests);
          matchLocation = searchApi.match(regex, location);
          mentorshipBio = searchApi.match(regex, mentorshipSkills);
          matchCompany = searchApi.match(regex, company);
        } else {
          if (searchCriteria.company) {
            matchCompany = searchApi.match(regex, company);
          }
          if (searchCriteria.mentorshipBio) {
            mentorshipBio = searchApi.match(regex, mentorshipSkills);
          }
          if (searchCriteria.location) {
            matchLocation = searchApi.match(regex, location);
          }
          if (searchCriteria.name) {
            matchName = searchApi.names(regex, username, displayName);
          }
          if (searchCriteria.skills) {
            matchSkill = searchApi.filter(regex, coreSkills);
          }
          if (searchCriteria.interests) {
            matchInterest = searchApi.filter(regex, codingInterests);
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
    this.setState({ [data.name]: data.checked }, () => {

      const {
        mentorsOnly,
        prosOnly,
        frontendOnly,
        backendOnly,
        dataVisOnly
      } = this.state;

      if (!this.state.value && !mentorsOnly && !prosOnly && !frontendOnly && !backendOnly && !dataVisOnly) {
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

    this.setState({ searchCriteria, dropdownValue: data.value });
  }

  showFilters = () => {
    const { showFilters: currState } = this.state;

    this.setState({ showFilters: !currState });
  }

  initiatePrivateChat = (user) => {
    this.props.initiatePrivateChat(user);
    this.props.history.push(`chat/${user}`);
  }

  render() {
    const { results, value, showFilters } = this.state;

    const searchFilters = filterSliders.map(radio => {
      return (
        <div key={radio.name}>
          <Checkbox
            slider
            name={radio.name}
            onChange={this.handleSliderChange}
            label={radio.label} />
          <div className="spacer" />
        </div>
      );
    });

    return (
      <div className="ui container">

        <h1 className="text-align-center">
          Search for a mentorship match here!
        </h1>

        <div className="ui form">
          <div className="filters-selector-wrap">
            <div onClick={this.showFilters} className="text-align-center filters-selector">
              <i className={`${!showFilters ? 'teal unhide' : 'brown hide'} icon`} />
              {`${!showFilters ? 'Show' : 'Hide'} Search Filters`}
            </div>
          </div>
          <div className={`search-filters ${!showFilters ? 'show' : 'hide'}`}>
            <div className="center-sliders">
              { searchFilters }
            </div>
          </div>

          <div className="ui inline fields search-fields">
            <div className="field">
              <DropDown
                value={this.state.dropdownValue}
                options={searchTypes}
                fluid={false}
                onChange={this.handleDropdownChange} />
            </div>
            <div className="field">
              <div className={`ui fluid search ${this.state.isLoading && 'loading'}`}>
                <div className="ui icon input">
                  <input
                    autoFocus
                    value={value}
                    onChange={this.handleChange}
                    type="text"
                    placeholder="Search Community" />
                  <i className="search icon"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="search-results">
          <SearchResults
            currentUser={this.props.currentUser}
            initiatePrivateChat={this.initiatePrivateChat}
            results={results}
            noResults={!isEmpty(value) && isEmpty(results)} />
        </div>

      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.username,
    community: state.community.toJS()
  }
}

export default connect(mapStateToProps, { initiatePrivateChat })(Mentorship);
