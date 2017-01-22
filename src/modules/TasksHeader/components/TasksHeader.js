import React, { Component, PropTypes } from 'react';

import { TASKS_SORT_ORDERS } from 'store/reducers/tasks';

import './TasksHeader.scss';

export default class TasksHeader extends Component {

    static propTypes = {
        tasksSortOrder: PropTypes.string,
        setTasksSortOrder: PropTypes.func.isRequired
    }

    constructor (props) {
        super(props);

        this.onSortClick = this.onSortClick.bind(this);
    }

    onSortClick () {
        let { tasksSortOrder } = this.props;

        if (tasksSortOrder === TASKS_SORT_ORDERS[0]) {
            tasksSortOrder = TASKS_SORT_ORDERS[1];
        } else {
            tasksSortOrder = TASKS_SORT_ORDERS[0];
        }

        this.props.setTasksSortOrder({
            sortOrder: tasksSortOrder
        });
    }

    render () {

        const { tasksSortOrder } = this.props;

        let sortOrderDisplay = '-';
        if (TASKS_SORT_ORDERS.includes(tasksSortOrder)) {
            sortOrderDisplay = tasksSortOrder;
        }

        // Output the list of tasks
        return (
            <div className='tasks-header'>
                <div className='tasks-header-sorting' onClick={this.onSortClick}>Sort: {sortOrderDisplay}</div>
            </div>
        );
    }
}
