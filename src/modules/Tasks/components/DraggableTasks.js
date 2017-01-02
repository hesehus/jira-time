import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Motion, spring } from 'react-motion';

import { setManualSortOrder } from 'store/reducers/tasks';
import TaskItem from 'modules/TaskItem';

import './DraggableTasks.scss';

function clamp (n, min, max) {
    return Math.max(Math.min(n, max), min);
}

const springConfig = { stiffness: 300, damping: 50 };

class Demo extends Component {

    static propTypes = {
        tasks: PropTypes.array.isRequired,
        setManualSortOrder: PropTypes.func.isRequired
    }

    constructor (props) {
        super(props);

        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        this.state = {
            topDeltaY: 0,
            mouseY: 0,
            isPressed: false,
            clientRects: []
        };

        this.refs = {};
    }

    componentWillMount () {
        this.taskItemRefs = [];
    }

    componentDidMount () {
        window.addEventListener('touchmove', this.handleTouchMove);
        window.addEventListener('touchend', this.handleMouseUp);
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);
        window.addEventListener('resize', this.calculatePositions);

        this.calculatePositions();
    }

    calculatePositions () {
        const realTasksList = this.refs.outer.parentNode.parentNode.querySelector('.tasks-draggable-real');
        if (!realTasksList) {
            return console.error('Could not get the real tasks list');
        }

        const clientRects = [];
        realTasksList.querySelectorAll('.task-item').forEach(realTask => {
            clientRects.push({
                cuid: realTask.dataset.cuid,
                clientRect: realTask.getBoundingClientRect()
            });
        });

        this.setState({
            clientRects
        });
    }

    getCurrentMouseRow ({ mouseY }) {
        const { clientRects } = this.state;

        // Determine precise row hit
        for (let i = 0; i < clientRects.length; i++) {
            let rect = clientRects[i].clientRect;
            console.log(mouseY, rect.top, rect.top + rect.height);
            if (mouseY >= rect.top && (rect.top + rect.height) <= rect.bottom) {
                return i;
            }
        }

        // Check if over the first item
        if (mouseY < clientRects[0].top) {
            return 0;
        }

        // No hit. Assume bottom
        return clientRects.length - 1;
    }

    handleTouchStart (taskCuid, pressLocation, e) {
        this.handleMouseDown(taskCuid, pressLocation, e.touches[0]);
    }

    handleTouchMove (e) {
        e.preventDefault();
        this.handleMouseMove(e.touches[0]);
    }

    handleMouseDown (taskCuid, pressY, { pageY }) {
        this.setState({
            topDeltaY: pageY - pressY,
            mouseY: pressY,
            isPressed: taskCuid
        });
    }

    handleMouseMove (event) {
        const { isPressed, topDeltaY } = this.state;
        const { tasks } = this.props;

        if (isPressed) {
            event.preventDefault();

            const mouseY = event.pageY - topDeltaY;
            const currentRow = this.getCurrentMouseRow({ mouseY });
            const currentArrayPosition = tasks.findIndex(t => t.cuid === isPressed);
            console.log(currentRow);

            if (currentRow !== currentArrayPosition) {
                let newTasks = [...tasks];
                let switchWith = newTasks[currentRow];

                newTasks[currentRow] = newTasks[currentArrayPosition];
                newTasks[currentArrayPosition] = switchWith;

                // this.props.setManualSortOrder({
                //     tasks: newTasks
                // });
            }

            this.setState({
                mouseY
            });
        }
    }

    handleMouseUp () {
        this.setState({
            isPressed: false,
            topDeltaY: 0
        });
    }

    render () {
        const { mouseY, isPressed, clientRects } = this.state;
        const { tasks } = this.props;

        let heightIncrement = 0;

        return (
            <div className='tasks-draggable' ref={el => this.refs.outer = el}>
                {tasks.map((task, i) => {

                    const rect = clientRects.find(c => c.cuid === task.cuid);
                    if (!rect) {
                        return <div />;
                    }

                    const top = heightIncrement;
                    heightIncrement += rect.clientRect.height + 15;

                    let style;
                    if (task.cuid === isPressed) {
                        style = {
                            scale: spring(1.05, springConfig),
                            shadow: spring(16, springConfig),
                            y: mouseY
                        };
                    } else {
                        style = {
                            scale: spring(1, springConfig),
                            shadow: spring(0, springConfig),
                            y: spring(top, springConfig)
                        };
                    }

                    return (
                        <Motion style={style} key={task.cuid}>
                            {({ scale, shadow, y }) =>
                                <div
                                  onMouseDown={(e) => this.handleMouseDown(task.cuid, y, e)}
                                  onTouchStart={(e) => this.handleTouchStart(task.cuid, y, e)}
                                  className='tasks-draggable-item'
                                  style={{
                                      height: `${rect.clientRect.height}px`,
                                      boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                                      transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                                      WebkitTransform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                                      zIndex: task.cuid === isPressed ? 99 : i
                                  }}
                                >
                                    <TaskItem key={i} task={task} />
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
        tasks: state.tasks.tasks
    };
}

const mapDispatchToProps = {
    setManualSortOrder
};

export default connect(mapStateToProps, mapDispatchToProps)(Demo);
