import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import MENU_DOTTED from '../../../../assets/images/menu-dotted.svg'
import { setImagePath, usePrevious } from '../../../../common/custom'
import { Link, withRouter } from "react-router-dom";
import { LIST_LEADS } from "../../../../routing/routeContants";
import { getAllCompletedLeads } from '../../../../duck/lead/lead.action';
import _ from 'lodash';
import moment from 'moment';
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import STAR_ICON from '../../../../assets/images/star.svg'
import { VIEW_LEAD_BASE } from "../../../../routing/routeContants";

export const ListCloseLeadPage = props => {

    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [total, setTotal] = useState(0);
    const [serviceMessage, setServiceMessage] = useState('');
    const [allLeadData, setAllLeadData] = useState([]);
    const getAllCompletedLeadData = useSelector(state => state.lead.getAllCompletedLeadData);
    const prevGetAllCompletedLeadData = usePrevious({ getAllCompletedLeadData });

    // On Load Get Data
    useEffect(() => {
        setLoader(true)
        dispatch(getAllCompletedLeads())
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // List Lead Status Data And Get Lead Data
    useEffect(() => {
        if (prevGetAllCompletedLeadData && prevGetAllCompletedLeadData.getAllCompletedLeadData !== getAllCompletedLeadData) {
            if (getAllCompletedLeadData && _.has(getAllCompletedLeadData, 'data') && getAllCompletedLeadData.success === true) {
                setLoader(false)
                let allLead = {};
                _.map(getAllCompletedLeadData.data, (val, ind) => {
                    allLead[moment(val.updated_at).format('MMMM YYYY')] = allLead[moment(val.updated_at).format('MMMM YYYY')] ? allLead[moment(val.updated_at).format('MMMM YYYY')] : [];
                    allLead[moment(val.updated_at).format('MMMM YYYY')].push(val)
                })
                setTotal((getAllCompletedLeadData.data).length)
                setAllLeadData(allLead)
            }
            if (getAllCompletedLeadData && _.has(getAllCompletedLeadData, 'message') && getAllCompletedLeadData.success === false) {
                setLoader(false)
                setServiceMessage(getAllCompletedLeadData.message)
            }
        }
    }, [prevGetAllCompletedLeadData, getAllCompletedLeadData]);// eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div className="main-site fixed--header">
            <Header loader={loader} getMainRoute={'leads'} />
            <main className="site-body">

                <section className="page-title contact--header">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-auto title--col">
                                <div>
                                    <ol className="breadcrumb d-none d-lg-flex">
                                        <li className="breadcrumb-item"><Link to={LIST_LEADS} >Leads</Link></li>
                                        <li className="breadcrumb-item active" aria-current="page">All closed leads </li>
                                    </ol>
                                    <h2 className="title">All Closed Leads ({total})</h2>
                                </div>
                            </div>
                            <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                <Link to={LIST_LEADS} className="btn btn-primary">Back</Link>
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
                        {_.map(allLeadData, (data, key) => {
                            return <div className="row no-gutters-mbl" key={key}>
                                <div className="col-12">
                                    <div className="closedleads-container">
                                        <div className="closed-container_header">{key}
                                        </div>
                                        <div className="closed-container_row">
                                            {_.map(data, (lead, lkey) => {
                                                return <div className={lead.lead_lost_reason_id === null ? "dragable--card completed" : "dragable--card lost"} key={lkey}>
                                                    <div className="title"><Link to={VIEW_LEAD_BASE + lead.id}>{lead.name}</Link></div>
                                                    <div className="info"><span>{lead.amount && lead.amount !== null ? '$' + lead.amount : (lead.potential_revenue && lead.potential_revenue !== null ? '$' + lead.potential_revenue : '-')}</span>Updated on: {moment(lead.updated_at).format("ddd, MMM DD YYYY")}
                                                    </div>
                                                    <div className="total-tasksnotes">
                                                        {lead.interest_level === 'Confirmed' ?
                                                            <div className="star-confirmed">
                                                                <img src={setImagePath(STAR_ICON)} alt="" />
                                                            </div>
                                                            : ''}
                                                        {lead.lead_note_count > 0 ? <div className="totalnotes">{lead.lead_note_count}N</div> : ''}
                                                        {lead.open_lead_task_count > 0 ? <div className={lead.open_due_task_count > 0 ? "totaltasks" : "totalnotes"}>{lead.open_lead_task_count}T</div> : ''}
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

export const ListCloseLead = withRouter(ListCloseLeadPage)