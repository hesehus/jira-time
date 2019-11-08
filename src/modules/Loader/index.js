import PropTypes from 'prop-types';
import React, { Component } from 'react';

import './index.scss';

export default class Loader extends Component {
    static propTypes = {
        size: PropTypes.string,
        height: PropTypes.string,
        width: PropTypes.string
    };

    render() {
        const { size = 'medium', height, width } = this.props;

        const baseStyles = {
            tiny: {
                borderWidth: '1px',
                width: '15px',
                height: '15px'
            },
            small: {
                borderWidth: '2px',
                width: '20px',
                height: '20px'
            },
            medium: {
                borderWidth: '2px',
                width: '26px',
                height: '26px'
            }
        };

        const style = baseStyles[size];

        if (height) {
            style.height = height;
        }
        if (width) {
            style.width = width;
        }

        return <span className="loader" style={style} />;
    }
}
