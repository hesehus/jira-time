import React, { Component, PropTypes } from 'react';

import themes from 'modules/theme/themes';
console.log(themes);

import './ThemeSelector.scss';

export class ThemeSelector extends Component {

    static propTypes = {
        profile: PropTypes.object.isRequired,
        setTheme: PropTypes.func.isRequired
    }

    changeTheme (theme) {
        this.props.setTheme({ theme })
    }

    render () {

        const { preferences } = this.props.profile;

        const listItems = themes.map(theme => {
            const selected = theme.key === preferences.theme ? 'theme-selector-list-item--selected' : '';
            return (
                <li className={`theme-selector-list-item theme-selector-list-item--${theme.key} ${selected}`}
                  key={theme.key}
                  onClick={() => this.changeTheme(theme.key)}
                  title={theme.name} />
            );
        });

        return (
            <div className='theme-selector'>
                <div className='theme-selector-title'>Theme:</div>
                <ul className='theme-selector-list'>
                    {listItems}
                </ul>
            </div>
        );
    }
}

export default ThemeSelector;
