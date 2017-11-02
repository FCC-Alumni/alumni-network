export const SAVE_SEARCH_STATE = 'SAVE_SEARCH_STATE';
export const SET_SEARCH_STRING = 'SET_SEARCH_STRING';

export const saveSearchState = searchState => {
  return {
    searchState,
    type: SAVE_SEARCH_STATE
  }
}

export const mentorshipSearchQuery = params => {
  return {
    params,
    type: SET_SEARCH_STRING
  }
}
