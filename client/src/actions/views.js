export const SAVE_PREFERENCES_VIEW_STATE = 'SAVE_PREFERENCES_VIEW_STATE';

export const savePreferencesViewState = (preferencesView) => {
  return {
    type: SAVE_PREFERENCES_VIEW_STATE,
    preferencesView
  }
}
