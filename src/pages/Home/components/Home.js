import React, { Component, PropTypes } from 'react';

import Tasks from 'modules/Tasks';
import Login from 'modules/Login';

import './Home.scss';

export class Home extends Component {

    static get contextTypes () {
        return {
            router: PropTypes.object.isRequired
        };
    }

    static get propTypes () {
        return {
            app: PropTypes.object.isRequired,
            loggedIn: PropTypes.bool.isRequired
        }
    }

    render () {
        return (
          <div className='home'>
            {this.props.loggedIn ? <Tasks /> : <Login />}
          </div>
        );
    }
}

export default Home;
