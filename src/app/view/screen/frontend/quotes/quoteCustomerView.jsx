import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Footer } from '../../../component/frontend/footer/footer'
import { Link, withRouter } from "react-router-dom";
import { Loader } from '../../../component/frontend/loader/loader'
import DOWNLOAD from "../../../../assets/images/ic_get_app.svg";
import moment from 'moment'
import { usePrevious, setImagePath, floatingWithTwoDecimal } from '../../../../common/custom';
import { baseUrl } from '../../../../common/constants';
import _ from 'lodash';
import { LIST_QUOTES, VIEW_CONTACT_BASE } from "../../../../routing/routeContants";
import ORANGE_ARROW from '../../../../assets/images/orange-arrow.svg'
import CHECKBOX_ICON from '../../../../assets/images/ic_check-blue.svg';
import ReactHtmlParser from 'react-html-parser';
import { changeQuoteStatus, viewCustomerQuote } from '../../../../duck/quote/quote.action';
import { QuoteDecline } from './quoteDecline'
import { QuoteAccept } from './quoteAccept'
import { QuoteAcceptDeposit } from './quoteAcceptDeposit'
import { QuoteRevision } from './quoteRevision'

export const NewCustomerViewQuote = props => {
    let quoteId;
    if (props.match && _.has(props.match, 'params') && _.has(props.match.params, 'id')) {
        quoteId = props.match.params.id
    }

    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [isCollapse, setIsCollapse] = useState('');
    const [paymentDetail, setPaymentDetail] = useState(false);
    const [declineModalShow, setDeclineModalShow] = useState(false);
    const [acceptQuoteModalShow, setAcceptQuoteModalShow] = useState(false);
    const [quoteRevisionModalShow, setQuoteRevisionModalShow] = useState(false);
    const [acceptQuoteDepositModalShow, setAcceptQuoteDepositModalShow] = useState(false);
    const [lineItems, setLineItems] = useState([{ item_name: '', item_description: '', item_charges: '' }]);
    const [optinalLineItems, setOptinalLineItems] = useState([]);
    const [amountArr, setAmount] = useState([{ fee_name: 'Set up cost', amount: '' }, { fee_name: 'Service Charge', amount: '' }, { fee_name: 'MISC or Taxes', amount: '' }, { discount_name: 'Discount Name', amount: '' }]);
    const [sections, setSections] = useState([]);
    const [contactData, setContactData] = useState('');
    const [subTotal, setSubTotal] = useState(0);
    const [allCheckedValue, setAllCheckedValue] = useState([]);
    const [organizationData, setOrganizationData] = useState('');
    const [state, setState] = useState({
        quoteName: '', timeValue: '', location: '', internalNotes: '',
        timeShiftValue: '', customDuration: '', lat_long: '', totalAmount: 0, deposite: 0, date: '',
        lineItem: '', itemName: '', discription: '', charge: '', qty: '', rate: '', validThrough: '', latLngUrl: '',
        status: '', depositRequired: 0, depositOnline: 0, paymentReceive: 0, tentative: false
    });
    const changeQuoteStatusData = useSelector(state => state.quote.changeQuoteStatusData);
    const prevChangeQuoteStatusData = usePrevious({ changeQuoteStatusData });
    const viewCustomerQuoteData = useSelector(state => state.quote.viewCustomerQuoteData);
    const prevViewCustomerQuoteData = usePrevious({ viewCustomerQuoteData });

    // Change the status on load 
    useEffect(() => {
        if (quoteId) {
            setLoader(true)
            dispatch(viewCustomerQuote({ id: quoteId }))
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
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Update Quote Customer and Update Quote Props Manage
    useEffect(() => {
        if (prevChangeQuoteStatusData && prevChangeQuoteStatusData.changeQuoteStatusData !== changeQuoteStatusData) {
            if (changeQuoteStatusData && _.has(changeQuoteStatusData, 'data') && changeQuoteStatusData.success === true) {
                setLoader(false)
            }
            if (changeQuoteStatusData && _.has(changeQuoteStatusData, 'message') && changeQuoteStatusData.success === false) {
                setLoader(false)
            }
        }
        if (prevViewCustomerQuoteData && prevViewCustomerQuoteData.viewCustomerQuoteData !== viewCustomerQuoteData) {
            if (viewCustomerQuoteData && _.has(viewCustomerQuoteData, 'data') && viewCustomerQuoteData.success === true) {
                const QuoteData = viewCustomerQuoteData.data.quote;
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
                        setSubTotal(parseFloat(totalCharge).toFixed(2))
                        setSections(_.map(sectionsGet, _.partial(_.pick, _, ['section_name', 'section_description'])))
                        setAmount(_.filter(amontAr, (data) => data.amount > 0));
                        setLineItems(_.map(itemsGet, _.partial(_.pick, _, ['item_name', 'item_description', 'item_charges', 'item_qty', 'item_rate'])))
                        setOptinalLineItems(_.map(optionalItemsGet, _.partial(_.pick, _, ['item_name', 'item_description', 'item_charges', 'id', 'item_qty', 'item_rate'])))
                    }
                    setContactData(QuoteData.contact)
                    setPaymentDetail(QuoteData.payment_account)
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
                        paymentReceive: QuoteData.payment && QuoteData.payment.amount_received ? QuoteData.payment.amount_received : 0,
                        status: QuoteData.quote_status_type_id,
                        depositOnline: QuoteData.deposit_online,
                        depositRequired: QuoteData.deposit_required,
                        date: QuoteData.start_date !== null ? QuoteData.start_date : '',
                        timeValue: QuoteData.start_date !== null ? QuoteData.start_date : '',
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
                    let data = { id: quoteId, status: 'view' }
                    if (QuoteData.quote_status_type_id === 2) {
                        dispatch(changeQuoteStatus(data))
                    } else {
                        setLoader(false)
                    }
                }
            }
            if (viewCustomerQuoteData && _.has(viewCustomerQuoteData, 'message') && viewCustomerQuoteData.success === false) {
                setLoader(false)
            }
        }
    }, [prevChangeQuoteStatusData, changeQuoteStatusData, prevViewCustomerQuoteData, viewCustomerQuoteData])// eslint-disable-line react-hooks/exhaustive-deps

    // On change select checkbox value
    const onCheckedValue = (id, charge) => {
        let newArr;
        if (_.includes(allCheckedValue, id)) {
            newArr = _.filter(allCheckedValue, (data) => data !== id)
            setSubTotal((parseFloat(subTotal) - parseFloat(charge)).toFixed(2))
            setState({ ...state, total: (parseFloat(state.total) - parseFloat(charge)).toFixed(2) })
        } else {
            newArr = [...allCheckedValue, id]
            setSubTotal((parseFloat(subTotal) + parseFloat(charge)).toFixed(2))
            setState({ ...state, total: (parseFloat(state.total) + parseFloat(charge)).toFixed(2) })
        }
        setAllCheckedValue(newArr)
    }

    return (
        <>
            <Loader loader={loader} />
            <div className="main-site customer-view">
                <section id="main-header">
                    <header className="customer-view--header">
                        <div className="container">
                            <div className="row no-gutter justify-content-between align-items-center">
                                <div className="col-auto">
                                    <h1>{state.quoteName}</h1>
                                </div>
                                <div className="col-auto">
                                    <div className="customer-view-hdr-logo">
                                        <em>Powered By</em>
                                        <a className="navbar-brand" href="#navbar" onClick={(e) => e.preventDefault()}>MyBizz<span>Hive</span></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                </section>
                <main className="site-body">

                    <section className="middle-section">
                        <div className="container">

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
                                                <h4 className="quote-heading"> {state.lineItem || ''}</h4>
                                            </div>
                                            <div className="card-body">

                                                <table className="table table-striped smart-table mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>{state.itemName || 'Line Item'}</th>
                                                            <th>{state.qty || 'Qty'}</th>
                                                            <th>{state.charge || 'Amount'}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            _.map(lineItems, (item, k) => {
                                                                return <tr key={k}>
                                                                    <td className="qt-activity-name"><strong>{item.item_name}</strong><p>{item.item_description}</p></td>
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
                                                                        return <tr key={k} className={_.includes(allCheckedValue, item.id) ? "" : "optional-item-tr"}>
                                                                            <td className="qt-activity-name">
                                                                                <div className="custom-control custom-checkbox">
                                                                                    <input type="checkbox" name={item.id} onChange={(e) => onCheckedValue(item.id, item.item_charges)} checked={_.includes(allCheckedValue, item.id)} className="custom-control-input" id={'check' + item.id} />
                                                                                    <label className="custom-control-label" htmlFor={'check' + item.id}><strong>{item.item_name}</strong></label>
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
                                                            <td colSpan="3" className="p-0">
                                                                <table className="table m-0">
                                                                    <tbody>
                                                                        {amountArr.length > 0 ?
                                                                            <>
                                                                                <tr>
                                                                                    <td className="qt-colblank"></td>
                                                                                    <td className="qt-qttotal qt-subtotal">Subtotal</td>
                                                                                    <td className="qt-fees">${subTotal}</td>
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
                                                                            <td className="qt-fees"><strong>${floatingWithTwoDecimal(state.total)}</strong> {/* USD */}</td>
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
                                                        <p>{/* Total Amount */}<strong>Advance: ${state.deposite}</strong></p>
                                                    </div>
                                                    <div className="rvwqt-download">
                                                        <a href={baseUrl[0] + 'download-invoice/' + quoteId} target="_blank" rel="noopener noreferrer"><img src={setImagePath(DOWNLOAD)} alt="" /> Download</a>
                                                    </div>
                                                    <div className="rvwqt-btns">
                                                        {state.status === 5 || state.status === 4 || (moment().isBefore(moment(state.validThrough).add(1, 'days')) === false) ?
                                                            <>
                                                                {/*  <button onClick={(e) => e.preventDefault()} className="btn btn-danger">Decline</button>
                                                        <button onClick={(e) => e.preventDefault()} className="btn btn-secondary">Request Revision</button>
                                                        {state.deposite===0 ?
                                                            <button onClick={(e) => e.preventDefault()} className="btn btn-primary">Accept</button>
                                                            : <button onClick={(e) => e.preventDefault()} className="btn btn-primary">Accept & Pay Deposit</button>
                                                        } */}
                                                            </>
                                                            :
                                                            <>
                                                                <button onClick={(e) => setDeclineModalShow(true)} className="btn btn-danger">Decline</button>
                                                                <button onClick={(e) => setQuoteRevisionModalShow(true)} className="btn btn-secondary">Request Revision</button>
                                                                {state.depositRequired === 1 && state.depositOnline === 1 ?
                                                                    <button onClick={() => setAcceptQuoteDepositModalShow(true)} className="btn btn-primary">Accept & Pay Advance</button>
                                                                    : <button onClick={() => setAcceptQuoteModalShow(true)} className="btn btn-primary">Accept</button>
                                                                }
                                                            </>
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

                    {/* Add Decline Modal*/}
                    <QuoteDecline loader={(data) => setLoader(data)}
                        openDeclineModal={declineModalShow}
                        quoteId={quoteId}
                        quoteName={state.quoteName}
                        closeDeclineModal={() => setDeclineModalShow(false)}
                    />
                    {/* Quote Accept Modal*/}
                    <QuoteAccept loader={(data) => setLoader(data)}
                        openQuoteAcceptModal={acceptQuoteModalShow}
                        quoteId={quoteId}
                        optional_id={allCheckedValue}
                        quoteName={state.quoteName}
                        closeQuoteAcceptModal={() => setAcceptQuoteModalShow(false)}
                    />
                    {/* Quote Accept Depost Modal*/}
                    <QuoteAcceptDeposit loader={(data) => setLoader(data)}
                        openQuoteAcceptDepositModal={acceptQuoteDepositModalShow}
                        quoteId={quoteId}
                        quoteName={state.quoteName}
                        depositAmount={state.deposite}
                        total={state.total}
                        paymentDetail={paymentDetail}
                        optional_id={allCheckedValue}
                        closeQuoteAcceptDepositModal={() => setAcceptQuoteDepositModalShow(false)}
                    />

                    {/* Quote Revision Modal*/}
                    <QuoteRevision loader={(data) => setLoader(data)}
                        openQuoteRevisionModal={quoteRevisionModalShow}
                        quoteId={quoteId}
                        quoteName={state.quoteName}
                        closeQuoteRevisionModal={() => setQuoteRevisionModalShow(false)}
                    />

                </main>
                <Footer />
            </div >
        </>
    );
}

export const ViewCustomerQuote = withRouter(NewCustomerViewQuote)