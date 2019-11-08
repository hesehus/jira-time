import PropTypes from 'prop-types';
import React, { Component } from 'react';

import themes from '../themes';

import './Theme.scss';

export class Theme extends Component {
    static propTypes = {
        profile: PropTypes.object,
        children: PropTypes.object
    };

    componentDidUpdate() {
        const theme = themes.find(t => t.key === this.props.profile.preferences.theme) || themes[0];
        document.body.style.setProperty('--theme-background', theme.background);
    }

    render() {
        const { children, profile } = this.props;
        const theme = `theme theme-${profile.preferences.theme}`;
        return <div className={theme}>{children}</div>;
    }
}

export default Theme;
