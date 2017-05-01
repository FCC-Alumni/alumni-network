export const SAVE_SEARCH_STATE = 'SAVE_SEARCH_STATE';
export const SAVE_PREFERENCES_VIEW_STATE = 'SAVE_PREFERENCES_VIEW_STATE';

export const saveSearchState = (searchState) => {
  return {
    type: SAVE_SEARCH_STATE,
    searchState
  }
}

export const savePreferencesViewState = (preferencesView) => {
  return {
    type: SAVE_PREFERENCES_VIEW_STATE,
    preferencesView
  }
}
