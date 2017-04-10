import themes from 'modules/theme/themes';

const initialState = {
    loggedIn: false,
    username: '',
    userinfo: {},
    preferences: {
        theme: themes[0].key,
        connectToSyncServer: true,
        enableVoiceRecording: false,
        enableAnimations: false,
        compactView: false
    }
};

// ------------------------------------
// Constants
// ------------------------------------
export const SET_LOGGED_IN = 'SET_LOGGED_IN';
export const SET_USER_INFO = 'SET_USER_INFO';
export const SET_USER_PREFERENCES = 'SET_USER_PREFERENCES';
export const SET_THEME = 'SET_THEME';

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

export function setUserPreferences ({ preferences }) {
    return {
        type: SET_USER_PREFERENCES,
        preferences
    }
};

export function setTheme ({ theme }) {
    return {
        type: SET_THEME,
        theme
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

ACTION_HANDLERS[SET_USER_INFO] = (state, { userinfo }) => {
    return {
        ...state,
        userinfo
    };
};

ACTION_HANDLERS[SET_USER_PREFERENCES] = (state, { preferences }) => {
    return {
        ...state,
        preferences
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

ACTION_HANDLERS['SERVER_STATE_PUSH'] = (state, { profile }) => profile;

// ------------------------------------
// Reducer
// ------------------------------------
export default function profileReducer (state = initialState, action) {

    const handler = ACTION_HANDLERS[action.type];

    return handler ? handler(state, action) : state;
}
