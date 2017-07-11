import { SAVE_SEARCH_STATE, SET_SEARCH_STRING } from '../actions/search';

export const defaultState = {
  backendOnly: false,
  dataVisOnly: false,
  disableClear: true,
  dropdownValue: ['all'],
  frontendOnly: false,
  isLoading: false,
  menteesOnly: false,
  mentorsOnly: false,
  prosOnly: false,
  results: [],
  searchCriteria: {
    all: true,
    company: false,
    interests: false,
    location: false,
    mentorshipBio: false,
    name: false,
    skills: false,
  },
  showFilters: true,
  value: '',
}

const defaultSearchCriteria = {
  all: true,
  company: false,
  interests: false,
  location: false,
  mentorshipBio: false,
  name: false,
  skills: false,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case SAVE_SEARCH_STATE:
      return action.searchState;

    case SET_SEARCH_STRING:
      return {
        ...defaultState,
        dropdownValue: [action.params.category],
        searchCriteria: {
          [action.params.category]: true,
          ...defaultSearchCriteria
        },
        value:  action.params.query,
      }

    default: return state;

  }
}
