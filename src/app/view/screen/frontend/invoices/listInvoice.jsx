import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import { Link, withRouter } from "react-router-dom";
import { VIEW_INVOICE_DETAIL_BASE, LIST_PAID_INVOICE, ADD_BASIC_INVOICE, VIEW_INVOICE_BASE, ADD_INVOICE_BASE } from "../../../../routing/routeContants";
import { usePrevious, setImagePath } from '../../../../common/custom';
import { Loader } from '../../../component/frontend/loader/loader'
import { listInvoice } from '../../../../duck/invoice/invoice.action';
import _ from 'lodash';
import ORANGE_ARROW from '../../../../assets/images/orange-arrow.svg'
import ARROW_RIGHT from '../../../../assets/images/arrow-rgt-teal.svg'
import PAYPAL_ICON from '../../../../assets/images/paypal.png'
import moment from 'moment'
import { getUserDetails } from '../../../../storage/user';
import { SubscriptionPlan } from "../profile/subscriptionPlans"
import Swal from 'sweetalert2'


export const ListInvoicePage = props => {

    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const userData = getUserDetails();
    const currentPlan = userData && userData.planData
    const [subscriptionModalShow, setSubscriptionModalShow] = useState(false);
    const [fetchList, setfetchList] = useState(true);
    const [isCollapse, setIsCollapse] = useState('');

    // List Quoes 
    const [allInvoices, setAllInvoice] = useState([])
    const [totalInvoice, setTotalInvoice] = useState(0)
    const listInvoiceData = useSelector(state => state.invoice.listInvoiceData);
    const prevListInvoiceData = usePrevious({ listInvoiceData });

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

    // On Load Get Data
    useEffect(() => {
        setLoader(true)
        dispatch(listInvoice())
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (prevListInvoiceData && prevListInvoiceData.listInvoiceData !== listInvoiceData) {
            console.log(listInvoiceData)
            if (listInvoiceData && _.has(listInvoiceData, 'data') && listInvoiceData.success === true) {
                let totalInvoice = 0;
                _.map(listInvoiceData.data, (val, ind) => {
                    totalInvoice = totalInvoice + val.count
                })
                setAllInvoice(listInvoiceData.data)
                setTotalInvoice(totalInvoice)
                setLoader(false)
                setfetchList(false);
            }
            if (listInvoiceData && _.has(listInvoiceData, 'message') && listInvoiceData.success === false) {
                setLoader(false)
                setfetchList(false);
            }
        }
    }, [prevListInvoiceData, listInvoiceData])// eslint-disable-line react-hooks/exhaustive-deps

    // Create Invoice 
    const createInvoice = (e) => {
        e.preventDefault()
        if(currentPlan && currentPlan.plan_is_active === 0){
            let buttonMsg = currentPlan.subscription_product_id === 1 ? 'View Plans' : 'Renew Plan'
            let warMsg = currentPlan.subscription_product_id === 1 ? 'Free Trial Expired' : 'Subscription Expired'
            let  msg = currentPlan.subscription_product_id === 1 ? 'Your free trial has expired. Please subscribe to a plan to access the application. ' : 'Your subscription has expired. Please renew your subscription or upgrade your plan to access the application. ';
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
            props.history.push(ADD_INVOICE_BASE)
        }
    }

    return (
        <>
            <Loader loader={loader} />
            <div className="main-site fixed--header">
                <Header getMainRoute={'invoices'} />
                <main className="site-body">
                    <section className="page-title contact--header">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-auto title--col">
                                    <div>
                                        <h2 className="title">Invoices ({totalInvoice})</h2>
                                    </div>
                                </div>
                                <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                    <button onClick={(e) => createInvoice(e)} className="btn btn-primary">Create Invoice</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="middle-section">
                        <div className="container">
                            {totalInvoice !== 0 ?
                                <div className="row no-gutters-mbl">
                                    <div className="col-12">
                                        {/* <div className="row justify-content-center">
                                            <div className="col-lg-3">
                                                <div className="alert alert-info plan-alert" role="alert">
                                                    Trial Plan 6 Feb 2021
                                                    <button type="button" className="btn btn-sm btn-primary">Buy</button>
                                                </div>
                                            </div>
                                        </div> */}
                                        <div className="leads-container quotes-section">
                                            <div className="leads-container_row leads-container_scroller lead-stage-adjust ">
                                                {_.map(allInvoices, (data, key) => {
                                                    return <div key={key} className="leads-col">
                                                        <div className="leads-col_header">
                                                            <button className="btn btn-block d-lg-none btn--card-collapse" type="button" data-toggle="collapse" data-target={'#lead-' + data.id} aria-expanded="false" aria-controls={'lead-' + data.id}><span>{data.name} ({data.count})</span> <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                                            <div className="header--web d-none d-lg-flex"><h4>{data.name} </h4><img src={setImagePath(ARROW_RIGHT)} alt="" /></div>
                                                        </div>
                                                        <div className={"leads-col_body " + isCollapse} id={'lead-' + data.id}>
                                                            <div className="leads-col_body--wrap">
                                                                {_.map(data.invoices, (invoice, invoiceKey) => {
                                                                    return <div className={"dragable--card " + (invoice.invoice_status_type_id === 5 ? 'completed' : (invoice.invoice_status_type_id === 4 ? 'lost' : ''))} key={invoiceKey}>
                                                                        <div className="title"><Link to={(data.name === 'New/Draft' ? VIEW_INVOICE_BASE : VIEW_INVOICE_DETAIL_BASE) + invoice.id}>{invoice.name}</Link></div>
                                                                        <div className="info">
                                                                            {invoice.contact && invoice.contact.id ?
                                                                                <>
                                                                                    {invoice.invoice_status_type_id === 5 ?
                                                                                        <>
                                                                                            <p className="mb-0"><strong>${invoice.amount_paid}</strong></p>
                                                                                            <p className="mb-0"> Paid On: {moment(invoice.timeline.paid_at).format('ll')}</p>
                                                                                        </>
                                                                                        :
                                                                                        <>
                                                                                            <p className="mb-0">{invoice.contact.first_name + ' ' + (invoice.contact.last_name !== null ? invoice.contact.last_name : '')}
                                                                                                {/* {invoice.contact.phone !== null ? (<><br />{invoice.contact.phone}</>) : ''} */} </p>
                                                                                            <p className="mb-0">Invoice ID : {invoice.invoice_serial_no}</p>
                                                                                            {invoice.amount_total !== null ? <p className="mb-0">${invoice.amount_total}</p> : ''}
                                                                                            {
                                                                                                invoice.invoice_status_type_id === 2 ?
                                                                                                    <p className="mb-0 quote-last-update">Sent at: {invoice.timeline && invoice.timeline.sent_at !== null ? moment(invoice.timeline.sent_at).format('h:mmA, MMM DD') : moment(invoice.timeline.paid_at).format('h:mmA, MMM DD')}</p>
                                                                                                    :
                                                                                                    invoice.invoice_status_type_id === 4 ?
                                                                                                        <p className="mb-0 quote-last-update"> Due On: {moment(invoice.due_date).format('ll')}</p>
                                                                                                        :
                                                                                                        invoice.invoice_status_type_id === 3 ?
                                                                                                            <p className="mb-0 quote-last-update">Viewed at: {invoice.timeline && invoice.timeline.viewed_at !== null ? moment(invoice.timeline.viewed_at).format('h:mmA, MMM DD') : moment(invoice.timeline.paid_at).format('h:mmA, MMM DD')}</p>
                                                                                                            :
                                                                                                            <p className="mb-0 quote-last-update">Last Updated: {moment(invoice.updated_at).format('h:mmA, MMM DD')}</p>
                                                                                            }
                                                                                        </>
                                                                                    }
                                                                                </>
                                                                                : ''}
                                                                        </div>
                                                                        {invoice.deposit_online === 1 ?
                                                                            <div className="total-tasksnotes">
                                                                                <div className="">
                                                                                    <img src={setImagePath(PAYPAL_ICON)} alt="" />
                                                                                </div>
                                                                            </div>
                                                                            : ''}
                                                                    </div>
                                                                })}
                                                            </div>
                                                            {data.name === 'Paid' && (data.invoices).length > 3 ?
                                                                <div className="d-block view-closed-leads text-center"><Link to={LIST_PAID_INVOICE} className="text-link">View All Invoices</Link></div>
                                                                : ''}

                                                        </div>
                                                    </div>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <>
                                    <div className="row no-gutters-mbl mb-4">
                                        <div className="col-12">
                                            <div className="leads-container no-lead">
                                                <div className="leads-container_row leads-container_scroller lead-stage-adjust">
                                                    {_.map(allInvoices, (data, key) => {
                                                        return <div className="leads-col" key={key}>
                                                            <div className="leads-col_header">
                                                                <button className="btn btn-block d-lg-none btn--card-collapse" type="button" data-toggle="collapse" data-target={'#' + data.id} aria-expanded="false" aria-controls={data.id}><span>{data.name} (0)</span> <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                                                <div className="header--web d-none d-lg-flex"><h4>{data.name}</h4><img src={setImagePath(ARROW_RIGHT)} alt="" /></div>
                                                            </div>
                                                        </div>
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {fetchList ?
                                        ''
                                        :
                                        <div className="row no-gutters-mbl">
                                            <div className="col-12">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div className="empty-leads">
                                                            <p>You don’t have any invoice yet! </p>
                                                            {/*  <p>Create new leads and track your business in one view. </p>
                                                            <p>Create your own view by editing the stage names or adding new ones.</p> */}
                                                            <Link to={ADD_BASIC_INVOICE} className="btn btn-primary">Create Invoice</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>}
                                </>
                            }
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
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

export const ListInvoice = withRouter(ListInvoicePage)