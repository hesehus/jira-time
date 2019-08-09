import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';

import Bar from './Bar';
import { updateRemainingEstimate, refreshJiraIssue, issueIsClosed } from 'shared/taskHelper';
import config from 'shared/config.json';

const Wrapper = styled.div`
    margin-right: 10px;
    font-size: 0.75rem;
    width: 150px;
    flex: 0 0 auto;
    cursor: default;
    display: flex;
    align-items: center;

    @media (max-width: ${config.breakpoints.sm}px) {
        .compact-view & {
            width: 100px;
        }
    }

    @media (min-width: ${config.breakpoints.md + 1}px) {
        margin-left: 10px;
    }
`;

const Percentage = styled.div`
    flex: 0 0 auto;
    text-align: right;
    width: 33px;
`;

const Remaining = styled.div`
    flex: 0 0 auto;
`;

const RemainingInput = styled.input`
    padding: 0 2px;
    border: none;
    background: transparent;
    color: #fff;
    width: 40px;
`;

const Bars = styled.div`
    flex: 1 1 auto;
    margin: 0 5px;
`;

export default class TimeTrackingInfo extends Component {
    static propTypes = {
        task: PropTypes.object.isRequired,
        somethingIsMoving: PropTypes.bool,
        setIssueRemainingEstimate: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this.onRemainingChange = this.onRemainingChange.bind(this);
        this.onRemainingBlur = this.onRemainingBlur.bind(this);

        this.state = {
            remainingEstimate: props.task.issue.fields.timetracking.remainingEstimate
        };
    }

    onRemainingChange(e) {
        this.props.setIssueRemainingEstimate({
            cuid: this.props.task.cuid,
            remainingEstimate: e.target.value
        });
    }

    onRemainingBlur(e) {
        let remainingEstimate = e.target.value;
        const { task, setIssueRemainingEstimate } = this.props;

        // Default the value to 0h
        if (!remainingEstimate) {
            remainingEstimate = '0h';
        }

        if (remainingEstimate !== this.state.remainingEstimate) {
            this.setState(
                {
                    remainingEstimate
                },
                () => {
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
                }
            );
        }
    }

    render() {
        const { task, somethingIsMoving } = this.props;

        let {
            remainingEstimate,
            remainingEstimateSeconds,
            originalEstimate,
            originalEstimateSeconds,
            timeSpent,
            timeSpentSeconds
        } = task.issue.fields.timetracking;

        if (
            typeof remainingEstimateSeconds === 'undefined' ||
            remainingEstimate === 'undefined' ||
            !originalEstimateSeconds
        ) {
            return null;
        }

        const timeSpentAndRemaining = timeSpentSeconds + remainingEstimateSeconds;
        const largest = Math.max(timeSpentAndRemaining, originalEstimateSeconds);

        const widthOriginalEstimate = (originalEstimateSeconds / largest) * 100;
        const widthTimeSpentAndRemaining = (timeSpentAndRemaining / largest) * 100;

        let progress = (timeSpentSeconds / timeSpentAndRemaining) * 100;

        if (!isFinite(progress)) {
            progress = 0;
        }
        if (progress < 0) {
            progress = 0;
        } else if (progress > 100) {
            progress = 100;
        }

        return (
            <Wrapper>
                <Percentage>{`${parseInt(progress)}%`}</Percentage>
                <Bars>
                    <Bar width={widthOriginalEstimate} title={`Original estimate: ${originalEstimate}`} />
                    <Bar
                        width={widthTimeSpentAndRemaining}
                        lineWidth={progress}
                        title={`Remaining: ${remainingEstimate}`}
                        titleLine={`Time spent: ${timeSpent}`}
                    />
                </Bars>
                <Remaining>
                    <RemainingInput
                        value={remainingEstimate}
                        title={remainingEstimate + ' remaining'}
                        onChange={this.onRemainingChange}
                        onBlur={this.onRemainingBlur}
                        disabled={issueIsClosed(task) || somethingIsMoving}
                        tabIndex="-1"
                        ref={el => (this.remainingElement = el)}
                    />
                </Remaining>
            </Wrapper>
        );
    }
}
