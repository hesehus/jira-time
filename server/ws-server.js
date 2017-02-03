const http = require('http');
const EventEmitter = require('event-emitter');
const WebSocket = require('ws');

module.exports = function startWebsocketServer (app) {

    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server });

    server.listen(8080, function listening () {
        log(`Websocket server listening on port ${server.address().port}`);
    });

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

                        log(`Websocket connection establised for "${username}" (${syncUserId})`);

                        setupInitialState(messageJson);

                        ee.on('update', listenForStateUpdates);
                        ee.on('updatedTaskIssue', listenForTaskIssueUpdates);
                    }
                } else if (messageJson.issueUpdate) {
                    updateJiraIssue({
                        issue: messageJson.issue,
                        syncUserId
                    });
                    log(`Received Jira issue update from "${username}" (${syncUserId})`);
                } else {
                    addOrReplaceState({ state: messageJson });
                    log(`State updated for "${username}" (${syncUserId})`);
                }
            } catch (e) {
                log(e);
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
        function setupInitialState (state) {
            delete state.init;
            const initialState = allStates.find(s => s.profile.username === username);
            if (initialState) {
                log(`Sending initial server state to "${username}" (${syncUserId})`);
                send(initialState);
            } else {
                // No previous state was found. Lets add it
                addOrReplaceState({ state, emitEvent: false });
            }
        }

        function send (message) {
            try {
                log(`Send to "${username}" (${syncUserId})`);
                if (ws.readyState === ws.OPEN) {
                    ws.send(JSON.stringify(message), (error) => {
                        if (error) {
                            ws.close();
                            log(error);
                        }
                    });
                } else {
                    closeConnection();
                }
            } catch (error) {
                closeConnection();
                log(error);
            }
        }

        function closeConnection () {
            log(`Connection closed for "${username}" (${syncUserId})`);
            ee.off('update', listenForStateUpdates);
            if (ws.close) {
                ws.close();
            }
            username = null;
            syncUserId = null;
            initiated = false;
        }
    });

    function addOrReplaceState ({ state, emitEvent = true }) {
        const existingIndex = allStates.findIndex(s => s.profile.username === state.profile.username);
        if (existingIndex >= 0) {
            allStates[existingIndex] = state;
        } else {
            allStates.push(state);
        }
        if (emitEvent) {
            ee.emit('update', state);
        }
    }

    function updateJiraIssue ({ issue, syncUserId }) {
        allStates = allStates.map((state) => {
            if (state.syncUserId !== syncUserId && !!state.tasks.tasks.length) {
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

    function log (message) {
        console.log('### ' + message + ' ###');
    }
}
