import history from './history';
import { Tokens, User } from '../storage';
import { LOGIN } from './routeContants';

export const onLogout = () => {
  Tokens.removeLocalData();
  history.push(LOGIN);
  return true;  
};

export const getToken = () => Tokens.getToken();
export const getUserDetails = () => User.getUserDetails();


export const isLoggedIn = () => {
  if (getToken() && getUserDetails()) {
    return true;
  } else {
    Tokens.removeLocalData();
    return false
  }
};