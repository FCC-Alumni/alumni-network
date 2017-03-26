import React from 'react';
import { connect } from 'react-redux';
import { initiatePrivateChat } from '../../actions/chat';

import Radio from '../common/RadioButton';
import UserLabel from '../common/UserLabel';
import DropDown from '../common/DropdownMultiSelect';
import { Checkbox } from 'semantic-ui-react';

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
  },
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
    this.setState({ value: e.target.value });
    if (e.target.value) this.search(e.target.value);
    else this.setState({ results: [] });
  }

  search = (escapedRegex) => {
    this.setState({ isLoading: true });

    const { searchCriteria } = this.state;
    var { community } = this.props,
    regex = new RegExp(escapedRegex, 'i'),
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
    const results = community.filter(user => {

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

    this.setState({ results, isLoading: false });

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

      if (!mentorsOnly && !prosOnly && !frontendOnly && !backendOnly && !dataVisOnly) {
        this.setState({ results: [] });
      }
      this.search(this.state.value);
    });
  }

  handleDropdownChange = (e, data) => {
    const { searchCriteria } = this.state;

    for (var criteria in searchCriteria) {
      if (data.value.indexOf(criteria) > -1) {
        searchCriteria[criteria] = true;
      } else {
        searchCriteria[criteria] = false;
      }
    }

    if (isEmpty(data.value)) {
      searchCriteria.all = true;
      this.setState({ dropdownValue: ['all'] });
    } else {
      this.setState({ dropdownValue: data.value });
    }

    this.setState({ searchCriteria });
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
              <Checkbox
                slider
                name="mentorsOnly"
                onChange={this.handleSliderChange}
                label="Mentors Only" />
              <div className="spacer" />
              <Checkbox
                slider
                onChange={this.handleSliderChange}
                name="prosOnly"
                label="Professional Developers Only" />
              <div className="spacer" />
              <Checkbox
                slider
                onChange={this.handleSliderChange}
                name="frontendOnly"
                label="Front End Certified" />
              <div className="spacer" />
              <Checkbox
                slider
                name="backendOnly"
                onChange={this.handleSliderChange}
                label="Back End Certified" />
              <div className="spacer" />
              <Checkbox
                slider
                name="dataVisOnly"
                onChange={this.handleSliderChange}
                label="Data Visualization Certified" />
              <div className="spacer" />
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
          <div className="ui divided items">
            {
              value.length > 0 && results.length === 0 ?
              <div className="item">
                <div className="ui tiny image">
                  <i className="huge teal warning circle icon" />
                </div>
                <div className="middle aligned content">
                  <div className="header">
                    Bummer man... No results.
                  </div>
                </div>
              </div>
              :
              this.state.results.map(user => {
                return (
                  <div key={user._id} className="item search-result-item">
                    <div className="ui tiny circular image">
                      <img src={user.personal.avatarUrl} />
                    </div>
                    <div className="content">
                      <div className="header">{user.username}</div>
                      {this.props.currentUser !== user.username &&
                        <i
                          className="comments icon chatIcon"
                          onClick={this.initiatePrivateChat.bind(this, user.username)}>
                        </i>}
                      <div className="meta">
                        <span><strong>{user.personal.displayName}</strong></span>
                        <i className="angle double right icon" />
                        <span>{user.mentorship.isMentor ? 'Mentor' : 'Member'}</span>
                      </div>
                      <div className="description">
                        {user.mentorship.mentorshipSkills}
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
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
