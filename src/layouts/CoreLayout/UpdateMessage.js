import React from 'react';
import styled from 'styled-components';
import Clipboard from 'clipboard';
import platform from 'platform';

import SorryDog from 'assets/sorry.jpg';

const Wrapper = styled.div`
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
`;

const SorryImage = styled.img`
    display: block;
    margin: 40px auto;
    height: calc(100vh - 450px);
    border: 5px solid rgba(0, 0, 0, .4);
`;

const AppStateInput = styled.input`
    margin: 0;
    opacity: 0;
`;

export default class UpdateMessage extends React.Component {

    constructor (props) {
        super(props);

        this.backupDataAndMoveToStep1 = this.backupDataAndMoveToStep1.bind(this);

        this.state = {
            step: 0,
            appState: null
        };
    }

    componentDidMount () {
        this.cp = new Clipboard(this.copyBtn);

        this.setState({
            appState: store.getState()
        });

        store.subscribe(() => {
            this.setState({
                appState: store.getState()
            });
        });
    }

    backupDataAndMoveToStep1 () {
        this.setState({
            step: 1
        });
    }

    render () {
        const { step, appState } = this.state;

        const downloadLink = platform.os.family === 'OS X' ? 'osx.zip' : 'windows.zip';

        const numTasks = appState ? appState.tasks.tasks.length : 0;
        const tasksDisplay = numTasks + (numTasks === 1 ? ' task' : ' tasks');
        const numWorklogs = appState ? appState.recorder.records.length : 0;
        const worklogsDisplay = numWorklogs + (numWorklogs === 1 ? ' work log' : ' work logs');

        return (
            <Wrapper>
                {step === 0 && (
                    <div>
                        <h1>Update!</h1>
                        <p>
                            Jira time has moved to a brand new server!<br />
                            This means more cool stuff, but requires a one-time manual update by you...
                        </p>
                        <SorryImage src={SorryDog} />
                        <p>
                            First and foremost:<br />
                            <button className='btn btn--sm'
                              style={{ marginTop: '10px' }}
                              onClick={this.backupDataAndMoveToStep1}
                              ref={el => this.copyBtn = el}
                              data-clipboard-target='#user-state'
                              disabled={!appState}
                            >
                                Backup your data
                            </button>
                        </p>
                        <div><AppStateInput id='user-state' readOnly value={JSON.stringify(appState)} /></div>
                    </div>
                )}
                {step === 1 && (
                    <div>
                        <h1>Good stuff!</h1>
                        <p>
                            Your {tasksDisplay} and {worklogsDisplay} has been backed up to your clipboard.
                        </p>
                        <p>
                            <a className='btn btn--sm'
                              href={downloadLink}
                              download
                              style={{ marginTop: '10px' }}
                              onClick={() => this.setState({ step: 2 })}
                            >
                              Download the new version
                            </a>
                        </p>
                        <p style={{ marginTop: '40px' }}>
                            ... or use the web version, if you are that kind of person<br />
                            <a href='http://prod-jira-time.hesehus.dk?show-update-instructions=1'>http://prod-jira-time.hesehus.dk</a>
                        </p>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <h1>
                            Downloading...
                        </h1>
                        <p>
                            When opening the updated app, just press CTR+V to restore your state
                            and continue to do awesome logging!
                        </p>
                        <p style={{ marginTop: '40px', fontSize: '.8rem' }}>
                            <a href='#' onClick={e => { e.preventDefault(); this.setState({ step: 0 }) }}>
                                Start all over again
                            </a>
                        </p>
                    </div>
                )}
            </Wrapper>
        );
    }
}
