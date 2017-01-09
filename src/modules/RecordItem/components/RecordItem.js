import React, { Component, PropTypes } from 'react';

import Sync from 'shared/sync';
import DateInput from 'modules/DateInput';

import ExportIcon from 'assets/export.svg';
import LoadingIcon from 'assets/loading.svg';

import './RecordItem.scss';

export default class RecordItem extends Component {

    static propTypes = {
        record: PropTypes.object.isRequired,
        recordCuid: PropTypes.string.isRequired,
        removeRecord: PropTypes.func.isRequired,
        setRecordDate: PropTypes.func.isRequired,
        setRecordComment: PropTypes.func.isRequired,
        setRecordMoving: PropTypes.func.isRequired,
        setRecordMoveTarget: PropTypes.func.isRequired,
        setRecordTask: PropTypes.func.isRequired,
        stopRecording: PropTypes.func.isRequired,
        activeRecord: PropTypes.object,
        movingRecord: PropTypes.object,
        autofocus: PropTypes.bool,
        movingTask: PropTypes.object
    }

    constructor (props) {
        super(props);

        this.onStartTimeChange = this.onStartTimeChange.bind(this);
        this.onEndTimeChange = this.onEndTimeChange.bind(this);
        this.onRemoveClick = this.onRemoveClick.bind(this);
        this.onCommentChange = this.onCommentChange.bind(this);
        this.onSyncClick = this.onSyncClick.bind(this);
        this.onStopRecordingClick = this.onStopRecordingClick.bind(this);

        this.state = {
            comment: ''
        };
    }

    componentWillMount () {
        this.setState({
            comment: this.props.record.comment
        });
    }

    componentDidMount () {
        const { record } = this.props;

        // Determine if the issue was just updated (less than 100ms ago)
        let justCreated = false;
        if (record.createdTime) {
            justCreated = (new Date() - new Date(record.createdTime)) < 100;
        }

        if (this.inputComment && justCreated) {
            this.inputComment.select();
            if (this.inputComment.scrollIntoViewIfNeeded) {
                this.inputComment.scrollIntoViewIfNeeded();
            } else {
                this.scrollIntoView();
            }
        }
    }

    componentWillReceiveProps (nextProps) {

        /**
        * We need to wrap this in a timeout since this callback will be fired multiple times
        * with old values first, which makes for a really weird user experience
        **/
        clearTimeout(this.willUpdateCommentTimeout);
        this.willUpdateCommentTimeout = setTimeout(() => {
            if (nextProps.record) {
                if (nextProps.record.comment !== this.state.comment) {
                    this.setState({
                        comment: nextProps.record.comment
                    });
                }
            }
        }, 0);
    }

    onStartTimeChange ({ date }) {
        this.props.setRecordDate({
            cuid: this.props.record.cuid,
            startTime: date,
            endTime: this.props.record.endTime
        });
    }

    onEndTimeChange ({ date }) {
        this.props.setRecordDate({
            cuid: this.props.record.cuid,
            startTime: this.props.record.startTime,
            endTime: date
        });
    }

    onCommentChange (e) {

        this.setState({
            comment: e.target.value
        });

        this.props.setRecordComment({
            cuid: this.props.record.cuid,
            comment: e.target.value
        });
    }

    onRemoveClick () {
        this.props.removeRecord({ cuid: this.props.record.cuid });
    }

    onStopRecordingClick () {
        this.props.stopRecording();
    }

    onSyncClick () {
        const syncer = new Sync({
            records: [this.props.record]
        });

        syncer.start();
    }

    render () {

        let { record, movingRecord, movingTask } = this.props;

        const somethingIsMoving = !!movingRecord || !!movingTask;

        let className = 'record';
        if (record.syncing) {
            className += ' record--syncing';
        }
        if (this.props.activeRecord && this.props.activeRecord.cuid === record.cuid) {
            className += ' record--active';
        }
        if (record.moving) {
            className += ' record--moving';
        }

        let btnSync;
        if (record.syncing) {
            btnSync = (
                <div className='record__sync record__sync--syncing' title='Syncing!'>
                    <img className='record__sync-icon' src={LoadingIcon} alt='Loading' />
                </div>
            );
        } else if (!record.endTime) {
            btnSync = (
                <div className='record__sync record__sync--stop'
                  onClick={this.onStopRecordingClick}
                  title='Stop recording'
                />
            );
        } else {
            btnSync = (
                <div className='record__sync' onClick={this.onSyncClick} title='Sync this worklog to JIRA'>
                    <img className='record__sync-icon' src={ExportIcon} alt='Export' />
                </div>
            );
        }

        return (
            <div className={className} data-cuid={record.cuid}>
                <button className='record-remove' onClick={this.onRemoveClick} disabled={record.syncing}>x</button>
                <div className='record-time'>
                    <div className='record-dates'>
                        <DateInput
                          date={record.startTime}
                          type='start'
                          onChange={this.onStartTimeChange}
                          disabled={somethingIsMoving}
                        />
                        {record.endTime ? (
                            <DateInput
                              date={record.endTime}
                              type='end'
                              onChange={this.onEndTimeChange}
                              disabled={somethingIsMoving}
                            />
                        ) : (
                        null
                        )}
                    </div>
                    <span className='record__elapsed-time'>{record.elapsedTime}</span>
                </div>
                <textarea
                  className='record-comment'
                  onChange={this.onCommentChange}
                  value={this.state.comment}
                  disabled={somethingIsMoving}
                  ref={(i) => this.inputComment = i}
                />
                {btnSync}
            </div>
        );
    }
}
