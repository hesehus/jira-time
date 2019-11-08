import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import Theme from 'modules/theme';
import Header from 'modules/Header';
import Recorder from 'modules/Recorder';

import './CoreLayout.scss';
import 'styles/core.scss';

export const CoreLayout = ({ children, profile }) => (
    <Theme>
        <div
            className={`layout-container${profile.preferences.compactView ? ' compact-view' : ''}${
                !profile.preferences.enableAnimations ? ' disable-animations' : ''
            }`}
        >
            <Header />
            <div className="layout-container__viewport">{children}</div>
            <Recorder />
        </div>
    </Theme>
);

export const CoreLayoutRoute = ({ component: Component, profile, ...rest }) => {
    return (
        <Route
            {...rest}
            render={matchProps => (
                <CoreLayout profile={profile}>
                    <Component {...matchProps} />
                </CoreLayout>
            )}
        />
    );
};

CoreLayout.propTypes = {
    children: PropTypes.element.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = ({ profile }) => {
    return {
        profile
    };
};

export default connect(mapStateToProps)(CoreLayoutRoute);
