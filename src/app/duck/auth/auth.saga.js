import {
    put,
    takeLatest
} from 'redux-saga/effects';
import {
    registrationResponse, REGISTRATION, SUCCESS_REGISTRATION, ERROR_REGISTRATION,
    userLoginResponse, USER_LOGIN, ERROR_USER_LOGIN, SUCCESS_USER_LOGIN,
    forgotPasswordresponse, FORGOT_PASSWORD, ERROR_FORGOT_PASSWORD, SUCCESS_FORGOT_PASSWORD,
    resetPasswordresponse, RESET_PASSWORD, ERROR_RESET_PASSWORD, SUCCESS_RESET_PASSWORD,
    verifyTokenresponse, VERIFY_TOKEN, ERROR_VERIFY_TOKEN, SUCCESS_VERIFY_TOKEN,
    userLogoutResponse, SUCCESS_USER_LOGOUT, ERROR_USER_LOGOUT, USER_LOGOUT,
    resendEmailVerificationResponse, SUCCESS_RESEND_EMAIL_VERIFICATION, ERROR_RESEND_EMAIL_VERIFICATION, RESEND_EMAIL_VERIFICATION
} from './auth.action';
import {
    loginApi, forgotPasswordApi, resetPasswordApi, verifyTokenApi, registrationApi,
    logoutApi, resendEmailVerificationApi
} from '../../../api/index';
import _ from 'lodash'
import {
    successNotification,
} from '../../common/notification-alert';

// Registration
function* registrationRequest(data) {
    let getData = yield registrationApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(registrationResponse(SUCCESS_REGISTRATION, getData.data));
    } else {
        yield put(registrationResponse(ERROR_REGISTRATION, getData.data));
    }
}

export function* registrationWatcher() {
    yield takeLatest(REGISTRATION, registrationRequest);
}

// User Login 
function* loginRequest(userData) {
    let loginData = yield loginApi(userData);
    if (loginData.success && _.has(loginData, 'data.data')) {
        yield put(userLoginResponse(SUCCESS_USER_LOGIN, loginData.data));
    } else {
        yield put(userLoginResponse(ERROR_USER_LOGIN, loginData.data));
    }
}

export function* loginWatcher() {
    yield takeLatest(USER_LOGIN, loginRequest);
}

// Forgot Password
function* forgotPasswordRequest(data) {
    let forgotPasswordData = yield forgotPasswordApi(data);
    if (forgotPasswordData.success) {
        successNotification(forgotPasswordData.data.message)
        yield put(forgotPasswordresponse(SUCCESS_FORGOT_PASSWORD, forgotPasswordData.data));
    } else {
        yield put(forgotPasswordresponse(ERROR_FORGOT_PASSWORD, forgotPasswordData.data));
    }
}

export function* forgotPasswordWatcher() {
    yield takeLatest(FORGOT_PASSWORD, forgotPasswordRequest);
}

// Reset Password
function* resetPasswordRequest(data) {
    let resetpasswordData = yield resetPasswordApi(data);
    if (resetpasswordData.success) {
        successNotification(resetpasswordData.data.message)
        yield put(resetPasswordresponse(SUCCESS_RESET_PASSWORD, resetpasswordData.data));
    } else {
        yield put(resetPasswordresponse(ERROR_RESET_PASSWORD, resetpasswordData.data));
    }
}

export function* resetPasswordWatcher() {
    yield takeLatest(RESET_PASSWORD, resetPasswordRequest);
}

// Verify Token
function* verifyTokenRequest(data) {
    let verifyTokenData = yield verifyTokenApi(data);
    if (verifyTokenData.success) {
        yield put(verifyTokenresponse(SUCCESS_VERIFY_TOKEN, verifyTokenData.data));
    } else {
        yield put(verifyTokenresponse(ERROR_VERIFY_TOKEN, verifyTokenData.data));
    }
}

export function* verifyTokenWatcher() {
    yield takeLatest(VERIFY_TOKEN, verifyTokenRequest);
}

// User Logout
function* logoutRequest() {
    let logoutData = yield logoutApi();
    if (logoutData.success && _.has(logoutData, 'data.data')) {
        successNotification(logoutData.data.message)
        yield put(userLogoutResponse(SUCCESS_USER_LOGOUT, logoutData.data));
    } else {
        yield put(userLogoutResponse(ERROR_USER_LOGOUT, logoutData.data));
    }
}

export function* logoutWatcher() {
    yield takeLatest(USER_LOGOUT, logoutRequest);
}

// Resend Email Verification
function* resendEmailVerificationRequest(data) {
    let getData = yield resendEmailVerificationApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(resendEmailVerificationResponse(SUCCESS_RESEND_EMAIL_VERIFICATION, getData.data));
    } else {
        yield put(resendEmailVerificationResponse(ERROR_RESEND_EMAIL_VERIFICATION, getData.data));
    }
}

export function* resendEmailVerificationWatcher() {
    yield takeLatest(RESEND_EMAIL_VERIFICATION, resendEmailVerificationRequest);
}