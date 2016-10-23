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

// export const doubleAsync = () => {
//  return (dispatch, getState) => {
//    return new Promise((resolve) => {
//      setTimeout(() => {
//        dispatch(increment(getState().counter))
//        resolve()
//      }, 200)
//    })
//  }
// }

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
const initialState = { username: '' };

export default function profileReducer (state = initialState, action) {

  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state;
}
