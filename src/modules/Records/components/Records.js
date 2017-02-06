import React, { Component, PropTypes } from 'react';
import { TransitionMotion, spring } from 'react-motion';

import events from 'shared/events';
import RecordItem from 'modules/RecordItem';

import './Records.scss';

export default class Records extends Component {

    static propTypes = {
        records: PropTypes.array.isRequired,
        focusOnRecordCommentCuid: PropTypes.any,
        taskIndex: PropTypes.number
    }

    render () {

        const { records, taskIndex } = this.props;

        return (
            <div className={'records' + (!!records.length ? '' : ' records--empty')}>
                <TransitionMotion
                  willEnter={() => {
                      return {
                          opacity: 0,
                          scale: 0.75,
                          height: 0
                      };
                  }}
                  willLeave={() => {
                      return {
                          opacity: spring(0),
                          scale: spring(0.75),
                          height: spring(0)
                      };
                  }}
                  styles={records.map((record, i) => ({
                      key: `record-${i}`,
                      style: {
                          opacity: spring(1),
                          scale: spring(1),
                          height: spring(53) // At the moment we have a fixed height of 53px for all record items
                      },
                      data: (
                          <RecordItem
                            recordCuid={record.cuid}
                            record={record}
                            key={record.cuid}
                            taskIndex={taskIndex}
                            recordIndex={i}
                          />
                      )
                  }))}
                >
                    {interpolatedStyles => {
                        events.emit('record-item-animate');

                        return (
                            <div>
                                {interpolatedStyles.map((interpolated) => {
                                    return (
                                        <div
                                          key={interpolated.key}
                                          style={{
                                              opacity: interpolated.style.opacity,
                                              WebkitTransform: `scale(${interpolated.style.scale})`,
                                              transform: `scale(${interpolated.style.scale})`,
                                              height: `${interpolated.style.height}px`
                                          }}
                                          className='record-wrap'
                                        >
                                            {interpolated.data}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    }}
                </TransitionMotion>
            </div>
        );
    }
}
