import EventEmitter from 'event-emitter';

const events = new EventEmitter({});

// Shared event emitter for all record items
let recordAnimationTimeout;
events.emitRecordAnimate = () => {
    clearTimeout(recordAnimationTimeout);
    recordAnimationTimeout = setTimeout(() => {
        events.emit('record-animate');
    });
}

export default events;
