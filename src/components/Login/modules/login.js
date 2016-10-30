const initialState = { username: '', password: '' };

// ------------------------------------
// Constants
// ------------------------------------
export const ATTEMPT_LOGIN = 'ATTEMPT_LOGIN';

// ------------------------------------
// Actions
// ------------------------------------
export function attemptLogin (action) {
  return {
    type: ATTEMPT_LOGIN,
    action
  }
};

export const actions = {
  attemptLogin
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ATTEMPT_LOGIN] : (state, action) => state
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function profileReducer (state = initialState, action) {

  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state;
}
