import { SAVE_SEARCH_STATE } from '../actions/types';

export const defaultState = {
  value: '',
  results: [],
  prosOnly: false,
  isLoading: false,
  showFilters: true,
  disableClear: true,
  mentorsOnly: false,
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

export default (state = defaultState, action) => {
  switch (action.type) {

    case SAVE_SEARCH_STATE:
      return action.searchState;

    default: return state;

  }
}
