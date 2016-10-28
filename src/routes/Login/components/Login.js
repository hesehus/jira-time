import React, { Component, PropTypes } from 'react'
import promiseFinally from 'promise-finally';

import './Login.scss';

import { login } from '../../../shared/jiraClient';
import { setAuthenticationHash } from '../../../store/app';

export class Login extends Component {

  static get propTypes () {
    return {
      dispatch: PropTypes.func.isRequired,
      onLoginSuccess: PropTypes.func
    }
  }

  constructor (props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = { loggingIn: false };
  }

  onSubmit (event) {
    event.preventDefault();
    this.doLogin();
  }

  doLogin () {
    if (!this.state.loggingIn) {
      this.setState({ loggingIn: true });

      const userInfo = {
        username: this.refs.username.value,
        password: this.refs.password.value
      };

      const p = login(userInfo)
        .then((resp) => {
          this.props.dispatch(setAuthenticationHash(userInfo));

          if (this.props.onLoginSuccess) {
            this.props.onLoginSuccess(userInfo);
          }
        });

      promiseFinally(p, () => this.setState({ loggingIn: false }));
    }
  }

  render () {
    return (
      <form className='login' onSubmit={this.onSubmit}>
        <label className='login-label'>
          <div className='login-label__text'>Username:</div>
          <input type='text' ref='username' name='username' />
        </label>
        <label className='login-label'>
          <div className='login-label__text'>Password:</div>
          <input type='password' ref='password' name='password' />
        </label>

        <button disabled={this.state.loggingIn}>Login</button>
      </form>
    );
  }
}

export default Login;
