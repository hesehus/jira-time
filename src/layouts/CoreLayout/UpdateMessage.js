import React from 'react';
import styled from 'styled-components';
import Clipboard from 'clipboard';

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

const UserStateInput = styled.input`
    margin: 0;
    opacity: 0;
`;

export default class UpdateMessage extends React.Component {

    constructor (props) {
        super(props);

        this.backupDataAndMoveToStep1 = this.backupDataAndMoveToStep1.bind(this);

        this.state = {
            step: 0
        };
    }

    backupDataAndMoveToStep1 () {
        this.setState({
            step: 1
        });
    }

    componentDidMount () {
        this.cp = new Clipboard(this.copyBtn);
    }

    render () {
        const { step } = this.state;

        const downloadLink = 'todo';
        const userState = store.getState();

        const numTasks = userState.tasks.tasks.length;
        const tasksDisplay = numTasks + (numTasks === 1 ? ' task' : ' tasks');
        const numWorklogs = userState.recorder.records.length;
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
                            >
                                Backup your data
                            </button>
                        </p>
                        <div><UserStateInput id='user-state' defaultValue={JSON.stringify(userState)} /></div>
                    </div>
                )}
                {step === 1 && (
                    <div>
                        <p>
                            Good stuff! Your {tasksDisplay} and {worklogsDisplay} has been backed up to your clipboard.
                            You can just paste it in (ctrl+v) after updating
                        </p>
                        <p>
                            Now then:<br />
                            <a className='btn btn--sm'
                              href={downloadLink}
                              download
                              style={{ marginTop: '10px' }}
                            >
                              Download the new version
                            </a>
                        </p>
                        <p style={{ marginTop: '40px' }}>
                            ... or use the web version, if you are that kind of person<br />
                            <a href='http://prod-jira-time.hesehus.dk'>http://prod-jira-time.hesehus.dk</a>
                        </p>
                    </div>
                )}
            </Wrapper>
        );
    }
}
