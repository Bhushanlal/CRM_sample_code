import {
    put,
    takeLatest
} from 'redux-saga/effects';
import {
    addDashboardTaskResponse, SUCCESS_ADD_DASHBOARD_TASK, ADD_DASHBOARD_TASK, ERROR_ADD_DASHBOARD_TASK,
    listDashboardTaskResponse, SUCCESS_LIST_DASHBOARD_TASK, ERROR_LIST_DASHBOARD_TASK, LIST_DASHBOARD_TASK,
    deleteDashboardTaskResponse, SUCCESS_DELETE_DASHBOARD_TASK, ERROR_DELETE_DASHBOARD_TASK, DELETE_DASHBOARD_TASK,
    updateDashboardTaskResponse, SUCCESS_UPDATE_DASHBOARD_TASK, ERROR_UPDATE_DASHBOARD_TASK, UPDATE_DASHBOARD_TASK,
    getBusinessSnapshotResponse, SUCCESS_GET_BUSINESS_SNAPSHOT, ERROR_GET_BUSINESS_SNAPSHOT, GET_BUSINESS_SNAPSHOT,
    listDashboardNotificationResponse, SUCCESS_LIST_DASHBOARD_NOTIFICATION, ERROR_LIST_DASHBOARD_NOTIFICATION, LIST_DASHBOARD_NOTIFICATION,
    deleteDashboardNotificationResponse, SUCCESS_DELETE_DASHBOARD_NOTIFICATION, ERROR_DELETE_DASHBOARD_NOTIFICATION, DELETE_DASHBOARD_NOTIFICATION,
    deleteAllNotificationResponse, SUCCESS_DELETE_ALL_NOTIFICATION, ERROR_DELETE_ALL_NOTIFICATION, DELETE_ALL_NOTIFICATION,
    markAsReadNotificationResponse, SUCCESS_MARK_AS_READ_NOTIFICATION, ERROR_MARK_AS_READ_NOTIFICATION, MARK_AS_READ_NOTIFICATION,
    userLoginStatusResponse, SUCCESS_USER_LOGIN_STATUS, ERROR_USER_LOGIN_STATUS, USER_LOGIN_STATUS
} from './dashboard.action';
import {
    addDashboardTaskApi, listDashboardTaskApi, deleteDashboardTaskApi, updateDashboardTaskApi, getBusinessSnapshotApi,
    listDashboardNotificationApi, deleteDashboardNotificationApi, deleteAllNotificationApi, markAsReadNotificationApi,
    userLoginStatusApi
} from '../../../api/index';
import _ from 'lodash'
import {
    successNotification,
} from '../../common/notification-alert';

// Add Dashboard Task Data
function* addDashboardTaskRequest(data) {
    let getData = yield addDashboardTaskApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(addDashboardTaskResponse(SUCCESS_ADD_DASHBOARD_TASK, getData.data));
    } else {
        yield put(addDashboardTaskResponse(ERROR_ADD_DASHBOARD_TASK, getData.data));
    }
}

export function* addDashboardTaskWatcher() {
    yield takeLatest(ADD_DASHBOARD_TASK, addDashboardTaskRequest);
}

// List Dashboard Task
function* listDashboardTaskRequest(data) {
    let getData = yield listDashboardTaskApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        yield put(listDashboardTaskResponse(SUCCESS_LIST_DASHBOARD_TASK, getData.data));
    } else {
        yield put(listDashboardTaskResponse(ERROR_LIST_DASHBOARD_TASK, getData.data));
    }
}

export function* listDashboardTaskWatcher() {
    yield takeLatest(LIST_DASHBOARD_TASK, listDashboardTaskRequest);
}

// Delete Dashboard Task
function* deleteDashboardTaskRequest(data) {
    let getData = yield deleteDashboardTaskApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(deleteDashboardTaskResponse(SUCCESS_DELETE_DASHBOARD_TASK, getData.data));
    } else {
        yield put(deleteDashboardTaskResponse(ERROR_DELETE_DASHBOARD_TASK, getData.data));
    }
}

export function* deleteDashboardTaskWatcher() {
    yield takeLatest(DELETE_DASHBOARD_TASK, deleteDashboardTaskRequest);
}


// Update Dashboard Task Data
function* updateDashboardTaskRequest(data) {
    let getData = yield updateDashboardTaskApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(updateDashboardTaskResponse(SUCCESS_UPDATE_DASHBOARD_TASK, getData.data));
    } else {
        yield put(updateDashboardTaskResponse(ERROR_UPDATE_DASHBOARD_TASK, getData.data));
    }
}

export function* updateDashboardTaskWatcher() {
    yield takeLatest(UPDATE_DASHBOARD_TASK, updateDashboardTaskRequest);
}

// Get Business Snapshot
function* getBusinessSnapshotRequest(data) {
    let getData = yield getBusinessSnapshotApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        yield put(getBusinessSnapshotResponse(SUCCESS_GET_BUSINESS_SNAPSHOT, getData.data));
    } else {
        yield put(getBusinessSnapshotResponse(ERROR_GET_BUSINESS_SNAPSHOT, getData.data));
    }
}

export function* getBusinessSnapshotWatcher() {
    yield takeLatest(GET_BUSINESS_SNAPSHOT, getBusinessSnapshotRequest);
}

// List Dashboard Notification
function* listDashboardNotificationRequest(data) {
    let getData = yield listDashboardNotificationApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        yield put(listDashboardNotificationResponse(SUCCESS_LIST_DASHBOARD_NOTIFICATION, getData.data));
    } else {
        yield put(listDashboardNotificationResponse(ERROR_LIST_DASHBOARD_NOTIFICATION, getData.data));
    }
}

export function* listDashboardNotificationWatcher() {
    yield takeLatest(LIST_DASHBOARD_NOTIFICATION, listDashboardNotificationRequest);
}

// Delete Dashboard Notification
function* deleteDashboardNotificationRequest(data) {
    let getData = yield deleteDashboardNotificationApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(deleteDashboardNotificationResponse(SUCCESS_DELETE_DASHBOARD_NOTIFICATION, getData.data));
    } else {
        yield put(deleteDashboardNotificationResponse(ERROR_DELETE_DASHBOARD_NOTIFICATION, getData.data));
    }
}

export function* deleteDashboardNotificationWatcher() {
    yield takeLatest(DELETE_DASHBOARD_NOTIFICATION, deleteDashboardNotificationRequest);
}

// Delete All Notification
function* deleteAllNotificationRequest(data) {
    let getData = yield deleteAllNotificationApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(deleteAllNotificationResponse(SUCCESS_DELETE_ALL_NOTIFICATION, getData.data));
    } else {
        yield put(deleteAllNotificationResponse(ERROR_DELETE_ALL_NOTIFICATION, getData.data));
    }
}

export function* deleteAllNotificationWatcher() {
    yield takeLatest(DELETE_ALL_NOTIFICATION, deleteAllNotificationRequest);
}

// Mark As Read Notification
function* markAsReadNotificationRequest(data) {
    let getData = yield markAsReadNotificationApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        /* successNotification(getData.data.message) */
        yield put(markAsReadNotificationResponse(SUCCESS_MARK_AS_READ_NOTIFICATION, getData.data));
    } else {
        yield put(markAsReadNotificationResponse(ERROR_MARK_AS_READ_NOTIFICATION, getData.data));
    }
}

export function* markAsReadNotificationWatcher() {
    yield takeLatest(MARK_AS_READ_NOTIFICATION, markAsReadNotificationRequest);
}

// user Login Status
function* userLoginStatusRequest(data) {
    let getData = yield userLoginStatusApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        /* successNotification(getData.data.message) */
        yield put(userLoginStatusResponse(SUCCESS_USER_LOGIN_STATUS, getData.data));
    } else {
        yield put(userLoginStatusResponse(ERROR_USER_LOGIN_STATUS, getData.data));
    }
}

export function* userLoginStatusWatcher() {
    yield takeLatest(USER_LOGIN_STATUS, userLoginStatusRequest);
}