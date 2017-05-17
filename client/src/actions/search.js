export const SAVE_SEARCH_STATE = 'SAVE_SEARCH_STATE';
export const SET_SEARCH_STRING = 'SET_SEARCH_STRING';

export const saveSearchState = (searchState) => {
  return {
    type: SAVE_SEARCH_STATE,
    searchState
  }
}

export const mentorshipSearchQuery = (params) => {
  return {
    type: SET_SEARCH_STRING,
    params
  }
}
