import cuid from 'cuid';

import TabModel from '../models/TabModel';

const initialState = [];

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_TAB = 'ADD_TAB';
export const ADD_TAB_TASK = 'ADD_TAB_TASK';

// ------------------------------------
// Actions
// ------------------------------------
export function addTab (action) {
  return {
    type: ADD_TAB,
    action
  }
};

export function addTabTask (action) {
  return {
    type: ADD_TAB_TASK,
    action
  }
};

// ------------------------------------
// Action Handlers
// ------------------------------------
export const ACTION_HANDLERS = {};

ACTION_HANDLERS[ADD_TAB] = (tabs, action) => {
    const tab = new TabModel(action.tab);

    if (!tab.name) {
        tab.name = 'tab '+ (tabs.length + 1);
    }

    return [...tabs, tab];
};

ACTION_HANDLERS[ADD_TAB_TASK] = (tabs, { tabCuid, taskCuid }) => {

    const index = tabs.findIndex(tab => tab.cuid === tabCuid);
    const tab = tabs[index];

    if (!tab.tasks.includes(taskCuid)) {
        tab.tasks.push(taskCuid);
    }

    return [...tabs.slice(0, index), tab, ...tabs.slice(index + 1)];
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function reducer (state = initialState, action) {

  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state;
}
