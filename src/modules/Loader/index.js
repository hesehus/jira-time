import React, { Component, PropTypes } from 'react';

import './index.scss';

export default class Loader extends Component {

    static propTypes = {
        size: PropTypes.string,
        color: PropTypes.string
    }

    render () {

        const {
            size = 'medium'
        } = this.props;

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

        return <span className='loader' style={style} />
    }
}
