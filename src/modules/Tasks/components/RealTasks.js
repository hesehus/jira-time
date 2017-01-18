import React, { Component, PropTypes } from 'react';

import TaskItem from 'modules/TaskItem';
import events from 'shared/events';

import './Tasks.scss';

export default class Tasks extends Component {

    static propTypes = {
        tasks: PropTypes.array.isRequired
    }

    componentDidMount () {
        this.calculatePositions();
        window.addEventListener('resize', this.calculatePositions.bind(this));
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.calculatePositions.bind(this));
    }

    componentDidUpdate () {
        this.calculatePositions();
    }

    calculatePositions () {
        console.log('test');
        if (!this.el) {
            return;
        }

        const { tasks } = this.props;
        const tasksPositions = [];
        let heightIncrement = 0;
        const taskItems = Array.from(this.el.querySelectorAll('.task-item'));

        if (!taskItems.length) {
            return;
        }

        tasks.forEach((task) => {
            const realTaskItem = taskItems.find(t => t.dataset.cuid === task.cuid);
            if (realTaskItem) {
                const clientRect = realTaskItem.getBoundingClientRect();

                tasksPositions.push({
                    cuid: task.cuid,
                    top: heightIncrement,
                    clientRect
                });

                heightIncrement += clientRect.height + 15;
            }
        });

        events.emit('tasksPositionsCalculated', { tasksPositions });
    }

    render () {

        const { tasks } = this.props;

        // Output the list of tasks
        return (
            <div className='tasks-real' ref={el => this.el = el}>
                {tasks.map((task, index) => <TaskItem key={index} task={task} />)}
            </div>
        );
    }
}
