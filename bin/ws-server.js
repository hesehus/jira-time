const EventEmitter = require('event-emitter');
const debug = require('debug')('app:server');
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 8080 });
debug('Websocket server listening on port 8080...');

const ee = new EventEmitter({});

const allStates = [];

wss.on('connection', function connection (ws) {
    let username;

    ws.on('message', function incoming (message) {
        try {
            const messageJson = JSON.parse(message);

            if (messageJson.init) {
                username = messageJson.username;
                sendInitialState();
                debug(`Connection establised for "${username}"`);
            } else {
                addOrReplace(messageJson);
                debug(`State updated for "${username}"`);
            }
        } catch (e) {
            debug(e);
        }
    });

    ee.on('update', (state) => {
        if (username === state.profile.username) {
            ws.send(JSON.stringify(state));
        }
    });

    // Send the initial state
    function sendInitialState () {
        const initialState = allStates.find(s => s.profile.username === username);
        if (initialState) {
            debug(`Sending initial state to "${username}"`);
            ws.send(JSON.stringify(initialState));
        }
    }
});

function addOrReplace (state) {
    const existingIndex = allStates.findIndex(s => s.profile.username === state.profile.username);
    if (existingIndex >= 0) {
        allStates[existingIndex] = state;
    } else {
        allStates.push(state);
    }
    ee.emit('update', state);
}
