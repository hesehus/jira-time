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

    const { records, focusOnRecordCommentCuid } = this.props;

    let recordItems = records.map((record) => {
      const autofocus = focusOnRecordCommentCuid === record.cuid;
      return <RecordItem recordCuid={record.cuid} record={record} key={record.cuid} autofocus={autofocus} />;
    });

    return (
      <div className='records'>
        {recordItems}
      </div>
    );
  }
}
