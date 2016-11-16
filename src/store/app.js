const initialState = {
  api: '/rest',
  authenticationHash: null
};

import { SET_LOGGED_IN } from 'routes/Profile/modules/profile';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_AUTHENTICATION_HASH = 'SET_AUTHENTICATION_HASH';

// ------------------------------------
// Actions
// ------------------------------------
export function setAuthenticationHash ({ username, password }) {
  return {
    type: SET_AUTHENTICATION_HASH,
    hash: window.btoa(unescape(encodeURIComponent(username + ':' + password)))
  };
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_AUTHENTICATION_HASH] : (state, action) => {
    return {
      api: state.api,
      authenticationHash: action.hash
    }
  },

  // Listen for logout
  [SET_LOGGED_IN] : (state, action) => {
    if (action.isLoggedIn) {
      return state;
    }

    return {
      api: state.api,
      authenticationHash: null
    };
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function appReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
