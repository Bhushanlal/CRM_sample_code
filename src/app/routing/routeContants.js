export const LOGIN = "/auth/login";
export const REGISTER = "/auth/register";
export const FORGOT_PASSWORD = "/auth/forgot-password";
export const DASHBOARD = "/user/dashboard";
export const RESET_PASSWORD = "/auth/reset-password/:token";
export const VERIFY_TOKEN = "/auth/verify-email";

/* Contact Module */
export const ADD_CONTACT = "/user/add-contact";
export const LIST_CONTACTS = "/user/list-contacts";
export const VIEW_CONTACT_BASE = "/user/view-contact/";
export const VIEW_CONTACT = VIEW_CONTACT_BASE + ":id";
export const EDIT_CONTACT_BASE = "/user/edit-contact/";
export const EDIT_CONTACT = EDIT_CONTACT_BASE + ":id";

/* Booking Module */
export const ADD_BOOKING = "/user/add-booking";
export const LIST_BOOKINGS = "/user/list-bookings";
export const VIEW_BOOKING_BASE = "/user/view-booking/";
export const VIEW_BOOKING = VIEW_BOOKING_BASE + ":id";
export const EDIT_BOOKING_BASE = "/user/edit-booking/";
export const EDIT_BOOKING = EDIT_BOOKING_BASE + ":id";

/* Leads Module */
export const ADD_LEAD = "/user/add-lead";
export const LIST_LEADS = "/user/list-leads";
export const VIEW_LEAD_BASE = "/user/view-lead/";
export const VIEW_LEAD = VIEW_LEAD_BASE + ":id";
export const EDIT_LEAD_BASE = "/user/edit-lead/";
export const EDIT_LEAD = EDIT_LEAD_BASE + ":id";
export const LIST_CLOSE_LEADS = "/user/list-close-leads";
export const CUSTOMIZE_STAGE = "/user/cusomize-stage";

/* Profile Module */
export const VIEW_PROFILE = "/user/view-profile";

/* Quotes Module */
export const LIST_QUOTES = "/user/list-quotes";
export const ADD_QUOTE_BASE = "/user/add-quote/";
export const ADD_QUOTE = ADD_QUOTE_BASE + ":id";
export const VIEW_QUOTE_BASE = "/user/view-quote/";
export const VIEW_QUOTE = VIEW_QUOTE_BASE + ":id";
export const SENT_QUOTE_BASE = "/user/sent-quote/";
export const SENT_QUOTE =  SENT_QUOTE_BASE + ":id";
export const QUOTE_CUSTOMER_VIEW ="/quote-customer-view/:id";
export const VIEW_QUOTE_DETAIL_BASE ="/user/quote-detail/";
export const VIEW_QUOTE_DETAIL = VIEW_QUOTE_DETAIL_BASE + ":id";
export const LIST_ACCEPTED_QUOTE = '/user/list-accepted-quote';
export const ACCEPT_QUOTE = '/user/accepted-quote';
export const ADD_BASIC_QUOTE = '/user/add-quote';
export const CONNECT_WITH_PAYPAL = '/user/connect-with-paypal';

/* Invoices Module */
export const LIST_INVOICES = "/user/list-invoices";
export const ADD_BASIC_INVOICE = "/user/add-invoice";
export const ADD_INVOICE_BASE = "/user/add-invoice/";
export const ADD_INVOICE = ADD_INVOICE_BASE + ":id";
export const VIEW_INVOICE_BASE = "/user/view-invoice/";
export const VIEW_INVOICE = VIEW_INVOICE_BASE + ":id";
export const SENT_INVOICE_BASE = "/user/sent-invoice/";
export const SENT_INVOICE = SENT_INVOICE_BASE + ":id";
export const INVOICE_CUSTOMER_VIEW = "/invoice-customer-view/:id";
export const VIEW_INVOICE_DETAIL_BASE = "/user/invoice-detail/";
export const VIEW_INVOICE_DETAIL = VIEW_INVOICE_DETAIL_BASE + ":id";
export const LIST_PAID_INVOICE = '/user/list-paid-invoice';
export const ACCEPT_INVOICE = '/user/accepted-invoice';

/** Home Page  */
export const HOME = '/';