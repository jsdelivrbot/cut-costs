import axios from 'axios';

export const LOGIN_USER = 'login_user';
export const LOGOUT_USER = 'logout_user';
export const LEFT_NAV_BAR_NAVIGATE = 'left_nav_bar_navigate';
export const FETCH_GROUPS = 'fetch_groups';

const ROOT_URL = "http://localhost:8443/api";
const AUTH_ENDPOINT_URL = `${ROOT_URL}/auth`;
const LOGIN_ENDPOINT = `${AUTH_ENDPOINT_URL}/login`;
const GROUP_ENDPOINT = `${ROOT_URL}/group/`;

export function loginUser(values, callback) {
  const request = axios.post(LOGIN_ENDPOINT,
    {
      username: values.username,
      password: values.password
    }
  ).then((response) => callback(response));

  return {
    type: LOGIN_USER,
    payload: request
  };
}

export function logoutUser(callback) {
    //callback();
    return {
      type: LOGOUT_USER
    };
}

//TODO: not useful yet
export function leftNavBarNavigate(callback) {
  //calback()
  return {
    type: LEFT_NAV_BAR_NAVIGATE
  }
}

export function fetchGroups() {
  const request = axios.get(GROUP_ENDPOINT,
    {
      headers: {
        'Authorization': localStorage.getItem('jwt_token'),
        'Content-Type': 'application/json'
      }
    }
  );
  return {
    type: FETCH_GROUPS,
    payload: request
  }
}
