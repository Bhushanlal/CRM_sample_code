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
import { getQuoteById, sendToCustomerQuote } from '../../../../duck/quote/quote.action';
import { ADD_QUOTE_BASE, LIST_QUOTES, VIEW_QUOTE_BASE, ADD_BASIC_QUOTE } from "../../../../routing/routeContants";
import ORANGE_ARROW from '../../../../assets/images/orange-arrow.svg'
import ReactHtmlParser from 'react-html-parser';
import { constants, tinyConfigEmailContent } from "../../../../common/constants";
import Modal from "react-bootstrap/Modal";
import { validateInputs } from '../../../../common/validation';
import { AddOrganization } from './addOrganization'
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import { Editor } from '@tinymce/tinymce-react';
import Swal from 'sweetalert2'
import { SubscriptionPlan } from "../profile/subscriptionPlans"

export const NewSentQuote = props => {
    let quoteId;
    if (props.match && _.has(props.match, 'params') && _.has(props.match.params, 'id')) {
        quoteId = props.match.params.id
    }

    const dispatch = useDispatch();
    const userData = getUserDetails();
    const currentPlan = userData && userData.planData
    const [loader, setLoader] = useState(false);
    const [subscriptionModalShow, setSubscriptionModalShow] = useState(false);
    const [serviceMessage, setServiceMessage] = useState('');
    const [contactData, setContactData] = useState('');
    const [Tentative, setTentative] = useState(0)
    const [isCollapse, setIsCollapse] = useState('');
    const [previewModal, setPreviewModal] = useState(false);
    const [previewData, setPreviewData] = useState('');
    const [editorData, setEditorData] = useState('');
    const [organizationData, setOrganizationData] = useState('');
    const [state, setState] = useState({
        quoteName: '', timeValue: '', location: '', internalNotes: '', wrongInput: constants.WRONG_INPUT,
        timeShiftValue: '', customDuration: '', lat_long: '', totalAmount: 0, deposite: 0, date: '',
        lineItem: '', itemName: '', discription: '', charge: '', validThrough: '', latLngUrl: '',
        email: '', subject: '', emailFrom: 'admin@mybizzhive.com', isCode: false, code: '',
        emailErr: '', emailCls: '', subjectErr: '', subjectCls: '', status: 1, send_email_copy_to_user: false,
        validThroughDays: ''
    });
    const getQuoteByIdData = useSelector(state => state.quote.getQuoteByIdData);
    const prevGetQuoteByIdData = usePrevious({ getQuoteByIdData });
    const sendToCustomerQuoteData = useSelector(state => state.quote.sendToCustomerQuoteData);
    const prevSendToCustomerQuoteData = usePrevious({ sendToCustomerQuoteData });

    // Organization Check 
    const [businessProfileModalShow, setBusinessProfileModalShow] = useState(false);

    // On Load Get Data
    useEffect(() => {
        if (quoteId) {
            setLoader(true)
            dispatch(getQuoteById({ id: quoteId }))
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

    // Get props quote by id and add organization 
    useEffect(() => {
        if (prevGetQuoteByIdData && prevGetQuoteByIdData.getQuoteByIdData !== getQuoteByIdData) {
            if (getQuoteByIdData && _.has(getQuoteByIdData, 'data') && getQuoteByIdData.success === true) {
                const QuoteData = getQuoteByIdData.data.quote;
                setTentative(QuoteData.tentative)
                if (!QuoteData.id) {
                    props.history.push(LIST_QUOTES)
                } else {
                    let orgName = ''
                    if (QuoteData.user_org_map.organization.id !== 1) {
                        let orgData = QuoteData.user_org_map.organization;
                        orgName = orgData.name + '<br>' + orgData.city + ', ' + orgData.zip + '<br>' + orgData.state + ', ' + orgData.country
                    }
                    const contactDetail = QuoteData.contact;
                    setLoader(false)
                    let send_email_copy_to_user = false, email = contactDetail && contactDetail.email !== null ? contactDetail.email : '', subject = QuoteData.name, content = 'Hi ' + contactDetail.first_name + (contactDetail.last_name !== null ? " " + contactDetail.last_name : "") + ',<br/><br/>Below is the link to the quote I put together as per our conversation. I have included all the details and instructions.<br/><br/> Please review the quote and accept (or pay the deposit) when you get a chance. <br/><br/> <button class="btn" style="background: rgba(251, 154, 0, 0.65); font-size: 12px; padding: 10px 15px; display: inline-block; color: #ffff; text-decoration: none; border: none;">View Quote</button>  <br/>  Thanks, <br/> ' + (orgName !== "" ? orgName : "Business/Person Name");
                    if (QuoteData.description.length > 0) {
                        let emailData = _.find(QuoteData.description, { 'type': "email" });
                        email = emailData && emailData.email_to ? emailData.email_to : contactDetail && contactDetail.email !== null ? contactDetail.email : '';
                        send_email_copy_to_user = emailData && emailData.send_email_copy_to_user === 1 ? true : false;
                        subject = emailData && emailData.email_subject ? emailData.email_subject : QuoteData.name;
                        content = emailData && emailData.email_description ? emailData.email_description : 'Hi ' + contactDetail.first_name + (contactDetail.last_name !== null ? " " + contactDetail.last_name : "") + ',<br/><br/>Below is the link to the quote I put together as per our conversation. I have included all the details and instructions.<br/><br/> Please review the quote and accept (or pay the deposit) when you get a chance. <br/><br/> <button class="btn" style="background: rgba(251, 154, 0, 0.65); font-size: 12px; padding: 10px 15px; display: inline-block; color: #ffff; text-decoration: none; border: none;">View Quote</button>  <br/><br/>  Thanks, <br/> ' + (orgName !== "" ? orgName : "Business/Person Name");
                    }
                    setContactData(QuoteData.contact)
                    let latLngUrl = '';
                    if (QuoteData.event_lat_long && QuoteData.event_lat_long !== null) {
                        let placeData = JSON.parse(QuoteData.event_lat_long);
                        latLngUrl = placeData.lat + ',' + placeData.lng + '&query_place_id=' + placeData.place_id
                    }
                    setEditorData(content)
                    setState({
                        ...state, quoteName: QuoteData.name,
                        quoteSerialNo: QuoteData.quote_serial_no,
                        total: QuoteData.amount_total,
                        latLngUrl: latLngUrl,
                        deposite: QuoteData.amount_deposit !== null ? QuoteData.amount_deposit : 0,
                        date: QuoteData.start_date !== null ? QuoteData.start_date : '',
                        timeValue: QuoteData.start_date !== null ? QuoteData.start_date : '',
                        validThroughDays: QuoteData.valid_through_days !== null ? QuoteData.valid_through_days : '',
                        location: QuoteData.event_location !== null ? QuoteData.event_location : '',
                        lat_long: QuoteData.event_lat_long !== null ? QuoteData.event_lat_long : '',
                        validThrough: QuoteData.valid_through !== null ? QuoteData.valid_through : '',
                        isCode: QuoteData.access_code !== null ? true : false,
                        code: QuoteData.access_code !== null ? QuoteData.access_code : '',
                        email, subject, send_email_copy_to_user,
                    })
                    setOrganizationData(QuoteData.user_org_map.organization);

                }
            }
            if (getQuoteByIdData && _.has(getQuoteByIdData, 'message') && getQuoteByIdData.success === false) {
                setLoader(false)
            }
        }
        if (prevSendToCustomerQuoteData && prevSendToCustomerQuoteData.sendToCustomerQuoteData !== sendToCustomerQuoteData) {
            if (sendToCustomerQuoteData && _.has(sendToCustomerQuoteData, 'data') && sendToCustomerQuoteData.success === true) {
                setLoader(false)
                props.history.push(LIST_QUOTES)
            }
            if (sendToCustomerQuoteData && _.has(sendToCustomerQuoteData, 'message') && sendToCustomerQuoteData.success === false) {
                setLoader(false)
                if (sendToCustomerQuoteData.message === 'Please add organization first.') {
                    setBusinessProfileModalShow(true)
                } else {
                    setServiceMessage(sendToCustomerQuoteData.message)
                }
            }
        }
    }, [prevGetQuoteByIdData, getQuoteByIdData, prevSendToCustomerQuoteData, sendToCustomerQuoteData])// eslint-disable-line react-hooks/exhaustive-deps

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
    const sendToCustomerQuoteFunction = (status) => {
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
                if (currentPlan && currentPlan.plan_is_active === 1 && (currentPlan.subscription_product_id === 3 || currentPlan.subscription_product_id === 4 || currentPlan.subscription_product_id === 1)) {
                    Swal.fire({
                        title: 'Please Confirm',
                        text: 'Are you sure you want to send the quote to the customer? You will not be able to make any changes after sending the quote.',
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
                            let data = { id: quoteId, email_to: state.email, email_from: state.emailFrom, email_subject: state.subject, email_description: editorData, quote_status_type_id: status, send_email_copy_to_user: state.send_email_copy_to_user ? 1 : 0 };
                            if (state.isCode) {
                                data.access_code = state.code
                            }
                            dispatch(sendToCustomerQuote(data))
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            // console.log('cancel')
                        }
                    })
                } else {
                    let msg, warMsg, buttonMsg;
                    if (currentPlan && currentPlan.plan_is_active === 0) {
                        buttonMsg = currentPlan.subscription_product_id === 1 ? 'View Plans' : 'Renew Plan'
                        warMsg = currentPlan.subscription_product_id === 1 ? 'Free Trial Expired' : 'Subscription Expired'
                        msg = currentPlan.subscription_product_id === 1 ? 'Your free trial has expired. Please subscribe to a plan to access the application. ' : 'Your subscription has expired. Please renew your subscription or upgrade your plan to access the application. ';
                    } else {
                        warMsg = 'Warning'
                        buttonMsg = 'Upgrade Plan'
                        msg = 'Your current plan does not include quote. Please upgrade your plan to access the functionality.';
                    }

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
            } else {
                setLoader(true);
                let data = { id: quoteId, email_to: state.email, email_from: state.emailFrom, email_subject: state.subject, email_description: editorData, quote_status_type_id: status, send_email_copy_to_user: state.send_email_copy_to_user ? 1 : 0 };
                if (state.isCode) {
                    data.access_code = state.code
                }
                dispatch(sendToCustomerQuote(data))
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
        //const emailData = replaceAll(data, "VIEW_QUOTE_BUTTON", '<button class="btn btn-primary mr-2">View Quote </button>');
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
                props.history.push(LIST_QUOTES)
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // console.log('cancel')
            }
        })
    }

    // Move To Basic Detail Page 
    const movedToBasicDetailPage = (e) => {
        props.history.push({
            pathname: ADD_BASIC_QUOTE,
            state: { quoteDataState: getQuoteByIdData.data }
        })
    }

    // Move To Quote Detail Page 
    const movedToQuoteDetailPage = (e) => {
        props.history.push(ADD_QUOTE_BASE + quoteId)
    }

    // Move To Preview Detail Page 
    const movedToPreviewPage = (e) => {
        props.history.push(VIEW_QUOTE_BASE + quoteId)
    }

    return (
        <>
            <Loader loader={loader} />
            <div className="main-site fixed--header lead-page-hdr unfixed-page-title">
                <Header getMainRoute={'quotes'} />
                <main className="site-body">

                    <section className="page-title contact--header">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-auto title--col">
                                    <div>
                                        <ol className="breadcrumb d-none d-lg-flex">
                                            <li className="breadcrumb-item"><Link to={LIST_QUOTES}>Quotes</Link></li>
                                            <li className="breadcrumb-item"><Link to={ADD_QUOTE_BASE + quoteId}>Edit Quote</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">Preview Quote</li>
                                        </ol>
                                        <h2 className="title">Quote: {state.quoteSerialNo} <small className="font-small">({state.quoteName})</small></h2>
                                    </div>
                                </div>
                                <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                    <button onClick={(e) => closeForm(e)} className="btn btn-dark mr-15">Close</button>
                                    <button onClick={() => sendToCustomerQuoteFunction(1)} className="btn btn-secondary mr-15">Save as Draft</button>
                                    <div className="btn-divider mr-15"></div>
                                    <Link to={VIEW_QUOTE_BASE + quoteId} className="btn btn-secondary mr-15">Back</Link>
                                    <button onClick={() => sendToCustomerQuoteFunction(2)} className="btn btn-primary d-none d-lg-flex">Send to Customer</button>
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
                                                        <div className="timeline-cols completed" onClick={(e) => movedToQuoteDetailPage(e)}><h5><em className="d-none d-lg-flex">2. Quote Details</em> <i className="d-lg-none">2</i></h5><span></span></div>
                                                        <div className="timeline-cols completed" onClick={(e) => movedToPreviewPage(e)}><h5><em className="d-none d-lg-flex">3. Preview Quote</em> <i className="d-lg-none">3</i></h5><span></span></div>
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
                                                            <label>Service Date</label>
                                                            <div className="field-text mb-0">{state.date !== '' ? moment(state.date).format('ddd, MMM DD YYYY') : '-'} {Tentative && Tentative ==1 ? ' (Tentative)':''}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="form-group mb-lg-0">
                                                            <label>Total Amount (Advance)</label>
                                                            <div className="field-text mb-0">${state.total} (${state.deposite})</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <div className="form-group mb-lg-0">
                                                            <label>Quote Valid For</label>
                                                            <div className="field-text">{state.validThroughDays !== '' ? state.validThroughDays + ' Days' : '-'}</div>
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
                                                                    {/* <label>To</label> */}
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
                                                                    {/* <label>Subject</label> */}
                                                                    {state.subjectErr ? <span className="errorValidationMessage"> {state.subjectErr}</span> : ''}
                                                                </div>
                                                            </div>
                                                            <div className="access--code">
                                                                <div className="custom-control custom-checkbox">
                                                                    <input type="checkbox" className="custom-control-input" id="customCheck3" checked={state.send_email_copy_to_user} onChange={(e) => setState({ ...state, send_email_copy_to_user: e.target.checked })} />
                                                                    <label className="custom-control-label" htmlFor="customCheck3"> Send a copy to <strong>{userData && userData.email}</strong></label>
                                                                </div>
                                                                {/* <input className="form-control" type="text" value={state.code} name="code" disabled={state.isCode ? false : true} onChange={(e) => setState({...state, code: e.target.value})}/> */}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="email-text--editor mt-3">
                                                        {/* Note: To generate button of view quote in body type VIEW_QUOTE_BUTTON anywhere you like */}
                                                        {/* <CKEditor
                                                    editor={ClassicEditor}
                                                    data={editorData}
                                                    config={editorConfig}
                                                    onChange={ ( event, editor ) => {
                                                        const data = editor.getData();
                                                        setEditorData(data)
                                                    } }
                                                /> */}
                                                        <Editor
                                                            value={editorData !== '' ? editorData : ''}
                                                            apiKey={constants.tinyAapiKey}
                                                            init={tinyConfigEmailContent}
                                                            onEditorChange={(data) => setEditorData(data)}
                                                        />
                                                    </div>

                                                    <div className="email_Btns mt-3">
                                                        <button onClick={(e) => previewEmail(e)} className="btn btn-secondary mr-2">Preview Email</button>
                                                        <button className="btn btn-primary mr-2" href="#google" onClick={() => sendToCustomerQuoteFunction(2)} >Send to Customer </button>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="row no-gutters-mbl mt-lg-4">
                                <div className="col-lg-12">
                                <div className="main-card create-qoute--cards create-form">
                                    <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#TermsCondCollapse" aria-expanded="false" aria-controls="TermsCondCollapse">
                                    Notification Settings
                                    <img src={setImagePath(ORANGE_ARROW)} alt="" />               
                                    </button>
                                    <div className={"card main-card--collapse "+isCollapse} id="TermsCondCollapse">
                                    <div className="card-header d-none d-lg-flex justify-content-between align-items-center">
                                        <h4 className="quote-heading">Notification Settings</h4>
                                    </div>
                                    <div className="card-body px-4">
                                        Coming soon…
                                        <div className="notify_Settings d-flex">
                                        <div className="custom-control custom-checkbox">
                                            <input type="checkbox" className="custom-control-input" id="customCheck33" />
                                            <label className="custom-control-label" htmlFor="customCheck33">Send a reminder email to <strong>Jessica</strong> if he/she doesn’t respond in</label>
                                        </div>
                                        <select className="form-control d-inline">
                                            <option>1 day</option>
                                            <option>2 days</option>
                                            <option>3 days</option>
                                            <option>4 days</option>
                                        </select>
                                        </div>
                                        <div className="notify_Settings">
                                        <div className="custom-control custom-checkbox">
                                            <input type="checkbox" className="custom-control-input" id="customCheck44" />
                                            <label className="custom-control-label" htmlFor="customCheck44">Send a notification when to me when <strong>Jessica,</strong></label>
                                        </div>
                                        <div className="notify_subSettings mt-2 d-flex">
                                            <div className="custom-control custom-checkbox">
                                            <input type="checkbox" className="custom-control-input" id="customCheck55" />
                                            <label className="custom-control-label" htmlFor="customCheck55">Opens quote</label>
                                            </div>
                                            <div className="custom-control custom-checkbox">
                                            <input type="checkbox" className="custom-control-input" id="customCheck66" />
                                            <label className="custom-control-label" htmlFor="customCheck66">Asks for revision or Rejects</label>
                                            </div>
                                            <div className="custom-control custom-checkbox">
                                            <input type="checkbox" className="custom-control-input" id="customCheck77" />
                                            <label className="custom-control-label" htmlFor="customCheck77">Accepts quote</label>
                                            </div>
                                            <div className="custom-control custom-checkbox">
                                            <input type="checkbox" className="custom-control-input" id="customCheck88" />
                                            <label className="custom-control-label" htmlFor="customCheck88">Hasn’t signed in </label>
                                            </div>
                                            <select className="form-control d-inline">
                                            <option>1 day</option>
                                            <option>2 days</option>
                                            <option>3 days</option>
                                            <option>4 days</option>
                                            </select>
                                        </div>
                                        </div>
                                        
                                    </div>
                                    </div>
                                </div>
                                </div>            
                            </div> */}

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
                    sentToCustomerCall={(data) => sendToCustomerQuoteFunction(state.status)}
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

export const SentQuote = withRouter(NewSentQuote)