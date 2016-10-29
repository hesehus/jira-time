/**
* Wrapper for all API calls
**/
function callApi ({ path, method = 'get', body }) {

  const state = window.store.getState();

  const headers = {
    'Content-Type': 'application/json'
  };

  if (state.app.authenticationHash) {
    headers['Authorization'] = `Basic ${state.app.authenticationHash}`;
  }

  return fetch(`${state.app.api}/${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body
  })
  .then((response) => {
    switch (response.status) {
      case 500 : {
        throw new Error(response);
      }
      default : {
        return response;
      }
    }
  })
  .catch((error) => {
    console.error(error);
  });
}

/**
* Login
* @param username: string
* @param password: string
* @returns promise
**/
export function login ({ username, password }) {
  return callApi({
    path: 'auth/1/session',
    method: 'post',
    body: JSON.stringify({ username, password })
  })
  .then((response) => {

    // Invalid credentials
    if (response.status === 401) {
      return {
        success: false,
        type: 'invalidCredentials'
      };
    }

    if (response.status === 403) {
      return {
        success: false,
        type: 'tooManyFailedLoginAttempts'
      };
    }

    return {
      success: true
    };
  });
}
