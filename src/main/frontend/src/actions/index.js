import axios from 'axios';
import history from '../history';
import { groupDeleted, groupsFetched, groupCreated, groupFetched, membersFetched, memberRemoved, expenseCreated, expenseDeletedFromGroup, expensesFetched, expenseDeleted, expenseFetched, sharerRemoved } from './creators';
import { logout } from '../helpers/auth_utils'

const ROOT_URL = "http://localhost:8443/api";
const AUTH_ENDPOINT_URL = `${ROOT_URL}/auth`;
const LOGIN_ENDPOINT = `${AUTH_ENDPOINT_URL}/login`;
const REGISTER_ENDPOINT = `${AUTH_ENDPOINT_URL}/signup`;
const GROUP_ENDPOINT = `${ROOT_URL}/group/`;
const EXPENSE_ENDPOINT = `${ROOT_URL}/expense/`

function getAuthorizationHeader() {
  return {
    headers: {
      'Authorization': localStorage.getItem('jwt_token'),
      'Content-Type': 'application/json'
    }
  };
}

export function loginUser(values, redirected_from, errorCallback) {
  return () => {
    axios.post(LOGIN_ENDPOINT,
      {
        username: values.username,
        password: values.password
      }
    ).then(response => {
      const { headers: { authorization } } = response;
      localStorage.setItem('jwt_token', authorization);
      localStorage.setItem('user_id', response.data);
      history.push(redirected_from);
    }).catch(({response}) => {
      if (!response) {
        //Network error
        //show a sticky message with offline message
      } else {
        if (response.status === 401) { // Unauthorized
          errorCallback();
        }
      }
    });
  };
}

export function fetchMembers(groupId, successCallback, errorCallback) {
  return dispatch => {
    axios.get(`${GROUP_ENDPOINT}${groupId}/user`, getAuthorizationHeader())
      .then(response => {
          dispatch(membersFetched(response.data, groupId));
      })
      .then(() => successCallback())
      .catch(({response}) => {
        if (!response) {
          //Network error
          //show a sticky message with offline message
        } else {
          if (response.status ===  401) { // Unauthorized
            logout();
          } else {
            errorCallback(response.data.message);
          }
        }
      })
  };
}

export function removeMember(groupId, memberId, errorCallback) {
  return dispatch => {
    axios.delete(`${GROUP_ENDPOINT}${groupId}/user/${memberId}`, getAuthorizationHeader())
      .then(response => {
          dispatch(memberRemoved(response.data, groupId));
      })
      .catch(({response}) => {
        if (!response) {
          //Network error
          //show a sticky message with offline message
        } else {
          if (response.status ===  401) { // Unauthorized
            logout();
          } else {
            errorCallback(response.data.message);
          }
        }
      })
  };
}

export function createExpense(values, groupId, successCallback, errorCallback) {
  return dispatch => {
    axios.post(`${EXPENSE_ENDPOINT}${groupId}`,
      {
        title: values.title,
        description: values.description,
        amount: values.amount
      }, getAuthorizationHeader())
      .then(({data}) => {
        successCallback();
        dispatch(expenseCreated(data, groupId))
      })
      .catch(({response}) => {
        if (!response) {
          //Network error
          //show a sticky message with offline message
        } else {
          if (response.status ===  401) { // Unauthorized
            logout();
          } else {
            errorCallback(response.data.message);
          }
        }
      });
    };
}

export function fetchExpense(expenseId, successCallback, errorCallback) {
  return dispatch => {
    axios.get(`${EXPENSE_ENDPOINT}${expenseId}`, getAuthorizationHeader())
      .then(({data}) => {
        dispatch(expenseFetched(data))
      })
      .then(() => successCallback())
      .catch(({response}) => {
        if (!response) {
          //Network error
          //show a sticky message with offline message
        } else {
          if (response.status ===  401) { // Unauthorized
            logout();
          } else {
            errorCallback(response.data.message);
          }
        }
      });
    };
}

export function removeSharer(sharerId, expenseId, errorCallback) {
  return dispatch => {
    axios.get(`${EXPENSE_ENDPOINT}${expenseId}/sharer/${sharerId}`, getAuthorizationHeader())
      .then(({data}) => {
        dispatch(sharerRemoved(data))
      })
      .catch(({response}) => {
        if (!response) {
          //Network error
          //show a sticky message with offline message
        } else {
          if (response.status ===  401) { // Unauthorized
            logout();
          } else {
            errorCallback(response.data.message);
          }
        }
      });
    };
}

export function fetchExpenses(successCallback, errorCallback) {
  return dispatch => {
    axios.get(`${EXPENSE_ENDPOINT}`, getAuthorizationHeader())
      .then(({data}) => dispatch(expensesFetched(data)))
      .then(() => successCallback())
      .catch(({response}) => {
        if (!response) {
          //Network error
          //show a sticky message with offline message
        } else {
          if (response.status ===  401) { // Unauthorized
            logout();
          } else {
            errorCallback(response.data.message);
          }
        }
      });
    };
}

export function deleteExpense(expenseId, groupId, errorCallback) {
  return dispatch => {
    axios.delete(`${EXPENSE_ENDPOINT}${expenseId}`, getAuthorizationHeader())
      .then(() => {
        if (groupId) {
          dispatch(expenseDeletedFromGroup(expenseId, groupId)); // in case expense is being deleted from a group
          // changing the state differs from simply deleting an expense
        } else {
          dispatch(expenseDeleted(expenseId));
        }
      }).catch(({response}) => {
        if (!response) {
          //Network error
          //show a sticky message with offline message
        } else {
          if (response.status ===  401) { // Unauthorized
            logout();
          } else {
            errorCallback(response.data.message);
          }
        }
      });
    };
}

export function fetchGroups(successCallback, errorCallback) {
  return dispatch => {
    axios.get(GROUP_ENDPOINT, getAuthorizationHeader())
      .then(response => dispatch(groupsFetched(response.data)))
      .then(() => successCallback())
      .catch(({response}) => {
        if (!response) {
          //Network error
          //show a sticky message with offline message
        } else {
          if (response.status ===  401) { // Unauthorized
            logout();
          } else {
            errorCallback(response.data.message);
          }
        }
      })
  };
}

export function fetchGroup(id, successCallback, errorCallback) {
  return (dispatch) => {
    axios.get(`${GROUP_ENDPOINT}${id}`, getAuthorizationHeader())
      .then(response => dispatch(groupFetched(response.data)))
      .then(() => successCallback())
      .catch(({response}) => {
        if (!response) {
          //Network error
          //show a sticky message with offline message
        } else {
          if (response.status ===  401) { // Unauthorized
            logout();
          } else {
            errorCallback(response.data.message);
          }
        }
      })
  };
}

export function updateGroup(values, callback) {
  return (dispatch) => {
    console.log(values);
    // axios.put(`${GROUP_ENDPOINT}values.id`,
    //   {
    //
    //   }, AUTHORIZATION_HEADER)
    //   .then(response => {
    //     if (response.status === 200) {
    //       dispatch(groupsFetched(response));
    //     } else {
    //       dispatch(groupsFetchErrored());
    //     }
    //   })
  };
}

export function createGroup(values, successCallback, errorCallback) {
  return (dispatch) => {
    axios.post(GROUP_ENDPOINT,
      {
        name: values.name,
        description: values.description
      }, getAuthorizationHeader())
      .then(({data}) => dispatch(groupCreated(data)))
      .then(() => successCallback())
      .catch(({response}) => { //TODO manually test it
        if (!response) {
          //Network error
          //show a sticky message with offline message
        } else {
          if (response.status ===  401) { // Unauthorized
            logout();
          } else {
            errorCallback(response.data.message);
          }
        }
      });
    };
}

export function deleteGroup(groupID) {
  return dispatch => {
    axios.delete(`${GROUP_ENDPOINT}${groupID}`, getAuthorizationHeader())
      .then(response => {
        dispatch(groupDeleted(response));
      }).catch(response => { //TODO manually test it
        if (!response) {
          //Network error
          //show a sticky message with offline message
        } else {
          if (response.status ===  401) { // Unauthorized
            logout();
          }
        }
      });
  };
}

export function logoutUser() {
  return () => {
    logout();
  }
}

export function registerUser(values, signupFailedCallback) {
  return () => {
    axios.post(REGISTER_ENDPOINT,
      {
        name: values.name,
        username: values.username,
        password: values.password
      }
    ).then(({ status, headers: { authorization } }) => {
      localStorage.setItem('jwt_token', authorization);
      history.push('/');
    }).catch(response => {
      debugger;
    });
  }
}
