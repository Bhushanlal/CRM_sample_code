import {
    LIST_QUOTE, ADD_QUOTE, ADD_QUOTE_TEMPLATE, GET_QUOTE_TEMPLATE_BY_ID, GET_QUOTE_BY_ID, UPDATE_QUOTE_CUSTOMER,
    UPDATE_QUOTE, SEND_TO_CUSTOMER_QUOTE, VIEW_CUSTOMER_QUOTE, CHANGE_QUOTE_STATUS, REVISE_QUOTE,
    GET_ACCEPTED_QUOTE, DELETE_QUOTE, LIST_QUOTE_TEMPLATE, UPDATE_BASIC_QUOTE
} from '../routing/route';
import { request } from '../request/axios.request'

export async function listQuoteApi() {
    return request({ url: LIST_QUOTE, method: 'get', })
}

export async function addQuoteApi(data) {
    let quoteData = data.data;
    return request({ url: ADD_QUOTE, method: 'post', data: quoteData })
}

export async function addQuoteTemplateApi(data) {
    let quoteTemplateData = data.data;
    return request({ url: ADD_QUOTE_TEMPLATE, method: 'post', data: quoteTemplateData })
}

export async function getQuoteTemplateByIdApi(templateData) {
    let templateId = templateData.data;
    return request({ url: GET_QUOTE_TEMPLATE_BY_ID, params: templateId, method: 'get', })
}

export async function getQuoteByIdApi(quoteData) {
    let quoteId = quoteData.data;
    return request({ url: GET_QUOTE_BY_ID, method: 'get', params: quoteId, })
}

export async function updateQuoteCustomerApi(data) {
    let quoteCustomerData = data.data;
    return request({ url: UPDATE_QUOTE_CUSTOMER, method: 'post', data: quoteCustomerData })
}

export async function updateQuoteApi(data) {
    let quoteData = data.data;
    return request({ url: UPDATE_QUOTE, method: 'post', data: quoteData })
}

export async function sendToCustomerQuoteApi(data) {
    let quoteData = data.data;
    return request({ url: SEND_TO_CUSTOMER_QUOTE, method: 'post', data: quoteData })
}

export async function viewCustomerQuoteApi(quoteData) {
    let quoteId = quoteData.data;
    return request({ url: VIEW_CUSTOMER_QUOTE, method: 'get', params: quoteId, })
}

export async function changeQuoteStatusApi(data) {
    let quoteData = data.data;
    return request({ url: CHANGE_QUOTE_STATUS, method: 'post', data: quoteData })
}

export async function reviseQuoteApi(data) {
    let quoteData = data.data;
    return request({ url: REVISE_QUOTE, method: 'post', data: quoteData })
}

export async function getAcceptedQuoteApi() {
    return request({ url: GET_ACCEPTED_QUOTE, method: 'get'})
}

export async function deleteQuoteApi(data) {
    let quoteId = data.data;
    return request({ url: DELETE_QUOTE, method: 'post', data: quoteId })
}

export async function listQuoteTemplateApi() {
    return request({ url: LIST_QUOTE_TEMPLATE, method: 'get', })
}

export async function updateBasicQuoteApi(data) {
    let quoteData = data.data;
    return request({ url: UPDATE_BASIC_QUOTE, method: 'post', data: quoteData })
}
