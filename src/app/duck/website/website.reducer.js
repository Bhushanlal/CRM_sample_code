import { SUCCESS_CONTACT_US_FORM, ERROR_CONTACT_US_FORM } from "./website.action";
import { DEFAULT_STATE } from "./website.state";

export const websiteReducer = (state = DEFAULT_STATE, action = {
    type: {},
    data: {}
}) => {
    switch (action.type) {
        case SUCCESS_CONTACT_US_FORM:
            const contactUsFormData = action.data;
            return { ...state, contactUsFormData }
        case ERROR_CONTACT_US_FORM:
            const errorContactUsFormData = action.data;
            return { ...state, contactUsFormData: errorContactUsFormData }
        default:
            return state;
    }
}