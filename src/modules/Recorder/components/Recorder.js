import React, { Component, PropTypes } from 'react'
import { Notification } from 'react-notification';
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

        this.state = {
            addingTasksFromDropOrPaste: processTask.getRemaining()
        };

        this.onDropAndPaste = this.onDropAndPaste.bind(this);
        this.updateElapsedTime = this.updateElapsedTime.bind(this);

        processTask.on('add', (result) => {
            this.setState({
                addingTasksFromDropOrPaste: processTask.getRemaining()
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
                addingTasksFromDropOrPaste: 0
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

                this.setState({
                    addingTasksFromDropOrPaste: processTask.getRemaining()
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

        let notifications;
        const num = this.state.addingTasksFromDropOrPaste;
        if (num) {
            const options = {
                isActive: true,
                dismissAfter: 999999,
                message: `Yo, hold on. I'm real busy trying to add ${num} ${num > 1 ? 'tasks' : 'task'}`
            };
            notifications = <Notification {...options} />;
        }

        return (
            <div className='recorder recorder--show'>
                {notifications}
            </div>
        )
    }
}

