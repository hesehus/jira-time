import React, { Component, PropTypes } from 'react'

import './Login.scss';

import { login, updateUserInfo } from 'shared/jiraClient';

import LogoIcon from 'assets/logo.png';
import LoadingIcon from 'assets/loading-black.svg';

export class Login extends Component {

    static get propTypes () {
        return {
            username: PropTypes.string,
            onLoginSuccess: PropTypes.func,
            setLoggedIn: PropTypes.func.isRequired,
            setAuthenticationHash: PropTypes.func.isRequired
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

    componentDidMount () {
        if (this.props.username) {
            this.refs.password.select();
        } else {
            this.refs.username.select();
        }
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

                this.props.setLoggedIn({
                    isLoggedIn: true,
                    username: userInfo.username
                });

                if (this.props.onLoginSuccess) {
                    this.props.onLoginSuccess({ userInfo });
                }
                updateUserInfo();

            } else {

                const errorState = {
                    error: resp.type
                };

                if (resp.type === 'tooManyFailedLoginAttempts') {
                    errorState.tooManyFailedLoginAttempts = this.state.tooManyFailedLoginAttempts + 1;
                }

                this.setState(errorState);
            }
        })
        .catch(() => {
            this.setState({
                loggingIn: false,
                error: 'noResponseFromAPI'
            });
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
                            <div className='login-error__header'>
                                Yo. Looks like you have too many failed login attempts!
                            </div>
                            <div>
                                Head over to <a href='/'>JIRA</a>, log out, and the log back in in order to fix this.
                            </div>
                            <div className='login-error__footer'>
                                And for the future, <b>remember your credentials dude!</b>
                            </div>
                        </div>
                    );
                } else if (this.state.tooManyFailedLoginAttempts > 5) {
                    error = (
                        <div className='login-error'>
                            <div className='login-error__header'>
                                You are truly impossible!
                                You <u><b>STILL</b></u> have too many failed login attempts!!!!
                            </div>
                            <div>
                                Head over to <a href='/'>JIRA</a>, log out, and the log back in in order to fix this.
                            </div>
                            <div className='login-error__footer'>
                                And for the future, <b>remember your credentials dude!</b>
                            </div>
                        </div>
                    );
                } else {
                    error = (
                        <div className='login-error'>
                            <div className='login-error__header'>
                                Things have not changed...
                                You <u>still</u> have too many failed login attempts!
                            </div>
                            <div>
                                Head over to <a href='/'>JIRA</a>, log out, and the log back in in order to fix this.
                            </div>
                            <div className='login-error__footer'>
                                And for the future, <b>remember your credentials dude!</b>
                            </div>
                        </div>
                    );
                }

            } else if (this.state.error === 'noResponseFromAPI') {
                error = (<div className='login-error'>No response from API =(</div>);
            }
        }

        const btnClassName = this.state.loggingIn ? 'btn login-btn login-btn--logging-in' : 'btn login-btn';

        return (
            <form className='login' onSubmit={this.onSubmit}>
                <img src={LogoIcon} alt='Jira Time logo' className='login-icon' />
                <label className='login-label'>
                    <div className='login-label__text'>Username</div>
                    <input type='text'
                      ref='username'
                      name='username'
                      className='input-field'
                      defaultValue={this.props.username}
                      disabled={this.state.loggingIn}
                />
                </label>
                <label className='login-label'>
                    <div className='login-label__text'>Password</div>
                    <input type='password'
                      ref='password'
                      name='password'
                      className='input-field'
                      disabled={this.state.loggingIn}
                />
                </label>

                {error}

                <button className={btnClassName}>
                    <span>Login</span>
                    <img src={LoadingIcon} alt='Loading' className='login-loading' />
                </button>
            </form>
        );
    }
}

export default Login;
