import moment from 'moment';
import React, { Component, PropTypes } from 'react';

// import './HistoryRecordItem.scss';

export default class HistoryRecordItem extends Component {

  static propTypes = {
    record: PropTypes.object.isRequired
  }

  render () {
    const { record } = this.props;

    const startTime = moment(record.startTime);
    const endTime = moment(record.endTime);

    return (
      <tr>
        <td>{record.taskIssueKey}</td>
        <td>{startTime.format('HH:mm')}</td>
        <td>{endTime.format('HH:mm')}</td>
        <td>{record.elapsedTime}</td>
        <td>{record.comment}</td>
      </tr>
    );
  }
}
