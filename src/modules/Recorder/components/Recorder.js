import React, { Component, PropTypes } from 'react'
import { default as swal } from 'sweetalert2'

import ws, { initWebsocketConnection } from 'shared/websocket';
import { extractIssueKeysFromText, addCurrentUserAsWatcher } from 'shared/jiraClient';
import ProcessTask from './ProcessTask';

import './Recorder.scss';

const processTask = new ProcessTask();

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
        this.onWsConnecting = this.onWsConnecting.bind(this);
        this.onWsConnected = this.onWsConnected.bind(this);
        this.onWsCloseOrError = this.onWsCloseOrError.bind(this);

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
        ws.on('connecting', this.onWsConnecting);
        ws.on('connected', this.onWsConnected);
        ws.on('closeOrError', this.onWsCloseOrError);
    }

    componentWillUnmount () {
        window.__events.off('drop', this.onDropAndPaste);
        window.__events.off('paste', this.onDropAndPaste);
        ws.off('connecting', this.onWsConnecting);
        ws.off('connected', this.onWsConnected);
        ws.off('closeOrError', this.onWsCloseOrError);
        clearInterval(this.elapsedTimeInterval);
    }

    onWsConnecting () {
        this.setState({
            wsConnecting: true,
            showWsConnected: false,
            wsClosed: false
        });
    }
    onWsConnected () {
        this.setState({
            wsConnecting: false,
            showWsConnected: true,
            wsClosed: false
        });
    }
    onWsCloseOrError () {
        this.setState({
            wsConnecting: false,
            showWsConnected: false,
            wsClosed: true
        });
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

        const {
            tasksAddingRemaining,
            tasksAtStart,
            showWsConnected,
            wsConnecting,
            wsClosed,
            wsError
        } = this.state;

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

        if (showWsConnected) {
            notifications.push(<div className='notification'>Connected!</div>);
        }
        if (wsConnecting) {
            notifications.push(<div className='notification'>Connecting to remote server...</div>);
        }
        // if (wsClosed) {
        //     notifications.push(<div className='notification'>Connection to remote server closed. Retrying...</div>);
        // }
        if (wsError || wsClosed) {
            notifications.push((
                <div className='notification'>
                    Could not connect to to remote server.
                    <u onClick={initWebsocketConnection}>Try again</u>
                </div>
            ));
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

