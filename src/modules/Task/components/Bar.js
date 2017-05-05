import React, { PropTypes } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    background: rgba(0, 0, 0, .3);
    border-radius: 5px;
    height: 4px;
    display: flex;

    &:first-child {
        margin-bottom: 4px;
    }
`;

const Line = styled.div`
    background: rgba(255, 255, 255, .85);
    border-radius: 5px;
    transition: all 100ms linear;
    min-width: 0%;
    max-width: 100%;
`;

export default function Bar ({ width, lineWidth = 100, title, titleLine }) {
    return (
        <Wrapper style={{ width: `${width}%` }} title={title} >
            <Line style={{ width: `${lineWidth}%` }} title={titleLine} />
        </Wrapper>
    );
}

Bar.propTypes = {
    width: PropTypes.number.isRequired,
    lineWidth: PropTypes.number,
    setBackground: PropTypes.bool,
    title: PropTypes.string,
    titleLine: PropTypes.string
};
