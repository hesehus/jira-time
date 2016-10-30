import cuid from 'cuid';

export default class TaskModel {
  constructor ({ issue }) {
    this.cuid = cuid();
    this.issue = issue;
  }
}
