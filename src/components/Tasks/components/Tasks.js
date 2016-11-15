import React, { Component, PropTypes } from 'react';

import TaskItemRecord from '../containers/TaskItemRecord';

import './Tasks.scss';

import lazyDog from './assets/lazy-dog.jpg';
import TaskItem from '../containers/TaskItem';

export class TasksView extends Component {

  static propTypes = {
    tasks: PropTypes.array.isRequired,
    movingRecord: PropTypes.object,
    recordsWithNoIssue: PropTypes.array.isRequired
  }

  render () {

    const { tasks, movingRecord, recordsWithNoIssue } = this.props;

    let textInLimbo;
    switch (recordsWithNoIssue.length) {
      case 0 : {
        textInLimbo = 'Hurray! No work logs in limbo';
        break;
      }
      case 1 : {
        textInLimbo = 'Just one work log in limbo';
        break;
      }
      case 2 :
      case 3 :
      case 4 : {
        textInLimbo = `${recordsWithNoIssue.length} work logs in limbo`;
        break;
      }
      default : {
        textInLimbo = `Oh dear. You have ${recordsWithNoIssue.length} work logs in limbo`;
        break;
      }
    }

    let classNameRecordsNoIssue = 'records records--no-issue';

    if (movingRecord && !movingRecord.taskDroppableCuid) {
      classNameRecordsNoIssue += ' records--drop-active';
    }

    // Tell the user to start working
    if (tasks.length === 0 && recordsWithNoIssue.length === 0) {
      return (
        <div className='tasks-outer'>
          <div className='tasks tasks--no-tasks'>
            <div>You have not added any tasks, you lazy dog.</div>
            <img className='tasks__lazy-dog' src={lazyDog} alt='Lazy dog' />
          </div>
        </div>
      );
    }

    // Output the list of tasks
    return (
      <div className='tasks-outer'>
        <div className={classNameRecordsNoIssue}>
          <div className='records-header'>{textInLimbo}</div>
          {recordsWithNoIssue.map((record) => (
            <TaskItemRecord recordCuid={record.cuid} record={record} key={record.cuid} />
          ))}
        </div>
        <div className='tasks'>
          {tasks.map((task, index) => <TaskItem key={index} task={task} />)}
        </div>
      </div>
    );
  }
}

export default TasksView;
