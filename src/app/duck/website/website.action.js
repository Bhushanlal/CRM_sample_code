// contact us form
export const CONTACT_US_FORM = 'CONTACT_US_FORM';
export const contactUsForm = (data) => ({ type: CONTACT_US_FORM, data });
export const SUCCESS_CONTACT_US_FORM = 'SUCCESS_CONTACT_US_FORM';
export const ERROR_CONTACT_US_FORM = 'ERROR_CONTACT_US_FORM';
export const contactUsFormResponse = (type, data) => ({ type, data });