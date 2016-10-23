import React, { Component } from 'react';
import './Tasks.scss';

export class TasksView extends Component {

  render () {

    // Tell the user to start working
    if (this.props.tasks.length === 0) {
      return (
        <div className='tasks tasks--no-tasks'>
          No tasks, you lazy dog
        </div>
      );
    }

    // Output the list of tasks
    return (
      <div className='tasks'>
        {
          this.props.tasks.map((task, index) => (
            <div className='tasks__item' key={index}>{task}</div>
          ))
        }
      </div>
    );
  }
}

export default TasksView;