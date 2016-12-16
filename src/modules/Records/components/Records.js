import React, { Component, PropTypes } from 'react';

import RecordItem from 'modules/RecordItem';

import './Records.scss';

export default class Records extends Component {

  static propTypes = {
    records: PropTypes.array.isRequired,
    activeRecord: PropTypes.object,
    focusOnRecordCommentCuid: PropTypes.any
  }

  render () {

    const { records } = this.props;

    return (
      <div className='records'>
        {records.map((record) => <RecordItem recordCuid={record.cuid} record={record} key={record.cuid} />)}
      </div>
    );
  }
}
