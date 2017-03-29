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

    let allClientConnectionStates = [];

    wss.on('connection', function connection (ws) {
        let username;
        let syncUserId;
        let initiated = false;

        ws.on('close', closeConnection);

        ws.on('message', function incoming (message) {
            try {
                const messageJson = JSON.parse(message);

                // Client wants init data
                if (messageJson.init) {
                    if (!initiated) {
                        initiated = true;
                        username = messageJson.username;
                        syncUserId = messageJson.syncUserId;

                        log(`Websocket connection establised for "${username}" (${syncUserId})`);

                        setInitialClientConnectionState(messageJson);

                        ee.on('update', listenForStateUpdates);
                        ee.on('updatedTaskIssue', listenForTaskIssueUpdates);
                    }
                } else if (messageJson.issueUpdate) {
                    // Client has an updated JIRA issue to broadcast to the other clients
                    updateJiraIssue({
                        issue: messageJson.issue,
                        syncUserId
                    });
                    log(`Received Jira issue update from "${username}" (${syncUserId})`);
                } else {
                    // Normal state update
                    addOrReplaceState({ state: messageJson });
                    log(`State updated for "${username}" (${syncUserId})`);
                }
            } catch (e) {
                log(e);
            }
        });

        function listenForStateUpdates (state) {
            if (username === state.profile.username) {
                send(state);
            }
        }

        function listenForTaskIssueUpdates (state) {
            state.taskIssueUpdate = true;
            send(state);
        }

        // Send the initial state to the client
        function setInitialClientConnectionState (state) {
            delete state.init;
            const initialState = allClientConnectionStates.find(s => s.profile.username === username);

            /**
             * There is already an initial state, and its updateTime is ahead
             * of the one that we are getting here.
             */
            if (initialState && initialState.app.updateTime > state.app.updateTime) {
                log(`Initial state for ${username} already on the server.
                     Sending it back to the client (${syncUserId})...`);
                send(initialState);
            } else {
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
        const existingIndex = allClientConnectionStates.findIndex(s => s.profile.username === state.profile.username);
        if (existingIndex >= 0) {

            /**
             * Ensure that the new state we received is actually updated at a later
             * point in time than the one we have
             */
            if (allClientConnectionStates[existingIndex].app.updateTime < state.app.updateTime) {
                allClientConnectionStates[existingIndex] = state;
            }
        } else {
            allClientConnectionStates.push(state);
        }
        if (emitEvent) {
            ee.emit('update', state);
        }
    }

    function updateJiraIssue ({ issue, syncUserId }) {
        allClientConnectionStates = allClientConnectionStates.map((state) => {
            if (!!state.tasks.tasks.length) {
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
