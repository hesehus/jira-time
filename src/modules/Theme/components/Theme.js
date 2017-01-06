import React, { Component, PropTypes } from 'react';

import './Theme.scss';

export class Theme extends Component {

    static propTypes = {
        profile: PropTypes.object,
        children: PropTypes.object
    }

    render () {
        const { children, profile } = this.props;
        const theme = `theme theme-${profile.preferences.theme}`;
        return <div className={theme}>{children}</div>;
    }
}

export default Theme;
