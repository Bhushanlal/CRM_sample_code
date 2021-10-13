import {
    REGISTRATION, USER_LOGIN, FORGOT_PASSWORD, RESET_PASSWORD, VERIFY_TOKEN, USER_LOGOUT,
    RESEND_EMAIL_VERIFICATION
} from '../routing/route';
import { request } from '../request/axios.request'

export async function registrationApi(data) {
    let userData = data.data;
    return request({ url: REGISTRATION, method: 'post', data: userData })
}

export async function loginApi(userData) {
    let loginData = userData.data;
    return request({ url: USER_LOGIN, method: 'post', data: loginData })
}

export async function forgotPasswordApi(userData) {
    let loginData = userData.data;
    return request({ url: FORGOT_PASSWORD, method: 'post', data: loginData })
}

export async function resetPasswordApi(resetData) {
    let resetPasswordData = resetData.data;
    return request({ url: RESET_PASSWORD, method: 'post', data: resetPasswordData })
}

export async function verifyTokenApi(verifyTokenData) {
    let tokenData = verifyTokenData.data;
    return request({ url: VERIFY_TOKEN + tokenData, method: 'get' })
}

export async function logoutApi() {
    return request({ url: USER_LOGOUT, method: 'get' })
}

export async function resendEmailVerificationApi(data) {
    let verificationEmailData = data.data;
    return request({ url: RESEND_EMAIL_VERIFICATION, method: 'post', data: verificationEmailData })
}
