import {
    GET_PROFILE_DETAIL, UPDATE_OWNER_PROFILE_DETAIL, UPDATE_PASSWORD, UPDATE_BUSINESS_PROFILE_DETAIL, GET_MENU_COUNT,
    CONNECT_WITH_PAYPAL, MAKE_TEST_PAYMENT, DELETE_PAYMENT_ACCOUNT, GET_SUBSCRIPTION_PLAN, CREATE_SUSBCRIPTION_PLAN, PLAN_APPLY_COUPON,
    GET_STATE_TAX, UPDATE_SUSBCRIPTION_PLAN, CANCEL_SUSBCRIPTION_PLAN, ADD_PROFILE_SERVICE
} from '../routing/route';
import { request } from '../request/axios.request';

export async function getProfileDetailApi() {
    return request({ url: GET_PROFILE_DETAIL, method: 'get' })
}

export async function updateOwnerProfileDetailApi(data) {
    let ownerProfileData = data.data;
    return request({ url: UPDATE_OWNER_PROFILE_DETAIL, method: 'post', data: ownerProfileData })
}

export async function updatePasswordApi(data) {
    let passwordData = data.data;
    return request({ url: UPDATE_PASSWORD, method: 'post', data: passwordData })
}

export async function updateBusinessProfileDetailApi(data) {
    let businessProfileData = data.data;
    return request({ url: UPDATE_BUSINESS_PROFILE_DETAIL, method: 'post', data: businessProfileData })
}

export async function getMenuCountApi() {
    return request({ url: GET_MENU_COUNT, method: 'get' })
}

export async function connectWithPaypalApi(data) {
    let connectWithPaypalData = data.data;
    return request({ url: CONNECT_WITH_PAYPAL, method: 'post', data: connectWithPaypalData })
}

export async function makeTestPaymentApi(data) {
    let testPaymentData = data.data;
    return request({ url: MAKE_TEST_PAYMENT, method: 'post', data: testPaymentData })
}

export async function deletePaymentAccountApi(data) {
    let deletePaymentData = data.data;
    return request({ url: DELETE_PAYMENT_ACCOUNT, method: 'post', data: deletePaymentData })
}

export async function getSubscriptionPlanApi() {
    return request({ url: GET_SUBSCRIPTION_PLAN, method: 'get' })
}

export async function createSubscriptionPlanApi(data) {
    let planData = data.data;
    return request({ url: CREATE_SUSBCRIPTION_PLAN, method: 'post', data: planData })
}

export async function planApplyCouponApi(data) {
    let couponData = data.data;
    return request({ url: PLAN_APPLY_COUPON, method: 'get', params: couponData })
}

export async function getStateTaxApi() {
    return request({ url: GET_STATE_TAX, method: 'get' })
}

export async function updateSubscriptionPlanApi(data) {
    let planData = data.data;
    return request({ url: UPDATE_SUSBCRIPTION_PLAN, method: 'post', data: planData })
}

export async function cancelSubscriptionPlanApi(data) {
    let planData = data.data;
    return request({ url: CANCEL_SUSBCRIPTION_PLAN, method: 'post', data: planData })
}

export async function addProfileServiceApi(data) {
    let profileServiceData = data.data;
    return request({ url: ADD_PROFILE_SERVICE, method: 'post', data: profileServiceData })
}