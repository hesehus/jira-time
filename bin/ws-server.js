const EventEmitter = require('event-emitter');
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 8080 });
console.log('Websocket server listening on port 8080...');

const ee = new EventEmitter({});

let allStates = [];

wss.on('connection', function connection (ws) {
    let username;
    let syncUserId;
    let initiated = false;

    ws.on('close', closeConnection);

    ws.on('message', function incoming (message) {
        try {
            const messageJson = JSON.parse(message);

            if (messageJson.init) {
                if (!initiated) {
                    initiated = true;
                    username = messageJson.username;
                    syncUserId = messageJson.syncUserId;

                    console.log(`### Connection establised for "${username}" (${syncUserId}) ###`);

                    sendInitialState();

                    ee.on('update', listenForStateUpdates);
                    ee.on('updatedTaskIssue', listenForTaskIssueUpdates);
                }
            } else if (messageJson.issueUpdate) {
                updateJiraIssue({
                    issue: messageJson.issue,
                    syncUserId
                });
                console.log(`Received Jira issue update from "${username}" (${syncUserId})`);
            } else {
                addOrReplaceState(messageJson);
                console.log(`State updated for "${username}" (${syncUserId})`);
            }
        } catch (e) {
            console.log(e);
        }
    });

    function listenForStateUpdates (state) {
        if (username === state.profile.username && syncUserId !== state.syncUserId) {
            send(state);
        }
    }

    function listenForTaskIssueUpdates (state) {
        state.taskIssueUpdate = true;
        send(state);
    }

    // Send the initial state
    function sendInitialState () {
        const initialState = allStates.find(s => s.profile.username === username);
        if (initialState) {
            console.log(`Sending initial server state to "${username}" (${syncUserId})`);
            send(initialState);
        }
    }

    function send (message) {
        try {
            console.log(`Send to "${username}" (${syncUserId})`);
            if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify(message), (error) => {
                    if (error) {
                        ws.close();
                        console.log(error);
                    }
                });
            } else {
                closeConnection();
            }
        } catch (error) {
            closeConnection();
            console.log(error);
        }
    }

    function closeConnection () {
        console.log(`### Connection closed for "${username}" (${syncUserId}) ###`);
        ee.off('update', listenForStateUpdates);
        if (ws.close) {
            ws.close();
        }
        username = null;
        syncUserId = null;
        initiated = false;
    }
});

function addOrReplaceState (state) {
    const existingIndex = allStates.findIndex(s => s.profile.username === state.profile.username);
    if (existingIndex >= 0) {
        allStates[existingIndex] = state;
    } else {
        allStates.push(state);
    }
    ee.emit('update', state);
}

function updateJiraIssue ({ issue, syncUserId }) {
    allStates = allStates.map((state) => {
        if (state.syncUserId !== syncUserId) {
            state.tasks.tasks = state.tasks.tasks.map((task) => {
                if (task.issue.key.toLowerCase() === issue.key.toLowerCase()) {
                    task.issue = issue;
                }
                return task;
            });
            ee.emit('updatedTaskIssue', state);
        }
        return state;
    });
}
