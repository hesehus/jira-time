import TaskModel from './TaskModel';

const initialState = { tasks: [] };

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_TASK = 'ADD_TASK';
export const REMOVE_TASK = 'REMOVE_TASK';

// ------------------------------------
// Actions
// ------------------------------------
export function addTask ({ issue }) {
  return {
    type: ADD_TASK,
    issue
  }
};
export function removeTask ({ cuid }) {
  return {
    type: REMOVE_TASK,
    cuid
  }
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ADD_TASK] : (state, action) => {

    const { issue } = action;

    return {
      tasks: [...state.tasks, new TaskModel({ issue })]
    }
  },
  [REMOVE_TASK] : (state, action) => {

    let taskIndex = state.tasks.findIndex(task => task.cuid === action.cuid);

    return {
      tasks: [...state.tasks.slice(0, taskIndex), ...state.tasks.slice(taskIndex + 1)]
    };
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function tasksReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
