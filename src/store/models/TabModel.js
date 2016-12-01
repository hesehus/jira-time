import cuid from 'cuid';

export default function TabModel ({ name, order = 0, active, tasks = [] } = {}) {
  return {
    cuid: cuid(),
    name,
    order,
    active,
    tasks
  };
}
