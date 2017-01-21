import React, { Component, PropTypes } from 'react';
import calculateScrollbarWidth from 'scrollbar-width';

import TasksHeader from 'modules/TasksHeader';
import lazyDog from 'assets/lazy-dog.png';
import TasksInLimbo from 'modules/TasksInLimbo';
import RealTasks from './RealTasks';
import DraggableTasks from './DraggableTasks';

import './Tasks.scss';

let scrollbarWidth;

export default class Tasks extends Component {

    static propTypes = {
        tasks: PropTypes.array.isRequired,
        recordsWithNoIssue: PropTypes.array.isRequired,
        setManualSortOrder: PropTypes.func.isRequired,
        setTaskMoving: PropTypes.func.isRequired
    }

    constructor (props) {
        super(props);

        this.onScroll = this.onScroll.bind(this);

        this.state = {
            scrollTop: 0
        };
    }

    componentWillMount () {
        scrollbarWidth = calculateScrollbarWidth();
    }

    onScroll (event) {
        this.setState({
            scrollTop: event.target.scrollTop
        });
    }

    render () {

        const { tasks, recordsWithNoIssue, setManualSortOrder, setTaskMoving } = this.props;
        const { scrollTop } = this.state;

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
                    <div style={{ marginRight: `${scrollbarWidth}px` }}>
                        <TasksHeader />
                        <TasksInLimbo />
                    </div>
                    <div className='tasks-list-wrap' onScroll={this.onScroll}>
                        <RealTasks tasks={tasks} />
                        <DraggableTasks
                          tasks={tasks}
                          setTaskMoving={setTaskMoving}
                          setManualSortOrder={setManualSortOrder}
                          parentScrollTop={scrollTop}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
