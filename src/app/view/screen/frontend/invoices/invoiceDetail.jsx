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
import { getInvoiceById } from '../../../../duck/invoice/invoice.action';
import { LIST_INVOICES, VIEW_CONTACT_BASE } from "../../../../routing/routeContants";
import ORANGE_ARROW from '../../../../assets/images/orange-arrow.svg'
import ReactHtmlParser from 'react-html-parser';
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import CHECKBOX_ICON from '../../../../assets/images/ic_check-blue.svg';
import { MarkPaidInvoice } from './markAsPaid'

export const NewInvoiceDetail = props => {
    let invoiceId;
    if (props.match && _.has(props.match, 'params') && _.has(props.match.params, 'id')) {
        invoiceId = props.match.params.id
    }

    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [serviceMessage, setServiceMessage] = useState('');
    const [isCollapse, setIsCollapse] = useState('');
    const [timelineData, setTimelineData] = useState('');
    const [lineItems, setLineItems] = useState([{ item_name: '', item_description: '', item_charges: '' }]);
    const [amountArr, setAmount] = useState([{ fee_name: 'Set up cost', amount: '' }, { fee_name: 'Service Charge', amount: '' }, { fee_name: 'MISC or Taxes', amount: '' }, { discount_name: 'Discount Name', amount: '' }]);
    const [sections, setSections] = useState([]);
    const [contactData, setContactData] = useState('');
    const [subTotal, setSubTotal] = useState(0);
    const [organizationData, setOrganizationData] = useState('');
    const [state, setState] = useState({
        invoiceName: '', timeValue: '', location: '', internalNotes: '',
        timeShiftValue: '', customDuration: '', lat_long: '', totalAmount: 0, deposite: 0, date: '',
        lineItem: '', itemName: '', discription: '', charge: '', validThrough: '', latLngUrl: '',
        status: 2, signature: '', revision: '', alphaId: '', totalDue: 0, rejectReason: '',
        paymentReceive: 0, amountPaid: 0, dueDate: '', tipAmount: 0, PaidBy: '', qty: '', rate: '',
    });
    const getInvoiceByIdData = useSelector(state => state.invoice.getInvoiceByIdData);
    const prevGetInvoiceByIdData = usePrevious({ getInvoiceByIdData });

    // Mark as Paid 
    const [markPaidInvoiceModalShow, setMarkPaidInvoiceModalShow] = useState(false);

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

    // Get props invoice by id and add organization 
    useEffect(() => {
        if (prevGetInvoiceByIdData && prevGetInvoiceByIdData.getInvoiceByIdData !== getInvoiceByIdData) {
            if (getInvoiceByIdData && _.has(getInvoiceByIdData, 'data') && getInvoiceByIdData.success === true) {
                const InvoiceData = getInvoiceByIdData.data.invoice;
                if (!InvoiceData.id) {
                    props.history.push(LIST_INVOICES)
                } else {
                    let itemName, discription, charge, qty, rate;
                    if (InvoiceData.description.length > 0) {
                        let itemTitleGet = _.find(InvoiceData.description, { 'type': "item_title" });
                        let itemHeadingGet = _.find(InvoiceData.description, { 'type': "item_heading" });
                        let itemsGet = _.filter(InvoiceData.description, (dd) => dd.type === 'item');
                        let sectionsGet = _.filter(InvoiceData.description, (dd) => dd.type === 'section');
                        itemName = itemTitleGet && itemHeadingGet.item_heading_name ? itemHeadingGet.item_heading_name : ''
                        discription = itemTitleGet && itemHeadingGet.item_heading_description ? itemHeadingGet.item_heading_description : ''
                        charge = itemTitleGet && itemHeadingGet.item_heading_charges ? itemHeadingGet.item_heading_charges : ''
                        qty = itemHeadingGet && itemHeadingGet.item_heading_qty ? itemHeadingGet.item_heading_qty : ''
                        rate = itemHeadingGet && itemHeadingGet.item_heading_rate ? itemHeadingGet.item_heading_rate : ''
                        let amountsGet = _.filter(InvoiceData.description, (dd) => (dd.type === 'fee' || dd.type === 'discount'));
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
                    }

                    setLoader(false)
                    setTimelineData(InvoiceData.timeline)
                    setContactData(InvoiceData.contact)
                    let latLngUrl = '';
                    if (InvoiceData.event_lat_long && InvoiceData.event_lat_long !== null) {
                        let placeData = JSON.parse(InvoiceData.event_lat_long);
                        latLngUrl = placeData.lat + ',' + placeData.lng + '&query_place_id=' + placeData.place_id
                    }
                    setState({
                        ...state, invoiceName: InvoiceData.name,
                        invoiceSerialNo: InvoiceData.invoice_serial_no,
                        total: InvoiceData.amount_total,
                        tipAmount: InvoiceData.tip_amount,
                        PaidBy: InvoiceData.paid_by,
                        latLngUrl: latLngUrl,
                        alpha_id: InvoiceData.alpha_id,
                        deposite: InvoiceData.amount_deposit,
                        paymentReceive: InvoiceData && InvoiceData.amount_received ? InvoiceData.amount_received : 0,
                        totalDue: InvoiceData.amount_balance,
                        amountPaid: InvoiceData.amount_paid,
                        rejectReason: InvoiceData.reject_reason,
                        status: InvoiceData.invoice_status_type_id,
                        date: InvoiceData.event_date !== null ? InvoiceData.event_date : '',
                        timeValue: InvoiceData.event_date !== null ? InvoiceData.event_date : '',
                        internalNotes: InvoiceData.internal_notes !== null ? InvoiceData.internal_notes : '',
                        location: InvoiceData.event_location !== null ? InvoiceData.event_location : '',
                        lat_long: InvoiceData.event_lat_long !== null ? InvoiceData.event_lat_long : '',
                        validThrough: InvoiceData.valid_through !== null ? InvoiceData.valid_through : '',
                        signature: InvoiceData.accept_signature !== null ? InvoiceData.accept_signature : '',
                        lineItem: InvoiceData.service_type && InvoiceData.service_type.name ? InvoiceData.service_type.name : '',
                        itemName, discription, charge, qty, rate,
                        customDuration: InvoiceData.event_duration !== null ? InvoiceData.event_duration : '',
                        revision: InvoiceData.revision !== null ? InvoiceData.revision : '',
                        dueDate: InvoiceData.due_date !== null ? InvoiceData.due_date : '',
                    })
                    // Set Organization Data
                    setOrganizationData(InvoiceData.user_org_map.organization);
                }
            }
            if (getInvoiceByIdData && _.has(getInvoiceByIdData, 'message') && getInvoiceByIdData.success === false) {
                setLoader(false)
                setServiceMessage(getInvoiceByIdData.message)
            }
        }
    }, [prevGetInvoiceByIdData, getInvoiceByIdData])// eslint-disable-line react-hooks/exhaustive-deps

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
                                            <li className="breadcrumb-item active" aria-current="page">Invoice Details</li>
                                        </ol>
                                        <h2 className="title">Invoice: {state.invoiceSerialNo} <small className="font-small">({state.invoiceName})</small></h2>
                                    </div>
                                </div>
                                <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                    <a href={baseUrl[0] + 'invoice-pdf/' + state.alpha_id} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mr-15">Download PDF</a>
                                    <div className="btn-divider mr-15"></div>
                                    {state.status !== 5 && state.totalDue !== 0 ?
                                        <button type="button" onClick={() => setMarkPaidInvoiceModalShow(true)} className="btn btn-secondary mr-15 d-none d-lg-flex">Mark as Paid</button>
                                        : ''}
                                    {/* <div className="dropdown d-lg-none custom-dropdown dropdown-toggle--mbl">
                                        <button className="btn dropdown-toggle " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <img src={setImagePath(MENU_DOTTED)} alt="" />
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                            <button onClick={(e) => createInvoiceByQuote(e)}  className="btn btn-secondary mr-15">Generate Invoice</button>
                                        </div>
                                    </div> */}

                                    <Link to={LIST_INVOICES} className="btn btn-primary">Back</Link>
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
                                                <h4 className="quote-heading">Internal Notes</h4>
                                            </div>
                                            <div className="card-body px-4">
                                                {state.internalNotes}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="quote-timeline">
                                <ul className="quote-timeline--wrap">
                                    <li className={timelineData.viewed_at !== null ? "completed" : "current"}><span><em>Sent</em> {timelineData.sent_at !== null ? moment(timelineData.sent_at).format('h:mmA ddd, MMM DD') : '  '}</span></li>
                                    <li className={timelineData.viewed_at !== null ? timelineData.paid_at !== null ? "completed" : "current" : ""}><span><em>Viewed</em> {timelineData.viewed_at !== null ? moment(timelineData.viewed_at).format('h:mmA ddd, MMM DD') : '  '}</span></li>
                                    {state.status === 4 ?
                                        <li className="revision"><span><em>Past Due</em></span></li>
                                        :
                                        state.status === 5 ?
                                            <li className="current"><span><em>Paid</em> {timelineData && timelineData.paid_at !== null ? moment(timelineData.paid_at).format('h:mmA ddd, MMM DD') : ''}</span></li>
                                            :
                                            <li><span><em>Paid</em></span></li>
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
                                                        <label>Service Date</label>
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
                                                        <label>Invoice Date</label>
                                                        <div className="field-text">{state.invoiceDate !== '' ? moment(state.invoiceDate).format('ddd, MMM DD YYYY') : '-'}</div>
                                                    </div>
                                                    <div className="form-group col-6">
                                                        <label>Invoice ID</label>
                                                        <div className="field-text">{state.invoiceSerialNo}</div>
                                                    </div>
                                                    <div className="form-group col-6 mb-0">
                                                        <label>Total Amount Due</label>
                                                        <div className="field-text bizzamount-price">${floatingWithTwoDecimal(state.totalDue)}</div>
                                                    </div>
                                                    <div className="form-group col-6 mb-0">
                                                        <label>Due Date</label>
                                                        <div className="field-text">{state.dueDate !== '' ? moment(state.dueDate).format('ddd, MMM DD YYYY') : '-'}</div>
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
                                                                            <td className="qt-fees"><strong>${floatingWithTwoDecimal(state.total)}</strong></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="qt-colblank"></td>
                                                                            <td className="qt-qttotal">Advance</td>
                                                                            <td className="qt-fees"><span className="col--minus"> ${floatingWithTwoDecimal(state.paymentReceive)}</span></td>
                                                                        </tr>
                                                                        {state.status === 5 ?
                                                                            <>
                                                                                <tr>
                                                                                    <td className="qt-colblank"></td>
                                                                                    <td className="qt-qttotal">Tip</td>
                                                                                    <td className="qt-fees">${floatingWithTwoDecimal(state.tipAmount)}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td className="qt-colblank"></td>
                                                                                    <td className="qt-qttotal qt-total"><strong>Amount Paid</strong></td>
                                                                                    <td className="qt-fees"><strong>${floatingWithTwoDecimal(state.amountPaid)}</strong></td>
                                                                                </tr>
                                                                            </>
                                                                            :
                                                                            <tr>
                                                                                <td className="qt-colblank"></td>
                                                                                <td className="qt-qttotal qt-total"><strong>Amount Due</strong></td>
                                                                                <td className="qt-fees"><strong>${floatingWithTwoDecimal(state.totalDue)}</strong></td>
                                                                            </tr>
                                                                        }
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
                                                    <div className="rvwqt-deposit">
                                                        <h4>${floatingWithTwoDecimal(state.status === 5 ? state.amountPaid : state.totalDue)}</h4>
                                                        <p>{state.status === 5 ? 'Amount Paid' : 'Amount Due'}</p>
                                                    </div>
                                                    <div className="rvwqt-deposit">
                                                        <p className="mb-2 mt-1"><strong>{state.status === 5 ? moment(timelineData.paid_at).format('ddd, MMM DD YYYY') : moment(state.dueDate).format('ddd, MMM DD YYYY')}</strong></p>
                                                        <p>{state.status === 5 ? 'Paid On' : 'Due Date'}</p>
                                                    </div>
                                                    <div className="rvwqt-signature">
                                                        Signature
                                                    </div>
                                                    {state && state.status === 5 ?
                                                        state.PaidBy !== 'Online' ?
                                                            <div className="rvwqt-final">
                                                                <h6>Payment Method : {state.PaidBy}</h6>
                                                                <p>Last updated on: {moment(timelineData.paid_at).format('h:mmA MMM DD, YYYY')}</p>
                                                            </div>
                                                            :
                                                            <div className="rvwqt-final">
                                                                <h4>{state.signature || '-'}</h4>
                                                                <p>Signed & Paid on {moment(timelineData.paid_at).format('h:mmA MMM DD, YYYY')}</p>
                                                            </div>
                                                        : state && state.status === 4 ?
                                                            <div className="rvwqt-final"><h4 className="text-danger mb-0"><strong>Past Due</strong></h4></div>
                                                            : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Mark As Paid Invoice Modal*/}
                    <MarkPaidInvoice loader={(data) => setLoader(data)}
                        openMarkPaidInvoiceModal={markPaidInvoiceModalShow}
                        invoiceId={invoiceId}
                        invoiceSerialNo={state.invoiceSerialNo}
                        totalDue={state.totalDue}
                        closeMarkPaidInvoiceModal={() => setMarkPaidInvoiceModalShow(false)}
                    />
                </main>
                <Footer />
            </div >
        </>
    );
}

export const InvoiceDetail = withRouter(NewInvoiceDetail)