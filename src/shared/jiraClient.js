const base = 'http://localhost:8080/rest';

function callApi ({ path, method = 'get', body, headers }) {
  return fetch(`${base}/${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body
  });
}

export function login ({ username, password }) {
  return callApi({
    path: 'auth/1/session',
    method: 'post',
    body: JSON.stringify({ username, password })
  });
}
