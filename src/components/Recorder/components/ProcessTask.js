import { getIssue } from 'shared/jiraClient';
import EventClass from 'shared/eventClass';

export default class ProcessTask extends EventClass {

  constructor () {
    super();

    this.processingTasks = false;
    this.tasks = [];
  }

  add (tasks) {
    const length = this.tasks.length;

    this.tasks = [...this.tasks, ...tasks];

    if (length === 0) {
      this.process();
    }
  }

  getRemaining () {
    return this.tasks.length;
  }

  process () {

    if (!this.tasks.length) {
      return;
    }

    const key = this.tasks[0];

    getIssue({ key })
    .then((issue) => {

      next();

      if (issue) {
        this.emit('add', {
          success: true,
          issue
        });
      } else {
        this.emit('add', {
          success: false,
          message: `Hey, ${key} is not a valid JIRA issue key.\nPull yourself together!`
        });
      }
    })
    .catch(next);

    var next = () => {
      this.tasks = this.tasks.splice(1);
      this.process();
    }
  }
}
