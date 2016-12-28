import { default as swal } from 'sweetalert2'

import EventClass from './eventClass';

import { addWorklog, updateWorklog, getIssue } from './jiraClient';
import { ensureDate } from './helpers';

import { getRecords, setRecordSync, removeRecord } from 'store/reducers/recorder';
import { setIssueRefreshing, refreshIssue } from 'store/reducers/tasks';

export const sharedEvents = new EventClass();

export default class Sync extends EventClass {

  // Static method for handling all records in state
    static processAllInState = () => {

        const records = getRecords({ state: store.getState() });

        const syncer = new Sync({ records });

        syncer.on('start', () => sharedEvents.emit('processAllStart'));
        syncer.on('done', () => sharedEvents.emit('processAllDone'));

        syncer.start();

        return syncer;
    }

    constructor ({ records }) {
        super();

        this.records = records.sort((a, b) => a.taskIssueKey < b.taskIssueKey);

        this.index = 0;
    }

    start () {
        this.emit('start');

        this.syncIterator();
    }

    syncIterator () {

        // Moving on to next issue
        const processNext = () => {
            this.index += 1;
            this.syncIterator();

            return this;
        }

        const record = this.records[this.index];

        if (!record) {
            return this.emit('done');
        } else {

            // No end time specified. Moving on
            if (!record.endTime) {
                console.log('Cannot sync record. No end time', record)
                return processNext();
            }

            // Must have a comment
            if (!record.comment) {
                console.log('Cannot sync record. No comment', record)
                return processNext();
            }

            // Must have a issue key
            if (!record.taskIssueKey) {
                console.log('Cannot sync record. No task issue key', record)
                return processNext();
            }

            // Must be at least one minute
            if ((ensureDate(record.endTime) - ensureDate(record.startTime)) < 60000) {
                console.log('Cannot sync record. Less than a minute', record)
                return processNext();
            }

            this.emit('syncStart', record);

            store.dispatch(setRecordSync({
                cuid: record.cuid,
                syncing: true
            }));

            // Determine if we are updating or adding worklog
            let adder;
            if (record.id) {
                adder = updateWorklog({ record })
            } else {
                adder = addWorklog({ record });
            }

            adder
            .then(r => r && r.json ? r.json() : r)
            .then((worklog) => {

                store.dispatch(removeRecord({
                    cuid: record.cuid
                }));

                const status = {
                    record,
                    nextRecord: this.records[this.index + 1],
                    didSync: true,
                    worklog
                };

                this.emit('logSynced', status);

                this.refreshIssue(status);

                processNext();
            })
            .catch((response) => {

                store.dispatch(setRecordSync({
                    cuid: record.cuid,
                    syncing: false
                }));

                /* eslint-disable */
                if (response.status === 403) {
                    swal(
                        'Damn!',
                        `Looks like you don't have permissions to log to ${record.taskIssueKey}.<br />Did you change your login password or something?`,
                        'error'
                    );
                } else if (response.status === 400) {
                    swal(
                        'Hey...!',
                        `Looks like not all info required to log to ${record.taskIssueKey} was provided.<br />Shape up!`,
                        'error'
                    );
                } else {
                    swal(
                        'Whuut?',
                        `I failed spectacularly when attempting to log to ${record.taskIssueKey}.<br />I have no clue why...`,
                        'error'
                    );
                }
                /* eslint-enable */

                this.emit('syncTaskError', {
                    record,
                    nextRecord: this.records[this.index + 1],
                    didSync: false
                });

                processNext();
            });
        }
    }

    // Refresh issue info when all the records for the task is synced
    refreshIssue ({ record, nextRecord }) {
        if (!nextRecord || record.taskCuid !== nextRecord.taskCuid) {

            store.dispatch(setIssueRefreshing({
                cuid: record.taskCuid,
                refreshing: true
            }));

            getIssue({
                key: record.taskIssueKey
            })
            .then((issue) => {
                store.dispatch(refreshIssue({
                    cuid: record.taskCuid,
                    issue
                }));
            })
            .catch(() => {
                store.dispatch(setIssueRefreshing({
                    cuid: record.taskCuid,
                    refreshing: false
                }));
            });
        }
    }
}
