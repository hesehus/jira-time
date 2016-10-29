import React, { Component, PropTypes } from 'react'

import './Login.scss';

import { login } from '../../../shared/jiraClient';

export class Login extends Component {

  static get propTypes () {
    return {
      onLoginSuccess: PropTypes.func
    }
  }

  constructor (props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      loggingIn: false,
      attempts: 0,
      tooManyFailedLoginAttempts: 0
    };
  }

  onSubmit (event) {
    event.preventDefault();
    this.doLogin();
  }

  doLogin () {
    if (!this.state.loggingIn) {

      this.setState({
        loggingIn: true,
        error: null,
        attempts: this.state.attempts + 1
      });

      const userInfo = {
        username: this.refs.username.value,
        password: this.refs.password.value
      };

      login(userInfo)
        .then((resp) => {

          this.setState({ loggingIn: false });

          if (resp.success) {

            this.setState({
              error: null,
              attempts: 0,
              tooManyFailedLoginAttempts: 0
            });

            this.props.setAuthenticationHash(userInfo);

            if (this.props.onLoginSuccess) {
              this.props.onLoginSuccess(userInfo);
            }
          } else {

            const errorState = {
              error: resp.type
            };
  
            if (resp.type === 'tooManyFailedLoginAttempts') {
              errorState.tooManyFailedLoginAttempts = this.state.tooManyFailedLoginAttempts + 1;
            }

            this.setState(errorState);
          }
        });
    }
  }

  render () {

    let error;

    if (this.state.error) {
      if (this.state.error === 'invalidCredentials') {

        if (this.state.attempts === 1) {
          error = <div className='login-error'>I don't think this is correct</div>;
        } else {
          error = <div className='login-error'>I still don't think this is correct</div>;
        }

      } else if (this.state.error === 'tooManyFailedLoginAttempts') {

        if (this.state.tooManyFailedLoginAttempts === 1) {
          error = (
            <div className='login-error'>
              <div className='login-error__header'>Yo. Looks like you have too many failed login attempts!</div>
              <div>Head over to <a href='/'>JIRA</a>, log out, and the log back in in order to fix this.</div>
              <div className='login-error__footer'>And for the future, <b>remember your credentials dude!</b></div>
            </div>
          );
        } else if (this.state.tooManyFailedLoginAttempts > 5) {
          error = (
            <div className='login-error'>
              <div className='login-error__header'>
                You are truly impossible!
                You <u><b>STILL</b></u> have too many failed login attempts!!!!</div>
              <div>Head over to <a href='/'>JIRA</a>, log out, and the log back in in order to fix this.</div>
              <div className='login-error__footer'>And for the future, <b>remember your credentials dude!</b></div>
            </div>
          );
        } else {
          error = (
            <div className='login-error'>
              <div className='login-error__header'>
                Things have not changed...
                You <u>still</u> have too many failed login attempts!</div>
              <div>Head over to <a href='/'>JIRA</a>, log out, and the log back in in order to fix this.</div>
              <div className='login-error__footer'>And for the future, <b>remember your credentials dude!</b></div>
            </div>
          );
        }
        
      } else if (this.state.error === 'noResponseFromAPI') {
        error = (<div className='login-error'>No response from API =(</div>);
      }
    }

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

        {error}

        <button disabled={this.state.loggingIn}>Login</button>
      </form>
    );
  }
}

export default Login;
