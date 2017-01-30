import React, { Component, PropTypes } from 'react';
import { default as swal } from 'sweetalert2';

import LoadingIcon from 'assets/loading.svg';
import PlusIcon from 'assets/plus.svg';
import RecordIcon from 'assets/record.svg';
import RefreshIcon from 'assets/refresh.svg';
import RecordModel from 'store/models/RecordModel';
import { refreshJiraIssue } from 'shared/taskHelper';
import './RecordActionButtons.scss';

export default class RecordActionButtons extends Component {

    static propTypes = {
        task: PropTypes.object,
        addRecord: PropTypes.func.isRequired,
        startRecording: PropTypes.func.isRequired,
        removeTask: PropTypes.func.isRequired,
        refreshIssue: PropTypes.func.isRequired,
        setIssueRefreshing: PropTypes.func.isRequired,
        onRemainingUpdated: PropTypes.func,
        numberOfRecords: PropTypes.number
    }

    constructor (props) {
        super(props);

        this.onRemoveClick = this.onRemoveClick.bind(this);
        this.onIssueRefreshClick = this.onIssueRefreshClick.bind(this);
        this.onStartPassiveLogClick = this.onStartPassiveLogClick.bind(this);
        this.onStartActiveLogClick = this.onStartActiveLogClick.bind(this);
    }

    onRemoveClick () {
        const { numberOfRecords, removeTask, task } = this.props;

        if (numberOfRecords > 0) {
            let worklogName = numberOfRecords === 1 ? 'worklog' : 'worklogs';
            swal({
                title: 'Wow dude! Are you sure?',
                text: `You have ${numberOfRecords} ${worklogName} on this task`,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, get rid of it all!'
            }).then(function () {
                removeTask({ cuid: task.cuid });
            }).catch(() => {
                // Ah, good thing we asked this question then =)
            });
        } else {
            removeTask({ cuid: task.cuid });
        }
    }

    onStartPassiveLogClick () {
        const { task } = this.props;

        const startTime = new Date();
        const endTime = new Date();
        endTime.setMinutes(endTime.getMinutes() + 1);

        const record = RecordModel({
            task,
            startTime,
            endTime
        });

        this.props.addRecord({
            task,
            record
        });
    }

    onStartActiveLogClick () {
        const { task } = this.props;

        const record = RecordModel({ task });

        this.props.startRecording({
            task,
            record
        });
    }

    onIssueRefreshClick () {
        const { task, onRemainingUpdated } = this.props;

        refreshJiraIssue({
            taskCuid: task.cuid,
            taskIssueKey: task.issue.key
        })
        .then((issue) => {
            if (onRemainingUpdated) {
                onRemainingUpdated(issue.fields.timetracking.remainingEstimate);
            }
        });
    }

    render () {

        const { task } = this.props;

        let iconToUserForRefresh = RefreshIcon;
        if (task && task.issueRefreshing) {
            iconToUserForRefresh = LoadingIcon;
        }

        let actionsForTaskWithIssue = [];
        if (task) {
            actionsForTaskWithIssue = [
                <span className='record-action-buttons__log record-action-buttons__log--refresh'
                  title='Click to refresh the JIRA issue'
                  onClick={this.onIssueRefreshClick}>
                    <img src={iconToUserForRefresh}
                      className='record-action-buttons__log-icon record-action-buttons__log-icon--refresh'
                      alt='Refresh' />
                </span>,
                <button className='task-item__remove record-action-buttons__log record-action-buttons__log--remove'
                  onClick={this.onRemoveClick}>
                    <img src={PlusIcon} className='record-action-buttons__log-icon' alt='Remove' />
                </button>
            ];
        }

        return (
            <div className='record-action-buttons'>
                {actionsForTaskWithIssue}
                <button className='record-action-buttons__log'
                  title='Add a worklog'
                  onClick={this.onStartPassiveLogClick}>
                    <img src={PlusIcon} className='record-action-buttons__log-icon' alt='Plus' />
                </button>
                <button className='record-action-buttons__log'
                  title='Start new worklog'
                  onClick={this.onStartActiveLogClick}>
                    <img src={RecordIcon}
                      className='record-action-buttons__log-icon record-action-buttons__log-icon--record'
                      alt='Record' />
                </button>
            </div>
        );
    }
}
