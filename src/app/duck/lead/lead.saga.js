import { put, takeLatest } from 'redux-saga/effects';
import {
    addServiceResponse, SUCCESS_ADD_SERVICE, ERROR_ADD_SERVICE, ADD_SERVICE,
    listServiceWithSourceResponse, SUCCESS_LIST_SERVICE_WITH_SOURCE, ERROR_LIST_SERVICE_WITH_SOURCE, LIST_SERVICE_WITH_SOURCE,
    addSourceResponse, SUCCESS_ADD_SOURCE, ERROR_ADD_SOURCE, ADD_SOURCE,
    listLeadStatusResponse, SUCCESS_LIST_LEAD_STATUS, ERROR_LIST_LEAD_STATUS, LIST_LEAD_STATUS,
    addLeadResponse, SUCCESS_ADD_LEAD, ERROR_ADD_LEAD, ADD_LEAD,
    getLeadByIdResponse, SUCCESS_GET_LEAD_BY_ID, ERROR_GET_LEAD_BY_ID, GET_LEAD_BY_ID,
    deleteLeadResponse, SUCCESS_DELETE_LEAD, ERROR_DELETE_LEAD, DELETE_LEAD,
    updateLeadResponse, SUCCESS_UPDATE_LEAD, ERROR_UPDATE_LEAD, UPDATE_LEAD,
    addLeadNoteResponse, ADD_LEAD_NOTE, SUCCESS_ADD_LEAD_NOTE, ERROR_ADD_LEAD_NOTE,
    listLeadNoteResponse, SUCCESS_LIST_LEAD_NOTE, LIST_LEAD_NOTE, ERROR_LIST_LEAD_NOTE,
    deleteLeadNoteResponse, SUCCESS_DELETE_LEAD_NOTE, DELETE_LEAD_NOTE, ERROR_DELETE_LEAD_NOTE,
    updateLeadNoteResponse, SUCCESS_UPDATE_LEAD_NOTE, ERROR_UPDATE_LEAD_NOTE, UPDATE_LEAD_NOTE,
    listLeadResponse, SUCCESS_LIST_LEAD, ERROR_LIST_LEAD, LIST_LEAD,
    addLeadTaskResponse, SUCCESS_ADD_LEAD_TASK, ADD_LEAD_TASK, ERROR_ADD_LEAD_TASK,
    listLeadTaskResponse, SUCCESS_LIST_LEAD_TASK, ERROR_LIST_LEAD_TASK, LIST_LEAD_TASK,
    deleteLeadTaskResponse, SUCCESS_DELETE_LEAD_TASK, ERROR_DELETE_LEAD_TASK, DELETE_LEAD_TASK,
    updateLeadTaskResponse, SUCCESS_UPDATE_LEAD_TASK, ERROR_UPDATE_LEAD_TASK, UPDATE_LEAD_TASK,
    updateLeadStatusResponse, SUCCESS_UPDATE_LEAD_STATUS, ERROR_UPDATE_LEAD_STATUS, UPDATE_LEAD_STATUS,
    listLeadWithPositionResponse, SUCCESS_LIST_LEAD_WITH_POSITION, ERROR_LIST_LEAD_WITH_POSITION, LIST_LEAD_WITH_POSITION,
    addLostReasonResponse, SUCCESS_ADD_LOST_REASON, ERROR_ADD_LOST_REASON, ADD_LOST_REASON,
    listLostReasonResponse, SUCCESS_LIST_LOST_REASON, ERROR_LIST_LOST_REASON, LIST_LOST_REASON,
    markLeadStatusResponse, SUCCESS_MARK_LEAD_STATUS, ERROR_MARK_LEAD_STATUS, MARK_LEAD_STATUS,
    getAllCompletedLeadsResponse, SUCCESS_GET_ALL_COMPLETED_LEADS, ERROR_GET_ALL_COMPLETED_LEADS, GET_ALL_COMPLETED_LEADS,
    customizeLeadStageResponse, SUCCESS_CUSTOMIZE_LEAD_STAGE, ERROR_CUSTOMIZE_LEAD_STAGE, CUSTOMIZE_LEAD_STAGE

} from './lead.action';
import {
    addServiceApi, listServiceWithSourceApi, addSourceApi, listLeadStatusApi, addLeadApi, getLeadByIdApi,
    deleteLeadApi, updateLeadApi, addLeadNoteApi, listLeadNoteApi, deleteLeadNoteApi, updateLeadNoteApi,
    listLeadApi, addLeadTaskApi, listLeadTaskApi, deleteLeadTaskApi, updateLeadTaskApi, updateLeadStatusApi,
    listLeadWithPositionApi, listLostReasonApi, addLostReasonApi, markLeadStatusApi, getAllCompletedLeadsApi,
    customizeLeadStageApi
} from '../../../api/index';
import _ from 'lodash'
import { successNotification } from '../../common/notification-alert';

// Add Service Data
function* addServiceRequest(data) {
    let getData = yield addServiceApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(addServiceResponse(SUCCESS_ADD_SERVICE, getData.data));
    } else {
        yield put(addServiceResponse(ERROR_ADD_SERVICE, getData.data));
    }
}

export function* addServiceWatcher() {
    yield takeLatest(ADD_SERVICE, addServiceRequest);
}

// List Service Data
function* listServiceWithSourceRequest() {
    let getData = yield listServiceWithSourceApi();
    if (getData.success && _.has(getData, 'data.data')) {
        yield put(listServiceWithSourceResponse(SUCCESS_LIST_SERVICE_WITH_SOURCE, getData.data));
    } else {
        yield put(listServiceWithSourceResponse(ERROR_LIST_SERVICE_WITH_SOURCE, getData.data));
    }
}

export function* listServiceWithSourceWatcher() {
    yield takeLatest(LIST_SERVICE_WITH_SOURCE, listServiceWithSourceRequest);
}

// Add Source Data
function* addSourceRequest(data) {
    let getData = yield addSourceApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(addSourceResponse(SUCCESS_ADD_SOURCE, getData.data));
    } else {
        yield put(addSourceResponse(ERROR_ADD_SOURCE, getData.data));
    }
}

export function* addSourceWatcher() {
    yield takeLatest(ADD_SOURCE, addSourceRequest);
}

// List Source Data
function* listLeadStatusRequest(data) {
    let getData = yield listLeadStatusApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        yield put(listLeadStatusResponse(SUCCESS_LIST_LEAD_STATUS, getData.data));
    } else {
        yield put(listLeadStatusResponse(ERROR_LIST_LEAD_STATUS, getData.data));
    }
}

export function* listLeadStatusWatcher() {
    yield takeLatest(LIST_LEAD_STATUS, listLeadStatusRequest);
}

// Add Lead Data
function* addLeadRequest(data) {
    let getData = yield addLeadApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(addLeadResponse(SUCCESS_ADD_LEAD, getData.data));
    } else {
        yield put(addLeadResponse(ERROR_ADD_LEAD, getData.data));
    }
}

export function* addLeadWatcher() {
    yield takeLatest(ADD_LEAD, addLeadRequest);
}

// Get Lead By Id
function* getLeadByIdRequest(data) {
    let getData = yield getLeadByIdApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        yield put(getLeadByIdResponse(SUCCESS_GET_LEAD_BY_ID, getData.data));
    } else {
        yield put(getLeadByIdResponse(ERROR_GET_LEAD_BY_ID, getData.data));
    }
}

export function* getLeadByIdWatcher() {
    yield takeLatest(GET_LEAD_BY_ID, getLeadByIdRequest);
}

// Delete Lead 
function* deleteLeadRequest(data) {
    let getData = yield deleteLeadApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        yield put(deleteLeadResponse(SUCCESS_DELETE_LEAD, getData.data));
    } else {
        yield put(deleteLeadResponse(ERROR_DELETE_LEAD, getData.data));
    }
}

export function* deleteLeadWatcher() {
    yield takeLatest(DELETE_LEAD, deleteLeadRequest);
}

// Update Lead Data
function* updateLeadRequest(data) {
    let getData = yield updateLeadApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(updateLeadResponse(SUCCESS_UPDATE_LEAD, getData.data));
    } else {
        yield put(updateLeadResponse(ERROR_UPDATE_LEAD, getData.data));
    }
}

export function* updateLeadWatcher() {
    yield takeLatest(UPDATE_LEAD, updateLeadRequest);
}

// Add Lead Note Data
function* addLeadNoteRequest(data) {
    let getData = yield addLeadNoteApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(addLeadNoteResponse(SUCCESS_ADD_LEAD_NOTE, getData.data));
    } else {
        yield put(addLeadNoteResponse(ERROR_ADD_LEAD_NOTE, getData.data));
    }
}

export function* addLeadNoteWatcher() {
    yield takeLatest(ADD_LEAD_NOTE, addLeadNoteRequest);
}

// List Lead Note Data
function* listLeadNoteRequest(data) {
    let getData = yield listLeadNoteApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        yield put(listLeadNoteResponse(SUCCESS_LIST_LEAD_NOTE, getData.data));
    } else {
        yield put(listLeadNoteResponse(ERROR_LIST_LEAD_NOTE, getData.data));
    }
}

export function* listLeadNoteWatcher() {
    yield takeLatest(LIST_LEAD_NOTE, listLeadNoteRequest);
}

// Delete Lead Note
function* deleteLeadNoteRequest(data) {
    let getData = yield deleteLeadNoteApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(deleteLeadNoteResponse(SUCCESS_DELETE_LEAD_NOTE, getData.data));
    } else {
        yield put(deleteLeadNoteResponse(ERROR_DELETE_LEAD_NOTE, getData.data));
    }
}

export function* deleteLeadNoteWatcher() {
    yield takeLatest(DELETE_LEAD_NOTE, deleteLeadNoteRequest);
}

// Update Lead Note Data
function* updateLeadNoteRequest(data) {
    let getData = yield updateLeadNoteApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(updateLeadNoteResponse(SUCCESS_UPDATE_LEAD_NOTE, getData.data));
    } else {
        yield put(updateLeadNoteResponse(ERROR_UPDATE_LEAD_NOTE, getData.data));
    }
}

export function* updateLeadNoteWatcher() {
    yield takeLatest(UPDATE_LEAD_NOTE, updateLeadNoteRequest);
}

// List Lead Data
function* listLeadRequest(data) {
    let getData = yield listLeadApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        yield put(listLeadResponse(SUCCESS_LIST_LEAD, getData.data));
    } else {
        yield put(listLeadResponse(ERROR_LIST_LEAD, getData.data));
    }
}

export function* listLeadWatcher() {
    yield takeLatest(LIST_LEAD, listLeadRequest);
}

// Add Lead Task Data
function* addLeadTaskRequest(data) {
    let getData = yield addLeadTaskApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(addLeadTaskResponse(SUCCESS_ADD_LEAD_TASK, getData.data));
    } else {
        yield put(addLeadTaskResponse(ERROR_ADD_LEAD_TASK, getData.data));
    }
}

export function* addLeadTaskWatcher() {
    yield takeLatest(ADD_LEAD_TASK, addLeadTaskRequest);
}

// List Lead Task
function* listLeadTaskRequest(data) {
    let getData = yield listLeadTaskApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        yield put(listLeadTaskResponse(SUCCESS_LIST_LEAD_TASK, getData.data));
    } else {
        yield put(listLeadTaskResponse(ERROR_LIST_LEAD_TASK, getData.data));
    }
}

export function* listLeadTaskWatcher() {
    yield takeLatest(LIST_LEAD_TASK, listLeadTaskRequest);
}

// Delete Lead Task
function* deleteLeadTaskRequest(data) {
    let getData = yield deleteLeadTaskApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(deleteLeadTaskResponse(SUCCESS_DELETE_LEAD_TASK, getData.data));
    } else {
        yield put(deleteLeadTaskResponse(ERROR_DELETE_LEAD_TASK, getData.data));
    }
}

export function* deleteLeadTaskWatcher() {
    yield takeLatest(DELETE_LEAD_TASK, deleteLeadTaskRequest);
}


// Update Lead Task Data
function* updateLeadTaskRequest(data) {
    let getData = yield updateLeadTaskApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(updateLeadTaskResponse(SUCCESS_UPDATE_LEAD_TASK, getData.data));
    } else {
        yield put(updateLeadTaskResponse(ERROR_UPDATE_LEAD_TASK, getData.data));
    }
}

export function* updateLeadTaskWatcher() {
    yield takeLatest(UPDATE_LEAD_TASK, updateLeadTaskRequest);
}

// Update Lead Status Data
function* updateLeadStatusRequest(data) {
    console.log(data)
    let getData = yield updateLeadStatusApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        if(!data.data.position){
            successNotification(getData.data.message)
        }
        yield put(updateLeadStatusResponse(SUCCESS_UPDATE_LEAD_STATUS, getData.data));
    } else {
        yield put(updateLeadStatusResponse(ERROR_UPDATE_LEAD_STATUS, getData.data));
    }
}

export function* updateLeadStatusWatcher() {
    yield takeLatest(UPDATE_LEAD_STATUS, updateLeadStatusRequest);
}

// List Lead With Position Data
function* listLeadWithPositionRequest() {
    let getData = yield listLeadWithPositionApi();
    if (getData.success && _.has(getData, 'data.data')) {
        yield put(listLeadWithPositionResponse(SUCCESS_LIST_LEAD_WITH_POSITION, getData.data));
    } else {
        yield put(listLeadWithPositionResponse(ERROR_LIST_LEAD_WITH_POSITION, getData.data));
    }
}

export function* listLeadWithPositionWatcher() {
    yield takeLatest(LIST_LEAD_WITH_POSITION, listLeadWithPositionRequest);
}

// Add Lost Reason
function* addLostReasonRequest(data) {
    let getData = yield addLostReasonApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(addLostReasonResponse(SUCCESS_ADD_LOST_REASON, getData.data));
    } else {
        yield put(addLostReasonResponse(ERROR_ADD_LOST_REASON, getData.data));
    }
}

export function* addLostReasonWatcher() {
    yield takeLatest(ADD_LOST_REASON, addLostReasonRequest);
}

// List Service Data
function* listLostReasonRequest(data) {
    let getData = yield listLostReasonApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        yield put(listLostReasonResponse(SUCCESS_LIST_LOST_REASON, getData.data));
    } else {
        yield put(listLostReasonResponse(ERROR_LIST_LOST_REASON, getData.data));
    }
}

export function* listLostReasonWatcher() {
    yield takeLatest(LIST_LOST_REASON, listLostReasonRequest);
}

// Change Lead Status
function* markLeadStatusRequest(data) {
    let getData = yield markLeadStatusApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(markLeadStatusResponse(SUCCESS_MARK_LEAD_STATUS, getData.data));
    } else {
        yield put(markLeadStatusResponse(ERROR_MARK_LEAD_STATUS, getData.data));
    }
}

export function* markLeadStatusWatcher() {
    yield takeLatest(MARK_LEAD_STATUS, markLeadStatusRequest);
}

// Get All Completed Leads
function* getAllCompletedLeadsRequest(data) {
    let getData = yield getAllCompletedLeadsApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        yield put(getAllCompletedLeadsResponse(SUCCESS_GET_ALL_COMPLETED_LEADS, getData.data));
    } else {
        yield put(getAllCompletedLeadsResponse(ERROR_GET_ALL_COMPLETED_LEADS, getData.data));
    }
}

export function* getAllCompletedLeadsWatcher() {
    yield takeLatest(GET_ALL_COMPLETED_LEADS, getAllCompletedLeadsRequest);
}

// Customize Lead Stage
function* customizeLeadStageRequest(data) {
    let getData = yield customizeLeadStageApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(customizeLeadStageResponse(SUCCESS_CUSTOMIZE_LEAD_STAGE, getData.data));
    } else {
        yield put(customizeLeadStageResponse(ERROR_CUSTOMIZE_LEAD_STAGE, getData.data));
    }
}

export function* customizeLeadStageWatcher() {
    yield takeLatest(CUSTOMIZE_LEAD_STAGE, customizeLeadStageRequest);
}