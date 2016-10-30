import cuid from 'cuid';

export default class RecordModel {
  constructor ({ task }) {
    this.cuid = cuid();
    this.taskCuid = task.cuid;
    this.taskIssueKey = task.issue.key;
    this.startTime = Date.now();
    this.endTime = null;
    this.comment = '';
  }
}
