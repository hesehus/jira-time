import EventEmitter from 'event-emitter';

const events = new EventEmitter({});

// Shared event emitter for all record items
let recordAnimationTimeout;
events.emitRecordItemAnimate = () => {
    clearTimeout(recordAnimationTimeout);
    recordAnimationTimeout = setTimeout(() => {
        events.emit('record-item-animate');
    });
}

export default events;
