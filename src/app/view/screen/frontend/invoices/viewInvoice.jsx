import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import { Link, withRouter } from "react-router-dom";
import { Loader } from '../../../component/frontend/loader/loader'
import DOWNLOAD from "../../../../assets/images/ic_get_app.svg";
import moment from 'moment'
import { constants, baseUrl } from "../../../../common/constants";
import { usePrevious, setImagePath, floatingWithTwoDecimal } from '../../../../common/custom';
import _ from 'lodash';
import ORANGE_ARROW from '../../../../assets/images/orange-arrow.svg'
import ReactHtmlParser from 'react-html-parser';
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import CHECKBOX_ICON from '../../../../assets/images/ic_check-blue.svg';
import { getInvoiceById } from "../../../../duck/invoice/invoice.action";
import { ADD_INVOICE_BASE, LIST_INVOICES, VIEW_CONTACT_BASE, SENT_INVOICE_BASE, ADD_BASIC_INVOICE } from "../../../../routing/routeContants";
import ALERT_ICON from "../../../../assets/images/alert-icn.svg";
import { AddOrganization } from './addOrganization'

export const NewViewInvoice = props => {
    let invoiceId;
    if (props.match && _.has(props.match, 'params') && _.has(props.match.params, 'id')) {
        invoiceId = props.match.params.id
    }
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [businessProfileModalShow, setBusinessProfileModalShow] = useState(false);
    const [serviceMessage, setServiceMessage] = useState('');
    const [lineItems, setLineItems] = useState([{ item_name: '', item_description: '', item_charges: '' }]);
    const [amountArr, setAmount] = useState([]);
    const [sections, setSections] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [organizationData, setOrganizationData] = useState('');
    const [contactData, setContactData] = useState('');
    const [isCollapse, setIsCollapse] = useState('');
    const [state, setState] = useState({
        correctInput: '', wrongInput: constants.WRONG_INPUT, invoiceName: '', invoiceSerialNo: '',
        location: '', lat_long: '', date: '', timeValue: '', customDuration: '', invoiceDate: '', dueDate: '', totalAmount: 0,
        totalDue: 0, deposite: 0, depositRequired: 0, depositOnline: 0, serviceName: '', itemName: '', discription: '', charge: '',
        latLngUrl: '', deposit_online: 0, qty: '', rate: '',
    });
    const getInvoiceByIdData = useSelector(state => state.invoice.getInvoiceByIdData);
    const prevGetInvoiceByIdData = usePrevious({ getInvoiceByIdData });

    // On Load Get Data
    useEffect(() => {
        if (invoiceId) {
            setLoader(true)
            dispatch(getInvoiceById({ id: invoiceId }))
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

    useEffect(() => {
        if (prevGetInvoiceByIdData && prevGetInvoiceByIdData.getInvoiceByIdData !== getInvoiceByIdData) {
            if (getInvoiceByIdData && _.has(getInvoiceByIdData, 'data') && getInvoiceByIdData.success === true) {
                const InvoiceData = getInvoiceByIdData.data.invoice;
                if (!InvoiceData.id || InvoiceData.invoice_status_type_id !== 1) {
                    props.history.push(LIST_INVOICES)
                } else {
                    let itemName = 'Line Item', discription = 'Discription', charge = 'Amount', qty = 'Qty', rate = "Rate";
                    if (InvoiceData.description.length > 0) {
                        let itemHeadingGet = _.find(InvoiceData.description, { 'type': "item_heading" });
                        let itemsGet = _.filter(InvoiceData.description, (dd) => dd.type === 'item');
                        let sectionsGet = _.filter(InvoiceData.description, (dd) => dd.type === 'section');
                        itemName = itemHeadingGet && itemHeadingGet.item_heading_name ? itemHeadingGet.item_heading_name : ''
                        discription = itemHeadingGet && itemHeadingGet.item_heading_description ? itemHeadingGet.item_heading_description : ''
                        charge = itemHeadingGet && itemHeadingGet.item_heading_charges ? itemHeadingGet.item_heading_charges : ''
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
                        if (sectionsGet.length > 0) {
                            setSections(_.map(sectionsGet, _.partial(_.pick, _, ['section_name', 'section_description'])))
                        } else {
                            setSections([{ section_name: 'Terms & Conditions', section_description: '' }])
                        }
                        setAmount(amontAr);
                        setLineItems(_.map(itemsGet, _.partial(_.pick, _, ['item_name', 'item_description', 'item_charges', 'item_qty', 'item_rate'])))
                        const totalCharge = _.sumBy(itemsGet, ch => {
                            return (parseFloat(ch.item_charges) ? parseFloat(ch.item_charges) : 0);
                        });
                        setSubTotal(parseFloat(totalCharge).toFixed(2))
                    } else {
                        setSections([{ section_name: 'Terms & Conditions', section_description: '' }])
                    }
                    setLoader(false)
                    setContactData(InvoiceData.contact)
                    let latLngUrl = '';
                    if (InvoiceData.event_lat_long && InvoiceData.event_lat_long !== null) {
                        let placeData = JSON.parse(InvoiceData.event_lat_long);
                        latLngUrl = placeData.lat + ',' + placeData.lng + '&query_place_id=' + placeData.place_id
                    }
                    setState({
                        ...state, invoiceName: InvoiceData.name,
                        invoiceSerialNo: InvoiceData.invoice_serial_no,
                        latLngUrl: latLngUrl,
                        date: InvoiceData.event_date !== null ? InvoiceData.event_date : '',
                        timeValue: InvoiceData.event_date !== null ? InvoiceData.event_date : '',
                        location: InvoiceData.event_location !== null ? InvoiceData.event_location : 'TBD',
                        lat_long: InvoiceData.event_lat_long !== null ? InvoiceData.event_lat_long : '',
                        customDuration: InvoiceData.event_duration !== null ? InvoiceData.event_duration : '',
                        totalAmount: InvoiceData.amount_total !== null ? InvoiceData.amount_total : '',
                        totalDue: InvoiceData.amount_balance !== null ? InvoiceData.amount_balance : '',
                        invoiceDate: InvoiceData.created_at !== null ? InvoiceData.created_at : '',
                        dueDate: InvoiceData.due_date !== null ? InvoiceData.due_date : '',
                        deposite: InvoiceData.amount_received !== null ? InvoiceData.amount_received : 0,
                        depositRequired: InvoiceData.deposit_required,
                        deposit_online: InvoiceData.deposit_online,
                        serviceName: InvoiceData.service_type && InvoiceData.service_type.name ? InvoiceData.service_type.name : '',
                        itemName, discription, charge, qty, rate,
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
    }, [prevGetInvoiceByIdData, getInvoiceByIdData]); // eslint-disable-line react-hooks/exhaustive-deps

    // Move To Basic Detail Page 
    const movedToBasicDetailPage = (e) => {
        let data = getInvoiceByIdData.data;
        props.history.push({
            pathname: ADD_BASIC_INVOICE,
            state: { invoiceDataState: data }
        })
    }

    // Move To Quote Detail Page 
    const movedToInvoiceDetailPage = (e) => {
        props.history.push(ADD_INVOICE_BASE + invoiceId)
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
                                            <li className="breadcrumb-item active" aria-current="page">Preview Invoice</li>
                                        </ol>
                                        <h2 className="title">Invoice: {state.invoiceSerialNo} <small className="font-small">({state.invoiceName})</small></h2>
                                    </div>
                                </div>
                                <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                    <Link to={LIST_INVOICES} className="btn btn-dark mr-15">Close</Link>
                                    <div className="btn-divider mr-15"></div>
                                    <Link to={ADD_INVOICE_BASE + invoiceId} className="btn btn-secondary mr-15">Back</Link>
                                    <Link to={SENT_INVOICE_BASE + invoiceId} className="btn btn-primary">Continue</Link>
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
                                                        <div className="timeline-cols active"><h5><em className="d-none d-lg-flex">3. Preview Invoice</em> <i className="d-lg-none">3</i></h5><span></span></div>
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
                                    <p className="mb-0"><strong>Note:</strong> This is also your customer’s view of the invoice. They will receive an email with link to the invoice along with your message.</p>
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
                                                        <div className="field-text"><strong>{moment(state.date).format('HH:mm') !== '00:00' ? moment(state.timeValue).format("LT") + ' PST' : 'TBD'}</strong>
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
                                            {state.serviceName || ''}
                                            <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                        <div className={"card main-card--collapse show " + isCollapse} id="LineItemsCollapse">
                                            {/* <div className="card-header d-none d-lg-flex justify-content-between align-items-center">
                                                <h4 className="quote-heading">{state.serviceName || ''}</h4>
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
                                                                            <td className="qt-fees"><strong>${floatingWithTwoDecimal(state.totalAmount)}</strong></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="qt-colblank"></td>
                                                                            <td className="qt-qttotal"><strong>Advance</strong></td>
                                                                            <td className="qt-fees"><strong><span className="col--minus">${floatingWithTwoDecimal(state.deposite)}</span></strong></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className="qt-colblank"></td>
                                                                            <td className="qt-qttotal"><strong>Total Due</strong></td>
                                                                            <td className="qt-fees"><strong>${floatingWithTwoDecimal(state.totalDue)}</strong></td>
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
                                                        <h4>${floatingWithTwoDecimal(state.totalDue)}</h4>
                                                        <p>Amount Due</p>
                                                    </div>
                                                    <div className="rvwqt-deposit">
                                                        <p className="mb-2 mt-1"><strong>{state.dueDate !== '' ? moment(state.dueDate).format('ddd, MMM DD YYYY') : '-'}</strong></p>
                                                        <p>Due Date</p>
                                                    </div>
                                                    <div className="rvwqt-download disabled-button-state">
                                                        <a href="#about" onClick={(e) => e.preventDefault()}><img src={setImagePath(DOWNLOAD)} alt="" /> Download</a>
                                                    </div>
                                                    {state.deposit_online === 1 ?
                                                        <div className="rvwqt-btns disabled-button-state">
                                                            <a href="#about" onClick={(e) => e.preventDefault()} className="btn btn-primary">Make Payment</a>
                                                        </div>
                                                        : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="rvwqt-note"><b>Note:</b> Both parties will receive a copy of this invoice via email after the customer has made the payment.</p>
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

export const ViewInvoice = withRouter(NewViewInvoice)