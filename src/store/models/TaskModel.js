import cuid from 'cuid';

export default function TaskModel({ issue } = {}) {
    return {
        cuid: cuid(),
        issueRefreshing: false,
        issue
    };
}
