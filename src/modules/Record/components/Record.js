import React, { Component, PropTypes } from 'react';
import keycode from 'keycode';

import Sync from 'shared/sync';
import { issueIsClosed } from 'shared/taskHelper';
import DateInput from 'modules/DateInput';

import ExportIcon from 'assets/export-compact.svg';
import LoadingIcon from 'assets/loading.svg';
import DeleteIcon from 'assets/delete.svg';
import MicIcon from 'assets/mic.svg';
import MicRedIcon from 'assets/mic-red.svg';

import './Record.scss';

const browserHasSpeechRecognition = 'webkitSpeechRecognition' in window;

export default class RecordItem extends Component {

    static propTypes = {
        record: PropTypes.object.isRequired,
        task: PropTypes.object,
        removeRecord: PropTypes.func.isRequired,
        setRecordDate: PropTypes.func.isRequired,
        setRecordComment: PropTypes.func.isRequired,
        stopRecording: PropTypes.func.isRequired,
        activeRecord: PropTypes.object,
        movingRecord: PropTypes.object,
        movingTask: PropTypes.object,
        profile: PropTypes.object
    }

    constructor (props) {
        super(props);

        this.onStartTimeChange = this.onStartTimeChange.bind(this);
        this.onEndTimeChange = this.onEndTimeChange.bind(this);
        this.onRemoveClick = this.onRemoveClick.bind(this);
        this.onCommentKeyDown = this.onCommentKeyDown.bind(this);
        this.onSyncClick = this.onSyncClick.bind(this);
        this.onStopRecordingClick = this.onStopRecordingClick.bind(this);
        this.onSpeechRecordClick = this.onSpeechRecordClick.bind(this);
        this.onCommentChange = this.onCommentChange.bind(this);

        this.state = {};
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
        this.props.setRecordComment({
            cuid: this.props.record.cuid,
            comment: e.target.value
        });
    }

    onCommentKeyDown (e) {
        const command = keycode(e);
        if ((command === 'down' || command === 'up')) {
            e.preventDefault();

            const { enableAnimations } = this.props.profile.preferences;
            let tasks;
            if (enableAnimations) {
                tasks = document.querySelector('.tasks--draggable');
            } else {
                tasks = document.querySelector('.tasks--real');
            }

            const limboTask = document.querySelector('.task--limbo');
            if (tasks && limboTask) {
                const allRecordsInLimbo = Array.from(limboTask.querySelectorAll('.record[data-cuid]'));
                const allRecordsOnPage = Array.from(tasks.querySelectorAll('.record[data-cuid]'));
                const allRecords = [...allRecordsInLimbo, ...allRecordsOnPage];
                const currentRecordPosition = allRecords.findIndex((record) => {
                    return record.dataset.cuid === this.recordElement.dataset.cuid;
                });
                const nextRecordItem = allRecords[currentRecordPosition + (command === 'up' ? -1 : 1)];
                if (nextRecordItem) {
                    const nextRecordComment = nextRecordItem.querySelector('.record-comment');
                    if (nextRecordComment) {
                        nextRecordComment.select();
                    }
                }
                return;
            }
            e.target.blur();
        }
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

    onSpeechRecordClick () {
        if (!this.sr) {
            this.sr = new webkitSpeechRecognition(); // eslint-disable-line
            this.sr.lang = 'da-DK';
            this.sr.onresult = ({ results }) => {
                if (results.length > 0) {
                    this.props.setRecordComment({
                        cuid: this.props.record.cuid,
                        comment: results[0][0].transcript
                    });
                }
            }
        }

        if (this.state.srActive) {
            this.sr.stop();
        } else {
            this.sr.start();
        }
        this.setState({
            srActive: !this.state.srActive
        });
    }

    render () {

        let { record, task, movingRecord, movingTask, profile } = this.props;
        const { enableVoiceRecording, compactView } = profile.preferences;

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
        if (issueIsClosed(task)) {
            btnSync = (
                <div
                  className='record-sync'
                  title='The issue is closed, dude!'>
                    Issue closed
                </div>
            );
        } else if (record.syncing) {
            btnSync = (
                <div className='record-sync record-sync--syncing' title='Syncing!'>
                    <img className='record-sync-icon' src={LoadingIcon} alt='Loading' />
                </div>
            );
        } else if (!record.endTime) {
            btnSync = (
                <div className='record-sync record-sync--stop'
                  onClick={this.onStopRecordingClick}
                  title='Stop recording'
                />
            );
        } else {
            btnSync = (
                <button tabIndex='-1'
                  className='record-sync'
                  onClick={this.onSyncClick}
                  title='Sync this worklog to JIRA'
                >
                    <img className='record-sync-icon' src={ExportIcon} alt='Export' />
                </button>
            );
        }

        let btnMic;
        if (browserHasSpeechRecognition && enableVoiceRecording) {
            btnMic = (
                <span className='record-mic' onClick={this.onSpeechRecordClick}>
                    <img src={this.state.srActive ? MicRedIcon : MicIcon} alt='Microfone' />
                </span>
            );
        }

        return (
            <div className={className} data-cuid={record.cuid} ref={e => this.recordElement = e}>
                <button tabIndex='-1' className='record-remove' onClick={this.onRemoveClick} disabled={record.syncing}>
                    <img src={DeleteIcon} alt='Delete' className='record-remove-icon' />
                </button>
                <div className='record-time'>
                    <div className='record-dates' ref={e => this.recordDates = e}>
                        <DateInput
                          date={record.startTime}
                          onChange={this.onStartTimeChange}
                          disabled={somethingIsMoving}
                        />
                        {record.endTime ? (
                            <DateInput
                              date={record.endTime}
                              onChange={this.onEndTimeChange}
                              disabled={somethingIsMoving}
                            />
                        ) : (
                        null
                        )}
                    </div>
                    {!compactView && <span className='record__elapsed-time'>{record.elapsedTime}</span>}
                </div>
                <input
                  className='record-comment'
                  onChange={this.onCommentChange}
                  onKeyDown={this.onCommentKeyDown}
                  value={record.comment}
                  disabled={somethingIsMoving}
                  tabIndex='0'
                  ref={e => this.inputComment = e}
                />
                {btnMic}
                {btnSync}
            </div>
        );
    }
}
