import React, { Component, PropTypes } from 'react';
import { default as swal } from 'sweetalert2';

import Records from 'modules/Records';
import RecordActionButtons from 'modules/RecordActionButtons';
import DeleteIcon from 'assets/delete.svg';
import TimeTrackingInfo from './TimeTrackingInfo';

import './TaskItem.scss';

export class TaskItem extends Component {

    static get propTypes () {
        return {
            task: PropTypes.object.isRequired,
            index: PropTypes.number,
            setIssueRemainingEstimate: PropTypes.func.isRequired,
            movingRecord: PropTypes.object,
            movingTask: PropTypes.object,
            removeTask: PropTypes.func.isRequired,
            records: PropTypes.array,
            numberOfRecordsWithNoIssue: PropTypes.number.isRequired
        };
    }

    constructor (props) {
        super(props);

        this.onRemoveClick = this.onRemoveClick.bind(this);

        this.state = {};
    }

    onRemoveClick () {

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
            }).then(function () {
                removeTask({ cuid: task.cuid });
            }).catch(() => {
                // No? Good thing we asked this question then =)
            });
        } else {
            removeTask({ cuid: task.cuid });
        }
    }

    render () {

        const { task,
            movingRecord,
            movingTask,
            index,
            records,
            numberOfRecordsWithNoIssue,
            setIssueRemainingEstimate
        } = this.props;

        let className = 'task-item';
        if (movingRecord && movingRecord.taskDroppableCuid === task.cuid) {
            className += ' task-item--drop-active';
        }

        const recordsOutput = <Records records={records} taskIndex={index + numberOfRecordsWithNoIssue} />;
        const deleteButton = (
            <button tabIndex='-1'
              type='button'
              className='task-item-delete'
              title='Delete work log'
              onClick={this.onRemoveClick}
            >
                <img src={DeleteIcon} alt='Delete' className='task-item-delete-icon' />
            </button>
        );

        // This task does have a JIRA issue
        if (task.issue) {

            // There are errors with the task. Display that instead of issue info
            if (task.issue.errorMessages && task.issue.errorMessages.length > 0) {
                return (
                    <div className='task-item task-item--errors'>
                        {deleteButton}
                        <div className='task-item-info'>
                            <span className='task-item__summary'>
                                {task.issue.errorMessages.map((e, i) => (<div key={i}>{e}</div>))}
                            </span>
                        </div>
                        {recordsOutput}
                    </div>
                );
            }
        }

        const status = (
            task.issue.fields.status
            ? <span className='task-item__status'>{task.issue.fields.status.name}</span>
            : null
        );

        const somethingIsMoving = !!movingRecord || !!movingTask;

        // Output the task
        return (
            <div className={className} data-cuid={task.cuid} data-taskissuekey={task.issue ? task.issue.key : null}>
                {deleteButton}
                <div className='task-item__info'>
                    <div className='task-item__left'>
                        <div className='task-item__key-and-status'>
                            <a className='task-item__link'
                              href={'/browse/' + task.issue.key}
                              target='_blank'
                              tabIndex='-1'
                            >
                                {task.issue.key}
                            </a>
                            {status}
                        </div>
                        <div className='task-item__summary' title={task.issue.fields.summary}>
                            {task.issue.fields.summary}
                        </div>
                    </div>
                    <div className='task-item__right'>
                        <TimeTrackingInfo
                          task={task}
                          somethingIsMoving={somethingIsMoving}
                          setIssueRemainingEstimate={setIssueRemainingEstimate}
                        />
                        <RecordActionButtons task={task} onRemainingUpdated={this.setRemainingInputValue} />
                    </div>
                </div>
                {recordsOutput}
            </div>
        );
    }
}

export default TaskItem;
