import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import { Link, withRouter } from "react-router-dom";
import { Loader } from '../../../component/frontend/loader/loader'
import moment from 'moment'
import { usePrevious, setImagePath, fieldValidator } from '../../../../common/custom';
import _ from 'lodash';
import { getUserDetails } from '../../../../storage/user';
import { LIST_INVOICES, ADD_INVOICE_BASE, VIEW_INVOICE_BASE, ADD_BASIC_INVOICE } from "../../../../routing/routeContants";
import ORANGE_ARROW from '../../../../assets/images/orange-arrow.svg'
import ReactHtmlParser from 'react-html-parser';
import { constants, tinyConfigEmailContent } from "../../../../common/constants";
import Modal from "react-bootstrap/Modal";
import { validateInputs } from '../../../../common/validation';
import { AddOrganization } from './addOrganization'
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import { Editor } from '@tinymce/tinymce-react';
import Swal from 'sweetalert2'
import { getInvoiceById, sendToCustomerInvoice } from "../../../../duck/invoice/invoice.action";
import { SubscriptionPlan } from "../profile/subscriptionPlans"

export const NewSentInvoice = props => {
    let invoiceId;
    if (props.match && _.has(props.match, 'params') && _.has(props.match.params, 'id')) {
        invoiceId = props.match.params.id
    }

    const dispatch = useDispatch();
    const userData = getUserDetails();
    const currentPlan = userData && userData.planData
    const [loader, setLoader] = useState(false);
    const [subscriptionModalShow, setSubscriptionModalShow] = useState(false);
    const [serviceMessage, setServiceMessage] = useState('');
    const [contactData, setContactData] = useState('');
    const [isCollapse, setIsCollapse] = useState('');
    const [previewModal, setPreviewModal] = useState(false);
    const [previewData, setPreviewData] = useState('');
    const [editorData, setEditorData] = useState('');
    const [organizationData, setOrganizationData] = useState('');
    const [state, setState] = useState({
        invoiceName: '', invoiceSerialNo: '', date: '', totalAmount: 0, dueDate: '',
        email: '', subject: '', emailFrom: 'admin@mybizzhive.com', emailErr: '', emailCls: '',
        subjectErr: '', subjectCls: '', status: 1, send_email_copy_to_user: false,
        wrongInput: constants.WRONG_INPUT, paymentReceive: 0, totalSentInvoice : 0
    });

    const getInvoiceByIdData = useSelector(state => state.invoice.getInvoiceByIdData);
    const prevGetInvoiceByIdData = usePrevious({ getInvoiceByIdData });
    const sendToCustomerInvoiceData = useSelector(state => state.invoice.sendToCustomerInvoiceData);
    const prevSendToCustomerInvoiceData = usePrevious({ sendToCustomerInvoiceData });

    // Organization Check 
    const [businessProfileModalShow, setBusinessProfileModalShow] = useState(false);

    // On Load Get Data
    useEffect(() => {
        if (invoiceId) {
            setLoader(true)
            dispatch(getInvoiceById({ id: invoiceId }))
        }
        const resizeListener = () => {
            // change width from the state object
            if (window.innerWidth < 991) {
                setIsCollapse('collapse')
            } else {
                setIsCollapse('')
            }
        };
        // set resize listener
        window.addEventListener('resize', resizeListener);
        resizeListener();
        // clean up function
        return () => {
            // remove resize listener
            window.removeEventListener('resize', resizeListener);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (prevGetInvoiceByIdData && prevGetInvoiceByIdData.getInvoiceByIdData !== getInvoiceByIdData) {
            if (getInvoiceByIdData && _.has(getInvoiceByIdData, 'data') && getInvoiceByIdData.success === true) {
                const InvoiceData = getInvoiceByIdData.data.invoice;
                if (!InvoiceData.id || InvoiceData.invoice_status_type_id !== 1) {
                    props.history.push(LIST_INVOICES)
                } else {
                    let orgName = ''
                    if (InvoiceData.user_org_map.organization.id !== 1) {
                        let orgData = InvoiceData.user_org_map.organization;
                        orgName = orgData.name + '<br>' + orgData.city + ', ' + orgData.zip + '<br>' + orgData.state + ', ' + orgData.country
                    }
                    const contactDetail = InvoiceData.contact;
                    let send_email_copy_to_user = false, email = contactDetail && contactDetail.email !== null ? contactDetail.email : '', subject = InvoiceData.name, content = 'Hi ' + contactDetail.first_name + (contactDetail.last_name !== null ? " " + contactDetail.last_name : "") + ',<br/><br/>Below is the link to the invoice for the event. I have included all the details and instructions.<br/><br/> Please review  the invoice and make payment when you get a chance. <br/><br/>Let me know if you have any questions.<br/><br/> <button class="btn" style="background: rgba(251, 154, 0, 0.65); font-size: 12px; padding: 10px 15px; display: inline-block; color: #ffff; text-decoration: none; border: none;">View Invoice</button><br/><br/> Thanks, <br/> ' + (orgName !== "" ? orgName : "Business/Person Name");
                    if (InvoiceData.description.length > 0) {
                        let emailData = _.find(InvoiceData.description, { 'type': "email" });
                        email = emailData && emailData.email_to ? emailData.email_to : contactDetail && contactDetail.email !== null ? contactDetail.email : '';
                        send_email_copy_to_user = emailData && emailData.send_email_copy_to_user === 1 ? true : false;
                        subject = emailData && emailData.email_subject ? emailData.email_subject : InvoiceData.name;
                        content = emailData && emailData.email_description ? emailData.email_description : 'Hi ' + contactDetail.first_name + (contactDetail.last_name !== null ? " " + contactDetail.last_name : "") + ',<br/><br/>Below is the link to the invoice for the event.I have included all the details and instructions.<br/><br/> Please review the invoice and make the payment when you get a chance. <br/><br/><br/> <button class="btn" style="background: rgba(251, 154, 0, 0.65); font-size: 12px; padding: 10px 15px; display: inline-block; color: #ffff; text-decoration: none; border: none;">View Invoice</button><br/><br/> Thanks, <br/> ' + (orgName !== "" ? orgName : "Business/Person Name");
                    }
                    setLoader(false);
                    setContactData(InvoiceData.contact);
                    setEditorData(content)
                    setState({
                        ...state,
                        invoiceName: InvoiceData.name,
                        invoiceSerialNo: InvoiceData.invoice_serial_no,
                        date: InvoiceData.event_date !== null ? InvoiceData.event_date : '',
                        paymentReceive: InvoiceData && InvoiceData.amount_received ? InvoiceData.amount_received : 0,
                        totalAmount: InvoiceData.amount_total !== null ? InvoiceData.amount_total : 0,
                        dueDate: InvoiceData.due_date !== null ? InvoiceData.due_date : '',
                        email, subject, send_email_copy_to_user, totalSentInvoice: getInvoiceByIdData.data && getInvoiceByIdData.data.total_sent_invoices
                    })
                    setOrganizationData(InvoiceData.user_org_map.organization);
                }
            }
            if (getInvoiceByIdData && _.has(getInvoiceByIdData, 'message') && getInvoiceByIdData.success === false) {
                setLoader(false)
                setServiceMessage(getInvoiceByIdData.message)
            }
        }
        if (prevSendToCustomerInvoiceData && prevSendToCustomerInvoiceData.sendToCustomerInvoiceData !== sendToCustomerInvoiceData) {
            if (sendToCustomerInvoiceData && _.has(sendToCustomerInvoiceData, 'data') && sendToCustomerInvoiceData.success === true) {
                setLoader(false)
                props.history.push(LIST_INVOICES)
            }
            if (sendToCustomerInvoiceData && _.has(sendToCustomerInvoiceData, 'message') && sendToCustomerInvoiceData.success === false) {
                setLoader(false)
                if (sendToCustomerInvoiceData.message === 'Please add organization first.') {
                    setBusinessProfileModalShow(true)
                } else {
                    setServiceMessage(sendToCustomerInvoiceData.message)
                }
            }
        }
    }, [prevGetInvoiceByIdData, getInvoiceByIdData, prevSendToCustomerInvoiceData, sendToCustomerInvoiceData]); // eslint-disable-line react-hooks/exhaustive-deps

    // Check Validation Function 
    const checkValidation = (field, value, type, maxLength, minLength, fieldType) => {
        return fieldValidator(field, value, type, null, maxLength, minLength, fieldType)
    }

    // Set The Quote Input Values
    const setQuoteInputValue = (e, type, maxLength, minLength) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
        setState({ ...state, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        setServiceMessage('');
    }

    // Send To Customer Quote
    const sendToCustomerInvoiceFunction = (status) => {
        let error = state.wrongInput;
        let email = state.email, emailCls = '', emailErr = '',
            subject = state.subject, subjectCls = '', subjectErr = '', getError = false;

        if (status !== 1) {
            if (validateInputs('string', subject) === 'empty') {
                subjectErr = 'Please enter subject.';
                subjectCls = error
                getError = true;
            } else if (validateInputs('string', subject) === false) {
                subjectErr = 'Please enter valid subject.';
                subjectCls = error
                getError = true;
            }

            if (validateInputs('email', email) === 'empty') {
                emailErr = 'Please enter email.';
                emailCls = error
                getError = true;
            } else if (validateInputs('email', email) === false) {
                emailErr = 'Please enter valid email.';
                emailCls = error
                getError = true;
            }
        }

        setState({
            ...state, emailCls, emailErr, subjectCls, subjectErr, status
        })

        if (getError === false && subjectErr === '' && emailErr === '') {
            if (status !== 1) {
                if ((currentPlan && currentPlan.subscription_product_id === 4 && currentPlan.plan_is_active === 1) || (currentPlan && currentPlan.subscription_product_id === 1 && currentPlan.trial_product_type!==4 && currentPlan.plan_is_active === 1 && state.totalSentInvoice<1) || (currentPlan && currentPlan.subscription_product_id === 1 && currentPlan.trial_product_type===4 && currentPlan.plan_is_active === 1)) {
                    Swal.fire({
                        title: 'Please Confirm',
                        text: 'Are you sure you want to send the invoice to the customer? You will not be able to make any changes after sending the invoice.',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No',
                        reverseButtons: true,
                        showCloseButton: true,
                        customClass: "mycustom-alert",
                        cancelButtonClass: 'cancel-alert-note',
                    }).then((result) => {
                        if (result.value) {
                            setLoader(true)
                            let data = { id: invoiceId, email_to: state.email, email_from: state.emailFrom, email_subject: state.subject, email_description: editorData, invoice_status_type_id: status, send_email_copy_to_user: state.send_email_copy_to_user ? 1 : 0 };
                            dispatch(sendToCustomerInvoice(data))
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            // console.log('cancel')
                        }
                    })
                } else {
                    let msg, warMsg, buttonMsg;
                    if (currentPlan && currentPlan.plan_is_active === 0) {
                        console.log('1')
                        buttonMsg = currentPlan.subscription_product_id === 1 ? 'View Plans' : 'Renew Plan'
                        warMsg = currentPlan.subscription_product_id === 1 ? 'Free Trial Expired' : 'Subscription Expired'
                        msg = currentPlan.subscription_product_id === 1 ? 'Your free trial has expired. Please subscribe to a plan to access the application. ' : 'Your subscription has expired. Please renew your subscription or upgrade your plan to access the application. ';
                    } 
                    else {
                         warMsg = 'Warning'
                         buttonMsg = 'Upgrade Plan'
                          msg = 'Your current plan does not include invoice. Please upgrade your plan to access the functionality.';
                    }

                    if (currentPlan && currentPlan.subscription_product_id === 1 && currentPlan.plan_is_active === 1){
                        Swal.fire({
                            title: warMsg,
                            html: msg,
                            showCancelButton: true,
                            confirmButtonText: buttonMsg,
                            cancelButtonText: 'Close',
                            reverseButtons: true,
                            showCloseButton: true,
                            customClass: "mycustom-alert",
                            cancelButtonClass: 'cancel-alert-note',
                        }).then((result) => {
                            if (result.value) {
                                setSubscriptionModalShow(true)
                            } else if (result.dismiss === Swal.DismissReason.cancel) {
                                // console.log('cancel')
                            }
                        })
                    }
                }
            } else {
                setLoader(true);
                let data = { id: invoiceId, email_to: state.email, email_from: state.emailFrom, email_subject: state.subject, email_description: editorData, invoice_status_type_id: status, send_email_copy_to_user: state.send_email_copy_to_user ? 1 : 0 };
                dispatch(sendToCustomerInvoice(data))
            }
        } else {
            setServiceMessage('Please enter all required details.')
        }
    }

    // Send To Customer Quote
    const previewEmail = (e) => {
        e.currentTarget.blur();
        let data = editorData;
        setPreviewModal(true);
        setPreviewData(ReactHtmlParser(data))
    }

    // On Close
    const closeForm = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: ' You will lose all the changes if you navigate away',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel it',
            cancelButtonText: 'No, keep it',
            reverseButtons: true,
            showCloseButton: true,
            customClass: "mycustom-alert",
            cancelButtonClass: 'cancel-alert-note',
        }).then((result) => {
            if (result.value) {
                props.history.push(LIST_INVOICES)
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // console.log('cancel')
            }
        })
    }

    // Move To Basic Detail Page 
    const movedToBasicDetailPage = (e) => {
        props.history.push({
            pathname: ADD_BASIC_INVOICE,
            state: { invoiceDataState: getInvoiceByIdData.data }
        })
    }

    // Move To Quote Detail Page 
    const movedToInvoiceDetailPage = (e) => {
        props.history.push(ADD_INVOICE_BASE + invoiceId)
    }

    // Move To Preview Detail Page 
    const movedToPreviewPage = (e) => {
        props.history.push(VIEW_INVOICE_BASE + invoiceId)
    }

    return (
        <>
            <Loader loader={loader} />
            <div className="main-site fixed--header lead-page-hdr unfixed-page-title">
                <Header getMainRoute={'invoices'} />
                <main className="site-body">

                    <section className="page-title contact--header">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-auto title--col">
                                    <div>
                                        <ol className="breadcrumb d-none d-lg-flex">
                                            <li className="breadcrumb-item"><Link to={LIST_INVOICES}>Invoices</Link></li>
                                            <li className="breadcrumb-item"><Link to={ADD_INVOICE_BASE + invoiceId}>Edit Invoice</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">Message to Customer</li>
                                        </ol>
                                        <h2 className="title">Invoice: {state.invoiceSerialNo} <small className="font-small">({state.invoiceName})</small></h2>
                                    </div>
                                </div>
                                <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                    <button onClick={(e) => closeForm(e)} className="btn btn-dark mr-15">Close</button>
                                    <button onClick={() => sendToCustomerInvoiceFunction(1)} className="btn btn-secondary mr-15">Save as Draft</button>
                                    <div className="btn-divider mr-15"></div>
                                    <Link to={VIEW_INVOICE_BASE + invoiceId} className="btn btn-secondary mr-15">Back</Link>
                                    <button onClick={() => sendToCustomerInvoiceFunction(2)} className="btn btn-primary d-none d-lg-flex">Send to Customer</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="middle-section pt-0">
                        <div className="container">
                            {serviceMessage ? <div className="errorCls errCommonCls mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{serviceMessage}</div> : ''}
                            <div className="row no-gutters-mbl mb-lg-4">
                                <div className="col-12">
                                    <div className="main-card">
                                        <div className="card w-100">
                                            <div className="card-body p-0">
                                                <div className="new-lead-timeline">
                                                    <div className="timeline_row">
                                                        <div className="timeline-cols completed" onClick={(e) => movedToBasicDetailPage(e)}><h5><em className="d-none d-lg-flex">1. Basic Details</em> <i className="d-lg-none">1</i></h5><span></span></div>
                                                        <div className="timeline-cols completed" onClick={(e) => movedToInvoiceDetailPage(e)}><h5><em className="d-none d-lg-flex">2. Invoice Details</em> <i className="d-lg-none">2</i></h5><span></span></div>
                                                        <div className="timeline-cols completed" onClick={(e) => movedToPreviewPage(e)}><h5><em className="d-none d-lg-flex">3. Preview Invoice</em> <i className="d-lg-none">3</i></h5><span></span></div>
                                                        <div className="timeline-cols active"><h5><em className="d-none d-lg-flex">4. Message to Customer</em> <i className="d-lg-none">3</i></h5><span></span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row no-gutters-mbl mt-lg-3">
                                <div className="col-lg-12">
                                    <div className="main-card">
                                        <div className="card">
                                            <div className="card-body px-4">
                                                <div className="row">
                                                    <div className="col-lg-3">
                                                        <div className="form-group mb-lg-0">
                                                            {contactData.first_name ? <label><strong>{contactData.first_name + (contactData.last_name !== null ? ' ' + contactData.last_name : '')}</strong></label> : ''}
                                                            <div className="field-text mb-0">{contactData.phone}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="form-group mb-lg-0">
                                                            <label>Date</label>
                                                            <div className="field-text mb-0">{state.date !== '' ? moment(state.date).format('ddd, MMM DD YYYY') : '-'}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="form-group mb-lg-0">
                                                            <label>Total Amount (Advance)</label>
                                                            <div className="field-text mb-0">${state.totalAmount} (${state.paymentReceive})</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="form-group mb-lg-0">
                                                            <label>Due Date</label>
                                                            <div className="field-text">{state.dueDate !== '' ? moment(state.dueDate).format('ddd, MMM DD YYYY') : '-'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row no-gutters-mbl mt-lg-4">
                                <div className="col-lg-12">
                                    <div className="main-card create-qoute--cards create-form">
                                        <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#LineItemsCollapse" aria-expanded="true" aria-controls="LineItemsCollapse">
                                            Message to Customer
                                    <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                        <div className={"card main-card--collapse show " + isCollapse} id="LineItemsCollapse">
                                            <div className="card-header d-none d-lg-flex justify-content-between align-items-center">
                                                <h4 className="quote-heading">Message to Customer</h4>
                                            </div>
                                            <div className="card-body">

                                                <div className="message-sender-wrap">
                                                    <div className="email--to">
                                                        <span>To:</span>
                                                        <div className="emailField">
                                                            <div className="form-group">
                                                                <div className={"floating-label float-error " + state.emailCls}>
                                                                    <input placeholder="Enter Email" onChange={(e) => setQuoteInputValue(e, 'email', null, null)} name="email" value={state.email} type="text" className="floating-input" />
                                                                    {state.emailErr ? <span className="errorValidationMessage"> {state.emailErr}</span> : ''}
                                                                </div>
                                                            </div>
                                                            <div className="email--from">
                                                                From: <strong>{organizationData.id !== 1 ? organizationData.name + ' ' : ''}({state.emailFrom})</strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="email--subject">
                                                        <span>Subject:</span>
                                                        <div className="emailField">
                                                            <div className="form-group">
                                                                <div className={"floating-label " + state.subjectCls}>
                                                                    <input placeholder="Enter Subject" onChange={(e) => setQuoteInputValue(e, 'string', 100, null)} name="subject" value={state.subject} type="text" className="floating-input" />
                                                                    {state.subjectErr ? <span className="errorValidationMessage"> {state.subjectErr}</span> : ''}
                                                                </div>
                                                            </div>
                                                            <div className="access--code">
                                                                <div className="custom-control custom-checkbox">
                                                                    <input type="checkbox" className="custom-control-input" id="customCheck3" checked={state.send_email_copy_to_user} onChange={(e) => setState({ ...state, send_email_copy_to_user: e.target.checked })} />
                                                                    <label className="custom-control-label" htmlFor="customCheck3"> Send a copy to <strong>{userData && userData.email}</strong></label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="email-text--editor mt-3">
                                                        <Editor
                                                            value={editorData !== '' ? editorData : ''}
                                                            apiKey={constants.tinyAapiKey}
                                                            init={tinyConfigEmailContent}
                                                            onEditorChange={(data) => setEditorData(data)}
                                                        />
                                                    </div>

                                                    <div className="email_Btns mt-3">
                                                        <button onClick={(e) => previewEmail(e)} className="btn btn-secondary mr-2">Preview Email</button>
                                                        <button className="btn btn-primary mr-2" href="#google" onClick={() => sendToCustomerInvoiceFunction(2)} >Send to Customer </button>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                {/* Preview Email */}
                <Modal show={previewModal} onHide={() => setPreviewModal(false)} size="lg" className="" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Preview Email
                            </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {previewData}
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>

                {/* Add Organization*/}
                <AddOrganization loader={(data) => setLoader(data)}
                    openOrg={businessProfileModalShow}
                    sentToCustomerCall={(data) => sendToCustomerInvoiceFunction(state.status)}
                    closeOrg={() => setBusinessProfileModalShow(false)}
                />
                <Footer />

                {/* Subscription Modal*/}
                <SubscriptionPlan loader={(data) => setLoader(data)}
                    openSubscriptionModal={subscriptionModalShow}
                    closeSubscriptionModal={() => setSubscriptionModalShow(false)}
                    updatePlanDetail={(data) => { setSubscriptionModalShow(false); setLoader(false) }}
                    currentPlan={currentPlan}
                />
            </div >
        </>
    );
}

export const SentInvoice = withRouter(NewSentInvoice);