import React, { Component, PropTypes } from 'react'
import { default as swal } from 'sweetalert2'

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
            isLoggedIn: PropTypes.bool.isRequired
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

    componentWillUnmount () {
        window.__events.off('drop', this.onDropAndPaste);
        window.__events.off('paste', this.onDropAndPaste);
        clearInterval(this.elapsedTimeInterval);
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

        const { tasksAddingRemaining, tasksAtStart } = this.state;
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

