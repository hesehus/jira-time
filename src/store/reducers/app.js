import { SET_LOGGED_IN } from 'store/reducers/profile';

const initialState = {
    authenticationHash: null,
    syncId: 0, // Used to identify client when syncing to server,
    updateTime: 0, // The last time the state was updated;
    hydrated: false // If persist/REHYDRATE has ran
};

// ------------------------------------
// Constants
// ------------------------------------
export const SET_AUTHENTICATION_HASH = 'SET_AUTHENTICATION_HASH';
export const SET_SYNC_ID = 'SET_SYNC_ID';

// ------------------------------------
// Actions
// ------------------------------------
export function setAuthenticationHash({ username, password }) {
    return {
        type: SET_AUTHENTICATION_HASH,
        hash: window.btoa(unescape(encodeURIComponent(username + ':' + password)))
    };
}
export function setSyncId({ syncId }) {
    return {
        type: SET_SYNC_ID,
        syncId
    };
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [SET_AUTHENTICATION_HASH]: (state, action) => {
        return {
            api: state.api,
            authenticationHash: action.hash
        };
    },

    [SET_SYNC_ID]: (state, { syncId }) => {
        return {
            ...state,
            syncId
        };
    },

    // Listen for logout
    [SET_LOGGED_IN]: (state, action) => {
        if (action.isLoggedIn) {
            return state;
        }

        return {
            api: state.api,
            authenticationHash: null
        };
    }
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function appReducer(state = initialState, action) {
    // Update the last updated time if a useful action is executed
    if (
        ![
            '@@INIT',
            'persist/REHYDRATE',
            'SERVER_STATE_PUSH',
            'UPDATE_RECORD_ELAPSED',
            'LOCATION_CHANGE',
            'SET_USER_INFO',
            'SET_LOGGED_IN',
            'ATTEMPT_LOGIN'
        ].includes(action.type) &&
        !action.type.includes('@@redux')
    ) {
        state = {
            ...state,
            updateTime: Date.now()
        };
    }

    // Reset the update time since it is not relevant when rehydrating
    if (action.type === 'persist/REHYDRATE') {
        if (!action.payload.app) {
            action.payload.app = {};
        }
        action.payload.app.hydrated = true;
        action.payload.app.updateTime = 0;
    }

    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state;
}
