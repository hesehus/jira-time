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

    this.syncIterator();
  }

  syncIterator () {

    const record = this.records[this.index];

    if (!record) {
      return this.emit('done');
    } else {

			// No end time specified. Moving on
      if (!record.endTime) {
        this.index += 1;
        this.syncIterator();
        return;
      }

			// Must be at least one minute
      if ((ensureDate(record.endTime) - ensureDate(record.startTime)) < 60) {
        return;
      }

      // Must have a comment
      if (!record.comment) {
        return;
      }

      this.emit('syncStart', record);

      this.setRecordSync({
        cuid: record.cuid,
        syncing: true
      });

      addWorklog({ record })
			.then((response) => {

  this.emit('syncEnd', record, this.records[this.index + 1]);

      	// Something went wrong
  if (!response) {
    this.setRecordSync({
      cuid: record.cuid,
      syncing: false
    });
  } else {

    if (response.status === 403 || response.status === 404) {
      alert(`Heey.. Looks like ${record.taskIssueKey} is closed or something. Cannot log dude.`);
    } else if (response.status === 400) {
      alert(`Heey.. Looks like not all info required to log to ${record.taskIssueKey} was provided. Shape up!`);
    } else if (response.status === 201) {
      this.removeRecord({
        cuid: record.cuid
      });
    }

					// Moving on to next issue
    this.index += 1;
    this.syncIterator();
  }

});
    }
  }
}
