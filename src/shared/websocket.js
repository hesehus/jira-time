import EventEmitter from 'event-emitter';

let ws;
let syncId;
let sendTimeout;
let minTimeBetweenStateUpdates = 1000;

const ee = new EventEmitter({});

// setTimeout(initWebsocketConnection, 2000);

export default ee;

export function initWebsocketConnection () {
    ee.emit('connecting');
    ws = new WebSocket('ws://' + location.hostname + ':8080');
    window.ws = ws;
    ws.addEventListener('close', (e) => {

        ee.emit('closeOrError');
        console.log('server connection closed.', e);

        // setTimeout(() => {
        //     initWebsocketConnection();
        // }, 2000);
    });

    /*ws.addEventListener('error', (e) => {
        console.log('server connection error', e);
        ws = false;
    });*/

    ws.onopen = () => {

        ee.emit('connected');

        /**
         * Send the init command the username since it is being used
         * as identifier for the future messages
        **/
        send({
            init: true,
            username: store.getState().profile.username
        });

        // Receving a message from the server
        ws.addEventListener('message', (message) => {

            const serverState = JSON.parse(message.data);
            const state = store.getState();
            console.log('received from server', serverState.app.syncId, syncId);
            if (serverState.app.syncId !== syncId) {
                if (serverState.profile.username === state.profile.username) {
                    console.log('Username matched. Lets sync!');
                    store.dispatch({
                        type: 'SERVER_HYDRATE',
                        ...serverState
                    });
                    ee.emit('hydrate');
                }
            }
        });

        store.subscribe(() => {
            clearTimeout(sendTimeout);
            sendTimeout = setTimeout(() => {
                const state = store.getState();

                /**
                 * The local syncId is equal to the state syncId. This means that the origin of
                 * the state change is local and we should push the changes to the server
                **/
                if (state.app.syncId === syncId) {
                    console.log('Send updates to server!');
                    ee.emit('send-remote');
                    syncId = Date.now();
                    state.app.syncId = syncId;

                    // Send update to server
                    send(state);
                } else {
                    /**
                     * Since the syncIds do not match, it means that the change origin was the server
                     * and we should not send this back to the server
                    **/
                    syncId = state.app.syncId;
                }
            }, minTimeBetweenStateUpdates);
        });
    }

    function send (message) {
        if (ws.send) {
            ws.send(JSON.stringify(message));
        }
    }
}
