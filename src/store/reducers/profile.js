const initialState = {
  loggedIn: false,
  username: ''
};

// ------------------------------------
// Constants
// ------------------------------------
export const SET_LOGGED_IN = 'SET_LOGGED_IN';

// ------------------------------------
// Actions
// ------------------------------------
export function setLoggedIn ({ isLoggedIn, username }) {
  return {
    type: SET_LOGGED_IN,
    isLoggedIn,
    username
  }
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_LOGGED_IN] : (state, action) => {
    return {
      loggedIn: action.isLoggedIn,
      username: typeof action.username === 'undefined' ? state.username : action.username
    }
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function profileReducer (state = initialState, action) {

  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state;
}
