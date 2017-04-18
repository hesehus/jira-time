import EventEmitter from 'event-emitter';
import cuid from 'cuid';

let ws;
let syncId;
let updateTime = 0;
let unsubscribeFromStoreUpdates;
let sendTimeout;
let minimumTimeBetweenStateUpdates = 500;

let syncUserId = window.syncUserId || innerWidth + ':' + cuid();
window.syncUserId = syncUserId;

const ee = new EventEmitter({});
export default ee;

// Initiate websocket connection
// setTimeout(handleWSConnection, 500);

let unsubscribeToStore;

export function sendIssueUpdate (issue) {
    send({
        issueUpdate: true,
        issue
    });

    // Return the issue given in order for this function to be used in a promise chain
    return issue;
}

export function handleWSConnection () {

    // We cannot connect to a socket server when the site is hosted by JIRA.
    if (location.hostname === 'jira.hesehus.dk') {
        return;
    }

    if (!unsubscribeToStore) {
        unsubscribeToStore = store.subscribe(handleWSConnection);
    }

    {
        let state = store.getState();
        if (!state.profile.loggedIn ||
            !state.profile.preferences.connectToSyncServer ||
            !state.app.hydrated) {
            closeConnection();
            return;
        }
    }

    if (!ws) {
        connect();
    }

    function connect () {

        ee.emit('connecting');

        ws = new WebSocket('ws://' + location.hostname + ':8080');

        ws.addEventListener('close', () => {
            console.log('server connection closed');
            closeConnection();
        });

        ws.addEventListener('error', (e) => {
            console.log('server connection error', e);
            closeConnection();
        });

        /**
         * Listen for the successful connect(open) event when the connection to
         * the server is established
         */
        ws.addEventListener('open', () => {

            ee.emit('connected');

            /**
             * Send the init command the username since it is being used
             * as identifier for the future messages
            **/
            const state = store.getState();
            send({
                ...state,
                init: true
            });

            // Listen for local store changes
            unsubscribeFromStoreUpdates = store.subscribe(() => {
                clearTimeout(sendTimeout);
                sendTimeout = setTimeout(() => {

                    if (!ws) {
                        return;
                    }

                    const state = store.getState();

                    /**
                     * The store updateTime is fresher than what we have. This means that the
                     * state change is local and we should push the changes to the server
                    **/
                    if (state.app.updateTime > updateTime) {
                        console.log('state qualifies for server update', state.app.updateTime, updateTime)

                        // Store the updateTime
                        updateTime = state.app.updateTime;

                        ee.emit('send-remote');
                        syncId = Date.now();
                        state.app.syncId = syncId;

                        // Send update to server
                        send(state);
                    }
                }, minimumTimeBetweenStateUpdates);
            });

            // Listen for messages from the server
            ws.addEventListener('message', (message) => {

                let serverState;
                try {
                    serverState = JSON.parse(message.data);
                } catch (error) {
                    console.error('Malformed websocket response', message);
                }

                if (!serverState) {
                    return;
                }

                const state = store.getState();

                if (serverState.profile.username === state.profile.username) {
                    console.log('Fresher state received from server. Hydrate!', serverState);
                    updateTime = serverState.app.updateTime;

                    // Delete util keys, since redux will give a warning if we don't (we don't need to persist them)
                    delete serverState.syncUserId;
                    delete serverState.taskIssueUpdate;

                    store.dispatch({
                        type: 'SERVER_STATE_PUSH',
                        ...serverState
                    });

                    ee.emit('hydrate');
                }
            });
        });
    }
}

function send (message) {
    if (ws && ws.send) {
        if (ws.readyState === WebSocket.OPEN) {
            try {
                ws.send(JSON.stringify({
                    ...message,
                    syncUserId
                }));
                console.log('Send to server!', message);
            } catch (error) {
                console.error('Error at websocket send', error);
                closeConnection();
            }
        } else {
            closeConnection();
        }
    } else {
        closeConnection();
    }
}

function closeConnection () {
    if (unsubscribeFromStoreUpdates) {
        unsubscribeFromStoreUpdates();
    }
    if (ws) {
        ws.close();
        ws = null;

        ee.emit('closeOrError');
    }
}
