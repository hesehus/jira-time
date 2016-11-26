import EventClass from './eventClass';

import { addWorklog } from './jiraClient';
import { ensureDate } from './helpers';

export default class Sync extends EventClass {
  constructor ({ records, setRecordSync, removeRecord, refreshIssue }) {
    super();

    this.records = records.sort((a, b) => a.taskIssueKey < b.taskIssueKey);
    this.setRecordSync = setRecordSync;
    this.removeRecord = removeRecord;
    this.refreshIssue = refreshIssue;

    this.index = 0;
  }

  start () {
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
      return this.emit('syncDone');
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

      this.setRecordSync({
        cuid: record.cuid,
        syncing: true
      });

      addWorklog({ record })
        .then((response) => {

          this.removeRecord({
            cuid: record.cuid
          });

          this.emit('syncTaskDone', {
            record,
            nextRecord: this.records[this.index + 1],
            didSync: true
          });

          processNext();
        })
        .catch((response) => {

          this.setRecordSync({
            cuid: record.cuid,
            syncing: false
          });

          if (response.status === 403) {
            alert(`Heey.. Looks like you don't have permissions to log to ${record.taskIssueKey}.
              Did you change your login password or something?`);
          } else if (response.status === 400) {
            alert(`Heey.. Looks like not all info required to log to ${record.taskIssueKey} was provided.
              Shape up!`);
          } else {
            alert(`Hm. An unkown error occured when attempting to log to ${record.taskIssueKey}.
              I have no clue why...`);
          }

          this.emit('syncTaskError', {
            record,
            nextRecord: this.records[this.index + 1],
            didSync: false
          });

          processNext();
        });
    }
  }
}
