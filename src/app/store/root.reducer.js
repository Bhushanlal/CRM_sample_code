import { combineReducers } from 'redux';
import { authReducer } from '../duck/auth/auth.reducer';
import { contactReducer } from '../duck/contact/contact.reducer';
import { bookingReducer } from '../duck/booking/booking.reducer';
import { leadReducer } from '../duck/lead/lead.reducer';
import { profileReducer } from '../duck/profile/profile.reducer';
import { dashboardReducer } from '../duck/dashboard/dashboard.reducer';
import { quoteReducer } from '../duck/quote/quote.reducer';
import { invoiceReducer } from '../duck/invoice/invoice.reducer';
import { websiteReducer } from '../duck/website/website.reducer';

export const rootReducer = combineReducers({
    auth: authReducer,
    contact: contactReducer,
    booking: bookingReducer,
    lead: leadReducer,
    profile: profileReducer,
    dashboard: dashboardReducer,
    quote: quoteReducer,
    invoice: invoiceReducer,
    website: websiteReducer,
});