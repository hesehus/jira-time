import React, { Component, PropTypes } from 'react';
import './TaskItemRecord.scss';

export class TaskItemRecord extends Component {

  static propTypes = {
    record: PropTypes.object.isRequired
  }

  render () {

    const { record } = this.props;

    const st = new Date(record.startTime);
    const et = new Date(record.endTime);

    return (
      <div className='task-item-record'>
        <span className='task-item-record__start-time'>{st.toLocaleString()}</span>
        <span className='task-item-record__end-time'>{et.toLocaleString()}</span>
      </div>
    );
  }
}

export default TaskItemRecord;
