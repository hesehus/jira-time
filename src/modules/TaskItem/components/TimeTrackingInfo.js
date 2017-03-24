import React, { Component, PropTypes } from 'react';

import { updateRemainingEstimate, refreshJiraIssue } from 'shared/taskHelper';

import './TimeTrackingInfo.scss';

export default class TimeTrackingInfo extends Component {

    static propTypes = {
        task: PropTypes.object,
        somethingIsMoving: PropTypes.bool,
        setIssueRemainingEstimate: PropTypes.func.isRequired
    }

    constructor (props) {
        super(props);

        this.onRemainignBlur = this.onRemainignBlur.bind(this);
    }

    onRemainignBlur (e) {

        let remainingEstimate = e.target.innerText;
        const { task } = this.props;

        // Default the value to 0h
        if (!remainingEstimate) {
            remainingEstimate = '0h';
            e.target.innerHTML = remainingEstimate;
        }

        if (remainingEstimate !== task.issue.fields.timetracking.remainingEstimate) {
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
            <div className='time-tracking-info'>
                <div className='time-tracking-info-progress-text'
                  title={`Original estimate: ${originalEstimate}. Remaining: ${remainingEstimate}`}>
                    <span className='time-tracking-info-progress-text-original'>{originalEstimate}</span>
                    <span className='time-tracking-info-progress-text-remaining'
                      contentEditable={!somethingIsMoving}
                      onFocus={this.onRemainignFocus}
                      onBlur={this.onRemainignBlur}
                      ref='inputRemaining'
                      tabIndex='-1'
                    >{remainingEstimate}</span>
                </div>
                <div className='time-tracking-info-progress-bar' title={`${usedEstimatePct}% of the time is spent`}>
                    <div className='time-tracking-info-progress-bar__status' style={{ width: usedEstimatePct + '%' }} />
                </div>
            </div>
        );
    }
}
