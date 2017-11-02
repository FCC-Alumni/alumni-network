import { SAVE_PREFERENCES_VIEW_STATE } from '../actions/views';

const defaultState = {
  showAll: false,
  showCareer: false,
  showCollaboration: false,
  showFCC: false,
  showMentorship: false,
  showProfile: true,
  showSkills: false,
  showSocial: false,
}

export default (state = defaultState, action) => {
  switch (action.type) {

    case SAVE_PREFERENCES_VIEW_STATE:
      var collapsedAll = true;
      for (var view in action.preferencesView) {
        if (action.preferencesView[view]) {
          collapsedAll = false;
          break;
        }
      }
      if (collapsedAll) {
        action.preferencesView.showProfile = true;
        action.preferencesView.showAll = true;
      }
      return action.preferencesView;

    default:
      return state;

  }
}
