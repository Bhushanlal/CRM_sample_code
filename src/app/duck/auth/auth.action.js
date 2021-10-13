// Registration
export const REGISTRATION = 'REGISTRATION';
export const registration = (data) => ({ type: REGISTRATION, data });
export const SUCCESS_REGISTRATION = 'SUCCESS_REGISTRATION';
export const ERROR_REGISTRATION = 'ERROR_REGISTRATION';
export const registrationResponse = (type, data) => ({ type, data });

// User Login 
export const USER_LOGIN = 'USER_LOGIN';
export const userLogin = (data) => ({ type: USER_LOGIN, data });
export const SUCCESS_USER_LOGIN = 'SUCCESS_USER_LOGIN';
export const ERROR_USER_LOGIN = 'ERROR_USER_LOGIN';
export const userLoginResponse = (type, data) => ({ type, data });

// Forgot Password
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const forgotPassword = (data) => ({ type: FORGOT_PASSWORD, data });
export const SUCCESS_FORGOT_PASSWORD = 'SUCCESS_FORGOT_PASSWORD';
export const ERROR_FORGOT_PASSWORD = 'ERROR_FORGOT_PASSWORD';
export const forgotPasswordresponse = (type, data) => ({ type, data });

// Reset Password    
export const RESET_PASSWORD = 'RESET_PASSWORD';
export const resetPassword = (data) => ({ type: RESET_PASSWORD, data });
export const SUCCESS_RESET_PASSWORD = 'SUCCESS_RESET_PASSWORD';
export const ERROR_RESET_PASSWORD = 'ERROR_RESET_PASSWORD';
export const resetPasswordresponse = (type, data) => ({ type, data });

// Verify Token
export const VERIFY_TOKEN = 'VERIFY_TOKEN';
export const verifyToken = (data) => ({ type: VERIFY_TOKEN, data });
export const SUCCESS_VERIFY_TOKEN = 'SUCCESS_VERIFY_TOKEN';
export const ERROR_VERIFY_TOKEN = 'ERROR_VERIFY_TOKEN';
export const verifyTokenresponse = (type, data) => ({ type, data });

// User Logout 
export const USER_LOGOUT = 'USER_LOGOUT';
export const userLogout = (data) => ({ type: USER_LOGOUT, data });
export const SUCCESS_USER_LOGOUT = 'SUCCESS_USER_LOGOUT';
export const ERROR_USER_LOGOUT = 'ERROR_USER_LOGOUT';
export const userLogoutResponse = (type, data) => ({ type, data });

// Resend Email Verification
export const RESEND_EMAIL_VERIFICATION = 'RESEND_EMAIL_VERIFICATION';
export const resendEmailVerification = (data) => ({ type: RESEND_EMAIL_VERIFICATION, data });
export const SUCCESS_RESEND_EMAIL_VERIFICATION = 'SUCCESS_RESEND_EMAIL_VERIFICATION';
export const ERROR_RESEND_EMAIL_VERIFICATION = 'ERROR_RESEND_EMAIL_VERIFICATION';
export const resendEmailVerificationResponse = (type, data) => ({ type, data });