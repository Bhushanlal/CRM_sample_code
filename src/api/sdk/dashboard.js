import {
    ADD_DASHBOARD_TASK, UPDATE_DASHBOARD_TASK, DASHBOARD_TASK_DATA, DELETE_DASHBOARD_TASK, GET_BUSINESS_SNAPSHOT,
    DASHBOARD_NOTIFICATION_DATA, DELETE_DASHBOARD_NOTIFICATION, DELETE_ALL_NOTIFICATION, MARK_AS_READ_NOTIFICATION,
    USER_LOGIN_STATUS
} from '../routing/route';
import { request } from '../request/axios.request'

export async function addDashboardTaskApi(data) {
    let dashboardTaskData = data.data;
    return request({ url: ADD_DASHBOARD_TASK, method: 'post', data: dashboardTaskData })
}

export async function listDashboardTaskApi(data) {
    let dashboardTaskData = data.data;
    return request({ url: DASHBOARD_TASK_DATA, method: 'post', data: dashboardTaskData })
}

export async function deleteDashboardTaskApi(data) {
    let dashboardTaskData = data.data;
    return request({ url: DELETE_DASHBOARD_TASK, method: 'post', data: dashboardTaskData })
}

export async function updateDashboardTaskApi(data) {
    let dashboardTaskData = data.data;
    return request({ url: UPDATE_DASHBOARD_TASK, method: 'post', data: dashboardTaskData })
}

export async function getBusinessSnapshotApi(data) {
    let businessSnapShotData = data.data;
    return request({ url: GET_BUSINESS_SNAPSHOT, method: 'get', params: businessSnapShotData })
}

export async function listDashboardNotificationApi(data) {
    let dashboardNotificationData = data.data;
    return request({ url: DASHBOARD_NOTIFICATION_DATA, method: 'post', data: dashboardNotificationData })
}

export async function deleteDashboardNotificationApi(data) {
    let dashboardNotificationData = data.data;
    return request({ url: DELETE_DASHBOARD_NOTIFICATION, method: 'post', data: dashboardNotificationData })
}

export async function deleteAllNotificationApi(data) {
    let dashboardNotificationData = data.data;
    return request({ url: DELETE_ALL_NOTIFICATION, method: 'post', data: dashboardNotificationData })
}

export async function markAsReadNotificationApi(data) {
    let dashboardNotificationData = data.data;
    return request({ url: MARK_AS_READ_NOTIFICATION, method: 'post', data: dashboardNotificationData })
}

export async function userLoginStatusApi(data) {
    let loginData = data.data;
    return request({ url: USER_LOGIN_STATUS, method: 'post', data: loginData })
}