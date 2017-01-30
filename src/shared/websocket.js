import EventEmitter from 'event-emitter';
import cuid from 'cuid';

let ws;
let syncId;
let unsubscribeFromStoreUpdates;
let sendTimeout;
let minTimeBetweenStateUpdates = 0;

let syncUserId = window.syncUserId || cuid();
window.syncUserId = syncUserId;

const ee = new EventEmitter({});
export default ee;

// Initiate websocket connection in 2 sec
// setTimeout(initWebsocketConnection, 2000);

export function sendIssueUpdate (issue) {
    send({
        issueUpdate: true,
        syncUserId,
        issue
    });

    // Return the issue given in order for this function to be used in a promise chain
    return issue;
}

export function initWebsocketConnection () {
    ee.emit('connecting');
    ws = new WebSocket('ws://' + location.hostname + ':8080');
    // ws = new WebSocket('ws://hk-pc2.hesehus.dk:8080');

    ws.addEventListener('close', closeConnection);

    ws.addEventListener('error', (e) => {
        console.log('server connection error', e);
        closeConnection();
        // ws = false;
    });

    ws.addEventListener('open', () => {

        ee.emit('connected');

        /**
         * Send the init command the username since it is being used
         * as identifier for the future messages
        **/
        send({
            init: true,
            username: store.getState().profile.username,
            syncUserId
        });

        // Receving a message from the server
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

            // console.log('received from server', serverState.app.syncId, syncId);
            if (serverState.syncUserId && (serverState.syncUserId !== syncUserId || serverState.taskIssueUpdate)) {
                if (serverState.profile.username === state.profile.username) {
                    console.log('State received from server. Hydrate!', serverState);

                    // Delete util keys, since redux will give a warning if we don't (we don't need to persist them)
                    delete serverState.syncUserId;
                    delete serverState.taskIssueUpdate;

                    store.dispatch({
                        type: 'SERVER_HYDRATE',
                        ...serverState
                    });
                    ee.emit('hydrate');
                }
            }
        });

        unsubscribeFromStoreUpdates = store.subscribe(() => {
            clearTimeout(sendTimeout);
            sendTimeout = setTimeout(() => {
                const state = store.getState();

                /**
                 * The local syncId is equal to the state syncId. This means that the origin of
                 * the state change is local and we should push the changes to the server
                **/
                if (state.app.syncId === syncId) {
                    ee.emit('send-remote');
                    syncId = Date.now();
                    state.app.syncId = syncId;
                    console.log('Send updates to server!', state);

                    // Send update to server
                    send({
                        syncUserId,
                        ...state
                    });
                } else {
                    /**
                     * Since the syncIds do not match, it means that the change origin was the server
                     * and we should not send this back to the server
                    **/
                    syncId = state.app.syncId;
                }
            }, minTimeBetweenStateUpdates);
        });
    });
}

function send (message) {
    if (ws && ws.send) {
        if (ws.readyState === WebSocket.OPEN) {
            try {
                ws.send(JSON.stringify(message));
            } catch (error) {
                console.error(error);
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

        ee.emit('closeOrError');
        console.log('Server connection closed.');
    }
}
