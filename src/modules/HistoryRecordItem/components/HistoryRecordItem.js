import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import TimeInput from 'time-input';

import config from 'shared/config.json';

import { getElapsedTime } from 'store/reducers/recorder';
import Sync from 'shared/sync';

import ExportIcon from 'assets/export.svg';
import LoadingIcon from 'assets/loading.svg';

import './HistoryRecordItem.scss';

export default class HistoryRecordItem extends Component {
    static propTypes = {
        record: PropTypes.object.isRequired,
        setRecordDate: PropTypes.func.isRequired,
        onSyncedChange: PropTypes.func.isRequired,
        onSyncedSynced: PropTypes.func.isRequired,
        onNotSyncedSynced: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.onStartTimeChange = this.onStartTimeChange.bind(this);
        this.onEndTimeChange = this.onEndTimeChange.bind(this);
        this.onSyncClick = this.onSyncClick.bind(this);

        this.state = {};

        this.originalRecord = Object.assign({}, props.record);
    }

    onStartTimeChange(time) {
        const { record } = this.props;

        const startTime = moment(record.startTime);
        const endTime = !record.active ? moment(record.endTime) : null;

        const vals = time.split(':');

        startTime.set('hours', vals[0]);
        startTime.set('minute', vals[1]);

        this.onChange({ startTime, endTime });
    }

    onEndTimeChange(time) {
        const { record } = this.props;

        const startTime = moment(record.startTime);
        const endTime = moment(record.endTime);

        const vals = time.split(':');

        endTime.set('hours', vals[0]);
        endTime.set('minute', vals[1]);

        this.onChange({ startTime, endTime });
    }

    onChange({ startTime, endTime }) {
        const recordInfo = {
            cuid: this.props.record.cuid,
            startTime: startTime.toDate(),
            endTime: endTime ? endTime.toDate() : null
        };

        // Un-synced item. Just update the redux state
        if (!this.isSynced()) {
            this.props.setRecordDate(recordInfo);
        } else {
            const isDirty =
                !moment(recordInfo.startTime).isSame(this.originalRecord.startTime) ||
                !moment(recordInfo.endTime).isSame(this.originalRecord.endTime);

            this.props.onSyncedChange(recordInfo, isDirty);
        }
    }

    onSyncClick() {
        const { record } = this.props;

        const syncer = new Sync({
            records: [record]
        });

        /**
         * This is already synced, and is not in our redux state.
         * We need to keep track of the state ourself here
         **/
        if (record.id) {
            this.setState({
                syncing: true
            });

            syncer.on('logSynced', () => {
                this.setState({
                    syncing: false
                });

                this.props.onSyncedSynced(record);
            });
        } else {
            syncer.on('logSynced', ({ worklog }) => {
                this.props.onNotSyncedSynced({ record, worklog });
            });
        }

        syncer.start();
    }

    isSynced() {
        return !!this.props.record.created;
    }

    canBeExported() {
        const { record } = this.props;

        return record.isDirty || (!this.isSynced() && !record.active);
    }

    render() {
        const { record } = this.props;

        const startTime = moment(record.startTime);

        const endTime = moment(record.endTime);
        const elapsedTime = record.elapsedTime || getElapsedTime({ startTime, endTime });

        const startTimeDisplay = (
            <TimeInput
                value={startTime.format('HH:mm')}
                className="date-inp__input date-inp__input--time"
                onChange={this.onStartTimeChange}
            />
        );

        let endTimeDisplay = endTime.format('HH:mm');
        if (this.isSynced() || !record.active) {
            endTimeDisplay = (
                <TimeInput
                    value={endTimeDisplay}
                    className="date-inp__input date-inp__input--time"
                    onChange={this.onEndTimeChange}
                />
            );
        }

        let className = 'history-record';
        if (this.canBeExported()) {
            className += ' history-record--can-be-exported';
        }

        let Icon = ExportIcon;
        if (record.syncing || this.state.syncing) {
            Icon = LoadingIcon;
        }

        let editWorklogLink = record.taskIssueKey;
        if (record.id) {
            editWorklogLink = (
                <a
                    href={
                        config.serverPath +
                        `/secure/UpdateWorklog!default.jspa?key=${record.taskIssueKey}&worklogId=${record.id}`
                    }
                    target="_blank"
                >
                    {record.taskIssueKey}
                </a>
            );
        }

        return (
            <tr className={className}>
                <td className="history-record-cell history-record-cell--issue-key">{editWorklogLink}</td>
                <td className="history-record-cell">{startTimeDisplay}</td>
                <td className="history-record-cell">{endTimeDisplay}</td>
                <td className="history-record-cell">{elapsedTime}</td>
                <td className="history-record-cell history-record-cell--comment">{record.comment}</td>
                <td className="history-record-cell">
                    <img src={Icon} alt="Export" onClick={this.onSyncClick} className="history-record-icon" />
                </td>
            </tr>
        );
    }
}
