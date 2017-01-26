import { SET_LOGGED_IN } from 'store/reducers/profile';

const initialState = {
    api: '/rest',
    authenticationHash: null,
    syncId: 0 // Used for when syncing to server
};

// ------------------------------------
// Constants
// ------------------------------------
export const SET_AUTHENTICATION_HASH = 'SET_AUTHENTICATION_HASH';
export const SET_SYNC_ID = 'SET_SYNC_ID';

// ------------------------------------
// Actions
// ------------------------------------
export function setAuthenticationHash ({ username, password }) {
    return {
        type: SET_AUTHENTICATION_HASH,
        hash: window.btoa(unescape(encodeURIComponent(username + ':' + password)))
    };
}
export function setSyncId ({ syncId }) {
    return {
        type: SET_SYNC_ID,
        syncId
    };
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [SET_AUTHENTICATION_HASH] : (state, action) => {
        return {
            api: state.api,
            authenticationHash: action.hash
        }
    },

    [SET_SYNC_ID] : (state, { syncId }) => {
        return {
            ...state,
            syncId
        }
    },

    // Listen for logout
    [SET_LOGGED_IN] : (state, action) => {
        if (action.isLoggedIn) {
            return state;
        }

        return {
            api: state.api,
            authenticationHash: null
        };
    },

    SERVER_HYDRATE : (state, { app }) => app
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function appReducer (state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];

    return handler ? handler(state, action) : state;
}
