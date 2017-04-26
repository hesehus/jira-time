import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px;
    text-align: center;
`;

const NoticeLink = styled.a`
    margin-top: 40px;
`;

const updateInstructionsShownKey = 'updateInstructionsShown';
const locationIncludesUpdateInstructions = location.href.includes('show-update-instructions=1');
const updateInstructionsShown = localStorage.getItem(updateInstructionsShownKey);
const showUpdateMessage = locationIncludesUpdateInstructions && updateInstructionsShown;

if (showUpdateMessage) {
    localStorage.setItem(updateInstructionsShownKey, Date.now());
}

export default class UpdateMessage extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            showUpdateMessage
        };

        this.onClick = this.onClick.bind(this);
        this.onUserAppStateApplied = this.onUserAppStateApplied.bind(this);
    }

    componentDidMount () {
        window.__events.on('userAppStateApplied', this.onUserAppStateApplied);
    }

    componentWillUnmount () {
        window.__events.off('userAppStateApplied', this.onUserAppStateApplied);
    }

    onUserAppStateApplied () {
        this.setState({
            showUpdateMessage: false
        });
    }

    onClick (e) {
        e.preventDefault();
        this.setState({
            showUpdateMessage: false
        });
    }

    render () {
        if (!this.state.showUpdateMessage) {
            return null;
        }
        return (
            <Wrapper>
                <h1>Press (CMD/CTRL)+V to retrieve your state</h1>
                <NoticeLink href='#' onClick={this.onClick}>Nah, I would rather not</NoticeLink>
            </Wrapper>
        );
    }
}
