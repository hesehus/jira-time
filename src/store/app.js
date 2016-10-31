const initialState = {
  api: '/rest',
  authenticationHash: null
};

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
      visited: state.visited,
      authenticationHash: action.hash
    }
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function appReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
