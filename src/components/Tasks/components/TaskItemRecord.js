import React, { Component, PropTypes } from 'react';
import './TaskItemRecord.scss';

export class TaskItemRecord extends Component {

  static propTypes = {
    record: PropTypes.object.isRequired
  }

  render () {

    const { record } = this.props;

    const st = new Date(record.startTime).toLocaleString();
    const et = record.endTime ? new Date(record.endTime).toLocaleString() : '';

    return (
      <div className='task-item-record'>
        <span className='task-item-record__start-time'>{st}</span>
        <span className='task-item-record__end-time'>{et}</span>
      </div>
    );
  }
}

export default TaskItemRecord;
