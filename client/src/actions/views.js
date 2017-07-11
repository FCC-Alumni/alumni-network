export const SAVE_PREFERENCES_VIEW_STATE = 'SAVE_PREFERENCES_VIEW_STATE';

export const savePreferencesViewState = (preferencesView) => {
  return {
    preferencesView,
    type: SAVE_PREFERENCES_VIEW_STATE,
  }
}
