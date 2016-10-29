const initialState = { tasks: [] };

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
export default function tasksReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
