import {
    put,
    takeLatest
} from 'redux-saga/effects';
import {
    addContactResponse, ADD_CONTACT, SUCCESS_ADD_CONTACT, ERROR_ADD_CONTACT,
    listContactResponse, LIST_CONTACT, SUCCESS_LIST_CONTACT, ERROR_LIST_CONTACT,
    deleteContactResponse, DELETE_CONTACT, SUCCESS_DELETE_CONTACT, ERROR_DELETE_CONTACT,
    getContactByIdResponse, GET_CONTACT_BY_ID, SUCCESS_GET_CONTACT_BY_ID, ERROR_GET_CONTACT_BY_ID,
    updateContactResponse, UPDATE_CONTACT, SUCCESS_UPDATE_CONTACT, ERROR_UPDATE_CONTACT,
    addContactNoteResponse, ADD_CONTACT_NOTE, SUCCESS_ADD_CONTACT_NOTE, ERROR_ADD_CONTACT_NOTE,
    listContactNoteResponse, SUCCESS_LIST_CONTACT_NOTE, LIST_CONTACT_NOTE, ERROR_LIST_CONTACT_NOTE,
    deleteContactNoteResponse, SUCCESS_DELETE_CONTACT_NOTE, DELETE_CONTACT_NOTE, ERROR_DELETE_CONTACT_NOTE,
    updateContactNoteResponse, SUCCESS_UPDATE_CONTACT_NOTE, ERROR_UPDATE_CONTACT_NOTE, UPDATE_CONTACT_NOTE,
    addContactTaskResponse, SUCCESS_ADD_CONTACT_TASK, ADD_CONTACT_TASK, ERROR_ADD_CONTACT_TASK,
    contactImportResponse, SUCCESS_CONTACT_IMPORT, ERROR_CONTACT_IMPORT, CONTACT_IMPORT,
    listContactTaskResponse, SUCCESS_LIST_CONTACT_TASK, ERROR_LIST_CONTACT_TASK, LIST_CONTACT_TASK,
    deleteContactTaskResponse, SUCCESS_DELETE_CONTACT_TASK, ERROR_DELETE_CONTACT_TASK, DELETE_CONTACT_TASK,
    updateContactTaskResponse, SUCCESS_UPDATE_CONTACT_TASK, ERROR_UPDATE_CONTACT_TASK, UPDATE_CONTACT_TASK
} from './contact.action';
import {
    addContactApi, listContactApi, deleteContactApi, getContactByIdApi, updateContactApi,
    addContactNoteApi, listContactNoteApi, deleteContactNoteApi, updateContactNoteApi,
    addContactTaskApi, contactImportApi, listContactTaskApi, deleteContactTaskApi,
    updateContactTaskApi
} from '../../../api/index';
import _ from 'lodash'
import {
    successNotification,
} from '../../common/notification-alert';

// Add Contact Data
function* addContactRequest(data) {
    let getData = yield addContactApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(addContactResponse(SUCCESS_ADD_CONTACT, getData.data));
    } else {
        yield put(addContactResponse(ERROR_ADD_CONTACT, getData.data));
    }
}

export function* addContactWatcher() {
    yield takeLatest(ADD_CONTACT, addContactRequest);
}

// List Contact Data
function* listContactRequest(data) {
    let getData = yield listContactApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        yield put(listContactResponse(SUCCESS_LIST_CONTACT, getData.data));
    } else {
        yield put(listContactResponse(ERROR_LIST_CONTACT, getData.data));
    }
}

export function* listContactWatcher() {
    yield takeLatest(LIST_CONTACT, listContactRequest);
}

// Delete Contact 
function* deleteContactRequest(data) {
    let getData = yield deleteContactApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        yield put(deleteContactResponse(SUCCESS_DELETE_CONTACT, getData.data));
    } else {
        yield put(deleteContactResponse(ERROR_DELETE_CONTACT, getData.data));
    }
}

export function* deleteContactWatcher() {
    yield takeLatest(DELETE_CONTACT, deleteContactRequest);
}

// Get Contact By Id
function* getContactByIdRequest(data) {
    let getData = yield getContactByIdApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        yield put(getContactByIdResponse(SUCCESS_GET_CONTACT_BY_ID, getData.data));
    } else {
        yield put(getContactByIdResponse(ERROR_GET_CONTACT_BY_ID, getData.data));
    }
}

export function* getContactByIdWatcher() {
    yield takeLatest(GET_CONTACT_BY_ID, getContactByIdRequest);
}

// Update Contact Data
function* updateContactRequest(data) {
    let getData = yield updateContactApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(updateContactResponse(SUCCESS_UPDATE_CONTACT, getData.data));
    } else {
        yield put(updateContactResponse(ERROR_UPDATE_CONTACT, getData.data));
    }
}

export function* updateContactWatcher() {
    yield takeLatest(UPDATE_CONTACT, updateContactRequest);
}

// Add Contact Note Data
function* addContactNoteRequest(data) {
    let getData = yield addContactNoteApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(addContactNoteResponse(SUCCESS_ADD_CONTACT_NOTE, getData.data));
    } else {
        yield put(addContactNoteResponse(ERROR_ADD_CONTACT_NOTE, getData.data));
    }
}

export function* addContactNoteWatcher() {
    yield takeLatest(ADD_CONTACT_NOTE, addContactNoteRequest);
}

// List Contact Note Data
function* listContactNoteRequest(data) {
    let getData = yield listContactNoteApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        yield put(listContactNoteResponse(SUCCESS_LIST_CONTACT_NOTE, getData.data));
    } else {
        yield put(listContactNoteResponse(ERROR_LIST_CONTACT_NOTE, getData.data));
    }
}

export function* listContactNoteWatcher() {
    yield takeLatest(LIST_CONTACT_NOTE, listContactNoteRequest);
}

// Delete Contact Note
function* deleteContactNoteRequest(data) {
    let getData = yield deleteContactNoteApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(deleteContactNoteResponse(SUCCESS_DELETE_CONTACT_NOTE, getData.data));
    } else {
        yield put(deleteContactNoteResponse(ERROR_DELETE_CONTACT_NOTE, getData.data));
    }
}

export function* deleteContactNoteWatcher() {
    yield takeLatest(DELETE_CONTACT_NOTE, deleteContactNoteRequest);
}

// Update Contact Note Data
function* updateContactNoteRequest(data) {
    let getData = yield updateContactNoteApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(updateContactNoteResponse(SUCCESS_UPDATE_CONTACT_NOTE, getData.data));
    } else {
        yield put(updateContactNoteResponse(ERROR_UPDATE_CONTACT_NOTE, getData.data));
    }
}

export function* updateContactNoteWatcher() {
    yield takeLatest(UPDATE_CONTACT_NOTE, updateContactNoteRequest);
}

// Add Contact Task Data
function* addContactTaskRequest(data) {
    let getData = yield addContactTaskApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(addContactTaskResponse(SUCCESS_ADD_CONTACT_TASK, getData.data));
    } else {
        yield put(addContactTaskResponse(ERROR_ADD_CONTACT_TASK, getData.data));
    }
}

export function* addContactTaskWatcher() {
    yield takeLatest(ADD_CONTACT_TASK, addContactTaskRequest);
}

// Contact Import
function* contactImportRequest(data) {
    let getData = yield contactImportApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(contactImportResponse(SUCCESS_CONTACT_IMPORT, getData.data));
    } else {
        yield put(contactImportResponse(ERROR_CONTACT_IMPORT, getData.data));
    }
}

export function* contactImportWatcher() {
    yield takeLatest(CONTACT_IMPORT, contactImportRequest);
}

// List Contact Task
function* listContactTaskRequest(data) {
    let getData = yield listContactTaskApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        yield put(listContactTaskResponse(SUCCESS_LIST_CONTACT_TASK, getData.data));
    } else {
        yield put(listContactTaskResponse(ERROR_LIST_CONTACT_TASK, getData.data));
    }
}

export function* listContactTaskWatcher() {
    yield takeLatest(LIST_CONTACT_TASK, listContactTaskRequest);
}

// Delete Contact Task
function* deleteContactTaskRequest(data) {
    let getData = yield deleteContactTaskApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(deleteContactTaskResponse(SUCCESS_DELETE_CONTACT_TASK, getData.data));
    } else {
        yield put(deleteContactTaskResponse(ERROR_DELETE_CONTACT_TASK, getData.data));
    }
}

export function* deleteContactTaskWatcher() {
    yield takeLatest(DELETE_CONTACT_TASK, deleteContactTaskRequest);
}


// Update Contact Task Data
function* updateContactTaskRequest(data) {
    let getData = yield updateContactTaskApi(data);
    if (getData.success && _.has(getData, 'data.data')) {
        successNotification(getData.data.message)
        yield put(updateContactTaskResponse(SUCCESS_UPDATE_CONTACT_TASK, getData.data));
    } else {
        yield put(updateContactTaskResponse(ERROR_UPDATE_CONTACT_TASK, getData.data));
    }
}

export function* updateContactTaskWatcher() {
    yield takeLatest(UPDATE_CONTACT_TASK, updateContactTaskRequest);
}
