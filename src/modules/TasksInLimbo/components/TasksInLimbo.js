import React, { Component, PropTypes } from 'react';

import Records from 'modules/Records';
import RecordActionButtons from 'modules/RecordActionButtons';

import './TasksInLimbo.scss';

export default class TasksInLimbo extends Component {

    static propTypes = {
        movingRecord: PropTypes.object,
        recordsWithNoIssue: PropTypes.array.isRequired
    }

    render () {

        const { movingRecord, recordsWithNoIssue } = this.props;

        let textInLimbo;
        switch (recordsWithNoIssue.length) {
        case 0 : {
            textInLimbo = 'No work logs in limbo!';
            break;
        }
        case 1 : {
            textInLimbo = 'Just one work log in limbo';
            break;
        }
        case 2 :
        case 3 :
        case 4 : {
            textInLimbo = `${recordsWithNoIssue.length} work logs in limbo`;
            break;
        }
        default : {
            textInLimbo = `Oh dear. You have ${recordsWithNoIssue.length} work logs in limbo`;
            break;
        }
        }

        let className = 'task-item task-item--limbo';
        if (movingRecord && !movingRecord.taskDroppableCuid) {
            className += ' task-item--drop-active';
        }

        // Output the list of tasks
        return (
            <div>
                <div className={className}>
                    <div className='task-item--limbo-header'>
                        {textInLimbo}
                        <RecordActionButtons />
                    </div>
                    <Records records={recordsWithNoIssue} taskIndex={0} />
                </div>
            </div>
        );
    }
}
