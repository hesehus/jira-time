import React, { Component, PropTypes } from 'react';
import './TaskItemRecord.scss';

export class TaskItemRecord extends Component {

  static propTypes = {
    record: PropTypes.object.isRequired
  }

  render () {

    const { record } = this.props;
    const t = new Date(record.startTime);
    
    return (
      <div className='task-item-record'>
        <span className='task-item-record__startTime'>{t.toLocaleString()}</span>
      </div>
    );
  }
}

export default TaskItemRecord;
