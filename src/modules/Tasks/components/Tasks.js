import React, { Component, PropTypes } from 'react';

import DraggableTasks from './DraggableTasks';
import TaskItem from 'modules/TaskItem';
import TasksInLimbo from 'modules/TasksInLimbo';

import './Tasks.scss';

import lazyDog from 'assets/lazy-dog.png';

export class Tasks extends Component {

    static propTypes = {
        tasks: PropTypes.array.isRequired,
        recordsWithNoIssue: PropTypes.array.isRequired
    }

    render () {

        const { tasks, recordsWithNoIssue } = this.props;

        // Tell the user to start working
        if (tasks.length === 0 && recordsWithNoIssue.length === 0) {
            return (
                <div className='tasks-outer'>
                    <div className='tasks tasks--no-tasks'>
                        <div>You have not added any tasks, you lazy dog.</div>
                        <img className='tasks__lazy-dog' src={lazyDog} alt='Lazy dog' />
                    </div>
                </div>
            );
        }

        // Output the list of tasks
        return (
            <div className='tasks-outer'>
                <div className='tasks'>
                    <div className='tasks-draggable-real'>
                        <TasksInLimbo />
                        {tasks.map((task, index) => <TaskItem key={index} task={task} />)}
                    </div>
                    <DraggableTasks />
                </div>
            </div>
        );
    }
}

export default Tasks;
