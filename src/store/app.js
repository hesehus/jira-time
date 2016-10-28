const initialState = {
  visited: false,
  authenticationHash: null
};

// ------------------------------------
// Constants
// ------------------------------------
export const SET_VISITED = 'SET_VISITED';
export const SET_AUTHENTICATION_HASH = 'SET_AUTHENTICATION_HASH';

// ------------------------------------
// Actions
// ------------------------------------
export function setVisited (visited) {
  return {
    type: SET_VISITED,
    visited
  };
}
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
  [SET_VISITED] : (state, action) => {
    return {
      visited: action.visited,
      authenticationHash: state.authenticationHash
    }
  },
  [SET_AUTHENTICATION_HASH] : (state, action) => {
    return {
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
