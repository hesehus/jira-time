import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Task from 'modules/Task';
import events from 'shared/events';

export default class Tasks extends Component {
    static propTypes = {
        tasks: PropTypes.array.isRequired,
        enableAnimations: PropTypes.bool
    };

    constructor(props) {
        super(props);
        this.calculatePositions = this.calculatePositions.bind(this);
    }

    componentDidMount() {
        this.calculatePositions();
        window.addEventListener('resize', () => {
            clearTimeout(this.calculateTimeout);
            this.calculateTimeout = setTimeout(() => this.calculatePositions(), 1000);
        });
        if (this.props.enableAnimations) {
            events.on('record-animate', this.calculatePositions);
        }

        // Ensure that we update on all changes on the store
        this.storeUnsubscribe = store.subscribe(() => {
            clearTimeout(this.calculateTimeout);
            this.calculateTimeout = setTimeout(() => this.calculatePositions(), 1000);
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.calculatePositions);
        if (this.props.enableAnimations) {
            events.off('record-animate', this.calculatePositions);
        }
        clearTimeout(this.calculateTimeout);
        this.storeUnsubscribe();
    }

    calculatePositions() {
        if (!this.el || !this.props.enableAnimations) {
            return;
        }

        const { tasks } = this.props;
        const tasksPositions = [];
        let heightIncrement = 0;
        const taskElements = Array.from(this.el.querySelectorAll('.task'));

        if (!taskElements.length) {
            return;
        }

        tasks.forEach((task, index) => {
            const realTask = taskElements.find(t => t.dataset.cuid === task.cuid);
            if (realTask) {
                const clientRect = realTask.getBoundingClientRect();

                tasksPositions.push({
                    cuid: task.cuid,
                    top: heightIncrement,
                    bottom: clientRect.bottom,
                    center: heightIncrement + clientRect.height / 2,
                    clientRect
                });

                heightIncrement += clientRect.height;

                // Adjust for any spacing between tasks
                if (index > 0) {
                    heightIncrement += clientRect.top - tasksPositions[index - 1].bottom;
                }
            }
        });

        events.emit('tasksPositionsCalculated', { tasksPositions });
    }

    render() {
        const { tasks } = this.props;

        // Output the list of tasks
        return (
            <div className="tasks--real" ref={el => (this.el = el)}>
                {tasks.map(task => (
                    <Task key={task.cuid} task={task} />
                ))}
            </div>
        );
    }
}
