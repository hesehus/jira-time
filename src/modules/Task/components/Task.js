import React, { Component, PropTypes } from 'react';
import { default as swal } from 'sweetalert2';

import config from 'shared/config.json';

import Records from 'modules/Records';
import RecordActionButtons from 'modules/RecordActionButtons';
import DeleteIcon from 'assets/delete.svg';
import TimeTrackingInfo from './TimeTrackingInfo';

import './Task.scss';

export default class Task extends Component {
    static get propTypes() {
        return {
            task: PropTypes.object.isRequired,
            setIssueRemainingEstimate: PropTypes.func.isRequired,
            movingRecord: PropTypes.object,
            movingTask: PropTypes.object,
            removeTask: PropTypes.func.isRequired,
            records: PropTypes.array
        };
    }

    constructor(props) {
        super(props);

        this.onRemoveClick = this.onRemoveClick.bind(this);

        this.state = {};
    }

    onRemoveClick() {
        const { records, removeTask, task } = this.props;

        if (records.length > 0) {
            let worklogName = records.length === 1 ? 'worklog' : 'worklogs';
            swal({
                title: 'Hold on dude! Are you sure?',
                text: `You have ${records.length} ${worklogName} on this task`,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, get rid of it all!',
                cancelButtonText: 'Shit, NO!'
            })
                .then(function() {
                    removeTask({ cuid: task.cuid });
                })
                .catch(() => {
                    // No? Good thing we asked this question then =)
                });
        } else {
            removeTask({ cuid: task.cuid });
        }
    }

    render() {
        const { task, movingRecord, movingTask, records, setIssueRemainingEstimate } = this.props;

        let className = 'task';
        if (movingRecord && movingRecord.taskDroppableCuid === task.cuid) {
            className += ' task--drop-active';
        }

        const deleteButton = (
            <button
                tabIndex="-1"
                type="button"
                className="task-delete"
                title="Remove task"
                onClick={this.onRemoveClick}
            >
                <img src={DeleteIcon} alt="Delete" className="task-delete-icon" />
            </button>
        );

        // There are errors with the task. Display that instead of issue info
        if (task.issue.errorMessages && task.issue.errorMessages.length > 0) {
            return (
                <div className="task task--errors">
                    {deleteButton}
                    <div className="task-info">
                        <span className="task__summary">
                            {task.issue.errorMessages.map((e, i) => (
                                <div key={i}>{e}</div>
                            ))}
                        </span>
                    </div>
                    <Records records={records} />
                </div>
            );
        }

        const status = task.issue.fields.status ? (
            <span className="task__status">{task.issue.fields.status.name}</span>
        ) : null;

        const somethingIsMoving = !!movingRecord || !!movingTask;

        console.log(task);

        // Output the task
        return (
            <div className={className} data-cuid={task.cuid} data-taskissuekey={task.issue ? task.issue.key : null}>
                {deleteButton}
                <div className="task__info">
                    <div className="task__left">
                        <div className="task__key-and-status">
                            <a
                                className="task__link"
                                href={config.serverPath + '/browse/' + task.issue.key}
                                target="_blank"
                                tabIndex="-1"
                            >
                                {task.issue.key}
                            </a>

                            {task.issue.epic ? (
                                <a
                                    className="task__link task__link--epic"
                                    href={config.serverPath + '/browse/' + task.issue.epic.key}
                                    target="_blank"
                                    tabIndex="-1"
                                >
                                    EPIC: {task.issue.epic.fields.customfield_10007} ({task.issue.epic.key})
                                </a>
                            ) : (
                                ''
                            )}

                            {status}
                        </div>
                        <div className="task__summary" title={task.issue.fields.summary}>
                            {task.issue.fields.summary}
                        </div>
                    </div>
                    <div className="task__right">
                        <TimeTrackingInfo
                            task={task}
                            somethingIsMoving={somethingIsMoving}
                            setIssueRemainingEstimate={setIssueRemainingEstimate}
                        />
                        <RecordActionButtons task={task} onRemainingUpdated={this.setRemainingInputValue} />
                    </div>
                </div>
                <Records records={records} />
            </div>
        );
    }
}
