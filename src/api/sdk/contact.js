import {
    ADD_CONTACT, LIST_CONTACT, DELETE_CONTACT, GET_CONTACT_BY_ID, UPDATE_CONTACT,
    ADD_CONTACT_NOTE, LIST_CONTACT_NOTE, DELETE_CONTACT_NOTE, UPDATE_CONTACT_NOTE,
    ADD_CONTACT_TASK, CONTACT_IMPORT, CONTACT_TASK_DATA, DELETE_CONTACT_TASK,
    UPDATE_CONTACT_TASK
} from '../routing/route';
import { request } from '../request/axios.request'

export async function addContactApi(data) {
    let contactData = data.data;
    return request({ url: ADD_CONTACT, method: 'post', data: contactData })
}

export async function listContactApi(data) {
    let contactData = data.data;
    return request({ url: LIST_CONTACT, method: 'post', data: contactData })
}

export async function deleteContactApi(data) {
    let contactIds = data.data;
    return request({ url: DELETE_CONTACT, method: 'post', data: contactIds })
}

export async function getContactByIdApi(contactData) {
    let contactId = contactData.data;
    return request({ url: GET_CONTACT_BY_ID, params: contactId, method: 'get' })
}

export async function updateContactApi(data) {
    let contactData = data.data;
    return request({ url: UPDATE_CONTACT, method: 'post', data: contactData })
}

export async function addContactNoteApi(data) {
    let contactNoteData = data.data;
    return request({ url: ADD_CONTACT_NOTE, method: 'post', data: contactNoteData })
}

export async function listContactNoteApi(data) {
    let contactNoteData = data.data;
    return request({ url: LIST_CONTACT_NOTE, method: 'post', data: contactNoteData })
}

export async function deleteContactNoteApi(data) {
    let contactNoteId = data.data;
    return request({ url: DELETE_CONTACT_NOTE, method: 'post', data: contactNoteId })
}

export async function updateContactNoteApi(data) {
    let contactNoteData = data.data;
    return request({ url: UPDATE_CONTACT_NOTE, method: 'post', data: contactNoteData })
}

export async function addContactTaskApi(data) {
    let contactTaskData = data.data;
    return request({ url: ADD_CONTACT_TASK, method: 'post', data: contactTaskData })
}

export async function contactImportApi(data) {
    let importData = data.data;
    return request({ url: CONTACT_IMPORT, method: 'post', data: importData })
}

export async function listContactTaskApi(data) {
    let contactTaskData = data.data;
    return request({ url: CONTACT_TASK_DATA, method: 'post', data: contactTaskData })
}

export async function deleteContactTaskApi(data) {
    let contactTaskData = data.data;
    return request({ url: DELETE_CONTACT_TASK, method: 'post', data: contactTaskData })
}

export async function updateContactTaskApi(data) {
    let contactTaskData = data.data;
    return request({ url: UPDATE_CONTACT_TASK, method: 'post', data: contactTaskData })
}

export async function getContactListOptionValue(data) {
    return request({ url: LIST_CONTACT, method: 'post', data })
}