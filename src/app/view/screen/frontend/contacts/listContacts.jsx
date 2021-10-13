import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious, capFirst} from '../../../../common/custom';
import { PaginationFooter } from '../../../../common/paginationFooter'
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import { ADD_CONTACT, VIEW_CONTACT_BASE, VIEW_LEAD_BASE, VIEW_BOOKING_BASE, VIEW_INVOICE_BASE, VIEW_INVOICE_DETAIL_BASE } from "../../../../routing/routeContants";
import { listContact, deleteContact, contactImport } from '../../../../duck/contact/contact.action';
import { Link, withRouter } from "react-router-dom";
import _ from 'lodash';
import { constants } from "../../../../common/constants";
import Swal from 'sweetalert2'
import PLUS_ICON from '../../../../assets/images/ic_plus-circle.svg'
import SEARCH_ICON from '../../../../assets/images/search-icn.svg'
import CALL_ICON from '../../../../assets/images/ic_call.svg'
import Modal from "react-bootstrap/Modal";
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import { setImagePath } from '../../../../common/custom'
import SAMPLE_IMPORT_FILE from '../../../../assets/document/sample_import_file.xlsx'
import { Loader } from '../../../component/frontend/loader/loader'
import { errorPopUp, errorContactDeletePopUp } from '../../../../common/notification-alert';
import { getUserDetails } from '../../../../storage/user';
import { SubscriptionPlan } from "../profile/subscriptionPlans"

export const ListContactsPage = props => {
    const focusOutSearch = useRef();
    const dispatch = useDispatch();
    const userData = getUserDetails();
    const currentPlan = userData && userData.planData
    const [subscriptionModalShow, setSubscriptionModalShow] = useState(false);
    const listContactData = useSelector(state => state.contact.listContactData);
    const deleteContactData = useSelector(state => state.contact.deleteContactData);
    const prevListContactData = usePrevious({ listContactData });
    const prevDeleteContactData = usePrevious({ deleteContactData });

    // Set initial State Value  
    const [page, setPage] = useState(1);
    const [serviceMessage, setServiceMessage] = useState('');
    const [fetchList, setfetchList] = useState(true);
    const [limit] = useState(constants.PAGE_LIMIT);
    const [typingTimeout, setTypingTimeout] = useState(0);
    const [search, setSearch] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const [loader, setLoader] = useState(false);
    const [sortingOrder, setSortingOrder] = useState('ASC');
    const [sortingField, setSortingField] = useState('first_name');
    const [allCheckedValue, setAllCheckedValue] = useState([]);
    const [contactList, setContactList] = useState([]);
    const [checkedAll, setCheckedAll] = useState(false);

    // Set The State Value For Import Contact 
    const [importContactShow, setImportContactShow] = useState(false);
    const [contactImportFile, setContactImportFile] = useState([]);
    const [contactImportFileError, setContactImportFileError] = useState('');
    const fileInput = useRef(null);
    const contactImportData = useSelector(state => state.contact.contactImportData);
    const prevContactImportData = usePrevious({ contactImportData });

    // On Load Get Contact
    useEffect(() => {
        setLoader(true)
        dispatch(listContact({ page, limit, sortingField, sortingOrder }))
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // List Contact Data
    useEffect(() => {
        if (prevListContactData && prevListContactData.listContactData !== listContactData) {
            if (listContactData && _.has(listContactData, 'data') && listContactData.success === true) {
                setContactList(listContactData.data)
                setTotalRecords(listContactData.total)
                setLoader(false)
                setfetchList(false);
            }
            if (listContactData && _.has(listContactData, 'message') && listContactData.success === false) {
                setLoader(false)
                setfetchList(false);
                errorPopUp(listContactData.message)
            }
        }
    }, [listContactData, prevListContactData]);

    // Data Get By Pagination
    const getPageData = (page) => {
        setPage(page);
        setLoader(true)
        setAllCheckedValue([]);
        setCheckedAll(false);
        setServiceMessage('');
        dispatch(listContact({ page, limit, filter: search, sortingOrder, sortingField, searchField: "first_name,last_name,email,organization" }))
    }

    //Data Get By Search
    const onSearchResult = (search) => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        setPage(1);
        setSearch(search);
        setAllCheckedValue([]);
        setCheckedAll(false);
        setfetchList(true);
        setServiceMessage('');
        setTypingTimeout(setTimeout(function () {
            dispatch(listContact({ page, limit, filter: search, sortingField, sortingOrder, searchField: "first_name,last_name,email,organization" }))
        }, 300))
    }

    const keyPressDownEvent = (e) => {
        if (e.key === "Enter") {
            focusOutSearch.current.blur();
        }
    }

    // On change select checkbox value
    const onCheckedValue = (id) => {
        let newArr;
        setServiceMessage('');
        if (_.includes(allCheckedValue, id)) {
            newArr = _.filter(allCheckedValue, (data) => data !== id)
        } else {
            newArr = [...allCheckedValue, id]
        }
        if (newArr.length === contactList.length) {
            setCheckedAll(true)
            setAllCheckedValue(newArr)
        } else {
            setCheckedAll(false)
            setAllCheckedValue(newArr)
        }
    }

    // Delete Contact Data
    const deleteContactFunction = (e) => {
        e.preventDefault();
        setServiceMessage('');
        if(allCheckedValue.length===0){
            Swal.fire({
                text: "Please select atleast one contact to delete.",
                showConfirmButton: false,
                showCancelButton: true,
                reverseButtons: true,
                showCloseButton: true,
                customClass:"mycustom-alert",
                cancelButtonClass: 'cancel-alert-note',
                cancelButtonText: 'Ok',
            }).then((result) => {
               
            })
        }else{
            let msg = 'If you delete the contact, all associated Notes, Tasks and references will be lost. Are you sure you want to delete the contact?';
            if (allCheckedValue.length > 1) {
                msg = 'If you delete the contact, all associated Notes, Tasks and references will be lost. Are you sure you want to delete all the selected contacts?';
            }
            Swal.fire({
                title: 'Are you sure?',
                text: msg,
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it',
                cancelButtonText: 'No, keep it',
                reverseButtons: true,
                showCloseButton: true,
                customClass:"mycustom-alert",
                cancelButtonClass: 'cancel-alert-note',
            }).then((result) => {
                if (result.value) {
                    setLoader(true)
                    dispatch(deleteContact({ contact_id: allCheckedValue.join(',') }))
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // console.log('cancel')
                }
            })
        }
    }

    // Get Delete Contact Data Props
    useEffect(() => {
        if (prevDeleteContactData && prevDeleteContactData.deleteContactData !== deleteContactData) {
            if (deleteContactData && _.has(deleteContactData, 'data') && deleteContactData.success === true) {
                setAllCheckedValue([]);
                if (checkedAll === true) {
                    setCheckedAll(false);
                    setPage(1)
                    dispatch(listContact({ page: 1, limit, filter: search, sortingOrder, sortingField, searchField: "first_name,last_name,email,organization" }))
                } else {
                    setCheckedAll(false);
                    dispatch(listContact({ page, limit, filter: search, sortingOrder, sortingField, searchField: "first_name,last_name,email,organization" }))
                }
            }
            if (deleteContactData && _.has(deleteContactData, 'message') && deleteContactData.success === false) {
                setLoader(false)
                errorContactDeletePopUp(deleteContactData.message)
            }
        }
    }, [deleteContactData, prevDeleteContactData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Sort The Contact List 
    const sortTheData = (e, field, orderValue) => {
        let order = orderValue === 'DESC' ? 'ASC' : (orderValue === 'ASC' ? "DESC" : 'DESC');
        e.preventDefault();
        setPage(1);
        setSortingField(field);
        setSortingOrder(order);
        setLoader(true)
        setAllCheckedValue([])
        setCheckedAll(false)
        setServiceMessage('');
        dispatch(listContact({ page: 1, limit, filter: search, sortingField: field, sortingOrder: order, searchField: "first_name,last_name,email,organization" }))
    }

    const checkedAllCheckbox = (data) => {
        setServiceMessage('');
        if (data) {
            let allCheck = _.map(contactList, 'id');
            setAllCheckedValue(allCheck)
        } else {
            setAllCheckedValue([])
        }
        setCheckedAll(data)
    }

    const importContactModal = () => {
        setContactImportFileError('')
        setContactImportFile([])
        setServiceMessage('');
        setImportContactShow(true)
    }

    const triggerInputFile = () => {
        fileInput.current.click();
    }

    const handleRequestDocuments = (e) => {
        setServiceMessage('');
        if (e && e.target.value.length !== 0) {
            setContactImportFile(e.target.files)
            setContactImportFileError('')
        }
    }

    const removeSelectedFile = (e) => {
        e.preventDefault();
        setContactImportFile([])
    }

    const importContactData = () => {
        setServiceMessage('');
        if(contactImportFile.length>0){
            const setFilesdata = new FormData()
            setFilesdata.append("import_file", contactImportFile[0]);
            setLoader(true)
            dispatch(contactImport(setFilesdata))
        }else{
            setContactImportFileError("Please select file.")
        }
    }

    // Add Import Contact Data
    useEffect(() => {
        if (prevContactImportData && prevContactImportData.contactImportData !== contactImportData) {
            if (contactImportData && _.has(contactImportData, 'data') && contactImportData.success === true) {
                setImportContactShow(false)
                dispatch(listContact({ page, limit, sortingOrder, sortingField, }))
            }
            if (contactImportData && _.has(contactImportData, 'message') && contactImportData.success === false) {
                setLoader(false)
                setContactImportFileError(contactImportData.message)
            }
        }
    }, [contactImportData, prevContactImportData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Create Contact 
    const createContact = (e) => {
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
        }else{
            props.history.push(ADD_CONTACT)
        }
    }

    return (
        <>
        <Loader loader={loader} />
        <div className="main-site fixed--header">
            <Header getMainRoute={'contacts'} />
            <main className="site-body">
                <section className="page-title contact--header">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-auto title--col">
                                <div>
                                    <h2 className="title">Contacts ({totalRecords})</h2>
                                </div>
                                <div className="dropdown--search d-lg-none">
                                    <a className="btn dropdown--search_btn" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                                        <img src={setImagePath(SEARCH_ICON)} alt="" />
                                    </a>
                                </div>
                            </div>
                            <div className="collapse d-lg-none col-12 dropdown--search_wrapper" id="collapseExample">
                                <input type="text" name="search" ref={focusOutSearch} onKeyDown={(e) => keyPressDownEvent(e)} value={search}  onChange={(e) => onSearchResult(e.target.value)} placeholder="Search Contact" className="form-control mr-15" />
                            </div>
                            <div className="col-xl-8 col-lg-9 ml-auto d-flex justify-content-center align-items-center title-elems">
                                <input type="text" name="search" value={search} onChange={(e) => onSearchResult(e.target.value)} placeholder="Search Contact" className="form-control d-none d-lg-block" />
                                <button type="button" onClick={(e) => importContactModal()} className="btn text-link d-none d-lg-block"><img src={setImagePath(PLUS_ICON)} alt="" /> Import Contacts</button>                               
                                <button type="button" disabled={currentPlan==='' || (currentPlan && currentPlan.plan_is_active===0) ? true : false} onClick={(e) => deleteContactFunction(e)} className="btn btn-dark mr-15">Delete</button>
                                <button onClick={(e) => createContact(e)} className="btn btn-primary">Create Contact</button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="middle-section">
                    <div className="container">
                        {serviceMessage ? <div className="errorCls errCommonCls mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{serviceMessage}</div> : ''}
                        <div className="row no-gutters-mbl">
                            <div className="col-12">
                                <div className="main-card">
                                    <div className="card">
                                        <div className="card-body pt-0">
                                            <div className="table-responsive">
                                                <table className="table table-lg table-striped contacts--table smart-table">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">
                                                                {contactList.length > 0 ?
                                                                    <div className="custom-control custom-checkbox">
                                                                        <input type="checkbox" name="check_all" onChange={(e) => checkedAllCheckbox(e.target.checked)} checked={checkedAll} className="custom-control-input" id={'checkAll'} />
                                                                        <label className="custom-control-label" htmlFor={'checkAll'}></label>
                                                                    </div>
                                                                    : ''
                                                                }
                                                            </th>
                                                            <th >
                                                                <div className="table--sorting">
                                                                    Name
                                                            <div className="sorting-icn">
                                                                        <a href="#desc" className={sortingField === 'first_name' ? (sortingOrder === 'DESC' ? "active up" : (sortingOrder === 'ASC' ? "active" : "")) : ''} onClick={(e) => sortTheData(e, 'first_name', sortingOrder)}>
                                                                            <svg width="14" height="8" viewBox="0 0 10 6"  xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M9.90008 0.618506L9.39911 0.103126C9.33236 0.0343033 9.25546 0 9.16853 0C9.08181 0 9.00494 0.0343033 8.93819 0.103126L5.00005 4.15463L1.06209 0.103235C0.995301 0.0344116 0.918439 0.000108326 0.831611 0.000108326C0.744747 0.000108326 0.667886 0.0344116 0.601132 0.103235L0.100235 0.61865C0.0333416 0.687329 0 0.766407 0 0.855776C0 0.945073 0.0334469 1.02415 0.100235 1.09283L4.76957 5.89695C4.83633 5.96566 4.91322 6 5.00005 6C5.08688 6 5.16364 5.96566 5.23036 5.89695L9.90008 1.09283C9.96683 1.02411 10 0.945037 10 0.855776C10 0.766407 9.96683 0.687329 9.90008 0.618506Z" />
                                                                            </svg>
                                                                        </a>
                                                                    </div>
                                                                </div></th>
                                                            <th >
                                                                <div className="table--sorting">
                                                                    Email
                                                                    <div className="sorting-icn">
                                                                        <a href="#desc" className={sortingField === 'email' ? (sortingOrder === 'DESC' ? "active up" : (sortingOrder === 'ASC' ? "active" : "")) : ''} onClick={(e) => sortTheData(e, 'email', sortingOrder)}>
                                                                            <svg width="14" height="8" viewBox="0 0 10 6"  xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M9.90008 0.618506L9.39911 0.103126C9.33236 0.0343033 9.25546 0 9.16853 0C9.08181 0 9.00494 0.0343033 8.93819 0.103126L5.00005 4.15463L1.06209 0.103235C0.995301 0.0344116 0.918439 0.000108326 0.831611 0.000108326C0.744747 0.000108326 0.667886 0.0344116 0.601132 0.103235L0.100235 0.61865C0.0333416 0.687329 0 0.766407 0 0.855776C0 0.945073 0.0334469 1.02415 0.100235 1.09283L4.76957 5.89695C4.83633 5.96566 4.91322 6 5.00005 6C5.08688 6 5.16364 5.96566 5.23036 5.89695L9.90008 1.09283C9.96683 1.02411 10 0.945037 10 0.855776C10 0.766407 9.96683 0.687329 9.90008 0.618506Z" />
                                                                            </svg>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </th>
                                                            <th >
                                                                <div className="table--sorting">
                                                                    Phone Number
                                                                    <div className="sorting-icn">
                                                                        <a href="#desc" className={sortingField === 'phone' ? (sortingOrder === 'DESC' ? "active up" : (sortingOrder === 'ASC' ? "active" : "")) : ''} onClick={(e) => sortTheData(e, 'phone', sortingOrder)}>
                                                                            <svg width="14" height="8" viewBox="0 0 10 6"  xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M9.90008 0.618506L9.39911 0.103126C9.33236 0.0343033 9.25546 0 9.16853 0C9.08181 0 9.00494 0.0343033 8.93819 0.103126L5.00005 4.15463L1.06209 0.103235C0.995301 0.0344116 0.918439 0.000108326 0.831611 0.000108326C0.744747 0.000108326 0.667886 0.0344116 0.601132 0.103235L0.100235 0.61865C0.0333416 0.687329 0 0.766407 0 0.855776C0 0.945073 0.0334469 1.02415 0.100235 1.09283L4.76957 5.89695C4.83633 5.96566 4.91322 6 5.00005 6C5.08688 6 5.16364 5.96566 5.23036 5.89695L9.90008 1.09283C9.96683 1.02411 10 0.945037 10 0.855776C10 0.766407 9.96683 0.687329 9.90008 0.618506Z" />
                                                                            </svg>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </th>
                                                            <th >
                                                                <div className="table--sorting">
                                                                    Organization
                                                                    <div className="sorting-icn">
                                                                        <a href="#desc" className={sortingField === 'organization' ? (sortingOrder === 'DESC' ? "active up" : (sortingOrder === 'ASC' ? "active" : "")) : ''} onClick={(e) => sortTheData(e, 'organization', sortingOrder)}>
                                                                            <svg width="14" height="8" viewBox="0 0 10 6"  xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M9.90008 0.618506L9.39911 0.103126C9.33236 0.0343033 9.25546 0 9.16853 0C9.08181 0 9.00494 0.0343033 8.93819 0.103126L5.00005 4.15463L1.06209 0.103235C0.995301 0.0344116 0.918439 0.000108326 0.831611 0.000108326C0.744747 0.000108326 0.667886 0.0344116 0.601132 0.103235L0.100235 0.61865C0.0333416 0.687329 0 0.766407 0 0.855776C0 0.945073 0.0334469 1.02415 0.100235 1.09283L4.76957 5.89695C4.83633 5.96566 4.91322 6 5.00005 6C5.08688 6 5.16364 5.96566 5.23036 5.89695L9.90008 1.09283C9.96683 1.02411 10 0.945037 10 0.855776C10 0.766407 9.96683 0.687329 9.90008 0.618506Z" />
                                                                            </svg>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </th>
                                                            <th scope="col">Related to</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(contactList && contactList.length > 0) ?
                                                            _.map(contactList, (data) => {
                                                                return <tr key={data.id}>
                                                                    <td>
                                                                        <div className="custom-control custom-checkbox">
                                                                            <input type="checkbox" name={data.id} onChange={(e) => onCheckedValue(data.id, e.target.checked)} checked={_.includes(allCheckedValue, data.id)} className="custom-control-input" id={'check' + data.id} />
                                                                            <label className="custom-control-label" htmlFor={'check' + data.id}></label>
                                                                        </div>
                                                                    </td>
                                                                    <td className="contact--name"><Link to={VIEW_CONTACT_BASE + data.id} className="text-link">{capFirst(data.first_name) + ' ' + (data.last_name ? capFirst(data.last_name) : '')}</Link> <div className="contact--id_mbl">{data.email} </div></td>
                                                                    <td className="contact--id">{data.email || '-'} </td>
                                                                    <td className="contact--no"><span>{data.phone || '-'}</span><a href={"Tel:" + (data.phone || '-')}><img src={setImagePath(CALL_ICON)} alt="" /></a></td>
                                                                    <td className="biz--name">{data.organization || '-'}</td>
                                                                    {/* <td className="lead--name"><a className="text-link" href="#google" onClick={(e) => e.preventDefault()}>Lead Name</a></td> */}
                                                                    <td className="lead--name">
                                                                        {(data.leads).length>0 ?
                                                                            _.map(data.leads, (lead,k) =>{
                                                                                return <React.Fragment key={k}><Link to={VIEW_LEAD_BASE+lead.id} className="text-link" >{lead.name}</Link>{(data.leads).length===k+1 ? ''  : ', '}</React.Fragment>
                                                                            })
                                                                        : ''}
                                                                        {(data.bookings).length>0 ?
                                                                            _.map(data.bookings, (book,k) =>{
                                                                                return <React.Fragment key={k}>{(data.leads).length===1 ? ', ' : ''}<Link to={VIEW_BOOKING_BASE+book.id} className="text-link" >{book.name}</Link>{(data.bookings).length===k+1 ? ''  : ', '}</React.Fragment>
                                                                            })
                                                                        :''}
                                                                        {(data.invoices).length>0 ?
                                                                            _.map(data.invoices, (invoice,k) =>{
                                                                                return <React.Fragment key={k}>{(data.bookings).length===1 ? ', ' : ''}<Link to={(invoice.invoice_status_type_id!==1 ? VIEW_INVOICE_DETAIL_BASE : VIEW_INVOICE_BASE)+invoice.id} className="text-link" >{invoice.name}</Link>{(data.invoices).length===k+1 ? ''  : ', '}</React.Fragment>
                                                                            })
                                                                        :''}
                                                                        {(data.bookings).length===0 && (data.leads).length===0 && (data.invoices).length===0 ? '-' : ''}
                                                                    </td>
                                                                </tr>
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="6" className="bg-white">
                                                                    {fetchList ?
                                                                        ''
                                                                    :
                                                                    <div className="no--contacts">
                                                                            {search && search!=='' 
                                                                            ?
                                                                            <h5>No matching records were found. Please check your keyword and try again.</h5>
                                                                        : 
                                                                        <>
                                                                            <h5>You don’t have any contacts yet! </h5>
                                                                            <h5>Create new contact or Import contacts from email and manage them in all in one place. </h5>
                                                                            <p>Learn how to export contacts from, <a href="https://knowledgebase.constantcontact.com/articles/KnowledgeBase/5702-export-contacts-from-microsoft-outlook?lang=en_US" rel="noopener noreferrer" target="_blank" ><strong>Outlook to Excel</strong></a> or <a href="https://www.clientlook.com/export-your-google-contacts" rel="noopener noreferrer" target="_blank"><strong>Gmail to Excel</strong></a></p>
                                                                            <Link to={ADD_CONTACT} className="btn btn-primary mt-5">Create Contact</Link>
                                                                        </>
                                                                        }
                                                                    </div>}
                                                                </td>
                                                            </tr>
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                            {totalRecords ? <PaginationFooter getPageData={(data) => getPageData(data)} pageNo={page} totalRecords={totalRecords} limit={limit} /> : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            {/* IMPORT CONTACTS POP-UP */}
            <Modal show={importContactShow} onHide={() => setImportContactShow(false)} size="lg" className="" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Import Contacts
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {contactImportFileError ? 
                     (contactImportData.message==='unableToImport') ?
                     <div className="errorCls errCommonCls mb-3 error-unable-to-import"><img src={setImagePath(ERROR_ICON)} alt="" />Sorry, we could not import your contacts. Please make sure your file<br/> - format is supported and, <br/>- has column ‘names’ exactly matching with the labels listed below</div> 
                     :
                    <div className="errorCls errCommonCls mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{contactImportFileError}</div> 
                    : ''}
                    <p><strong>Upload a spreadsheet and import contacts.</strong></p>
                    <div className="d-flex justify-content-start">
                        <strong className="mr-2">Note:</strong>
                        <p>
                            We will import ‘<b>First Name</b>’, ‘<b>Last Name</b>’, ‘<b>E-mail Address</b>’, ‘<b>Phone Number</b>’ and remaining information <br /> will be added under ‘<b>More Information</b>’ field.
                        </p>
                    </div>
                    <div className="browe--file">
                        {contactImportFile.length > 0 ?
                        _.map(contactImportFile, (docV, docK) => {
                         return <div className="file-added" key={docK}>
                            {docV.name}             
                            <a href="#removeSelectedFile" onClick={(e) => removeSelectedFile(e)} className="edit-icn ml-3">
                            <svg width="20px" height="20px" fill="var(--danger)" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                viewBox="0 0 174.239 174.239" style={{"enableBackground":"new 0 0 174.239 174.239"}} xmlSpace="preserve">
                                <g>
                                    <path d="M87.12,0C39.082,0,0,39.082,0,87.12s39.082,87.12,87.12,87.12s87.12-39.082,87.12-87.12S135.157,0,87.12,0z M87.12,159.305
                                        c-39.802,0-72.185-32.383-72.185-72.185S47.318,14.935,87.12,14.935s72.185,32.383,72.185,72.185S126.921,159.305,87.12,159.305z"
                                        />
                                    <path d="M120.83,53.414c-2.917-2.917-7.647-2.917-10.559,0L87.12,76.568L63.969,53.414c-2.917-2.917-7.642-2.917-10.559,0
                                        s-2.917,7.642,0,10.559l23.151,23.153L53.409,110.28c-2.917,2.917-2.917,7.642,0,10.559c1.458,1.458,3.369,2.188,5.28,2.188
                                        c1.911,0,3.824-0.729,5.28-2.188L87.12,97.686l23.151,23.153c1.458,1.458,3.369,2.188,5.28,2.188c1.911,0,3.821-0.729,5.28-2.188
                                        c2.917-2.917,2.917-7.642,0-10.559L97.679,87.127l23.151-23.153C123.747,61.057,123.747,56.331,120.83,53.414z"/>
                                </g>
                            </svg>
                            </a>
                        </div>
                        })
                            :
                            <>
                                <input
                                    ref={fileInput}
                                    type="file"
                                    className="hiddenInputTypeFile"
                                    onChange={(e) => handleRequestDocuments(e)}
                                    accept='.xlsx, .xls, .csv'
                                    style={{ "display": "none" }}
                                />
                                <button type="button" className="btn btn-secondary bg-white mb-2" onClick={() => triggerInputFile()}>Browse File</button>
                            </>
                        }
                        <p className="mb-3 mt-2">Accepted formats: <strong>.CSV, .XLS, .XLSX</strong></p>
                        <p className="mb-0">Download a <strong><a href={SAMPLE_IMPORT_FILE} download="sample_import_file.xlsx">Sample File</a></strong></p>
                    </div>
                    <p className="mb-4">Learn how to export contacts from, <a href="https://knowledgebase.constantcontact.com/articles/KnowledgeBase/5702-export-contacts-from-microsoft-outlook?lang=en_US" rel="noopener noreferrer" target="_blank" ><strong>Outlook to Excel</strong></a> or <a href="https://www.clientlook.com/export-your-google-contacts" rel="noopener noreferrer" target="_blank"><strong>Gmail to Excel</strong></a></p>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-dark" onClick={() => setImportContactShow(false)}>Cancel</button>
                    <button type="button" onClick={() => importContactData()} className="btn btn-primary">Import</button>
                </Modal.Footer>
            </Modal>
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

export const ListContacts = withRouter(ListContactsPage)