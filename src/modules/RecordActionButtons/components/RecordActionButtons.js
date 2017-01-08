import React, { Component, PropTypes } from 'react';

import PlusIcon from 'assets/plus.svg';
import RecordModel from 'store/models/RecordModel';

import './RecordActionButtons.scss';

export default class RecordActionButtons extends Component {

    static propTypes = {
        task: PropTypes.object,
        addRecord: PropTypes.func.isRequired,
        startRecording: PropTypes.func.isRequired
    }

    constructor (props) {
        super(props);

        this.onStartPassiveLogClick = this.onStartPassiveLogClick.bind(this);
        this.onStartActiveLogClick = this.onStartActiveLogClick.bind(this);
    }

    onStartPassiveLogClick () {
        const { task } = this.props;

        const startTime = new Date();
        const endTime = new Date();
        endTime.setMinutes(endTime.getMinutes() + 1);

        const record = RecordModel({
            task,
            startTime,
            endTime
        });

        this.props.addRecord({
            task,
            record
        });
    }

    onStartActiveLogClick () {
        const { task } = this.props;

        const record = RecordModel({ task });

        this.props.startRecording({
            task,
            record
        });
    }

    render () {
        return (
            <div className='record-action-buttons'>
                <button className='record-action-buttons__log record-action-buttons__log--passive'
                  title='Add a worklog'
                  onClick={this.onStartPassiveLogClick}>
                    <img src={PlusIcon} className='record-action-buttons__log-icon' alt='Plus' />
                </button>
                <button className='record-action-buttons__log record-action-buttons__log--active'
                  title='Start new worklog'
                  onClick={this.onStartActiveLogClick}>
                    ●
                </button>
            </div>
        );
    }
}
