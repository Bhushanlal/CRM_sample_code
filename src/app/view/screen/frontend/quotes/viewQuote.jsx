import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import { Link, withRouter } from "react-router-dom";
import { Loader } from '../../../component/frontend/loader/loader'
import DOWNLOAD from "../../../../assets/images/ic_get_app.svg";
import moment from 'moment'
import { baseUrl } from "../../../../common/constants";
import { usePrevious, setImagePath, floatingWithTwoDecimal } from '../../../../common/custom';
import _ from 'lodash';
import { getQuoteById } from '../../../../duck/quote/quote.action';
import { ADD_QUOTE_BASE, LIST_QUOTES, VIEW_CONTACT_BASE, SENT_QUOTE_BASE, ADD_BASIC_QUOTE } from "../../../../routing/routeContants";
import ORANGE_ARROW from '../../../../assets/images/orange-arrow.svg'
import CHECKBOX_ICON from '../../../../assets/images/ic_check-blue.svg';
import ReactHtmlParser from 'react-html-parser';
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import { AddOrganization } from './addOrganization'
import ALERT_ICON from "../../../../assets/images/alert-icn.svg";

export const NewViewQuote = props => {
    let quoteId;
    if (props.match && _.has(props.match, 'params') && _.has(props.match.params, 'id')) {
        quoteId = props.match.params.id
    }

    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [businessProfileModalShow, setBusinessProfileModalShow] = useState(false);
    const [serviceMessage, setServiceMessage] = useState('');
    const [isCollapse, setIsCollapse] = useState('');
    const [lineItems, setLineItems] = useState([{ item_name: '', item_description: '', item_charges: '' }]);
    const [amountArr, setAmount] = useState([]);
    const [sections, setSections] = useState([]);
    const [contactData, setContactData] = useState('');
    const [subTotal, setSubTotal] = useState(0);
    const [optinalLineItems, setOptinalLineItems] = useState([]);
    const [organizationData, setOrganizationData] = useState('');
    const [state, setState] = useState({
        quoteName: '', timeValue: '', location: '', internalNotes: '',
        timeShiftValue: '', customDuration: '', lat_long: '', totalAmount: 0, deposite: 0, date: '',
        lineItem: '', itemName: '', discription: '', charge: '', qty: '', rate: '', validThrough: '', latLngUrl: '',
        depositRequired: 0, depositOnline: 0, validThroughDays: '', tentative: false
    });
    const getQuoteByIdData = useSelector(state => state.quote.getQuoteByIdData);
    const prevGetQuoteByIdData = usePrevious({ getQuoteByIdData });

    // On Load Get Data
    useEffect(() => {
        if (quoteId) {
            setLoader(true)
            dispatch(getQuoteById({ id: quoteId }))
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Get props quote by id and add organization 
    useEffect(() => {
        if (prevGetQuoteByIdData && prevGetQuoteByIdData.getQuoteByIdData !== getQuoteByIdData) {
            if (getQuoteByIdData && _.has(getQuoteByIdData, 'data') && getQuoteByIdData.success === true) {
                const QuoteData = getQuoteByIdData.data.quote;
                if (!QuoteData.id || QuoteData.quote_status_type_id !== 1) {
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
                        setSubTotal(parseFloat(totalCharge).toFixed(2))
                        setSections(_.map(sectionsGet, _.partial(_.pick, _, ['section_name', 'section_description'])))
                        setAmount(_.filter(amontAr, (data) => data.amount > 0));
                        setLineItems(_.map(itemsGet, _.partial(_.pick, _, ['item_name', 'item_description', 'item_charges', 'item_qty', 'item_rate'])))
                        setOptinalLineItems(_.map(optionalItemsGet, _.partial(_.pick, _, ['item_name', 'item_description', 'item_charges', 'item_qty', 'item_rate'])))
                    }

                    setLoader(false)
                    setContactData(QuoteData.contact)
                    let latLngUrl = '';
                    if (QuoteData.event_lat_long && QuoteData.event_lat_long !== null) {
                        let placeData = JSON.parse(QuoteData.event_lat_long);
                        latLngUrl = placeData.lat + ',' + placeData.lng + '&query_place_id=' + placeData.place_id
                    }
                    setState({
                        ...state, quoteName: QuoteData.name,
                        quoteSerialNo: QuoteData.quote_serial_no,
                        total: QuoteData.amount_total,
                        latLngUrl: latLngUrl,
                        deposite: QuoteData.amount_deposit,
                        tentative: QuoteData.tentative === 1 ? true : false,
                        depositOnline: QuoteData.deposit_online,
                        depositRequired: QuoteData.deposit_required,
                        date: QuoteData.start_date !== null ? QuoteData.start_date : '',
                        timeValue: QuoteData.start_date !== null ? QuoteData.start_date : '',
                        validThroughDays: QuoteData.valid_through_days !== null ? QuoteData.valid_through_days : '',
                        internalNotes: QuoteData.internal_notes !== null ? QuoteData.internal_notes : '',
                        location: QuoteData.event_location !== null ? QuoteData.event_location : 'TBD',
                        lat_long: QuoteData.event_lat_long !== null ? QuoteData.event_lat_long : '',
                        validThrough: QuoteData.valid_through !== null ? QuoteData.valid_through : '',
                        lineItem: QuoteData.service_type && QuoteData.service_type.name ? QuoteData.service_type.name : '',
                        itemName, discription, charge, qty, rate,
                        customDuration: QuoteData.event_duration !== null ? QuoteData.event_duration : ''
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
    }, [prevGetQuoteByIdData, getQuoteByIdData])// eslint-disable-line react-hooks/exhaustive-deps

    // Set Mobile View
    useEffect(() => {
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

    }, [])

    // Move To Basic Detail Page 
    const movedToBasicDetailPage = (e) => {
        let data = getQuoteByIdData.data;
        props.history.push({
            pathname: ADD_BASIC_QUOTE,
            state: { quoteDataState: data }
        })
    }

    // Move To Quote Detail Page 
    const movedToQuoteDetailPage = (e) => {
        props.history.push(ADD_QUOTE_BASE + quoteId)
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
                                    {/* <button type="button" onClick={(e) => deleteQuoteFunction(e)} className="btn btn-danger mr-15 d-none d-lg-flex">Delete</button> */}
                                    <Link to={LIST_QUOTES} className="btn btn-dark mr-15">Close</Link>
                                    <div className="btn-divider mr-15"></div>
                                    <Link to={ADD_QUOTE_BASE + quoteId} className="btn btn-secondary mr-15">Back</Link>
                                    <Link to={SENT_QUOTE_BASE + quoteId} className="btn btn-primary">Continue</Link>
                                    {/* <div className="dropdown d-lg-none custom-dropdown dropdown-toggle--mbl">
                                        <button className="btn dropdown-toggle " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <img src={setImagePath(MENU_DOTTED)} alt="" />
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                            <Link className="dropdown-item" to={LIST_QUOTES}>Close</Link>
                                            <a className="dropdown-item" href="#delete" onClick={(e) => deleteQuoteFunction(e)}>Delete</a>
                                        </div>
                                    </div>  */}
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
                                                        <div className="timeline-cols active"><h5><em className="d-none d-lg-flex">3. Preview Quote</em> <i className="d-lg-none">3</i></h5><span></span></div>
                                                        <div className="timeline-cols"><h5><em className="d-none d-lg-flex">4. Message to Customer</em> <i className="d-lg-none">4</i></h5><span></span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row no-gutters-mbl mt-lg-4 mt-2">
                                <div className="col-lg-12 px-3">
                                    <p className="mb-0"><strong>Note:</strong> This is also your customer’s view of the quote. They will receive an email with link to the quote along with your message.</p>
                                </div>
                            </div>
                            <div className="row no-gutters-mbl mt-lg-4 mt-2">
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
                                                                        <div className="quote-bizzlogo"><img src={setImagePath(baseUrl[0] + organizationData.company_logo)} alt="" /></div>
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
                                                        : <p className="d-flex align-items-center flex-wrap"><img src={setImagePath(ALERT_ICON)} alt="" /><strong className="text-danger mx-1">Important: You must add your business information before sending a quote or invoice to a customer.</strong> <a className="mr-1 text-link" onClick={(e) => { e.preventDefault(); setBusinessProfileModalShow(true) }} href="#google"> Click Here </a> to add your business information. </p>}
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
                                                        <div className="field-text"><strong>{moment(state.date).format('HH:mm') !== '00:00' ? moment(state.date).format("LT") + ' PST' : 'TBD'}</strong>
                                                            {state.customDuration !== '' ?
                                                                " (" + state.customDuration + ")"
                                                                : ''}
                                                        </div>
                                                    </div>
                                                    <div className="form-group col-md-12 mb-0">
                                                        <label>Location</label>
                                                        <div className="field-text">{state.location || '-'}
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
                                        <div className={"card main-card--collapse show " + isCollapse} id="QuoteCollapse">
                                            <div className="card-body px-4">

                                                <div className="row">
                                                    <div className="form-group col-6">
                                                        <label>Quote Valid For</label>
                                                        <div className="field-text">{state.validThroughDays !== '' ? state.validThroughDays + ' Days' : '-'}</div>
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
                                                        <label>Advance Required</label>
                                                        <div className="field-text bizzamount-price">${floatingWithTwoDecimal(state.deposite)}</div>
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
                                            {/* <div className="card-header d-none d-lg-flex justify-content-between align-items-center">
                                                <h4 className="quote-heading">{state.lineItem || ''}</h4>
                                            </div> */}
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
                                                                    <td className="qt-fees">{item.item_qty ? item.item_qty + ' x $' + floatingWithTwoDecimal(item.item_rate) : 0}</td>
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
                                                                        return <tr key={k} className="optional-item-tr">
                                                                            <td className="qt-activity-name">
                                                                                <div className="custom-control custom-checkbox">
                                                                                    <input type="checkbox" className="custom-control-input" id="customCheck3" disabled />
                                                                                    <label className="custom-control-label" htmlFor="customCheck3"> <strong>{item.item_name}</strong></label>
                                                                                </div>
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
                                                            <td colSpan="5" className="p-0">
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
                                                    <h5 className="quote-heading">{sec.section_name}</h5>
                                                </div>
                                                <div className="card-body px-4">
                                                    {ReactHtmlParser(sec.section_description)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}


                            {/* <div className="row no-gutters-mbl mt-lg-4">
                                <div className="col-lg-12">
                                    <div className="main-card  create-qoute--cards">
                                        <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#NotesCollapse" aria-expanded="false" aria-controls="NotesCollapse">Preparation  Instructions<img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                        <div className="card main-card--collapse" id="NotesCollapse">
                                            <div className="card-header pt-4 d-none d-lg-flex">
                                                <h4 className="quote-heading">Preparation Instructions</h4>
                                            </div>
                                            <div className="card-body px-4">

                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magnaliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>

                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magnaliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                        </p>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            <div className="row no-gutters-mbl mt-lg-4">
                                <div className="col-lg-12">
                                    <div className="main-card reviewQuote--ftr h-auto">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="rvwqt-row">
                                                    <div className="rvwqt-name">
                                                        <h4>{contactData.first_name + (contactData.last_name !== null ? ' ' + contactData.last_name : '')}</h4>
                                                        <p><strong>{contactData.organization}</strong> {contactData.title ? "(" + contactData.title + ")" : ''}</p>
                                                    </div>
                                                    <div className="rvwqt-deposit">
                                                        <h4>${floatingWithTwoDecimal(state.total)}</h4>
                                                        <p><strong>Advance: ${floatingWithTwoDecimal(state.deposite)}</strong></p>
                                                    </div>
                                                    <div className="rvwqt-download disabled-button-state">
                                                        <a href="#about" onClick={(e) => e.preventDefault()}><img src={setImagePath(DOWNLOAD)} alt="" /> Download</a>
                                                    </div>
                                                    <div className="rvwqt-btns disabled-button-state">
                                                        <a href="#about" onClick={(e) => e.preventDefault()} className="btn btn-danger">Decline</a>
                                                        <a href="#about" onClick={(e) => e.preventDefault()} className="btn btn-secondary">Request Revision</a>
                                                        {state.depositRequired === 1 && state.depositOnline === 1 ?
                                                            <a href="#about" onClick={(e) => e.preventDefault()} className="btn btn-primary">Accept & Pay Advance </a>
                                                            :
                                                            <a href="#about" onClick={(e) => e.preventDefault()} className="btn btn-primary">Accept</a>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="rvwqt-note"><b>Note:</b> Both parties will receive an electronically signed copy of quote via email after the customer has accecpted the quote.</p>
                                </div>
                            </div>


                        </div>
                    </section>

                </main>

                {/* Add Organization*/}
                <AddOrganization loader={(data) => setLoader(data)}
                    openOrg={businessProfileModalShow}
                    sentToCustomerCall={(data) => { setOrganizationData(data); setBusinessProfileModalShow(false) }}
                    closeOrg={() => setBusinessProfileModalShow(false)}
                />
                <Footer />
            </div >
        </>
    );
}

export const ViewQuote = withRouter(NewViewQuote)