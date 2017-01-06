import React, { PropTypes, Component } from 'react';
import { Motion, spring } from 'react-motion';
import { connect } from 'react-redux';

import events from 'shared/events';
import { setManualSortOrder } from 'store/reducers/tasks';
import TaskItem from 'modules/TaskItem';

import './DraggableTasks.scss';

const springConfig = { stiffness: 300, damping: 50 };

class DraggablaTasks extends Component {

    static propTypes = {
        tasks: PropTypes.array.isRequired
    }

    constructor (props) {
        super(props);

        this.onPanStart = this.onPanStart.bind(this);
        this.onPanMove = this.onPanMove.bind(this);
        this.onPanEnd = this.onPanEnd.bind(this);
        this.onPanCancel = this.onPanCancel.bind(this);

        this.state = {
            y: 0,
            initialYPosition: 0,
            initialTasks: [],
            isPressed: false,
            tasksPositions: []
        };

        events.on('tasksPositionsCalculated', ({ tasksPositions }) => {
            console.log('Task items positions received!', tasksPositions);
            this.setState({
                tasksPositions
            });
        });
    }

    componentDidMount () {
        events.on('panstart:task', this.onPanStart);
        events.on('panmove:task', this.onPanMove);
        events.on('panend:task', this.onPanEnd);
        events.on('pancancel:task', this.onPanCancel);
    }

    getCurrentMouseRow ({ y, currentHeight }) {

        const { tasksPositions } = this.state;

        // Determine precise row hit
        for (let i = 0; i < tasksPositions.length; i++) {
            const rect = tasksPositions[i];
            const { height } = rect.clientRect;

            // Half way up this item
            if (y <= (rect.top + (height / 2)) && y >= rect.top) {
                return i;
            }

            // Over the top of next
            if (y <= rect.top) {
                return i;
            }
        }

        // Check if over the first item
        if (y < tasksPositions[0].top) {
            return 0;
        }

        // No hit. Assume bottom
        return tasksPositions.length - 1;
    }

    onPanStart ({ element }) {
        if (element) {
            const { tasksPositions } = this.state;
            const { tasks } = this.props;
            const { cuid } = element.dataset;
            const clientRectEl = tasksPositions.find(c => c.cuid === cuid);
            this.setState({
                y: clientRectEl.top,
                initialYPosition: clientRectEl.top,
                isPressed: cuid,
                initialTasks: [...tasks]
            });
        }
    }

    onPanMove ({ event, element }) {
        if (element) {
            const { tasks } = this.props;
            const { tasksPositions, initialYPosition } = this.state;
            const { cuid } = element.dataset;
            const clientRectEl = tasksPositions.find(c => c.cuid === cuid);
            const currentArrayPosition = tasks.findIndex(t => t.cuid === cuid);

            if (clientRectEl) {
                const y = initialYPosition + event.deltaY;

                const currentRow = this.getCurrentMouseRow({ y, currentHeight: clientRectEl.clientRect.height });

                if (currentRow !== currentArrayPosition) {
                    let newTasks = [...tasks];
                    let switchWith = newTasks[currentRow];

                    if (switchWith) {
                        newTasks[currentRow] = newTasks[currentArrayPosition];
                        newTasks[currentArrayPosition] = switchWith;

                        store.dispatch(setManualSortOrder({
                            tasks: newTasks
                        }));
                    }
                }

                this.setState({
                    y
                });
            }
        }
    }

    onPanEnd () {
        this.setState({
            isPressed: false,
            y: 0,
            initialYPosition: 0
        });
    }

    onPanCancel () {
        store.dispatch(setManualSortOrder({
            tasks: this.state.initialTasks
        }));

        this.setState({
            isPressed: false,
            y: 0,
            initialYPosition: 0,
            initialTasks: []
        });
    }

    render () {
        const { y, isPressed, tasksPositions } = this.state;
        const { tasks } = this.props;

        if (!tasksPositions) {
            return null;
        }

        return (
            <div className='tasks-draggable' ref={el => this.refOuter = el}>
                {tasks.map((task, i) => {

                    const rect = tasksPositions.find(c => c.cuid === task.cuid);
                    if (!rect) {
                        return null;
                    }

                    let style;
                    if (task.cuid === isPressed) {
                        style = {
                            scale: spring(1.05, springConfig),
                            shadow: spring(16, springConfig),
                            y
                        };
                    } else {
                        style = {
                            scale: spring(1, springConfig),
                            shadow: spring(0, springConfig),
                            y: spring(rect.top, springConfig)
                        };
                    }

                    return (
                        <Motion style={style} key={task.cuid}>
                            {({ scale, shadow, y }) =>
                                <div
                                  className='tasks-draggable-item'
                                  style={{
                                      height: `${rect.clientRect.height}px`,
                                      boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                                      transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                                      WebkitTransform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                                      zIndex: task.cuid === isPressed ? 99 : i
                                  }}
                                >
                                    <TaskItem task={task} />
                                </div>
                            }
                        </Motion>
                    );
                })}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        tasksPositions: state.tasks.tasksPositions
    }
};

export default connect(mapStateToProps)(DraggablaTasks);
