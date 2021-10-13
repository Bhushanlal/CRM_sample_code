import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import { Link, withRouter } from "react-router-dom";
import { Loader } from '../../../component/frontend/loader/loader'
import moment from 'moment'
import { baseUrl } from "../../../../common/constants";
import { usePrevious, setImagePath, floatingWithTwoDecimal } from '../../../../common/custom';
import _ from 'lodash';
import { getQuoteById, reviseQuote } from '../../../../duck/quote/quote.action';
import { ADD_QUOTE_BASE, LIST_QUOTES, VIEW_CONTACT_BASE, ADD_BASIC_INVOICE } from "../../../../routing/routeContants";
import ORANGE_ARROW from '../../../../assets/images/orange-arrow.svg'
import ReactHtmlParser from 'react-html-parser';
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import MENU_DOTTED from '../../../../assets/images/menu-dotted.svg'
import CHECKBOX_ICON from '../../../../assets/images/ic_check-blue.svg';
import Swal from 'sweetalert2'
import { getUserDetails } from '../../../../storage/user';
import { SubscriptionPlan } from "../profile/subscriptionPlans"

export const NewQuoteDetail = props => {
    let quoteId;
    if (props.match && _.has(props.match, 'params') && _.has(props.match.params, 'id')) {
        quoteId = props.match.params.id
    }

    const dispatch = useDispatch();
    const userData = getUserDetails();
    const currentPlan = userData && userData.planData
    const [subscriptionModalShow, setSubscriptionModalShow] = useState(false);
    const [loader, setLoader] = useState(false);
    const [serviceMessage, setServiceMessage] = useState('');
    const [isCollapse, setIsCollapse] = useState('');
    const [invoiceDetail, setInvoiceDetail] = useState('');
    const [timelineData, setTimelineData] = useState('');
    const [lineItems, setLineItems] = useState([{ item_name: '', item_description: '', item_charges: '' }]);
    const [amountArr, setAmount] = useState([{ fee_name: 'Set up cost', amount: '' }, { fee_name: 'Service Charge', amount: '' }, { fee_name: 'MISC or Taxes', amount: '' }, { discount_name: 'Discount Name', amount: '' }]);
    const [sections, setSections] = useState([]);
    const [contactData, setContactData] = useState('');
    const [subTotal, setSubTotal] = useState(0);
    const [optinalLineItems, setOptinalLineItems] = useState([]);
    const [organizationData, setOrganizationData] = useState('');
    const [state, setState] = useState({
        quoteName: '', timeValue: '', location: '', internalNotes: '',
        timeShiftValue: '', customDuration: '', lat_long: '', totalAmount: 0, deposite: 0, date: '',
        lineItem: '', itemName: '', discription: '', charge: '', qty: '', rate: '', validThrough: '', latLngUrl: '',
        status: 2, signature: '', revision: '', alphaId: '', amountBalance: 0, rejectReason: '', tentative: false,
        paymentReceive: 0, isExpired: 0
    });
    const getQuoteByIdData = useSelector(state => state.quote.getQuoteByIdData);
    const prevGetQuoteByIdData = usePrevious({ getQuoteByIdData });
    const reviseQuoteData = useSelector(state => state.quote.reviseQuoteData);
    const prevReviseQuoteData = usePrevious({ reviseQuoteData });

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
                if (!QuoteData.id) {
                    props.history.push(LIST_QUOTES)
                } else {
                    let itemName, discription, charge, qty, rate;
                    if (QuoteData.description.length > 0) {
                        let itemTitleGet = _.find(QuoteData.description, { 'type': "item_title" });
                        let itemHeadingGet = _.find(QuoteData.description, { 'type': "item_heading" });
                        let itemsGet = _.filter(QuoteData.description, (dd) => dd.type === 'item');
                        let optionalItemsGet = _.filter(QuoteData.description, (dd) => dd.type === 'optional_item');
                        let sectionsGet = _.filter(QuoteData.description, (dd) => dd.type === 'section');
                        itemName = itemTitleGet && itemHeadingGet.item_heading_name ? itemHeadingGet.item_heading_name : ''
                        discription = itemTitleGet && itemHeadingGet.item_heading_description ? itemHeadingGet.item_heading_description : ''
                        charge = itemTitleGet && itemHeadingGet.item_heading_charges ? itemHeadingGet.item_heading_charges : ''
                        qty = itemHeadingGet && itemHeadingGet.item_heading_qty ? itemHeadingGet.item_heading_qty : ''
                        rate = itemHeadingGet && itemHeadingGet.item_heading_rate ? itemHeadingGet.item_heading_rate : ''
                        let amountsGet = _.filter(QuoteData.description, (dd) => (dd.type === 'fee' || dd.type === 'discount'));
                        let amontAr = []
                        _.map(amountsGet, (data) => {
                            if (data.type === 'fee') {
                                amontAr.push({ fee_name: data.fee_name, amount: data.fee })
                            } else {
                                amontAr.push({ discount_name: data.discount_name, amount: data.discount })
                            }
                        })
                        const totalCharge = _.sumBy(itemsGet, ch => {
                            return (parseFloat(ch.item_charges) ? parseFloat(ch.item_charges) : 0);
                        });
                        const optionalTotalCharge = _.sumBy(optionalItemsGet, ch => {
                            return (parseFloat(ch.item_charges) ? parseFloat(ch.item_charges) : 0);
                        });
                        if (QuoteData.timeline && QuoteData.timeline.signed_at !== null) {
                            setSubTotal((parseFloat(totalCharge) + parseFloat(optionalTotalCharge)).toFixed(2))
                        } else {
                            setSubTotal(totalCharge.toFixed(2))
                        }
                        setSections(_.map(sectionsGet, _.partial(_.pick, _, ['section_name', 'section_description'])))
                        setAmount(_.filter(amontAr, (data) => data.amount > 0));
                        setLineItems(_.map(itemsGet, _.partial(_.pick, _, ['item_name', 'item_description', 'item_charges', 'item_qty', 'item_rate'])))
                        setOptinalLineItems(_.map(optionalItemsGet, _.partial(_.pick, _, ['item_name', 'item_description', 'item_charges', 'item_qty', 'item_rate'])))
                    }

                    setLoader(false)
                    setTimelineData(QuoteData.timeline)
                    setContactData(QuoteData.contact)
                    setInvoiceDetail(QuoteData.invoice)
                    let latLngUrl = '';
                    if (QuoteData.event_lat_long && QuoteData.event_lat_long !== null) {
                        let placeData = JSON.parse(QuoteData.event_lat_long);
                        latLngUrl = placeData.lat + ',' + placeData.lng + '&query_place_id=' + placeData.place_id
                    }
                    setState({
                        ...state, quoteName: QuoteData.name,
                        quoteSerialNo: QuoteData.quote_serial_no,
                        total: QuoteData.amount_total,
                        isExpired: QuoteData.is_expired,
                        latLngUrl: latLngUrl,
                        alpha_id: QuoteData.alpha_id,
                        deposite: QuoteData.amount_deposit,
                        tentative: QuoteData.tentative === 1 ? true : false,
                        paymentReceive: QuoteData.payment && QuoteData.payment.amount_received ? QuoteData.payment.amount_received : 0,
                        amountBalance: QuoteData.amount_balance,
                        rejectReason: QuoteData.reject_reason,
                        status: QuoteData.quote_status_type_id,
                        date: QuoteData.start_date !== null ? QuoteData.start_date : '',
                        timeValue: QuoteData.start_date !== null ? QuoteData.start_date : '',
                        internalNotes: QuoteData.internal_notes !== null ? QuoteData.internal_notes : '',
                        location: QuoteData.event_location !== null ? QuoteData.event_location : '',
                        lat_long: QuoteData.event_lat_long !== null ? QuoteData.event_lat_long : '',
                        validThrough: QuoteData.valid_through !== null ? QuoteData.valid_through : '',
                        signature: QuoteData.accept_signatue !== null ? QuoteData.accept_signatue : '',
                        lineItem: QuoteData.service_type && QuoteData.service_type.name ? QuoteData.service_type.name : '',
                        itemName, discription, charge, qty, rate,
                        customDuration: QuoteData.event_duration !== null ? QuoteData.event_duration : '',
                        revision: QuoteData.revision !== null ? QuoteData.revision : ''
                    })
                    // Set Organization Data
                    setOrganizationData(QuoteData.user_org_map.organization);
                }
            }
            if (getQuoteByIdData && _.has(getQuoteByIdData, 'message') && getQuoteByIdData.success === false) {
                setLoader(false)
                setServiceMessage(getQuoteByIdData.message)
            }
        }
        if (prevReviseQuoteData && prevReviseQuoteData.reviseQuoteData !== reviseQuoteData) {
            if (reviseQuoteData && _.has(reviseQuoteData, 'data') && reviseQuoteData.success === true) {
                props.history.push(ADD_QUOTE_BASE + reviseQuoteData.data.id)
            }

            if (reviseQuoteData && _.has(reviseQuoteData, 'message') && reviseQuoteData.success === false) {
                setLoader(false)
                setServiceMessage(reviseQuoteData.message)
            }
        }
    }, [prevGetQuoteByIdData, getQuoteByIdData, prevReviseQuoteData, reviseQuoteData])// eslint-disable-line react-hooks/exhaustive-deps

    // Revise Quote
    const reviseQuoteFunction = (e) => {
        e.preventDefault()
        setLoader(true)
        dispatch(reviseQuote({ id: quoteId }))
    }

    // Create invoice by quote 
    const createInvoiceByQuote = (e) => {
        e.currentTarget.blur()
        if (currentPlan && currentPlan.plan_is_active === 0) {
            let buttonMsg = currentPlan.subscription_product_id === 1 ? 'View Plans' : 'Renew Plan'
            let warMsg = currentPlan.subscription_product_id === 1 ? 'Free Trial Expired' : 'Subscription Expired'
            let msg = currentPlan.subscription_product_id === 1 ? 'Your free trial has expired. Please subscribe to a plan to access the application. ' : 'Your subscription has expired. Please renew your subscription or upgrade your plan to access the application. ';
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
        } else {
            if (invoiceDetail && invoiceDetail.id) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "Invoice has been already created from this quote, do you still want to create a new invoice ?",
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    reverseButtons: true,
                    showCloseButton: true,
                    customClass: "mycustom-alert",
                    cancelButtonClass: 'cancel-alert-note'
                }).then((result) => {
                    if (result.value) {
                        props.history.push({
                            pathname: ADD_BASIC_INVOICE,
                            state: { invoiceQuoteData: getQuoteByIdData.data.quote }
                        })
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        // console.log('cancel')
                    }
                })
            } else {
                props.history.push({
                    pathname: ADD_BASIC_INVOICE,
                    state: { invoiceQuoteData: getQuoteByIdData.data.quote }
                })
            }
        }
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
                                            <li className="breadcrumb-item active" aria-current="page">Quote Details</li>
                                        </ol>
                                        <h2 className="title">Quote: {state.quoteSerialNo} <small className="font-small">({state.quoteName})</small></h2>
                                    </div>
                                </div>
                                <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                    {state.status !== 4 ?
                                        <>
                                            <a href={baseUrl[0] + 'download-invoice/' + state.alpha_id} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mr-15">Download PDF</a>
                                            {(timelineData && timelineData.reject_at !== null) || state.status === 4 ? '' :
                                                <>
                                                    <button onClick={(e) => createInvoiceByQuote(e)} className="btn btn-secondary mr-15 d-none d-lg-flex">Generate Invoice</button>
                                                    <div className="dropdown d-lg-none custom-dropdown dropdown-toggle--mbl">
                                                        <button className="btn dropdown-toggle " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            <img src={setImagePath(MENU_DOTTED)} alt="" />
                                                        </button>
                                                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                                            <button onClick={(e) => createInvoiceByQuote(e)} className="btn btn-secondary mr-15">Generate Invoice</button>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </>
                                        :
                                        <button onClick={(e) => reviseQuoteFunction(e)} className="btn btn-secondary mr-15">Revise Quote</button>
                                    }
                                    <Link to={LIST_QUOTES} className="btn btn-primary">Back</Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="middle-section">
                        <div className="container">
                            {serviceMessage ? <div className="errorCls errCommonCls mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{serviceMessage}</div> : ''}
                            <div className="row no-gutters-mbl">
                                <div className="col-lg-12">
                                    <div className="main-card create-qoute--cards create-form">
                                        <button className={"btn btn-block btn--card-collapse"} type="button" data-toggle="collapse" data-target="#NotesCollapse" aria-expanded="true" aria-controls="NotesCollapse">Preparation  Internal Notes<img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                        <div className={"card main-card--collapse show " + isCollapse} id="NotesCollapse">
                                            <div className="card-header pt-4 d-none d-lg-flex">
                                                <h4 className="quote-heading">{state.status === 4 ? 'Comment' : 'Internal Notes'}</h4>
                                            </div>
                                            <div className="card-body px-4">
                                                {state.status === 4 ? state.revision : state.internalNotes}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="quote-timeline">
                                <ul className="quote-timeline--wrap">
                                    <li className={timelineData.sent_at !== null ? timelineData.viewed_at !== null || timelineData.expired_on !== null ? "completed" : "current" : ''}><span><em>Sent</em> {timelineData.sent_at !== null ? moment(timelineData.sent_at).format('h:mmA ddd, MMM DD') : '  '}</span></li>
                                    <li className={timelineData.viewed_at !== null ? timelineData.reject_at !== null || timelineData.signed_at !== null || timelineData.revision_at !== null || timelineData.expired_on !== null ? "completed" : "current" : ""}><span><em>Viewed</em> {timelineData.viewed_at !== null ? moment(timelineData.viewed_at).format('h:mmA ddd, MMM DD') : '  '}</span></li>
                                    {state.status === 4 ?
                                        <li className="revision"><span><em>Revision Requested</em> {timelineData.revision_at !== null ? moment(timelineData.revision_at).format('h:mmA ddd, MMM DD') : '  '}</span></li>
                                        :
                                        state.status === 5 ?
                                            state.isExpired === 1 ?
                                                <li className="expired"><span><em>Expired</em> {moment(timelineData.expired_on).format('h:mmA ddd, MMM DD')}</span></li>
                                                :
                                                <li className={timelineData && timelineData.reject_at !== null ? "revision" : "current"}><span><em>{timelineData && timelineData.reject_at !== null ? 'Rejected' : 'Signed'}</em> {timelineData && timelineData.reject_at !== null ? moment(timelineData.reject_at).format('h:mmA ddd, MMM DD') : moment(timelineData.signed_at).format('h:mmA ddd, MMM DD')}</span></li>
                                            :
                                            <li><span><em>Signed</em></span></li>
                                    }

                                </ul>
                            </div>

                            <div className="row no-gutters-mbl mt-lg-4">
                                <div className="col-lg-12">
                                    <div className="main-card create-qoute--cards">
                                        <div className="card">
                                            <div className="card-body px-4">
                                                <div className="row align-items-center">
                                                    {organizationData.id !== 1 ?
                                                        <>
                                                            <div className="col-lg-7">
                                                                <div className="quote-bizzlogo--name">
                                                                    {organizationData.company_logo !== null ?
                                                                        <div className="quote-bizzlogo">{organizationData.company_logo ? <img src={setImagePath(baseUrl[0] + organizationData.company_logo)} alt="" /> : ''}</div>
                                                                        : ''
                                                                    }
                                                                    <div>
                                                                        <div className="quote-bizzname">{organizationData.name}</div>
                                                                        <div className="organization-flag">{organizationData && organizationData.license_no !== null ? <span className="d-inline-block mr-3">License # <strong className="ml-1">{organizationData.license_no}</strong></span> : ''}
                                                                            {organizationData.bonded === 1 ? <span className='pl-2'><img src={setImagePath(CHECKBOX_ICON)} alt="" /> <strong>Bonded</strong></span> : ''}
                                                                            {organizationData.insured === 1 ? <span className='pl-2 ml-1'><img src={setImagePath(CHECKBOX_ICON)} alt="" /> <strong> Insured</strong></span> : ''}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-5">
                                                                {organizationData && organizationData.id ?
                                                                    <div className="quote-bizz-details">
                                                                        <div className="field-text">{organizationData.street_address}</div>
                                                                        <div className="field-text">{organizationData.city + ', ' + organizationData.zip}</div>
                                                                        <div className="field-text">{organizationData.state + ', ' + organizationData.country}</div>
                                                                        <div className="field-text">{organizationData.phone}</div>
                                                                        <div className="field-text"><a href={"mailto:" + organizationData.email}>{organizationData.email}</a></div>
                                                                        <div className="field-text"><a href="#quote" onClick={(e) => e.preventDefault()}>{organizationData.website}</a></div>
                                                                    </div>
                                                                    : ''
                                                                }
                                                            </div>
                                                        </>
                                                        : 'No Organization Detail Added.'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row no-gutters-mbl mt-lg-4">
                                <div className="col-lg-3">
                                    <div className="main-card create-qoute--cards">
                                        <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#CustomerCollapse" aria-expanded="true" aria-controls="CustomerCollapse">Customer <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                        <div className={"card main-card--collapse show " + isCollapse} id="CustomerCollapse">
                                            <div className="card-body px-4">
                                                <div className="form-group mb-0">
                                                    {/* <label>Contact Information</label> */}
                                                    {contactData.first_name ? <div className="field-text">{contactData.first_name + (contactData.last_name !== null ? ' ' + contactData.last_name : '')}</div> : ''}
                                                    {contactData.phone ? <div className="field-text">{contactData.phone}</div> : ''}
                                                    {contactData.email ? <div className="field-text"><Link to={VIEW_CONTACT_BASE + contactData.id}>{contactData.email}</Link></div> : ''}
                                                    <div className="field-text">{contactData.organization}
                                                        {contactData.title ? <><br /><small>({contactData.title})</small></> : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-5">
                                    <div className="main-card create-qoute--cards">
                                        <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#EventCollapse" aria-expanded="true" aria-controls="EventCollapse">Event Details <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                        <div className={"card main-card--collapse show " + isCollapse} id="EventCollapse">
                                            <div className="card-body px-4">
                                                <div className="row">
                                                    <div className="form-group col-6">
                                                        <label>Service Date {state.tentative ? '(Tentative)' : ''}</label>
                                                        <div className="field-text">{state.date !== '' ? moment(state.date).format('ddd, MMM DD YYYY') : '-'} </div>
                                                    </div>
                                                    <div className="form-group col-6">
                                                        <label>Start Time</label>
                                                        <div className="field-text"><strong>{state.date !== '' ? moment(state.date).format("LT") + ' PST' : '-'}</strong>
                                                            {state.customDuration !== '' ?
                                                                " (" + state.customDuration + ")"
                                                                : ''}
                                                        </div>
                                                    </div>
                                                    <div className="form-group col-md-12 mb-0">
                                                        <label>Location</label>
                                                        <div className="field-text">{state.location || 'TBD'}
                                                            {state.latLngUrl !== '' ?
                                                                <a href={"https://www.google.com/maps/search/?api=1&query=" + state.latLngUrl} rel="noopener noreferrer" target="_blank" className="text-link ml-1">(Map)</a>

                                                                : ''}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-4">
                                    <div className="main-card create-qoute--cards">
                                        <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#QuoteCollapse" aria-expanded="true" aria-controls="QuoteCollapse">Quote Amount <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                        <div className="card main-card--collapse" id="QuoteCollapse">
                                            <div className="card-body px-4">

                                                <div className="row">
                                                    <div className="form-group col-6">
                                                        <label>Quote Valid For</label>
                                                        <div className="field-text">{state.validThrough !== '' ? moment(state.validThrough).format('ddd, MMM DD YYYY') : '-'}</div>
                                                    </div>
                                                    <div className="form-group col-6 mb-0">
                                                        <label>Total Amount </label>
                                                        <div className="field-text bizzamount-price">${floatingWithTwoDecimal(state.total)}</div>
                                                    </div>
                                                    <div className="form-group col-6">
                                                        <label>Quote ID</label>
                                                        <div className="field-text">{state.quoteSerialNo}</div>
                                                    </div>
                                                    <div className="form-group col-6 mb-0">
                                                        <label>Advance {state.status !== 5 ? 'Required' : 'Received'}</label>
                                                        <div className="field-text bizzamount-price">${floatingWithTwoDecimal(state.status !== 5 ? state.deposite : state.paymentReceive)}</div>
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
                                            {state.lineItem || ''}
                                            <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                        <div className={"card main-card--collapse show " + isCollapse} id="LineItemsCollapse">
                                            <div className="card-header d-none d-lg-flex justify-content-between align-items-center">
                                                <h4 className="quote-heading">{state.lineItem || ''}</h4>
                                            </div>
                                            <div className="card-body">

                                                <table className="table table-striped smart-table mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>{state.itemName || 'Line Item'}</th>
                                                            <th width="15%">{state.qty || 'Qty'}</th>
                                                            <th>{state.charge || 'Amount'}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            _.map(lineItems, (item, k) => {
                                                                return <tr key={k}>
                                                                    <td className="qt-activity-name"><div className="description-list-item"><strong>{item.item_name}</strong><p>{item.item_description}</p></div></td>
                                                                    <td className="qt-fees">{item.item_qty ? item.item_qty +' x $'+floatingWithTwoDecimal(item.item_rate) : 0}</td>
                                                                    <td className="qt-fees"><strong>${floatingWithTwoDecimal(item.item_charges)}</strong></td>
                                                                </tr>
                                                            })
                                                        }
                                                        {optinalLineItems.length > 0 ?
                                                            <>
                                                                <tr>
                                                                    <td className="qt-activity-name">
                                                                        <strong><h5>Optional Items</h5></strong>
                                                                    </td>
                                                                    <td className="qt-desc"></td>
                                                                    <td className="qt-fees"></td>
                                                                </tr>
                                                                {
                                                                    _.map(optinalLineItems, (item, k) => {
                                                                        return <tr key={k}>
                                                                            <td className="qt-activity-name">
                                                                                <strong>{item.item_name}</strong>
                                                                            </td>
                                                                            <td className="qt-fees">{item.item_qty ? item.item_qty + ' x $' + floatingWithTwoDecimal(item.item_rate) : 0}</td>
                                                                            <td className="qt-fees"><strong>${floatingWithTwoDecimal(item.item_charges)}</strong></td>
                                                                        </tr>
                                                                    })
                                                                }
                                                            </>
                                                            : <></>
                                                        }

                                                        <tr className="quote-total-row">
                                                            <td colSpan="3" className="p-0">
                                                                <table className="table m-0">
                                                                    <tbody>
                                                                        {amountArr.length > 0 ?
                                                                            <>
                                                                                <tr>
                                                                                    <td className="qt-colblank"></td>
                                                                                    <td className="qt-qttotal qt-subtotal"><strong>Subtotal</strong></td>
                                                                                    <td className="qt-fees"><strong>${subTotal}</strong></td>
                                                                                </tr>
                                                                                {_.map(amountArr, (amount, k) => {
                                                                                    return <tr key={k}>
                                                                                        <td className="qt-colblank"></td>
                                                                                        <td className="qt-qttotal">{_.has(amount, 'discount_name') ? amount.discount_name : amount.fee_name}</td>
                                                                                        <td className="qt-fees"><span className={_.has(amount, 'discount_name') ? "col--minus" : ""}>${floatingWithTwoDecimal(amount.amount)}</span></td>
                                                                                    </tr>
                                                                                })}
                                                                            </>
                                                                            : _.map(amountArr, (amount, k) => {
                                                                                return <tr key={k}>
                                                                                    <td className="qt-colblank"></td>
                                                                                    <td className="qt-qttotal">{_.has(amount, 'discount_name') ? amount.discount_name : amount.fee_name}</td>
                                                                                    <td className="qt-fees"><span className={_.has(amount, 'discount_name') ? "col--minus" : ""}>${floatingWithTwoDecimal(amount.amount)}</span></td>
                                                                                </tr>
                                                                            })
                                                                        }

                                                                        <tr>
                                                                            <td className="qt-colblank"></td>
                                                                            <td className="qt-qttotal qt-total"><strong>Total</strong></td>
                                                                            <td className="qt-fees"><strong>{floatingWithTwoDecimal(state.total)}</strong> USD</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {_.map(sections, (sec, j) => {
                                return <div className="row no-gutters-mbl mt-lg-4" key={j}>
                                    <div className="col-lg-12">
                                        <div className="main-card  create-qoute--cards create-form">
                                            <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target={"#TermsCondCollapse" + j} aria-expanded="false" aria-controls={"TermsCondCollapse" + j}>
                                                {sec.section_name}
                                                <img src={setImagePath(ORANGE_ARROW)} alt="" />
                                            </button>
                                            <div className={"card main-card--collapse " + isCollapse} id={"TermsCondCollapse" + j}>
                                                <div className="card-header d-none d-lg-flex justify-content-between align-items-center">
                                                    <h4 className="quote-heading">{sec.section_name}</h4>
                                                </div>
                                                <div className="card-body px-4">
                                                    {ReactHtmlParser(sec.section_description)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}

                            <div className="row no-gutters-mbl mt-lg-4 mb-3">
                                <div className="col-lg-12">
                                    <div className="main-card reviewQuote--ftr  h-auto">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="rvwqt-row">
                                                    <div className="rvwqt-name">
                                                        <h4>{contactData.first_name + (contactData.last_name !== null ? ' ' + contactData.last_name : '')}</h4>
                                                        <p><strong>{contactData.organization}</strong> {contactData.title ? "(" + contactData.title + ")" : ''}</p>
                                                    </div>
                                                    {state.status !== 5 ?
                                                        /* (state.deposite>0) ? 
                                                            <div className="rvwqt-deposit">
                                                                <h4>${floatingWithTwoDecimal(state.deposite)}</h4>
                                                                <p><strong>Deposit</strong></p>
                                                            </div> : '' */
                                                        ''
                                                        : (parseFloat(state.total) - parseFloat(state.amountBalance)) > 0 ?
                                                            <div className="rvwqt-deposit">
                                                                <h4>${floatingWithTwoDecimal(parseFloat(state.total) - parseFloat(state.amountBalance))}</h4>
                                                                <p><strong>Advance</strong></p>
                                                            </div>
                                                            : ''}
                                                    <div className="rvwqt-deposit">
                                                        <h4>${floatingWithTwoDecimal(state.amountBalance)}</h4>
                                                        {(timelineData && timelineData.reject_at !== null) || state.status === 4 ? '' : <p><strong>Balance</strong></p>}
                                                    </div>
                                                    <div className="rvwqt-signature">
                                                        Signature
                                                    </div>
                                                    {state.isExpired === 1 ?
                                                        <div className="rvwqt-final">
                                                            <h4>{state.signature}</h4>
                                                            <p>Expired On: {moment(timelineData.expired_on).format('ll')}</p>
                                                        </div>
                                                        :
                                                        timelineData && timelineData.signed_at !== null ?
                                                            <div className="rvwqt-final">
                                                                <h4>{state.signature}</h4>
                                                                <p>Signed & accepted at {moment(timelineData.signed_at).format('h:mmA MMM DD, YYYY')}</p>
                                                            </div>
                                                            :
                                                            timelineData && timelineData.reject_at !== null ?
                                                                <div className="rvwqt-final">
                                                                    <p className="text-danger mb-2"><strong>{state.rejectReason}</strong></p>
                                                                    <p>Rejected at {moment(timelineData.reject_at).format('h:mmA MMM DD, YYYY')}</p>
                                                                </div>
                                                                :
                                                                ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </main>
                <Footer />
            </div >
            {/* Subscription Modal*/}
            <SubscriptionPlan loader={(data) => setLoader(data)}
                openSubscriptionModal={subscriptionModalShow}
                closeSubscriptionModal={() => setSubscriptionModalShow(false)}
                updatePlanDetail={(data) => { setSubscriptionModalShow(false); setLoader(false) }}
                currentPlan={currentPlan}
            />
        </>
    );
}

export const QuoteDetail = withRouter(NewQuoteDetail)