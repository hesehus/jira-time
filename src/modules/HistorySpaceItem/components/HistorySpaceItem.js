import PropTypes from 'prop-types';
import React, { Component } from 'react';

import './HistorySpaceItem.scss';

export default class HistorySpaceItem extends Component {
    static propTypes = {
        elapsedTime: PropTypes.string.isRequired
    };

    render() {
        return (
            <tr className="history-space-item">
                <td className="history-space-item-cell" colSpan="6">
                    {this.props.elapsedTime}
                </td>
            </tr>
        );
    }
}
