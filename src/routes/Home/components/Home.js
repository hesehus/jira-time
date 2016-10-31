import React, { Component, PropTypes } from 'react';

import Tasks from '../../../components/Tasks';

import './Home.scss';

export class Home extends Component {

  static get contextTypes () {
    return {
      router: PropTypes.object.isRequired
    };
  }

  static get propTypes () {
    return {
      app: PropTypes.object.isRequired
    }
  }

  componentDidMount () {

    /**
    * Redirect to login page if this is the first time opening
    * the app, and there is no previous attempt at at login registerd
    **/
    try {
      const isVisited = localStorage.getItem('appVisited');
      if (!isVisited) {
        localStorage.setItem('appVisited', 1);

        this.context.router.push('/jira-time/profile');
      }
    } catch (e) {}
  }

  render () {
    return (
      <div className='home'>
        <Tasks />
      </div>
    );
  }
}

export default Home;
