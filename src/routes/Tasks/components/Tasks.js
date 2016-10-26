import React, { Component, PropTypes } from 'react';
import './Tasks.scss';
import lazyDog from './assets/lazy-dog.jpg';

export class TasksView extends Component {

  static propTypes = {
    tasks: PropTypes.array
  }

  render () {

    // Tell the user to start working
    if (this.props.tasks.length === 0) {
      return (
        <div className='tasks tasks--no-tasks'>
          <div>You have not added any tasks, you lazy dog! (2)</div>
          <img className='tasks__lazy-dog' src={lazyDog} alt='Lazy dog' />
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
