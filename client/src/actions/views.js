import {
  SAVE_SEARCH_STATE,
  SAVE_PROFILE_STATS,
  SAVE_PREFERENCES_VIEW_STATE,
} from './types';

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

export const saveProfileStats = (stats) => {
  return {
    type: SAVE_PROFILE_STATS,
    stats
  }
}
