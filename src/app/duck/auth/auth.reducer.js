import {
  SUCCESS_REGISTRATION, ERROR_REGISTRATION,
  SUCCESS_USER_LOGIN, ERROR_USER_LOGIN,
  SUCCESS_FORGOT_PASSWORD, ERROR_FORGOT_PASSWORD,
  SUCCESS_RESET_PASSWORD, ERROR_RESET_PASSWORD,
  SUCCESS_VERIFY_TOKEN, ERROR_VERIFY_TOKEN,
  SUCCESS_USER_LOGOUT, ERROR_USER_LOGOUT,
  SUCCESS_RESEND_EMAIL_VERIFICATION, ERROR_RESEND_EMAIL_VERIFICATION

} from './auth.action';
import {
  DEFAULT_STATE
} from "./auth.state";

export const authReducer = (state = DEFAULT_STATE, action = {
  type: {},
  data: {}
}) => {
  switch (action.type) {
    case SUCCESS_REGISTRATION:
      const registerData = action.data;
      return { ...state, registerData }
    case ERROR_REGISTRATION:
      const errorRegisterData = action.data;
      return { ...state, registerData: errorRegisterData }
    case SUCCESS_USER_LOGIN:
      const loginData = action.data;
      return { ...state, loginData, logoutData: {} };
    case ERROR_USER_LOGIN:
      const errorLoginData = action.data;
      return { ...state, loginData: errorLoginData, logoutData: {} };
    case SUCCESS_FORGOT_PASSWORD:
      const forgotPasswordData = action.data;
      return { ...state, forgotPasswordData };
    case ERROR_FORGOT_PASSWORD:
      const errorForgotPasswordData = action.data;
      return { ...state, forgotPasswordData: errorForgotPasswordData }
    case SUCCESS_RESET_PASSWORD:
      const resetPasswordData = action.data;
      return { ...state, resetPasswordData };
    case ERROR_RESET_PASSWORD:
      const errorResetPassword = action.data;
      return { ...state, resetPasswordData: errorResetPassword };
    case SUCCESS_VERIFY_TOKEN:
      const verifyTokenData = action.data;
      return { ...state, verifyTokenData }
    case ERROR_VERIFY_TOKEN:
      const errorVerifyToken = action.data;
      return { ...state, verifyTokenData: errorVerifyToken }
    case SUCCESS_USER_LOGOUT:
      const logoutData = action.data;
      return { ...state, loginData: {}, logoutData }
    case ERROR_USER_LOGOUT:
      const errorLogoutData = action.data;
      return { ...state, loginData: {}, logoutData: errorLogoutData }
    case SUCCESS_RESEND_EMAIL_VERIFICATION:
      const emailVerificationData = action.data;
      return { ...state, loginData: {}, emailVerificationData }
    case ERROR_RESEND_EMAIL_VERIFICATION:
      const errorEmailVerificationData = action.data;
      return { ...state, loginData: {}, emailVerificationData: errorEmailVerificationData }
    default:
      return state;
  }
};