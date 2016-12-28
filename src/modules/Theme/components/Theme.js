import React, { Component, PropTypes } from 'react';

import themes from '../themes';

import './Theme.scss';

export class Theme extends Component {

    static propTypes = {
        profile: PropTypes.object
    }

    render ({ children }) {
        const theme = `theme theme-${themes.RED}`;
        return <div className={theme}>{children}</div>;
    }
}

export default Theme;
