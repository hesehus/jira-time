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
        tasksSearch: PropTypes.string,
        setManualSortOrder: PropTypes.func.isRequired,
        setTaskMoving: PropTypes.func.isRequired,
        unfilteredTasksCount: PropTypes.number.isRequired
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

        const {
            tasks,
            tasksSearch,
            setManualSortOrder,
            setTaskMoving,
            unfilteredTasksCount
        } = this.props;
        const { scrollTop } = this.state;

        let tasksListOutput;

        if (tasks.length === 0) {
            if (unfilteredTasksCount > 0) {
                tasksListOutput = (
                    <div className='tasks-list-wrap tasks-list-wrap--center'>
                        <div>{`Dude, there is no such thing as "${tasksSearch}"`}</div>
                    </div>
                );
            } else {
                // Tell the user to start working
                tasksListOutput = (
                    <div className='tasks-list-wrap tasks-list-wrap--center'>
                        <img className='tasks__lazy-dog' src={lazyDog} alt='Lazy dog' />
                        <div>You have not added any tasks, you lazy dog.</div>
                    </div>
                );
            }
        } else {
            tasksListOutput = (
                <div className='tasks-list-wrap' onScroll={this.onScroll}>
                    <RealTasks tasks={tasks} />
                    <DraggableTasks
                      tasks={tasks}
                      setTaskMoving={setTaskMoving}
                      setManualSortOrder={setManualSortOrder}
                      parentScrollTop={scrollTop}
                    />
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
                    {tasksListOutput}
                </div>
            </div>
        );
    }
}
