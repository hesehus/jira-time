import EventClass from './eventClass';

import { addWorklog, getIssue } from './jiraClient';
import { ensureDate } from './helpers';

export default class Sync extends EventClass {
	constructor ({ records, setRecordSync, removeRecord, refreshIssue }) {
		super();

		this.records = records;
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

			this.emit('syncStart', record);

			this.setRecordSync({
				cuid: record.cuid,
				syncing: true
			});

			addWorklog({ record })
			.then((result) => {
				this.emit('syncEnd', record);

				getIssue({
					id: record.taskIssueKey
				})
  			.then((issue) => {
					this.refreshIssue({
						cuid: record.taskCuid,
						issue
					});
				});

				// Something went wrong
				if (!result) {
					this.setRecordSync({
						cuid: record.cuid,
						syncing: false
					});
				} else {

					this.removeRecord({
						cuid: record.cuid
					});

					// Moving on to next issue
					this.index += 1;
					this.syncIterator();
				}

			});
		}
	}
}
