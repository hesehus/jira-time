import React from 'react';
import styled from 'styled-components';

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
    height: calc(100vh - 350px);
    border: 5px solid rgba(0, 0, 0, .4);
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

    render () {
        const { step } = this.state;

        const downloadLink = 'todo';

        return (
            <Wrapper>
                {step === 0 && (
                    <div>
                        <p>
                            Jira time has moved to a brand new server!<br />
                            This means more cool stuff, but requires a one-time manual update by you...
                        </p>
                        <SorryImage src={SorryDog} />
                        <p>
                            First and foremost:<br />
                            <button className='btn btn--sm'
                              style={{ marginTop: '10px' }}
                              onClick={this.backupDataAndMoveToStep1}>
                                Backup your data
                            </button>
                        </p>
                    </div>
                )}
                {step === 1 && (
                    <div>
                        <p>Good stuff! The backup is now stored on your clipboard</p>
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
                        <p style={{ marginTop: '40px' }}>... or use the web version, if you are that kind of person<br />
                            <a href='http://prod-jira-time.hesehus.dk'>http://prod-jira-time.hesehus.dk</a>
                        </p>
                    </div>
                )}
            </Wrapper>
        );
    }
}
