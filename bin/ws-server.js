const EventEmitter = require('event-emitter');
const debug = require('debug')('app:server');
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 8080 });
debug('Websocket server listening on port 8080...');

const ee = new EventEmitter({});

const allStates = [];

wss.on('connection', function connection (ws) {
    let username;
    // let syncId;

    ws.on('message', function incoming (message) {
        try {
            const state = JSON.parse(message);
            if (!username) {
                username = state.profile.username;
            }

            // syncId = state.syncId;
            addOrReplace(state);

            // Pass this data to other devices
            // ws.send(message);
        } catch (e) {
            debug(e);
        }
    });

    ee.on('update', (state) => {
        if (username === state.profile.username) {
            console.log('send to client!');
            ws.send(JSON.stringify(state));
        }
    });
});

function addOrReplace (state) {
    const existingIndex = allStates.findIndex(s => s.profile.username === state.profile.username);
    if (existingIndex >= 0) {
        allStates[existingIndex] = state;
        console.log('State replaced!');
    } else {
        allStates.push(state);
        console.log('State added!');
    }
    ee.emit('update', state);
}
