const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const URL = (uri) => `${BASE_URL}${uri}`;

/***** Auth Routes*********/
export const REGISTRATION = URL('/register');
export const USER_LOGIN = URL('/login');
export const FORGOT_PASSWORD = URL('/password/email');
export const RESET_PASSWORD = URL('/reset-password');
export const VERIFY_TOKEN = URL('/verify-email');
export const USER_LOGOUT = URL('/logout');
export const RESEND_EMAIL_VERIFICATION = URL('/resend-email-verification');

/****** Contact  Routes ******/
export const ADD_CONTACT = URL('/contact/create');
export const LIST_CONTACT = URL('/contact/list');
export const DELETE_CONTACT = URL('/contact/delete');
export const GET_CONTACT_BY_ID = URL('/contact/view');
export const UPDATE_CONTACT = URL('/contact/update');
export const ADD_CONTACT_NOTE = URL('/contact/note/create');
export const LIST_CONTACT_NOTE = URL('/contact/note/list');
export const DELETE_CONTACT_NOTE = URL('/contact/note/delete');
export const UPDATE_CONTACT_NOTE = URL('/contact/note/update');
export const ADD_CONTACT_TASK = URL('/contact/task/create');
export const CONTACT_IMPORT = URL('/contact/import');
export const CONTACT_TASK_DATA = URL('/contact/task/list');
export const DELETE_CONTACT_TASK = URL('/contact/task/delete');
export const UPDATE_CONTACT_TASK = URL('/contact/task/update');

/***** Booking Routes ******/
export const ADD_BOOKING = URL('/booking/create');
export const LIST_BOOKINGS = URL('/booking/list');
export const DELETE_BOOKING = URL('/booking/delete');
export const GET_BOOKING_BY_ID = URL('/booking/view');
export const UPDATE_BOOKING = URL('/booking/update');

export const ADD_BOOKING_NOTE = URL('/booking/note/create');
export const LIST_BOOKING_NOTE = URL('/booking/note/list');
export const DELETE_BOOKING_NOTE = URL('/booking/note/delete');
export const UPDATE_BOOKING_NOTE = URL('/booking/note/update');
export const ADD_BOOKING_TASK = URL('/booking/task/create');
export const BOOKING_TASK_DATA = URL('/booking/task/list');
export const DELETE_BOOKING_TASK = URL('/booking/task/delete');
export const UPDATE_BOOKING_TASK = URL('/booking/task/update');

/****** Lead  Routes ******/
export const ADD_SERVICE = URL('/service/create');
export const LIST_SERVICE_WITH_SOURCE = URL('/service/list-with-source');
export const ADD_SOURCE = URL('/source/create');
export const LIST_SOURCE = URL('/source/list');
export const ADD_LEAD = URL('/lead/create');
export const LIST_LEAD_STATUS = URL('/lead/status/list');
export const GET_LEAD_BY_ID = URL('/lead/view');
export const DELETE_LEAD = URL('/lead/delete');
export const UPDATE_LEAD = URL('/lead/update');
export const ADD_LEAD_NOTE = URL('/lead/note/create');
export const LIST_LEAD_NOTE = URL('/lead/note/list');
export const DELETE_LEAD_NOTE = URL('/lead/note/delete');
export const UPDATE_LEAD_NOTE = URL('/lead/note/update');
export const LIST_LEAD = URL('/lead/list');
export const ADD_LEAD_TASK = URL('/lead/task/create');
export const LEAD_TASK_DATA = URL('/lead/task/list');
export const DELETE_LEAD_TASK = URL('/lead/task/delete');
export const UPDATE_LEAD_TASK = URL('/lead/task/update');
export const UPDATE_LEAD_STATUS = URL('/lead/update-status');
export const LIST_LEAD_WITH_POSITION = URL('/lead/board-list');
export const LIST_LOST_REASON = URL('/lead/lost/list');
export const ADD_LOST_REASON = URL('/lead/lost/create');
export const MARK_LEAD_STATUS = URL('/lead/status/close-lead');
export const GET_ALL_COMPLETED_LEADS = URL('/lead/status/list-close');
export const CUSTOMIZE_LEAD_STAGE = URL('/lead/status/customize');
export const LIST_LEADS = URL('/lead/list');

/****** Profile Routes ******/
export const GET_PROFILE_DETAIL = URL('/me');
export const UPDATE_OWNER_PROFILE_DETAIL = URL('/account/update');
export const UPDATE_PASSWORD = URL('/account/reset-password');
export const UPDATE_BUSINESS_PROFILE_DETAIL = URL('/account/org/update');
export const GET_MENU_COUNT = URL('/account/entity-count');
export const CONNECT_WITH_PAYPAL = URL('/payment/check-business');
export const MAKE_TEST_PAYMENT = URL('/payment/add-test-payment');
export const DELETE_PAYMENT_ACCOUNT = URL('/payment/remove-account');
export const GET_SUBSCRIPTION_PLAN = URL('/subscription/list');
export const CREATE_SUSBCRIPTION_PLAN = URL('/subscription/new-subscription');
export const UPDATE_SUSBCRIPTION_PLAN = URL('/subscription/change-subscription');
export const PLAN_APPLY_COUPON = URL('/coupon/detail');
export const GET_STATE_TAX = URL('/state/list');
export const CANCEL_SUSBCRIPTION_PLAN = URL('/subscription/cancel-subscription');
export const ADD_PROFILE_SERVICE = URL('/service/set-default-service');

/*** Dashboard Route *****/
export const ADD_DASHBOARD_TASK = URL('/account/task/create');
export const DASHBOARD_TASK_DATA = URL('/account/all-tasks');
export const DELETE_DASHBOARD_TASK = URL('/account/task/delete');
export const UPDATE_DASHBOARD_TASK = URL('/account/task/update');
export const GET_BUSINESS_SNAPSHOT = URL('/account/business-snapshot');
export const DASHBOARD_NOTIFICATION_DATA = URL('/notification/list');
export const DELETE_DASHBOARD_NOTIFICATION = URL('/notification/delete');
export const DELETE_ALL_NOTIFICATION = URL('/notification/delete-all');
export const MARK_AS_READ_NOTIFICATION = URL('/notification/mark-as-read');
export const USER_LOGIN_STATUS = URL('/account/update-welcome');

/*** Quote Route *****/
export const LIST_QUOTE = URL('/quote/board-list');
export const ADD_QUOTE = URL('/quote/create');
export const ADD_QUOTE_TEMPLATE = URL('/quote/template/create');
export const GET_QUOTE_TEMPLATE_BY_ID = URL('/quote/template/view');
export const GET_QUOTE_BY_ID = URL('/quote/view');
export const UPDATE_QUOTE_CUSTOMER = URL('/quote/update-customer');
export const UPDATE_QUOTE = URL('/quote/update');
export const SEND_TO_CUSTOMER_QUOTE = URL('/quote/send-to-customer');
export const VIEW_CUSTOMER_QUOTE = URL('/quote/invoice-detail');
export const CHANGE_QUOTE_STATUS = URL('/quote/accept-invoice');
export const REVISE_QUOTE = URL('/quote/revision-draft');
export const GET_ACCEPTED_QUOTE = URL('/quote/list-accept-quote');
export const DELETE_QUOTE = URL('/quote/delete-quote');
export const LIST_QUOTE_TEMPLATE = URL('/quote/template/list');
export const UPDATE_BASIC_QUOTE = URL('/quote/quote-update');

/*** Invoice Route *****/
export const LIST_INVOICE = URL('/invoice/board-list');
export const ADD_INVOICE = URL('/invoice/create');
export const GET_INVOICE_BY_ID = URL('/invoice/view');
export const UPDATE_INVOICE = URL('/invoice/update');
export const SEND_TO_CUSTOMER_INVOICE = URL('/invoice/send-to-customer');
export const VIEW_CUSTOMER_INVOICE = URL('/invoice/customer-view');
export const MARK_PAID_INVOICE = URL('/invoice/mark-as-paid');
export const INVOICE_MAKE_PAYMENT = URL('/invoice/accept-invoice');
export const GET_PAID_INVOICE = URL('/invoice/list-paid-invoice');
export const DELETE_INVOICE = URL('/invoice/delete');
export const UPDATE_BASIC_INVOICE = URL('/invoice/invoice-update');
export const LIST_INVOICE_TEMPLATE = URL('/invoice/template/list');
export const ADD_INVOICE_TEMPLATE = URL('/invoice/template/create');
export const GET_INVOICE_TEMPLATE_BY_ID = URL('/invoice/template/view');

/**** Website Route ****/
export const CONTACT_US_FORM = URL('/contact-us');
