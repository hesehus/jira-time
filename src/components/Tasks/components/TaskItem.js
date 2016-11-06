import React, { Component, PropTypes } from 'react';
import TaskItemRecord from '../containers/TaskItemRecord';
import RecordModel from '../../Recorder/modules/RecordModel';

import { getIssue } from '../../../shared/jiraClient';

import LoadingIcon from '../../../assets/loading.svg';

import './TaskItem.scss';

export class TaskItem extends Component {

  static get propTypes () {
    return {
      task: PropTypes.object.isRequired,
      records: PropTypes.array.isRequired,
      removeTask: PropTypes.func.isRequired,
      startRecording: PropTypes.func.isRequired,
      refreshIssue: PropTypes.func.isRequired,
      setIssueRefreshing: PropTypes.func.isRequired
    };
  }

  constructor (props) {
    super(props);

    this.onRemoveClick = this.onRemoveClick.bind(this);
    this.onLogClick = this.onLogClick.bind(this);
    this.onRemainingClick = this.onRemainingClick.bind(this);
  }

  onRemoveClick () {
    this.props.removeTask({ cuid: this.props.task.cuid });
  }

  onLogClick () {
    const { task } = this.props;

    this.props.startRecording({
      task,
      record: RecordModel({ task })
    });
  }

  onRemainingClick () {
    const { task } = this.props;

    this.props.setIssueRefreshing({
      cuid: task.cuid,
      refreshing: true
    });

    getIssue({
      id: task.issue.key
    })
    .then((issue) => {
      this.props.refreshIssue({
        cuid: task.cuid,
        issue
      });
    });
  }

  render () {

    const { task } = this.props;

    // Get the records for this task
    let records = [];
    this.props.records.forEach(record => {
      if (record.taskCuid === task.cuid) {
        records.push(record);
      }
    });

    let issueInfoAtEnd;

    if (task.issue) {

      if (task.issue.errorMessages && task.issue.errorMessages.length > 0) {
        return (
          <div className='task-item task-item--errors'>
            <div className='task-item-info'>
              <button className='task-item__remove' onClick={this.onRemoveClick}>x</button>
              <span className='task-item__summary'>
                {task.issue.errorMessages.map((e, i) => <div key={i}>{e}</div>)}
              </span>
            </div>
            <div className='task-item-records'>
              {records.map((record, index) => (<TaskItemRecord recordCuid={record.cuid} record={record} key={index} />))}
            </div>
          </div>
        );
      }

      issueInfoAtEnd = (
        <span className='task-item__info'
          title='Click to refresh the remaining estimate, yo!'
          onClick={this.onRemainingClick}
        >{task.issue.fields.timetracking.remainingEstimate}</span>
      );
    }
    if (task.issueRefreshing) {
      issueInfoAtEnd = (
        <span className='task-item__info'>
          <img src={LoadingIcon} alt='Loading' className='task-item__loading' />
        </span>
      );
    }

    // Output the list of tasks
    return (
      <div className='task-item'>
        <div className='task-item-info'>
          <button className='task-item__remove' onClick={this.onRemoveClick}>x</button>
          <span className='task-item__key'>{task.issue.key}</span>
          <span className='task-item__summary'>{task.issue.fields.summary}</span>
          {issueInfoAtEnd}
          <button className='task-item__log' onClick={this.onLogClick}>+</button>
        </div>
        <div className='task-item-records'>
          {records.map((record, index) => (<TaskItemRecord recordCuid={record.cuid} record={record} key={index} />))}
        </div>
      </div>
    );
  }
}

export default TaskItem;
