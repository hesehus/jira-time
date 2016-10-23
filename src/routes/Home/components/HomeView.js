import React, { Component } from 'react';

import './HomeView.scss';

import Tasks from '../../Tasks';

export class HomeView extends Component {
  render () {
    return (
      <div className='home'>
        <Tasks />
      </div>
    );
  }
}

export default HomeView;
