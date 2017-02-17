import React, { Component, PropTypes } from 'react';
import { default as swal } from 'sweetalert2';

import Records from 'modules/Records';
import RecordActionButtons from 'modules/RecordActionButtons';
import { updateRemainingEstimate } from 'shared/taskHelper';
import DeleteIcon from 'assets/delete.svg';
import './TaskItem.scss';

let focusingOnRemaining = false;

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

        this.onRemainignChange = this.onRemainignChange.bind(this);
        this.onRemainignBlur = this.onRemainignBlur.bind(this);
        this.setRemainingInputValue = this.setRemainingInputValue.bind(this);
        this.onRemoveClick = this.onRemoveClick.bind(this);

        this.state = {};
    }

    componentWillUpdate () {
        if (this.props.task && this.props.task.issue) {
            this.setRemainingInputValue(this.props.task.issue.fields.timetracking.remainingEstimate);
        }
    }

    setRemainingInputValue (remaining = '') {
        if (!focusingOnRemaining) {
            const remInp = this.refs.inputRemaining;
            if (remInp && remInp.value !== remaining) {
                remInp.value = remaining;
            }
        }
    }

    onRemainignFocus (e) {
        focusingOnRemaining = true;
    }

    onRemainignChange (e) {

        const remainingEstimate = e.target.value;

        const { task } = this.props;

        this.props.setIssueRemainingEstimate({
            cuid: task.cuid,
            remainingEstimate
        });
    }

    onRemainignBlur (e) {

        focusingOnRemaining = false;

        const remainingEstimate = e.target.value;

        const { task } = this.props;

        updateRemainingEstimate({
            taskCuid: task.cuid,
            taskIssueKey: task.issue.key,
            remainingEstimate
        });
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

        const { task, movingRecord, movingTask, index, records, numberOfRecordsWithNoIssue } = this.props;
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

        let remainingEstimate = task.issue.fields.timetracking.remainingEstimate;
        if (!remainingEstimate || remainingEstimate === 'undefined') {
            remainingEstimate = null;
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
                        <div className='task-item__remaining'>
                            <input className='task-item__remaining-input'
                              value={remainingEstimate || ''}
                              onFocus={this.onRemainignFocus}
                              onChange={this.onRemainignChange}
                              onBlur={this.onRemainignBlur}
                              ref='inputRemaining'
                              disabled={!!somethingIsMoving}
                              title='Remaining estimate'
                              tabIndex='-1'
                            />
                        </div>
                        <RecordActionButtons task={task} onRemainingUpdated={this.setRemainingInputValue} />
                    </div>
                </div>
                {recordsOutput}
            </div>
        );
    }
}

export default TaskItem;
