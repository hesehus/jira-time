const initialState = {
  loggedIn: false,
  username: '',
  userinfo: {}
};

// ------------------------------------
// Constants
// ------------------------------------
export const SET_LOGGED_IN = 'SET_LOGGED_IN';
export const SET_USER_INFO = 'SET_USER_INFO';

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

export function setUserInfo ({ userinfo }) {
  return {
    type: SET_USER_INFO,
    userinfo
  }
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {};

ACTION_HANDLERS[SET_LOGGED_IN] = (state, action) => {
  return {
    ...state,
    loggedIn: action.isLoggedIn,
    username: typeof action.username === 'undefined' ? state.username : action.username
  }
}

ACTION_HANDLERS[SET_USER_INFO] = (state, action) => {
  return {
    ...state,
    userinfo: action.userinfo
  };
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function profileReducer (state = initialState, action) {

  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state;
}
