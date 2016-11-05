import DeepAssign from 'deep-assign';

import TaskModel from './TaskModel';

const initialState = { tasks: [] };

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_TASK = 'ADD_TASK';
export const REMOVE_TASK = 'REMOVE_TASK';
export const REFRESH_ISSUE = 'REFRESH_ISSUE';
export const SET_ISSUE_REFRESHING = 'SET_ISSUE_REFRESHING';

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
export function refreshIssue ({ cuid, issue }) {
  return {
    type: REFRESH_ISSUE,
    cuid,
    issue
  }
};
export function setIssueRefreshing ({ cuid, refreshing }) {
  return {
    type: SET_ISSUE_REFRESHING,
    cuid,
    refreshing
  }
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ADD_TASK] : (state, action) => {

    const { issue } = action;

    return {
      tasks: [...state.tasks, TaskModel({ issue })]
    }
  },
  [REMOVE_TASK] : (state, action) => {

    let taskIndex = state.tasks.findIndex(task => task.cuid === action.cuid);

    return {
      tasks: [...state.tasks.slice(0, taskIndex), ...state.tasks.slice(taskIndex + 1)]
    };
  },
  [REFRESH_ISSUE] : (state, action) => {

    let tasks = state.tasks.map(task => {
      if (task.cuid === action.cuid) {
        return DeepAssign({}, task, {
          issue: action.issue,
          issueRefreshing: false
        });
      }
      return task;
    });

    return {
      tasks
    };
  },
  [SET_ISSUE_REFRESHING] : (state, action) => {

    let tasks = state.tasks.map(task => {
      if (task.cuid === action.cuid) {
        return DeepAssign({}, task, {
          issueRefreshing: action.refreshing
        });
      }
      return task;
    });

    return {
      tasks
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
