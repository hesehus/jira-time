import React, { Component, PropTypes } from 'react';

import Tasks from '../../../components/Tasks';
import { setVisited } from '../../../store/app';

import './Home.scss';

export class Home extends Component {

  static get contextTypes () {
    return {
      router: PropTypes.object.isRequired
    };
  }

  static get propTypes () {
    return {
      dispatch: PropTypes.func.isRequired,
      app: PropTypes.object.isRequired
    }
  }

  componentDidMount () {

    /**
    * Redirect to login page if this is the first time opening
    * the app, and there is no previous attempt at at login registerd
    **/
    if (!this.props.app.visited) {
      console.log(this.props.app);
      this.context.router.push('/jira-time/profile');
      this.props.dispatch(setVisited(true));
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
