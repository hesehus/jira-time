// ------------------------------------
// Constants
// ------------------------------------
export const ADD_TASK_FROM_URL = 'ADD_TASK_FROM_URL';

// ------------------------------------
// Actions
// ------------------------------------
export function addTaskFromUrl (url) {
  return {
    type: ADD_TASK_FROM_URL,
    url
  }
};

//export const doubleAsync = () => {
//  return (dispatch, getState) => {
//    return new Promise((resolve) => {
//      setTimeout(() => {
//        dispatch(increment(getState().counter))
//        resolve()
//      }, 200)
//    })
//  }
//}

export const actions = {
  addTaskFromUrl
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ADD_TASK_FROM_URL] : (state, action) => {
    return {
      tasks: [action.url, ...state.tasks]
    }
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { tasks: [] };

export default function tasksReducer (state = initialState, action) {
  
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state;
}
