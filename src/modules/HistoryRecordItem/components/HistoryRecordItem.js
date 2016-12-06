import moment from 'moment';
import React, { Component, PropTypes } from 'react';

import { getElapsedTime } from 'store/reducers/recorder';

// import './HistoryRecordItem.scss';

export default class HistoryRecordItem extends Component {

  static propTypes = {
    record: PropTypes.object.isRequired
  }

  render () {
    const { record } = this.props;

    const startTime = moment(record.startTime);
    const endTime = moment(record.endTime);

    const elapsedTime = record.elapsedTime || getElapsedTime({ startTime, endTime });

    return (
      <tr>
        <td>{record.taskIssueKey}</td>
        <td>{startTime.format('HH:mm')}</td>
        <td>{endTime.format('HH:mm')}</td>
        <td>{elapsedTime}</td>
        <td>{record.comment}</td>
      </tr>
    );
  }
}
