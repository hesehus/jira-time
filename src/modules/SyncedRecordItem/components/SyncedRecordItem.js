import moment from 'moment';
import React, { Component, PropTypes } from 'react';

// import './SyncedRecordItem.scss';

export default class SyncedRecordItem extends Component {

  static propTypes = {
    record: PropTypes.object.isRequired
  }

  render () {
    const { record } = this.props;

    const startTime = moment(record.started);
    const endTime = moment(record.started).add(record.timeSpentSeconds, 'seconds');

    return (
      <tr>
        <td>{record.issueKey}</td>
        <td>{startTime.format('HH:mm')}</td>
        <td>{endTime.format('HH:mm')}</td>
        <td>{record.comment}</td>
      </tr>
    );
  }
}
