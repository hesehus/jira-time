import moment from 'moment';
import React, { Component, PropTypes } from 'react';

import { getWorkLogs } from 'shared/jiraClient';
import HistoryRecordItem from 'modules/HistoryRecordItem';
import HistorySpaceItem from 'modules/HistorySpaceItem';
import { getElapsedTime } from 'store/reducers/recorder';

import Loader from 'modules/Loader';

import './Summary.scss';

export default class Summary extends Component {

    static get propTypes () {
        return {
            profile: PropTypes.object.isRequired,
            notSyncedRecords: PropTypes.array.isRequired,
            activeRecord: PropTypes.object
        }
    }

    constructor (props) {
        super(props);

        this.state = {
            loading: true
        };

        this.onSyncedChange = this.onSyncedChange.bind(this);
        this.onSyncedSynced = this.onSyncedSynced.bind(this);
        this.onNotSyncedSynced = this.onNotSyncedSynced.bind(this);
    }

    componentDidMount () {

        const startDate = moment().second(0).minute(0).hour(0);
        const endDate = moment().second(0).minute(0).hour(0).add(1, 'days');

        getWorkLogs({
            startDate,
            endDate,
            username: this.props.profile.username
        })
        .then(records => this.setState({ loading: false, records }))
        .catch(() => this.setState({ loading: false, error: 'Could not get worklogs' }));
    }

    onSyncedChange (recordInfo, recordIsDirty) {

        const { records } = this.state;

        // Get the updated item
        const recordIndex = records.findIndex(r => r.cuid === recordInfo.cuid);
        const record = Object.assign({}, records[recordIndex]);
        record.startTime = recordInfo.startTime;
        record.endTime = recordInfo.endTime;
        record.isDirty = recordIsDirty;

        this.setState({
            records: [...records.slice(0, recordIndex), record, ...records.slice(recordIndex + 1)]
        });
    }

    onSyncedSynced (recordInfo) {
        const { records } = this.state;

        // Get the updated item
        const recordIndex = records.findIndex(r => r.cuid === recordInfo.cuid);
        const record = Object.assign({}, records[recordIndex]);
        record.isDirty = false;

        this.setState({
            records: [...records.slice(0, recordIndex), record, ...records.slice(recordIndex + 1)]
        });
    }

    /**
    * Since not synced records will dissapear from the redux state,
    * we need to adde them manually here at some point
    **/
    onNotSyncedSynced ({ record, worklog }) {

        // Since the not synced record will disappear from the redux state, we need to add it manually here
        const newRecord = {
            ...record,
            id: worklog.id,
            created: worklog.created,
            updated: worklog.updated
        };

        this.setState({
            records: [...this.state.records, newRecord]
        });
    }

    render () {

        const { loading, records } = this.state;
        let { notSyncedRecords, activeRecord } = this.props;

        if (!records || loading) {
            return (
                <div className='summary summary--loading'>
                    <Loader />
                </div>
            );
        }

        if (records && records.length === 0 && notSyncedRecords.length === 0) {
            return (
                <div className='summary summary--no-found'>
                    No worklogs found today
                </div>
            );
        }

        // Filter out active record
        if (activeRecord) {
            notSyncedRecords = notSyncedRecords.filter(r => r.cuid !== activeRecord.cuid);
        }

        // Combine the synced and not synced records
        let outputRecords = [...notSyncedRecords, ...records];
        if (activeRecord) {
            outputRecords.push(Object.assign({}, activeRecord, { active: true }));
        }

        // Momentify
        outputRecords.forEach((r) => {
            r.startTime = moment(r.startTime);
            r.endTime = moment(r.endTime);
        });

        // Sort by time started
        outputRecords = outputRecords.sort((a, b) => a.startTime.unix() - b.startTime.unix());

        // Calculate duration
        let duration = moment.duration();
        outputRecords.forEach((r) => {
            duration.add(r.endTime.unix() - r.startTime.unix(), 'seconds');
        });

        // Compose list with empty spaces within
        const outputItems = [];
        outputRecords.forEach((record, index) => {
            const prev = outputRecords[index - 1];
            if (prev) {

                // Consider everything over 1m as a space
                const duration = record.startTime.unix() - prev.endTime.unix();
                if (duration > 59) {
                    const elapsedTime = getElapsedTime({
                        startTime: prev.endTime,
                        endTime: record.startTime
                    });
                    outputItems.push(<HistorySpaceItem key={index} elapsedTime={elapsedTime} />);
                }
            }

            outputItems.push((
                <HistoryRecordItem
                  key={record.cuid}
                  record={record}
                  onSyncedChange={this.onSyncedChange}
                  onSyncedSynced={this.onSyncedSynced}
                  onNotSyncedSynced={this.onNotSyncedSynced}
                />
            ));
        });

        return (
            <div className='summary'>
                <table className='summary-table'>
                    <tbody>
                        {outputItems}
                    </tbody>
                </table>
                <div className='summary-total'>Total: {duration.hours()}h {duration.minutes()}m</div>
            </div>
        );
    }
}
