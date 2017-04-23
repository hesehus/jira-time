import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Theme from 'modules/theme';
import Header from 'modules/Header';
import Recorder from 'modules/Recorder';

import UpdateMessage from './UpdateMessage';

import './CoreLayout.scss';
import 'styles/core.scss';

export class CoreLayout extends React.Component {

    static propTypes = {
        children: PropTypes.element.isRequired,
        profile: PropTypes.object.isRequired
    };

    constructor (props) {
        super(props);

        this.state = {
            showUpdateMessage: true
        };
    }
    
    render () {
        const { children, profile } = this.props;
        const { showUpdateMessage } = this.state;

        if (showUpdateMessage) {
            return (
                <Theme>
                    <UpdateMessage />
                </Theme>
            );
        }

        return (
            <Theme>
                <div className={
                    'layout-container' +
                    (profile.preferences.compactView ? ' compact-view' : '') +
                    (!profile.preferences.enableAnimations ? ' disable-animations' : '')}
                >
                    <Header />
                    <div className='layout-container__viewport'>
                        {children}
                    </div>
                    <Recorder />
                </div>
            </Theme>
        );
    }
}

const mapStateToProps = ({ profile }) => {
    return {
        profile
    };
}

export default connect(mapStateToProps)(CoreLayout);
