import React, { Component, PropTypes } from 'react';

import { updateRemainingEstimate, refreshJiraIssue } from 'shared/taskHelper';

import './TimeTrackingInfo.scss';

export default class TimeTrackingInfo extends Component {

    static propTypes = {
        task: PropTypes.object.isRequired,
        somethingIsMoving: PropTypes.bool,
        setIssueRemainingEstimate: PropTypes.func.isRequired
    }

    constructor (props) {
        super(props);

        this.onRemainingChange = this.onRemainingChange.bind(this);
        this.onRemainingBlur = this.onRemainingBlur.bind(this);

        this.state = {
            remainingEstimate: props.task.issue.fields.timetracking.remainingEstimate
        };
    }

    onRemainingChange (e) {
        this.props.setIssueRemainingEstimate({
            cuid: this.props.task.cuid,
            remainingEstimate: e.target.value
        });
    }

    onRemainingBlur (e) {
        let remainingEstimate = e.target.value;
        const { task, setIssueRemainingEstimate } = this.props;

        // Default the value to 0h
        if (!remainingEstimate) {
            remainingEstimate = '0h';
        }

        if (remainingEstimate !== this.state.remainingEstimate) {
            this.setState({
                remainingEstimate
            }, () => {

                // Update redux state
                setIssueRemainingEstimate({
                    cuid: task.cuid,
                    remainingEstimate
                });

                // Send updates to server
                updateRemainingEstimate({
                    taskCuid: task.cuid,
                    taskIssueKey: task.issue.key,
                    remainingEstimate
                }).then(() => {
                    return refreshJiraIssue({
                        taskCuid: task.cuid,
                        taskIssueKey: task.issue.key
                    });
                });
            });
        }
    }

    getUsedEstimatePercentage (originalEstimateSeconds, remainingEstimateSeconds) {
        let usedEstimatePct = ((originalEstimateSeconds - remainingEstimateSeconds) / originalEstimateSeconds) * 100;
        if (usedEstimatePct > 100) {
            usedEstimatePct = 100;
        } else if (usedEstimatePct < 0) {
            usedEstimatePct = 0;
        }
        return Math.floor(usedEstimatePct);
    }

    render () {
        const { task, somethingIsMoving } = this.props;

        let {
            remainingEstimate,
            remainingEstimateSeconds,
            originalEstimate,
            originalEstimateSeconds
        } = task.issue.fields.timetracking;

        if (!remainingEstimate || remainingEstimate === 'undefined' || !originalEstimate) {
            return null;
        }

        let usedEstimatePct = this.getUsedEstimatePercentage(originalEstimateSeconds, remainingEstimateSeconds);

        return (
            <div className='time-tracking'>
                <div className='time-tracking-progress-text'
                  title={`Original estimate: ${originalEstimate}. Remaining: ${remainingEstimate}`}>
                    <span className='time-tracking-progress-text-original'>
                        <input className='time-tracking-progress-input time-tracking-progress-input--original'
                          value={originalEstimate}
                          disabled
                        />
                    </span>
                    <span className='time-tracking-progress-text-remaining'>
                        <input className='time-tracking-progress-input'
                          contentEditable={!somethingIsMoving}
                          value={remainingEstimate}
                          onChange={this.onRemainingChange}
                          onBlur={this.onRemainingBlur}
                          tabIndex='-1'
                          ref={el => this.remainingElement = el}
                        />
                    </span>
                </div>
                <div className='time-tracking-progress-bar' title={`${usedEstimatePct}% of the time is spent`}>
                    <div className='time-tracking-progress-bar__status' style={{ width: usedEstimatePct + '%' }} />
                </div>
            </div>
        );
    }
}
