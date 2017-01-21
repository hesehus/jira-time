import themes from 'modules/theme/themes';

import { SET_MANUAL_SORT_ORDER } from './tasks';

const initialState = {
    loggedIn: false,
    username: '',
    userinfo: {},
    preferences: {
        theme: themes[0].key,
        tasksSortOrder: null
    }
};

export const CONSTANTS = {
    hej: 1
};

// ------------------------------------
// Constants
// ------------------------------------
export const SET_LOGGED_IN = 'SET_LOGGED_IN';
export const SET_USER_INFO = 'SET_USER_INFO';
export const SET_THEME = 'SET_THEME';
export const SET_TASKS_SORT_ORDER = 'SET_TASKS_SORT_ORDER';

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

export function setTheme ({ theme }) {
    return {
        type: SET_THEME,
        theme
    }
};

export function setTasksSortOrder ({ tasksSortOrder }) {
    return {
        type: SET_TASKS_SORT_ORDER,
        tasksSortOrder
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
};

ACTION_HANDLERS[SET_USER_INFO] = (state, action) => {
    return {
        ...state,
        userinfo: action.userinfo
    };
};

ACTION_HANDLERS[SET_THEME] = (state, action) => {
    return {
        ...state,
        preferences: {
            ...state.preferences,
            theme: action.theme
        }
    };
};

ACTION_HANDLERS[SET_TASKS_SORT_ORDER] = (state, { tasksSortOrder }) => {
    return {
        ...state,
        preferences: {
            ...state.preferences,
            tasksSortOrder
        }
    };
};

ACTION_HANDLERS[SET_MANUAL_SORT_ORDER] = (state, action) => {
    return {
        ...state,
        preferences: {
            ...state.preferences,
            tasksSortOrder: 'manual'
        }
    };
};

// ------------------------------------
// Getters
// ------------------------------------
export const getTasksSortOrder = state => state.profile.preferences.tasksSortOrder;

// ------------------------------------
// Reducer
// ------------------------------------
export default function profileReducer (state = initialState, action) {

    const handler = ACTION_HANDLERS[action.type];

    return handler ? handler(state, action) : state;
}
