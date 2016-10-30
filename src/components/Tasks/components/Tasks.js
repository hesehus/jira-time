import React, { Component, PropTypes } from 'react';
import './Tasks.scss';
import lazyDog from './assets/lazy-dog.jpg';
import TaskItem from '../containers/TaskItem';

export class TasksView extends Component {

  static propTypes = {
    tasks: PropTypes.array
  }

  render () {

    const { tasks } = this.props;

    // Tell the user to start working
    if (tasks.length === 0) {
      return (
        <div className='tasks tasks--no-tasks'>
          <div>You have not added any tasks, you lazy dog.</div>
          <img className='tasks__lazy-dog' src={lazyDog} alt='Lazy dog' />
        </div>
      );
    }

    // Output the list of tasks
    return (
      <div className='tasks'>
        {tasks.map((task, index) => (<TaskItem key={index} task={task} />))}
      </div>
    );
  }
}

export default TasksView;
