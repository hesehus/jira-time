import React, { Component, PropTypes } from 'react';
import keycode from 'keycode';

import { TASKS_SORT_ORDERS } from 'store/reducers/tasks';
import IconDown from 'assets/down.svg';

import './TasksHeader.scss';

export default class TasksHeader extends Component {

    static propTypes = {
        tasksSortOrder: PropTypes.string,
        tasksSearch: PropTypes.string,
        setTasksSortOrder: PropTypes.func.isRequired,
        setTasksSearch: PropTypes.func.isRequired
    }

    constructor (props) {
        super(props);

        this.onSortClick = this.onSortClick.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
    }

    componentDidMount () {
        document.addEventListener('keydown', this.onDocumentKeyDown, false);
    }

    componentWillUnmount () {
        document.removeEventListener('keydown', this.onDocumentKeyDown);
    }

    onDocumentKeyDown (e) {
        const code = keycode(e);
        if (code === 'f') {
            if (e.metaKey || e.ctrlKey) {
                e.preventDefault();
                e.stopPropagation();
                this.search.select();
            }
        } else if (code === 'esc') {
            if (this.inputFocusing) {
                this.search.blur();
            }
        }
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

    onInputChange (e) {
        this.props.setTasksSearch({ search: e.target.value });
    }

    render () {

        const { tasksSortOrder, tasksSearch } = this.props;

        let sortOrderDisplay = '-';
        if (TASKS_SORT_ORDERS.includes(tasksSortOrder)) {
            sortOrderDisplay = tasksSortOrder;
        }

        // Output the list of tasks
        return (
            <div className='tasks-header'>
                <div
                  className={'tasks-header-sorting tasks-header-sorting--' + sortOrderDisplay}
                  onClick={this.onSortClick}
                  title={sortOrderDisplay}
                >
                    Sort:
                    <img
                      className='tasks-header-sorting-icon'
                      src={IconDown}
                      alt={sortOrderDisplay}
                    />
                </div>
                <input
                  className='input-field tasks-header-search'
                  type='search'
                  value={tasksSearch}
                  onChange={this.onInputChange}
                  onFocus={() => this.inputFocusing = true}
                  onBlur={() => this.inputFocusing = false}
                  ref={e => this.search = e}
                />
            </div>
        );
    }
}
