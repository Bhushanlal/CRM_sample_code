import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  LOGIN, REGISTER, FORGOT_PASSWORD, DASHBOARD, RESET_PASSWORD, VERIFY_TOKEN,
  ADD_BOOKING, LIST_BOOKINGS, LIST_CONTACTS, ADD_CONTACT, VIEW_CONTACT, EDIT_CONTACT,
  ADD_LEAD, LIST_LEADS, VIEW_LEAD, EDIT_LEAD, LIST_CLOSE_LEADS, CUSTOMIZE_STAGE,
  VIEW_BOOKING, EDIT_BOOKING, VIEW_PROFILE, LIST_INVOICES, LIST_QUOTES, ADD_QUOTE,
  VIEW_QUOTE, SENT_QUOTE, QUOTE_CUSTOMER_VIEW, VIEW_QUOTE_DETAIL, LIST_ACCEPTED_QUOTE,
  ACCEPT_QUOTE, ADD_BASIC_QUOTE, CONNECT_WITH_PAYPAL, ADD_BASIC_INVOICE, ADD_INVOICE,
  VIEW_INVOICE, SENT_INVOICE, INVOICE_CUSTOMER_VIEW, VIEW_INVOICE_DETAIL, LIST_PAID_INVOICE,
  ACCEPT_INVOICE
} from './routeContants';
import { Login } from '../view/screen/frontend/auth/login';
import { Register } from '../view/screen/frontend/auth/register';
import { ForgotPassword } from '../view/screen/frontend/auth/forgotPassword';
import { Dashboard } from '../view/screen/frontend/dashboard/dashboard';
import { ResetPassword } from '../view/screen/frontend/auth/resetPassword';
import { VerifyToken } from '../view/screen/frontend/auth/verifyToken';
import { AddContact } from '../view/screen/frontend/contacts/addContact';
import { ListContacts } from '../view/screen/frontend/contacts/listContacts';
import { ViewContact } from '../view/screen/frontend/contacts/viewContact';
import { AddBooking } from '../view/screen/frontend/bookings/addBooking';
import { ListBookings } from '../view/screen/frontend/bookings/listBookings';
import { ViewBooking } from '../view/screen/frontend/bookings/viewBooking';
import { AddLead } from '../view/screen/frontend/lead/addLead';
import { ListLead } from '../view/screen/frontend/lead/listLead';
import { ViewLead } from '../view/screen/frontend/lead/viewLead';
import { ListCloseLead } from '../view/screen/frontend/lead/listCloseLead';
import { CustomizeStage } from '../view/screen/frontend/lead/customizeStage';
import { ViewProfile } from '../view/screen/frontend/profile/viewProfile';
import { ListQuote } from '../view/screen/frontend/quotes/listQuote';
import { ListInvoice } from '../view/screen/frontend/invoices/listInvoice';
import { AddQuote } from '../view/screen/frontend/quotes/addQuote';
import { ViewQuote } from '../view/screen/frontend/quotes/viewQuote';
import { SentQuote } from '../view/screen/frontend/quotes/sentQuote';
import { ViewCustomerQuote } from '../view/screen/frontend/quotes/quoteCustomerView';
import { QuoteDetail } from '../view/screen/frontend/quotes/quoteDetail';
import { ListAcceptedQuote } from '../view/screen/frontend/quotes/listAcceptedQuote';
import { AcceptQuoteMessagePage } from '../view/screen/frontend/quotes/quoteAcceptMessage';
import { AddBasicQuote } from '../view/screen/frontend/quotes/addBasicQuote';
import { isLoggedIn } from './authService';
import { ConnectWithPaypal } from '../view/screen/frontend/profile/connectWithPaypal';
import { AddBasicInvoice } from '../view/screen/frontend/invoices/addBasicInvoice';
import { AddInvoice } from '../view/screen/frontend/invoices/addInvoice';
import { ViewInvoice } from '../view/screen/frontend/invoices/viewInvoice';
import { SentInvoice } from '../view/screen/frontend/invoices/sentInvoice';
import { ViewCustomerInvoice } from '../view/screen/frontend/invoices/invoiceCustomerView';
import { InvoiceDetail } from '../view/screen/frontend/invoices/invoiceDetail';
import { ListPaidInvoice } from '../view/screen/frontend/invoices/listPaidInvoice';
import { AcceptInvoiceMessagePage } from '../view/screen/frontend/invoices/invoiceAcceptMessage';
/* import { Home } from '../view/screen/website/home'; */

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      isLoggedIn() ? (
        <Component {...props} />
      ) : (
          <Redirect to={{
            pathname: LOGIN,
            state: { from: props.location },
          }}
          />
        )
    )}
  />
);

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      !isLoggedIn() || isLoggedIn() ? (
        <Component {...props} />
      ) : (
          <Redirect to={{
            pathname: DASHBOARD,
            state: { from: props.location },
          }}
          />
        )
    )}
  />
);

const LoginRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      !isLoggedIn() ? (
        <Component {...props} />
      ) : (
          <Redirect to={{
            pathname: DASHBOARD,
            state: { from: props.location },
          }}
          />
        )
    )}
  />
);

class AllRoutes extends React.Component {
  render() {
    return <Switch>
      <LoginRoute exact key="login" path={LOGIN} component={Login} />
      <PublicRoute exact path={REGISTER} component={Register} />
      <PublicRoute exact path={FORGOT_PASSWORD} component={ForgotPassword} />
      <PublicRoute exact path={RESET_PASSWORD} component={ResetPassword} />
      <PublicRoute exact path={VERIFY_TOKEN} component={VerifyToken} />
      <PrivateRoute exact key="dashboard" path={DASHBOARD} component={Dashboard} />
      <PrivateRoute exact key="add-contact" path={ADD_CONTACT} component={AddContact} />
      <PrivateRoute exact key="list-contact" path={LIST_CONTACTS} component={ListContacts} />
      <PrivateRoute exact key="view-contact" path={VIEW_CONTACT} component={ViewContact} />
      <PrivateRoute exact key="edit-contact" path={EDIT_CONTACT} component={AddContact} />
      <PrivateRoute exact key="add-lead" path={ADD_LEAD} component={AddLead} />
      <PrivateRoute exact key="edit-lead" path={EDIT_LEAD} component={AddLead} />
      <PrivateRoute exact key="list-lead" path={LIST_LEADS} component={ListLead} />
      <PrivateRoute exact key="customize-stage" path={CUSTOMIZE_STAGE} component={CustomizeStage} />
      <PrivateRoute exact key="list-close-lead" path={LIST_CLOSE_LEADS} component={ListCloseLead} />
      <PrivateRoute exact key="view-lead" path={VIEW_LEAD} component={ViewLead} />
      <PrivateRoute exact key="add-booking" path={ADD_BOOKING} component={AddBooking} />
      <PrivateRoute exact key="list-bookings" path={LIST_BOOKINGS} component={ListBookings} />
      <PrivateRoute exact key="view-profile" path={VIEW_PROFILE} component={ViewProfile} />
      <PrivateRoute exact key="view-booking" path={VIEW_BOOKING} component={ViewBooking} />
      <PrivateRoute exact key="edit-booking" path={EDIT_BOOKING} component={AddBooking} />
      <PrivateRoute exact key="list-quotes" path={LIST_QUOTES} component={ListQuote} />
      <PrivateRoute exact key="add-quote" path={ADD_QUOTE} component={AddQuote} />
      <PrivateRoute exact key="add-basic-quote" path={ADD_BASIC_QUOTE} component={AddBasicQuote} />
      <PrivateRoute exact key="view-quote" path={VIEW_QUOTE} component={ViewQuote} />
      <PrivateRoute exact key="sent-quote" path={SENT_QUOTE} component={SentQuote} />
      <PublicRoute exact key="customer-quote" path={QUOTE_CUSTOMER_VIEW} component={ViewCustomerQuote} />
      <PrivateRoute exact key="quote-detail" path={VIEW_QUOTE_DETAIL} component={QuoteDetail} />
      <PrivateRoute exact key="accepted-quote" path={LIST_ACCEPTED_QUOTE} component={ListAcceptedQuote} />
      <PublicRoute exact key="accepted-quote-message" path={ACCEPT_QUOTE} component={AcceptQuoteMessagePage} />
      <PrivateRoute exact key="list-invoices" path={LIST_INVOICES} component={ListInvoice} />
      <PrivateRoute exact key="connect-paypal" path={CONNECT_WITH_PAYPAL} component={ConnectWithPaypal} />
      <PrivateRoute exact key="add-basic-invoice" path={ADD_BASIC_INVOICE} component={AddBasicInvoice} />
      <PrivateRoute exact key="add-invoice" path={ADD_INVOICE} component={AddInvoice} />
      <PrivateRoute exact key="view-invoice" path={VIEW_INVOICE} component={ViewInvoice} />
      <PrivateRoute exact key="sent-invoice" path={SENT_INVOICE} component={SentInvoice} />
      <PublicRoute exact key="customer-invoice" path={INVOICE_CUSTOMER_VIEW} component={ViewCustomerInvoice} />
      <PrivateRoute exact key="invoice-detail" path={VIEW_INVOICE_DETAIL} component={InvoiceDetail} />
      <PrivateRoute exact key="paid-invoice" path={LIST_PAID_INVOICE} component={ListPaidInvoice} />
      <PublicRoute exact key="accepted-invoice-message" path={ACCEPT_INVOICE} component={AcceptInvoiceMessagePage} />
      {/* <PublicRoute exact key="home" path={HOME} component={Home} /> */}
      <Redirect from="/*" to={LOGIN} />
    </Switch>
  }
}

export default AllRoutes;