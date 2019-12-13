import cuid from 'cuid';

export default function TaskModel({ issue, highlighted = false } = {}) {
    return {
        cuid: cuid(),
        issueRefreshing: false,
        issue,
        highlighted
    };
}
