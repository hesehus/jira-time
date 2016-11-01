import React, { Component, PropTypes } from 'react';
import Elapsed from 'elapsed';

import './TaskItemRecord.scss';

export class TaskItemRecord extends Component {

  static propTypes = {
    record: PropTypes.object.isRequired
  }

  render () {

    const { record } = this.props;

    const startTime = new Date(record.startTime).toLocaleString();
    const endTime = record.endTime ? new Date(record.endTime).toLocaleString() : null;
    const elapsedTime = record.endTime ? new Elapsed(record.startTime, record.endTime).optimal : null;

    const className = record.syncing ? 'task-item-record task-item-record--syncing' : 'task-item-record';

    return (
      <div className={className}>
        <span className='task-item-record__start-time'>{startTime}</span>
        {record.endTime ? <span className='task-item-record__end-time'>{endTime}</span> : null}
        {record.endTime ? <span className='task-item-record__elapsed-time'>{elapsedTime}</span> : null}
      </div>
    );
  }
}

export default TaskItemRecord;
