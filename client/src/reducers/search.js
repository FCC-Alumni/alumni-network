import { SAVE_SEARCH_STATE, SET_SEARCH_STRING } from '../actions/search';

export const defaultState = {
  value: '',
  results: [],
  prosOnly: false,
  isLoading: false,
  showFilters: true,
  disableClear: true,
  mentorsOnly: false,
  menteesOnly: false,
  backendOnly: false,
  dataVisOnly: false,
  frontendOnly: false,
  dropdownValue: ['all'],
  searchCriteria: {
    mentorshipBio: false,
    interests: false,
    location: false,
    company: false,
    skills: false,
    name: false,
    all: true,
  }
}

const defaultSearchCriteria = {
  mentorshipBio: false,
  interests: false,
  location: false,
  company: false,
  skills: false,
  name: false,
  all: true,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case SAVE_SEARCH_STATE:
      return action.searchState;

    case SET_SEARCH_STRING:
      return {
        ...defaultState,
        value:  action.params.query,
        dropdownValue: [action.params.category],
        searchCriteria: {
          [action.params.category]: true,
          ...defaultSearchCriteria
        }
      }

    default: return state;

  }
}
