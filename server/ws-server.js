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

    const allClientConnectionStates = {};

    wss.on('connection', function connection (ws) {
        let username;
        let syncUserId;

        ws.on('close', closeConnection);

        ws.on('message', function incoming (message) {
            try {
                const messageJson = JSON.parse(message);

                // Client wants init data
                if (messageJson.init) {
                    username = messageJson.profile.username;
                    syncUserId = messageJson.syncUserId;

                    log(`Websocket connection establised for "${username}" (${syncUserId})`);

                    setInitialClientConnectionState(messageJson);

                    ee.on('update', listenForStateUpdates);
                    ee.on('updatedTaskIssue', listenForTaskIssueUpdates);
                } else if (messageJson.issueUpdate) {
                    // Client has an updated JIRA issue to broadcast to the other clients
                    updateJiraIssue({
                        issue: messageJson.issue
                    });
                    log(`Received Jira issue update from "${username}" (${syncUserId})`);
                } else {
                    // Normal state update
                    updateState({ state: messageJson });
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
            let connection = allClientConnectionStates[username];

            if (!connection) {
                connection = {
                    connectedUsers: 1,
                    state
                };
                allClientConnectionStates[state.profile.username] = connection;
            } else {
                connection.connectedUsers += 1;

                log(`Initial state for ${username} already on the server.
                     Sending it back to the client (${syncUserId})...`);
                send(connection.state);
            }
        }

        function send (message) {
            try {
                log(`Send to "${username}" (${syncUserId})`);
                if (ws.readyState === ws.OPEN) {
                    ws.send(JSON.stringify(message), null, (error) => {
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

            // removeClientStateIfLastConnection(username);

            ee.off('update', listenForStateUpdates);

            if (ws.close) {
                ws.close();
            }
            username = null;
            syncUserId = null;
        }
    });

    /**
     * Removes the connection state if no more users are connected
     */
    // function removeClientStateIfLastConnection (username) {
    //     const connection = allClientConnectionStates[username];
    //     if (connection) {
    //         if (connection.connectedUsers === 1) {
    //             delete allClientConnectionStates[username];
    //             log(`No more connections for ${username}. Clearing state.`);
    //         } else {
    //             connection.connectedUsers -= 1;
    //         }
    //     }
    // }

    function updateState ({ state, emitEvent = true }) {
        const existingConnection = allClientConnectionStates[state.profile.username];

        if (existingConnection) {

            /**
             * Ensure that the new state we received is actually updated at a later
             * point in time than the one we have
             */
            existingConnection.state = state;

            if (emitEvent) {
                ee.emit('update', state);
            }
        }
    }

    function updateJiraIssue ({ issue }) {
        for (let connection in allClientConnectionStates) {
            if (!!connection.state.tasks.tasks.length) {
                connection.state.tasks.tasks = connection.state.tasks.tasks.map((task) => {
                    if (task.issue.key.toLowerCase() === issue.key.toLowerCase()) {
                        task.issue = issue;
                    }
                    return task;
                });
                ee.emit('updatedTaskIssue', connection.state);
            }
        }
    }

    function log (message) {
        console.log('### ' + message + ' ###');
    }
}
