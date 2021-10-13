import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import MENU_DOTTED from '../../../../assets/images/menu-dotted.svg'
import { setImagePath, usePrevious } from '../../../../common/custom'
import { Link, withRouter } from "react-router-dom";
import { LIST_INVOICES, VIEW_INVOICE_DETAIL_BASE } from "../../../../routing/routeContants";
import { getPaidInvoice } from "../../../../duck/invoice/invoice.action";
import _ from 'lodash';
import moment from 'moment';
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import PAYPAL_ICON from '../../../../assets/images/paypal.png'

export const NewListPaidInvoice = props => {

    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [total, setTotal] = useState(0);
    const [serviceMessage, setServiceMessage] = useState('');
    const [allInvoiceData, setAllInvoiceData] = useState([]);
    const getPaidInvoiceData = useSelector(state => state.invoice.getPaidInvoiceData);
    const prevGetPaidInvoiceData = usePrevious({ getPaidInvoiceData });


    // On Load Get Data
    useEffect(() => {
        setLoader(true)
        dispatch(getPaidInvoice())
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // List Invoice Status Data And Get Invoice Data
    useEffect(() => {
        if (prevGetPaidInvoiceData && prevGetPaidInvoiceData.getPaidInvoiceData !== getPaidInvoiceData) {
            if (getPaidInvoiceData && _.has(getPaidInvoiceData, 'data') && getPaidInvoiceData.success === true) {
                setLoader(false)
                let allInvoice = {};
                _.map(getPaidInvoiceData.data, (val, ind) => {
                        allInvoice[moment(val.timeline.paid_at).format('MMMM YYYY')] = allInvoice[moment(val.timeline.paid_at).format('MMMM YYYY')] ? allInvoice[moment(val.timeline.paid_at).format('MMMM YYYY')] : [];
                        allInvoice[moment(val.timeline.paid_at).format('MMMM YYYY')].push(val)
                })
                setTotal((getPaidInvoiceData.data).length)
                setAllInvoiceData(allInvoice)
            }
            if (getPaidInvoiceData && _.has(getPaidInvoiceData, 'message') && getPaidInvoiceData.success === false) {
                setLoader(false)
                setServiceMessage(getPaidInvoiceData.message)
            }
        }
    }, [prevGetPaidInvoiceData, getPaidInvoiceData]);// eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div className="main-site fixed--header">
            <Header loader={loader} getMainRoute={'invoices'} />
            <main className="site-body">

                <section className="page-title contact--header">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-auto title--col">
                                <div>
                                    <ol className="breadcrumb d-none d-lg-flex">
                                        <li className="breadcrumb-item"><Link to={LIST_INVOICES} >Invoices</Link></li>
                                        <li className="breadcrumb-item active" aria-current="page">All Invoices </li>
                                    </ol>
                                    <h2 className="title">All Invoices ({total})</h2>
                                </div>
                            </div>
                            <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                <Link to={LIST_INVOICES} className="btn btn-primary">Back</Link>
                                <div className="dropdown d-lg-none custom-dropdown dropdown-toggle--mbl">
                                    <button className="btn dropdown-toggle " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <img src={setImagePath(MENU_DOTTED)} alt="" />
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                        <a className="dropdown-item" href="#lead" onClick={(e) => e.preventDefault()} >Create Contact</a>
                                        <a className="dropdown-item" href="#lead" onClick={(e) => e.preventDefault()} >Create Lead</a>
                                        <a className="dropdown-item" href="#lead" onClick={(e) => e.preventDefault()} >Create Quote</a>
                                        <a className="dropdown-item" href="#lead" onClick={(e) => e.preventDefault()} >Create Invoice</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="middle-section">
                    <div className="container">
                        {serviceMessage ? <div className="errorCls errCommonCls"><img src={setImagePath(ERROR_ICON)} alt="" />{serviceMessage}</div> : ''}
                        {_.map(allInvoiceData, (data, key) => {
                            return <div className="row no-gutters-mbl" key={key}>
                                <div className="col-12">
                                    <div className="closedleads-container">
                                        <div className="closed-container_header">{key}
                                        </div>
                                        <div className="closed-container_row">
                                            {_.map(data, (invoice, lkey) => {
                                                return <div className="dragable--card completed" key={lkey}>
                                                    <div className="title"><Link to={VIEW_INVOICE_DETAIL_BASE + invoice.id}>{invoice.name}</Link></div>
                                                    <div className="info">
                                                        <p className="mb-0"><strong>${invoice.amount_paid}</strong></p>
                                                        <p className="mb-0"> Paid on: {moment(invoice.timeline.paid_at).format('ll')}</p> 
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
                                    </div>
                                </div>
                            </div>
                        })}


                    </div>
                </section>

            </main>
            <Footer />
        </div >
    );
}

export const ListPaidInvoice = withRouter(NewListPaidInvoice)