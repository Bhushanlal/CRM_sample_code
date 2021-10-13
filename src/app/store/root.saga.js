import { all } from 'redux-saga/effects';
import {
  registrationWatcher, loginWatcher, logoutWatcher, forgotPasswordWatcher, resetPasswordWatcher,
  verifyTokenWatcher, resendEmailVerificationWatcher
} from '../duck/auth/auth.saga';

import {
  addContactWatcher, listContactWatcher, deleteContactWatcher, getContactByIdWatcher, updateContactWatcher,
  addContactNoteWatcher, listContactNoteWatcher, deleteContactNoteWatcher, updateContactNoteWatcher,
  addContactTaskWatcher, contactImportWatcher, listContactTaskWatcher, deleteContactTaskWatcher,
  updateContactTaskWatcher
} from '../duck/contact/contact.saga';

import {
  addBookingWatcher, listBookingsWatcher, deleteBookingWatcher, getBookingByIdWatcher, updateBookingWatcher,
  addBookingNoteWatcher, listBookingNoteWatcher, deleteBookingNoteWatcher, updateBookingNoteWatcher,
  addBookingTaskWatcher, listBookingTaskWatcher, deleteBookingTaskWatcher,
  updateBookingTaskWatcher
} from '../duck/booking/booking.saga';

import {
  addServiceWatcher, listServiceWithSourceWatcher, addSourceWatcher, listLeadStatusWatcher, addLeadWatcher,
  getLeadByIdWatcher, deleteLeadWatcher, updateLeadWatcher, addLeadNoteWatcher, listLeadNoteWatcher, updateLeadNoteWatcher,
  deleteLeadNoteWatcher, listLeadWatcher, addLeadTaskWatcher, updateLeadTaskWatcher, deleteLeadTaskWatcher, listLeadTaskWatcher,
  updateLeadStatusWatcher, listLeadWithPositionWatcher, markLeadStatusWatcher, listLostReasonWatcher,
  addLostReasonWatcher, getAllCompletedLeadsWatcher, customizeLeadStageWatcher
} from '../duck/lead/lead.saga'

import {
  getProfileDetailWatcher, updateOwnerProfileDetailWatcher, updatePasswordWatcher, updateBusinessProfileDetailWatcher, getMenuCountWatcher, connectWithPaypalWatcher,
  makeTestPaymentWatcher, deletePaymentAccountWatcher, getSubscriptionPlanWatcher, createSubscriptionPlanWatcher, planApplyCouponWatcher, getStateTaxWatcher, updateSubscriptionPlanWatcher,
  cancelSubscriptionPlanWatcher, addProfileServiceWatcher
} from '../duck/profile/profile.saga';

import {
  addDashboardTaskWatcher, updateDashboardTaskWatcher, listDashboardTaskWatcher, deleteDashboardTaskWatcher, getBusinessSnapshotWatcher, listDashboardNotificationWatcher,
  deleteDashboardNotificationWatcher, deleteAllNotificationWatcher, markAsReadNotificationWatcher, userLoginStatusWatcher
} from '../duck/dashboard/dashboard.saga';

import {
  listQuoteWatcher, addQuoteWatcher, addQuoteTemplateWatcher, getQuoteTemplateByIdWatcher, getQuoteByIdWatcher, updateQuoteCustomerWatcher,
  updateQuoteWatcher, sendToCustomerQuoteWatcher, viewCustomerQuoteWatcher, changeQuoteStatusWatcher, reviseQuoteWatcher, getAcceptedQuoteWatcher,
  deleteQuoteWatcher, listQuoteTemplateWatcher, updateBasicQuoteWatcher
} from '../duck/quote/quote.saga';

import {
  listInvoiceWatcher, addInvoiceWatcher, getInvoiceByIdWatcher, updateInvoiceWatcher, sendToCustomerInvoiceWatcher,
  viewCustomerInvoiceWatcher, markPaidInvoiceWatcher, invoiceMakePaymentWatcher, getPaidInvoiceWatcher,
  deleteInvoiceWatcher, updateBasicInvoiceWatcher, listInvoiceTemplateWatcher, addInvoiceTemplateWatcher,
  getInvoiceTemplateByIdWatcher,
} from '../duck/invoice/invoice.saga';

import { contactUsFormWatcher } from '../duck/website/website.saga';

export function* rootSaga() {
  yield all([
    registrationWatcher(), loginWatcher(), logoutWatcher(), forgotPasswordWatcher(),
    resetPasswordWatcher(), verifyTokenWatcher(), addContactWatcher(), listContactWatcher(),
    deleteContactWatcher(), getContactByIdWatcher(), updateContactWatcher(), addContactNoteWatcher(),
    listContactNoteWatcher(), deleteContactNoteWatcher(), updateContactNoteWatcher(),
    addContactTaskWatcher(), contactImportWatcher(), listContactTaskWatcher(), deleteContactTaskWatcher(),
    updateContactTaskWatcher(), resendEmailVerificationWatcher(), addBookingWatcher(), listBookingsWatcher(),
    deleteBookingWatcher(), getBookingByIdWatcher(), updateBookingWatcher(), addServiceWatcher(),
    addSourceWatcher(), addLeadWatcher(), listServiceWithSourceWatcher(), listLeadStatusWatcher(),
    getLeadByIdWatcher(), deleteLeadWatcher(), updateLeadWatcher(), addLeadNoteWatcher(), listLeadNoteWatcher(),
    updateLeadNoteWatcher(), deleteLeadNoteWatcher(), listLeadWatcher(), addLeadTaskWatcher(),
    updateLeadTaskWatcher(), deleteLeadTaskWatcher(), listLeadTaskWatcher(), updateLeadStatusWatcher(),
    listLeadWithPositionWatcher(), markLeadStatusWatcher(), listLostReasonWatcher(), addLostReasonWatcher(),
    getAllCompletedLeadsWatcher(), customizeLeadStageWatcher(), addBookingNoteWatcher(), listBookingNoteWatcher(), deleteBookingNoteWatcher(), updateBookingNoteWatcher(),
    addBookingTaskWatcher(), listBookingTaskWatcher(), deleteBookingTaskWatcher(), updateBookingTaskWatcher(), getProfileDetailWatcher(),
    updateOwnerProfileDetailWatcher(), updatePasswordWatcher(), updateBusinessProfileDetailWatcher(),
    addDashboardTaskWatcher(), updateDashboardTaskWatcher(), listDashboardTaskWatcher(), deleteDashboardTaskWatcher(),
    getBusinessSnapshotWatcher(), listDashboardNotificationWatcher(), deleteDashboardNotificationWatcher(), deleteAllNotificationWatcher(), markAsReadNotificationWatcher(),
    getMenuCountWatcher(), listQuoteWatcher(), addQuoteWatcher(), addQuoteTemplateWatcher(), getQuoteTemplateByIdWatcher(), getQuoteByIdWatcher(), updateQuoteCustomerWatcher(),
    updateQuoteWatcher(), sendToCustomerQuoteWatcher(), viewCustomerQuoteWatcher(), changeQuoteStatusWatcher(), reviseQuoteWatcher(),
    getAcceptedQuoteWatcher(), deleteQuoteWatcher(), listQuoteTemplateWatcher(), updateBasicQuoteWatcher(),
    connectWithPaypalWatcher(), makeTestPaymentWatcher(), addInvoiceWatcher(), listInvoiceWatcher(), getInvoiceByIdWatcher(),
    updateInvoiceWatcher(), sendToCustomerInvoiceWatcher(), viewCustomerInvoiceWatcher(), markPaidInvoiceWatcher(), invoiceMakePaymentWatcher(),
    getPaidInvoiceWatcher(), deleteInvoiceWatcher(), updateBasicInvoiceWatcher(), listInvoiceTemplateWatcher(),
    addInvoiceTemplateWatcher(), getInvoiceTemplateByIdWatcher(), contactUsFormWatcher(), deletePaymentAccountWatcher(),
    userLoginStatusWatcher(), getSubscriptionPlanWatcher(), createSubscriptionPlanWatcher(), planApplyCouponWatcher(),
    getStateTaxWatcher(), updateSubscriptionPlanWatcher(), cancelSubscriptionPlanWatcher(), addProfileServiceWatcher()
  ])
} 