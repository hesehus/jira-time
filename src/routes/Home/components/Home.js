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

  render () {
    return (
      <div className='home'>
        <Tasks />
      </div>
    );
  }
}

export default Home;
