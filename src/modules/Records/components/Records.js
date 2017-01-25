import React, { Component, PropTypes } from 'react';

import RecordItem from 'modules/RecordItem';

import './Records.scss';

export default class Records extends Component {

    static propTypes = {
        records: PropTypes.array.isRequired,
        activeRecord: PropTypes.object,
        focusOnRecordCommentCuid: PropTypes.any,
        taskIndex: PropTypes.number
    }

    render () {

        const { records, taskIndex } = this.props;

        if (!records.length) {
            return null;
        }

        return (
            <div className='records'>
                {records.map((record, i) => (
                    <RecordItem
                      recordCuid={record.cuid}
                      record={record}
                      key={record.cuid}
                      taskIndex={taskIndex}
                      recordIndex={i}
                    />
                ))}
            </div>
        );
    }
}
