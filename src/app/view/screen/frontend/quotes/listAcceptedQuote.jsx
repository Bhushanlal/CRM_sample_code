import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import MENU_DOTTED from '../../../../assets/images/menu-dotted.svg'
import { setImagePath, usePrevious } from '../../../../common/custom'
import { Link, withRouter } from "react-router-dom";
import { LIST_QUOTES, VIEW_QUOTE_DETAIL_BASE } from "../../../../routing/routeContants";
import { getAcceptedQuote } from '../../../../duck/quote/quote.action';
import _ from 'lodash';
import moment from 'moment';
import ERROR_ICON from '../../../../assets/images/error-icn.svg'

export const ListAcceptedQuotePage = props => {

    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [total, setTotal] = useState(0);
    const [serviceMessage, setServiceMessage] = useState('');
    const [allQuoteData, setAllQuoteData] = useState([]);
    const getAcceptedQuoteData = useSelector(state => state.quote.getAcceptedQuoteData);
    const prevGetAcceptedQuoteData = usePrevious({ getAcceptedQuoteData });

    // On Load Get Data
    useEffect(() => {
        setLoader(true)
        dispatch(getAcceptedQuote())
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // List Lead Status Data And Get Lead Data
    useEffect(() => {
        if (prevGetAcceptedQuoteData && prevGetAcceptedQuoteData.getAcceptedQuoteData !== getAcceptedQuoteData) {
            if (getAcceptedQuoteData && _.has(getAcceptedQuoteData, 'data') && getAcceptedQuoteData.success === true) {
                setLoader(false)
                let allLead = {};
                _.map(getAcceptedQuoteData.data, (val, ind) => {
                    if (val.is_expired === 1) {
                        allLead[moment(val.timeline.expired_on).format('MMMM YYYY')] = allLead[moment(val.timeline.expired_on).format('MMMM YYYY')] ? allLead[moment(val.timeline.expired_on).format('MMMM YYYY')] : [];
                        allLead[moment(val.timeline.expired_on).format('MMMM YYYY')].push(val)
                    } else if (val.reject_reason === null) {
                        allLead[moment(val.timeline.signed_at).format('MMMM YYYY')] = allLead[moment(val.timeline.signed_at).format('MMMM YYYY')] ? allLead[moment(val.timeline.signed_at).format('MMMM YYYY')] : [];
                        allLead[moment(val.timeline.signed_at).format('MMMM YYYY')].push(val)
                    } else {
                        allLead[moment(val.timeline.reject_at).format('MMMM YYYY')] = allLead[moment(val.timeline.reject_at).format('MMMM YYYY')] ? allLead[moment(val.timeline.reject_at).format('MMMM YYYY')] : [];
                        allLead[moment(val.timeline.reject_at).format('MMMM YYYY')].push(val)
                    }
                })
                setTotal((getAcceptedQuoteData.data).length)
                setAllQuoteData(allLead)
            }
            if (getAcceptedQuoteData && _.has(getAcceptedQuoteData, 'message') && getAcceptedQuoteData.success === false) {
                setLoader(false)
                setServiceMessage(getAcceptedQuoteData.message)
            }
        }
    }, [prevGetAcceptedQuoteData, getAcceptedQuoteData]);// eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div className="main-site fixed--header">
            <Header loader={loader} getMainRoute={'quotes'} />
            <main className="site-body">

                <section className="page-title contact--header">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-auto title--col">
                                <div>
                                    <ol className="breadcrumb d-none d-lg-flex">
                                        <li className="breadcrumb-item"><Link to={LIST_QUOTES} >Quotes</Link></li>
                                        <li className="breadcrumb-item active" aria-current="page">All Quotes </li>
                                    </ol>
                                    <h2 className="title">All Quotes ({total})</h2>
                                </div>
                            </div>
                            <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                <Link to={LIST_QUOTES} className="btn btn-primary">Back</Link>
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
                        {_.map(allQuoteData, (data, key) => {
                            return <div className="row no-gutters-mbl" key={key}>
                                <div className="col-12">
                                    <div className="closedleads-container">
                                        <div className="closed-container_header">{key}
                                        </div>
                                        <div className="closed-container_row">
                                            {_.map(data, (quote, lkey) => {
                                                return <div className={"dragable--card " + (quote.is_expired === 1 ? 'expired' : quote.reject_reason === null || quote.reject_reason === '' ? 'completed' : 'lost')} key={lkey}>
                                                    <div className="title"><Link to={VIEW_QUOTE_DETAIL_BASE + quote.id}>{quote.name}</Link></div>
                                                    <div className="info">
                                                        <p className="mb-0"><strong>${quote.amount_total}</strong> {quote.amount_deposit > 0 ? '($' + quote.amount_deposit + ' Deposit)' : ''}</p>
                                                        {quote.is_expired === 1 ?
                                                            <p className="mb-0"> Expired On: {moment(quote.timeline.expired_on).format('ll')}</p>
                                                            :
                                                            quote.reject_reason === null || quote.reject_reason === '' ?
                                                                <p className="mb-0"> Accepted On: {moment(quote.timeline.signed_at).format('ll')}</p>
                                                                :
                                                                <p className="mb-0"> Rejected On: {moment(quote.timeline.reject_at).format('ll')}</p>
                                                        }
                                                    </div>
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

export const ListAcceptedQuote = withRouter(ListAcceptedQuotePage)