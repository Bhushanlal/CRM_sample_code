import {
    LIST_INVOICE, ADD_INVOICE, GET_INVOICE_BY_ID, UPDATE_INVOICE, SEND_TO_CUSTOMER_INVOICE,
    VIEW_CUSTOMER_INVOICE, MARK_PAID_INVOICE, INVOICE_MAKE_PAYMENT, GET_PAID_INVOICE, DELETE_INVOICE, UPDATE_BASIC_INVOICE,
    LIST_INVOICE_TEMPLATE, ADD_INVOICE_TEMPLATE, GET_INVOICE_TEMPLATE_BY_ID
} from '../routing/route';
import { request } from '../request/axios.request'

export async function listInvoiceApi() {
    return request({ url: LIST_INVOICE, method: 'get', })
}

export async function addInvoiceApi(data) {
    let quoteData = data.data;
    return request({ url: ADD_INVOICE, method: 'post', data: quoteData })
}

export async function getInvoiceByIdApi(quoteData) {
    let quoteId = quoteData.data;
    return request({ url: GET_INVOICE_BY_ID, method: 'get', params: quoteId, })
}

export async function updateInvoiceApi(data) {
    let quoteData = data.data;
    return request({ url: UPDATE_INVOICE, method: 'post', data: quoteData })
}

export async function sendToCustomerInvoiceApi(data) {
    let quoteData = data.data;
    return request({ url: SEND_TO_CUSTOMER_INVOICE, method: 'post', data: quoteData })
}

export async function viewCustomerInvoiceApi(quoteData) {
    let quoteId = quoteData.data;
    return request({ url: VIEW_CUSTOMER_INVOICE, method: 'get', params: quoteId, })
}

export async function markPaidInvoiceApi(data) {
    let quoteData = data.data;
    return request({ url: MARK_PAID_INVOICE, method: 'post', data: quoteData })
}

export async function invoiceMakePaymentApi(data) {
    let quoteData = data.data;
    return request({ url: INVOICE_MAKE_PAYMENT, method: 'post', data: quoteData })
}

export async function getPaidInvoiceApi() {
    return request({ url: GET_PAID_INVOICE, method: 'get' })
}

export async function deleteInvoiceApi(data) {
    let quoteId = data.data;
    return request({ url: DELETE_INVOICE, method: 'post', data: quoteId })
}

export async function updateBasicInvoiceApi(data) {
    let quoteData = data.data;
    return request({ url: UPDATE_BASIC_INVOICE, method: 'post', data: quoteData })
}

export async function listInvoiceTemplateApi() {
    return request({ url: LIST_INVOICE_TEMPLATE, method: 'get', })
}

export async function addInvoiceTemplateApi(data) {
    let quoteTemplateData = data.data;
    return request({ url: ADD_INVOICE_TEMPLATE, method: 'post', data: quoteTemplateData })
}

export async function getInvoiceTemplateByIdApi(templateData) {
    let templateId = templateData.data;
    return request({ url: GET_INVOICE_TEMPLATE_BY_ID, params: templateId, method: 'get', })
}