import React, { Component, PropTypes } from 'react';

import Loader from 'modules/Loader';

import AddButton from 'assets/add-button.svg';
import RecordIcon from 'assets/record.svg';
import RefreshIcon from 'assets/refresh.svg';
import RecordModel from 'store/models/RecordModel';
import { refreshJiraIssue } from 'shared/taskHelper';
import './RecordActionButtons.scss';

export default class RecordActionButtons extends Component {

    static propTypes = {
        profile: PropTypes.object.isRequired,
        task: PropTypes.object,
        addRecord: PropTypes.func.isRequired,
        startRecording: PropTypes.func.isRequired,
        onRemainingUpdated: PropTypes.func
    }

    constructor (props) {
        super(props);

        this.onIssueRefreshClick = this.onIssueRefreshClick.bind(this);
        this.onStartPassiveLogClick = this.onStartPassiveLogClick.bind(this);
        this.onStartActiveLogClick = this.onStartActiveLogClick.bind(this);
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

        const { task, profile } = this.props;
        const { compactView } = profile.preferences;

        let issueIsClosed = false;
        if (task) {
            const { statusCategory } = task.issue.fields.status;
            if (statusCategory) {
                issueIsClosed = task.issue.fields.status.statusCategory.key === 'done';
            }
        }

        let refreshElement;
        if (task) {
            if (task.issueRefreshing) {
                refreshElement = (
                    <span className='record-action-buttons-btn record-action-buttons-btn--loader'>
                        <span className='record-action-buttons-small-icon'>
                            <Loader
                              size={compactView ? 'tiny' : 'small'}
                              width={compactView ? '13px' : '20px'}
                              height={compactView ? '13px' : '20px'}
                            />
                        </span>
                    </span>
                );
            } else {
                refreshElement = (
                    <button className='record-action-buttons-btn'
                      title='Click to refresh the JIRA issue'
                      onClick={this.onIssueRefreshClick}
                      tabIndex='-1'
                    >
                        <img src={RefreshIcon}
                          className='record-action-buttons-small-icon'
                          alt='Refresh' />
                    </button>
                );
            }
        }

        const btnClass = 'record-action-buttons-btn';

        return (
            <div className='record-action-buttons'>
                {refreshElement}
                <button
                  className={btnClass + (issueIsClosed ? ` ${btnClass}--disabled` : '')}
                  tabIndex='-1'
                  title={issueIsClosed ? 'Issue is closed, dude' : 'Add a worklog'}
                  disabled={issueIsClosed}
                  onClick={this.onStartPassiveLogClick}>
                    <img src={AddButton}
                      className='record-action-buttons-small-icon record-action-buttons-small-icon--add-passive'
                      alt='Plus'
                    />
                </button>
                <button
                  className={btnClass + (issueIsClosed ? ` ${btnClass}--disabled` : '')}
                  tabIndex='-1'
                  title={issueIsClosed ? 'Issue is closed, dude' : 'Start new worklog'}
                  disabled={issueIsClosed}
                  onClick={this.onStartActiveLogClick}>
                    <img src={RecordIcon}
                      className='record-action-buttons-start-new'
                      alt='Record' />
                </button>
            </div>
        );
    }
}
