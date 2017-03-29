import React, { Component, PropTypes } from 'react';
import { TransitionMotion, spring } from 'react-motion';

import events from 'shared/events';
import RecordItem from 'modules/RecordItem';

import './Records.scss';

export default class Records extends Component {

    static propTypes = {
        records: PropTypes.array.isRequired
    }

    render () {

        const { records } = this.props;

        return (
            <TransitionMotion
              willEnter={() => {
                  return {
                      opacity: 0,
                      scale: 0.9,
                      height: 0,
                      marginTop: 0
                  };
              }}
              willLeave={() => {
                  return {
                      opacity: spring(0),
                      scale: spring(0.9),
                      height: spring(0),
                      marginTop: spring(0)
                  };
              }}
              styles={records.map((record, index) => ({
                  key: `record-${record.cuid}`,
                  style: {
                      opacity: spring(1),
                      scale: spring(1),
                      height: spring(53), // At the moment we have a fixed height of 53px for all record items
                      marginTop: index === 0 ? spring(10) : spring(5)
                  },
                  data: {
                      record,
                      index
                  }
              }))}
            >
                {interpolatedStyles => {
                    events.emitRecordItemAnimate();
                    return (
                        <div className='records'>
                            {interpolatedStyles.map((interpolated) => {
                                return (
                                    <div
                                      key={interpolated.key}
                                      style={{
                                          opacity: interpolated.style.opacity,
                                          WebkitTransform: `scale(${interpolated.style.scale})`,
                                          transform: `scale(${interpolated.style.scale})`,
                                          height: `${interpolated.style.height}px`,
                                          marginTop: `${interpolated.style.marginTop}px`
                                      }}
                                      className='record-wrap'
                                    >
                                        <RecordItem
                                          record={interpolated.data.record}
                                          key={interpolated.data.record.cuid}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    );
                }}
            </TransitionMotion>
        );
    }
}
