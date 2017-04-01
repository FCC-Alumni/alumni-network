import { SAVE_PROFILE_VIEW_STATE } from '../actions/types';

const defaultState = {
  showAll: true,
  showFCC: false,
  showProfile: true,
  showSkills: false,
  showSocial: false,
  showCareer: false,
  showMentorship: false,
  showCollaboration: false,
}

export default (state = defaultState, action) => {
  switch (action.type) {

    case SAVE_PROFILE_VIEW_STATE:
      var collapsedAll = true;
      for (var view in action.profileView) {
        if (action.profileView[view]) {
          collapsedAll = false;
          break;
        }
      }
      if (collapsedAll) {
        action.profileView.showProfile = true;
        action.profileView.showAll = true;
      }
      return action.profileView;

    default: return state;

  }
}
