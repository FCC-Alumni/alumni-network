import { SAVE_SEARCH_STATE } from '../actions/types';

export const defaultState = {
  disableClear: true,
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

export const search = (state = defaultState, action) => {
  switch (action.type) {

    case SAVE_SEARCH_STATE:
      return action.searchState;

    default: return state;

  }
}
