import React, { Component, PropTypes } from 'react'
import { default as swal } from 'sweetalert2'

import { extractIssueKeysFromText, addCurrentUserAsWatcher } from 'shared/jiraClient';
import ProcessTask from './ProcessTask';

import './Recorder.scss';

const processTask = new ProcessTask();
let ws;
let syncId;

export default class Recorder extends Component {

    static get propTypes () {
        return {
            addTask: PropTypes.func.isRequired,
            recorder: PropTypes.object.isRequired,
            updateRecordElapsed: PropTypes.func.isRequired,
            isLoggedIn: PropTypes.bool.isRequired,
            setSyncId: PropTypes.func.isRequired
        };
    }

    constructor (props) {
        super(props);

        const remaining = processTask.getRemaining();
        this.state = {
            tasksAddingRemaining: remaining,
            tasksAtStart: remaining
        };

        this.onDropAndPaste = this.onDropAndPaste.bind(this);
        this.updateElapsedTime = this.updateElapsedTime.bind(this);

        processTask.on('add', (result) => {
            const remaining = processTask.getRemaining();

            this.setState({
                tasksAddingRemaining: remaining
            });

            if (result.success) {
                this.props.addTask({ issue: result.issue });
                addCurrentUserAsWatcher({ taskIssueKey: result.issue.key });
            } else {
                swal(
                    'Heeey..',
                    result.message,
                    'error'
                );
            }
        });

        processTask.on('end', () => {
            this.setState({
                tasksAddingRemaining: 0
            });
        });
    }

    componentWillMount () {
        if (!this.state.binded) {
            this.setState({ binded: true, test: 1 });

            window.__events.on('drop', this.onDropAndPaste);
            window.__events.on('paste', this.onDropAndPaste);

            const oneMinute = 1000 * 60;
            this.elapsedTimeInterval = setInterval(this.updateElapsedTime, oneMinute);
        }
    }

    componentDidMount () {
        // this.initRemoteSync();
    }

    componentWillUnmount () {
        window.__events.off('drop', this.onDropAndPaste);
        window.__events.off('paste', this.onDropAndPaste);
        clearInterval(this.elapsedTimeInterval);
    }

    initRemoteSync () {
        if (!ws && this.props.isLoggedIn) {
            this.setState({
                wsConnecting: true
            });

            ws = new WebSocket('ws://' + location.hostname + ':8080');
            ws.onopen = () => {

                this.setState({
                    wsConnecting: false,
                    showWsConnected: true
                });

                ws.onmessage = (message) => {

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
                        }
                    }
                }

                store.subscribe(() => {

                    // TODO: do not send data again if we just received it
                    const state = store.getState();

                    /**
                     * The local syncId is equal to the state syncId. This means that the change origin
                     * is local and we should push the changes to the server
                    **/
                    if (state.app.syncId === syncId) {
                        console.log('Send updates to server!');
                        syncId = Date.now();
                        state.app.syncId = syncId;

                        // Send update to server
                        ws.send(JSON.stringify(state));
                    } else {
                        /**
                         * Since the syncIds do not match, it means that the change origin was the server
                         * and we should not send this back to the server
                        **/
                        syncId = state.app.syncId;
                    }
                });
            }
        } else {
            setTimeout(() => this.initRemoteSync(), 1000);
        }
    }

    onDropAndPaste ({ url, text }) {
        if (this.props.isLoggedIn) {

            const taskKeys = extractIssueKeysFromText(url || text);

            if (!!taskKeys.length) {

                processTask.add(taskKeys);

                const remaining = processTask.getRemaining();
                this.setState({
                    tasksAddingRemaining: remaining,
                    tasksAtStart: remaining
                });
            }
        } else {
            swal(
                'Heeey..',
                'Hey dude, you are not logged in. How do you expect me to validate your shit?',
                'error'
            );
        }
    }

    updateElapsedTime () {
        const { record } = this.props.recorder;

        if (record) {
            this.props.updateRecordElapsed({
                cuid: record.cuid
            });
        }
    }

    render () {

        if (!this.props.isLoggedIn) {
            return null;
        }

        let notifications = [];

        const { tasksAddingRemaining, tasksAtStart, showWsConnected, wsConnecting } = this.state;

        if (tasksAddingRemaining) {
            if (tasksAddingRemaining > 10) {
                notifications.push((
                    <div className='notification'>
                        {
                            `Wow dude! ${tasksAtStart} tasks?
                            You must be crazy busy!
                            Take a well deserved break while I'm setting this up (${tasksAddingRemaining}
                            more to go)...`
                        }
                    </div>
                ));
            } else {
                if (tasksAtStart > 10) {
                    notifications.push((
                        <div className='notification'>
                            {`Allright man. Only ${tasksAddingRemaining} more...`}
                        </div>
                    ));
                } else {
                    notifications.push((
                        <div className='notification'>
                            {
                                `Yo dude!
                                I'm real busy trying to add ${tasksAddingRemaining}
                                ${tasksAddingRemaining > 1 ? 'tasks' : 'task'}...`
                            }
                        </div>
                    ));
                }
            }
        }

        if (wsConnecting) {
            notifications.push(<div className='notification'>Connecting to remote sync...</div>);
        }
        if (showWsConnected) {
            notifications.push(<div className='notification'>Connected!</div>);
        }

        if (!!notifications.length) {
            return (
                <div className='recorder recorder--show'>
                    {notifications}
                </div>
            );
        }

        return <div className='recorder' />;
    }
}

