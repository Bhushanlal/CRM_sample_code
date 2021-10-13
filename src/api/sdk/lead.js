import {
    ADD_SERVICE, LIST_SERVICE_WITH_SOURCE, ADD_SOURCE, LIST_LEAD_STATUS, ADD_LEAD,
    GET_LEAD_BY_ID, DELETE_LEAD, UPDATE_LEAD, ADD_LEAD_NOTE, LIST_LEAD_NOTE, DELETE_LEAD_NOTE, UPDATE_LEAD_NOTE,
    LIST_LEAD, ADD_LEAD_TASK, LEAD_TASK_DATA, DELETE_LEAD_TASK, UPDATE_LEAD_TASK, UPDATE_LEAD_STATUS,
    LIST_LEAD_WITH_POSITION, LIST_LOST_REASON, ADD_LOST_REASON, MARK_LEAD_STATUS, GET_ALL_COMPLETED_LEADS,
    CUSTOMIZE_LEAD_STAGE, LIST_LEADS
} from '../routing/route';
import { request } from '../request/axios.request'

export async function addServiceApi(data) {
    let serviceData = data.data;
    return request({ url: ADD_SERVICE, method: 'post', data: serviceData })
}

export async function listServiceWithSourceApi() {
    return request({ url: LIST_SERVICE_WITH_SOURCE, method: 'get' })
}

export async function addSourceApi(data) {
    let sourceData = data.data;
    return request({ url: ADD_SOURCE, method: 'post', data: sourceData })
}

export async function listLeadStatusApi() {
    return request({ url: LIST_LEAD_STATUS, method: 'get', })
}

export async function addLeadApi(data) {
    let leadData = data.data;
    return request({ url: ADD_LEAD, method: 'post', data: leadData })
}

export async function getLeadByIdApi(leadData) {
    let leadId = leadData.data;
    return request({ url: GET_LEAD_BY_ID, method: 'get', params: leadId, })
}

export async function deleteLeadApi(data) {
    let leadIds = data.data;
    return request({ url: DELETE_LEAD, method: 'post', data: leadIds })
}

export async function updateLeadApi(data) {
    let leadData = data.data;
    return request({ url: UPDATE_LEAD, method: 'post', data: leadData })
}

export async function addLeadNoteApi(data) {
    let leadNoteData = data.data;
    return request({ url: ADD_LEAD_NOTE, method: 'post', data: leadNoteData })
}

export async function listLeadNoteApi(data) {
    let leadNoteData = data.data;
    return request({ url: LIST_LEAD_NOTE, method: 'post', data: leadNoteData })
}

export async function deleteLeadNoteApi(data) {
    let leadNoteId = data.data;
    return request({ url: DELETE_LEAD_NOTE, method: 'post', data: leadNoteId })
}

export async function updateLeadNoteApi(data) {
    let leadNoteData = data.data;
    return request({ url: UPDATE_LEAD_NOTE, method: 'post', data: leadNoteData })
}

export async function listLeadApi(data) {
    let listLeadData = data.data;
    return request({ url: LIST_LEAD, method: 'post', data: listLeadData })
}

export async function addLeadTaskApi(data) {
    let leadTaskData = data.data;
    return request({ url: ADD_LEAD_TASK, method: 'post', data: leadTaskData })
}

export async function listLeadTaskApi(data) {
    let leadTaskData = data.data;
    return request({ url: LEAD_TASK_DATA, method: 'post', data: leadTaskData })
}

export async function deleteLeadTaskApi(data) {
    let leadTaskData = data.data;
    return request({ url: DELETE_LEAD_TASK, method: 'post', data: leadTaskData })
}

export async function updateLeadTaskApi(data) {
    let leadTaskData = data.data;
    return request({ url: UPDATE_LEAD_TASK, method: 'post', data: leadTaskData })
}

export async function updateLeadStatusApi(data) {
    let leadLeadStatusData = data.data;
    return request({ url: UPDATE_LEAD_STATUS, method: 'post', data: leadLeadStatusData })
}

export async function listLeadWithPositionApi() {
    return request({ url: LIST_LEAD_WITH_POSITION, method: 'get' })
}

export async function listLostReasonApi(data) {
    let lostReasonData = data.data;
    return request({ url: LIST_LOST_REASON, method: 'post', data: lostReasonData })
}

export async function addLostReasonApi(data) {
    let lostReasonData = data.data;
    return request({ url: ADD_LOST_REASON, method: 'post', data: lostReasonData })
}

export async function markLeadStatusApi(data) {
    let leadStatusData = data.data;
    return request({ url: MARK_LEAD_STATUS, method: 'post', data: leadStatusData })
}

export async function getAllCompletedLeadsApi() {
    return request({ url: GET_ALL_COMPLETED_LEADS, method: 'get' })
}

export async function customizeLeadStageApi(data) {
    let leadStaageData = data.data;
    return request({ url: CUSTOMIZE_LEAD_STAGE, method: 'post', data: leadStaageData })
}

export async function getAssociateLeadListOptionValue(data) {
    return request({ url: LIST_LEADS, method: 'post', data })
}