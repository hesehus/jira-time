import React, { Component, PropTypes } from 'react';
import { TransitionMotion, spring } from 'react-motion';

import { xs } from 'shared/responsive';
import events from 'shared/events';
import Record from 'modules/Record';

import './Records.scss';

export default class Records extends Component {

    static propTypes = {
        records: PropTypes.array.isRequired,
        profile: PropTypes.object.isRequired
    }

    render () {

        const { records, profile } = this.props;

        if (!profile.preferences.enableAnimations) {
            return (
                <div className='records'>
                    {records.map(record => <Record record={record} key={record.cuid} />)}
                </div>
            );
        }

        /**
         * Fixed height for record items since we need to animate
         * them with react-motion
         */
        const recordHeight = {
            xs: 90,
            default: 53
        };

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
                      height: spring(xs.matches ? recordHeight.xs : recordHeight.default),
                      marginTop: index === 0 ? spring(10) : spring(5)
                  },
                  data: {
                      record,
                      index
                  }
              }))}
            >
                {interpolatedStyles => {
                    events.emitRecordAnimate();
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
                                        <Record
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
