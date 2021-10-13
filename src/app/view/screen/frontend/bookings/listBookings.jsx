import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from '../../../../common/custom';
import { PaginationFooter } from '../../../../common/paginationFooter'
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import { ADD_BOOKING, VIEW_BOOKING_BASE, VIEW_QUOTE_BASE, VIEW_QUOTE_DETAIL_BASE, VIEW_INVOICE_DETAIL_BASE, VIEW_INVOICE_BASE } from "../../../../routing/routeContants";
import { listBookings, deleteBooking } from '../../../../duck/booking/booking.action';
import { Link } from "react-router-dom";
import _ from 'lodash';
import { constants, selectStyle } from "../../../../common/constants";
import Swal from 'sweetalert2'
import { Loader } from '../../../component/frontend/loader/loader'
import Select from "react-select";
import makeAnimated from "react-select/animated";
import moment from 'moment-timezone/moment-timezone';
import { errorPopUp } from '../../../../common/notification-alert';

export function ListBookings() {
    const dispatch = useDispatch();
    const [fetchList, setfetchList] = useState(true);
    const listBookingsData = useSelector(state => state.booking.listBookingData);
    const deleteBookingData = useSelector(state => state.booking.deleteBookingData);
    const prevListBookingData = usePrevious({ listBookingsData });
    const prevDeleteBookingData = usePrevious({ deleteBookingData });

    // Set initial State Value  
    const [page, setPage] = useState(1);
    const [limit] = useState(constants.PAGE_LIMIT);
    const [search, setSearch] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const [loader, setLoader] = useState(false);
    const [sortingOrder, setSortingOrder] = useState('ASC');
    const [sortingField, setSortingField] = useState('start_date');
    const [allCheckedValue, setAllCheckedValue] = useState([]);
    const [bookingList, setBookingList] = useState([]);
    const [checkedAll, setCheckedAll] = useState(false);

    const searchTypeOptions = [{ value: "Upcoming", label: 'Upcoming' }, { value: "Completed", label: 'Completed' }, { value: "All", label: 'All' }];

    const [state, setState] = useState({
        searchOptions: { value: "Upcoming", label: "Upcoming" },

    });
    // On Load Get Booking
    useEffect(() => {
        setLoader(true)
        dispatch(listBookings({ page, limit, sortingField: "start_date", sortingOrder: "ASC", future_booking: 1 }))
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // List Booking Data
    useEffect(() => {
        if (prevListBookingData && prevListBookingData.listBookingsData !== listBookingsData) {

            if (listBookingsData && _.has(listBookingsData, 'data') && listBookingsData.success === true) {
                setLoader(false)
                setBookingList(listBookingsData.data)
                setTotalRecords(listBookingsData.total)
                setfetchList(false);
            }
            if (listBookingsData && _.has(listBookingsData, 'message') && listBookingsData.success === false) {
                setLoader(false)
                setfetchList(false);
                errorPopUp(listBookingsData.message)
            }
        }
    }, [listBookingsData, prevListBookingData]);

    // Data Get By Pagination
    const getPageData = (page) => {
        setPage(page);
        setLoader(true)
        setAllCheckedValue([]);
        setCheckedAll(false);
        if (state.searchOptions && state.searchOptions.value === 'Upcoming') {
            dispatch(listBookings({ page, future_booking: 1, limit, filter: search, sortingOrder, sortingField, searchField: "first_name,last_name,email,organization" }))
        } else if (state.searchOptions && state.searchOptions.value === 'Completed') {
            dispatch(listBookings({ page, future_booking: 0, limit, filter: search, sortingOrder, sortingField, searchField: "first_name,last_name,email,organization" }))
        } else {
            dispatch(listBookings({ page, limit, filter: search, sortingOrder, sortingField, searchField: "first_name,last_name,email,organization" }))
        }
    }

    //Data Get By Search
    const onSearchResult = (search) => {
        if (search.label === "Upcoming") {
            search.value = ""
        }
        /* if (typingTimeout) {
            clearTimeout(typingTimeout);
        } */
        setPage(1);
        setSearch(search);
        setAllCheckedValue([]);
        setCheckedAll(false);
        if (search.label === "Upcoming") {
            setState({ searchOptions: { value: 'Upcoming', label: 'Upcoming' } })
            setSortingField('start_date');
            setSortingOrder('ASC');

            dispatch(listBookings({ future_booking: 1, page, limit, sortingField: "start_date", sortingOrder: "ASC" }))
        } else if (search.label === "Completed") {
            setState({ searchOptions: { value: 'Completed', label: 'Completed' } })
            setSortingField('start_date');
            setSortingOrder('DESC');

            dispatch(listBookings({ page, limit, future_booking: 0, sortingField: "start_date", sortingOrder: "DESC" }))
        }
        else if (search.label === "All") {
            setState({ searchOptions: { value: 'All', label: 'All' } })
            setSortingField('start_date');
            setSortingOrder('ASC');
            /*  setTypingTimeout(setTimeout(function () {
                 dispatch(listBookings({ page, limit, sortingField: "start_date", sortingOrder: "ASC" }))
             }, 300)) */
            dispatch(listBookings({ page, limit, sortingField: "start_date", sortingOrder: "ASC" }))
        }
    }

    // On change select checkbox value
    const onCheckedValue = (id) => {
        let newArr;
        if (_.includes(allCheckedValue, id)) {
            newArr = _.filter(allCheckedValue, (data) => data !== id)
        } else {
            newArr = [...allCheckedValue, id]
        }
        if (newArr.length === bookingList.length) {
            setCheckedAll(true)
            setAllCheckedValue(newArr)
        } else {
            setCheckedAll(false)
            setAllCheckedValue(newArr)
        }
    }

    // Delete Booking Data
    const deleteContactFunction = (e) => {
        e.preventDefault();
        if (allCheckedValue.length === 0) {
            Swal.fire({
                text: "Please select atleast one booking to delete.",
                showConfirmButton: false,
                showCancelButton: true,
                reverseButtons: true,
                showCloseButton: true,
                customClass: "mycustom-alert",
                cancelButtonClass: 'cancel-alert-note',
                cancelButtonText: 'Ok',
            }).then((result) => {

            })
        } else {
            let msg = 'If you delete the booking, all associated Notes, Tasks and references will be lost. Are you sure you want to delete the booking?';
            if (allCheckedValue.length > 1) {
                msg = 'If you delete the booking, all associated Notes, Tasks and references will be lost. Are you sure you want to delete all the selected bookings?';
            }
            Swal.fire({
                title: 'Are you sure?',
                text: msg,
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it',
                cancelButtonText: 'No, keep it',
                reverseButtons: true,
                showCloseButton: true,
                customClass: "mycustom-alert",
                cancelButtonClass: 'cancel-alert-note',
            }).then((result) => {
                if (result.value) {
                    setLoader(true)
                    dispatch(deleteBooking({ booking_id: allCheckedValue.join(',') }))
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // console.log('cancel')
                }
            })
        }
    }

    // Get Delete Booking Data Props
    useEffect(() => {
        if (prevDeleteBookingData && prevDeleteBookingData.deleteBookingData !== deleteBookingData) {
            if (deleteBookingData && _.has(deleteBookingData, 'data') && deleteBookingData.success === true) {
                setAllCheckedValue([]);
                if (checkedAll === true) {
                    setCheckedAll(false);
                    setPage(1)
                    dispatch(listBookings({ page: 1, limit, }))
                } else {
                    setCheckedAll(false);
                    dispatch(listBookings({ page, limit }))
                }
            }
            if (deleteBookingData && _.has(deleteBookingData, 'message') && deleteBookingData.success === false) {
                setLoader(false)
                errorPopUp(deleteBookingData.message)
            }
        }
    }, [deleteBookingData, prevDeleteBookingData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Sort The Booking List 
    const sortTheData = (e, field, orderValue) => {
        let order = orderValue === 'DESC' ? 'ASC' : (orderValue === 'ASC' ? "DESC" : 'DESC');
        e.preventDefault();
        setPage(1);
        setSortingField(field);
        setSortingOrder(order);
        setLoader(true)
        setAllCheckedValue([])
        setCheckedAll(false)
        if ((state.searchOptions && state.searchOptions[0] && state.searchOptions[0].label) || (state.searchOptions.label) === "Upcoming") {
            dispatch(listBookings({ page: 1, limit, future_booking: 1, filter: search, sortingField: field, sortingOrder: order, searchField: "first_name,start_date,location,amount" }))
        }
        else if (state.searchOptions && state.searchOptions && state.searchOptions.label === "Completed") {
            dispatch(listBookings({ page: 1, future_booking: 0, limit, filter: search, sortingField: field, sortingOrder: order, searchField: "first_name,start_date,location,amount" }))
        }
        else if (state.searchOptions && state.searchOptions && state.searchOptions.label === "All") {
            dispatch(listBookings({ page: 1, limit, filter: search, sortingField: field, sortingOrder: order, searchField: "first_name,start_date,location,amount" }))
        }
    }

    const checkedAllCheckbox = (data) => {
        if (data) {
            let allCheck = _.map(bookingList, 'id');
            setAllCheckedValue(allCheck)
        } else {
            setAllCheckedValue([])
        }
        setCheckedAll(data)
    }

    return (
        <>
            <Loader loader={loader} />
            <div className="main-site fixed--header ">
                <section id="main-header" >
                    <Header getMainRoute={"bookings"} />
                </section>
                <main className="site-body">
                    <section className="page-title contact--header">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-auto title--col">
                                    <div>
                                        <h2 className="title">Bookings ({totalRecords})</h2>
                                    </div>

                                </div>
                                <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                    {/* <span className="d-none d-lg-block">View</span> */}
                                    <Select
                                        className="floating-select cstselectmin-w d-lg-block  mr-15 ml-15"
                                        styles={selectStyle}
                                        isSearchable={false}
                                        components={makeAnimated()}
                                        options={searchTypeOptions}
                                        value={state.searchOptions}
                                        onChange={(e) => onSearchResult(e)}
                                    /* menuIsOpen={true} */
                                    // onChange={(data) => setState({ ...state, searchOptions: data })}
                                    />
                                    {/* <input type="text" name="search" value={search} onChange={(e) => onSearchResult(e.target.value)} placeholder="Search Contact" className="form-control d-none d-lg-block" /> */}
                                    <button type="button" href="#google" onClick={(e) => deleteContactFunction(e)} className="btn btn-danger mr-15">Delete</button>
                                    <Link to={ADD_BOOKING} className="btn btn-primary mr-15">Create </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="middle-section">
                        <div className="container">
                            <div className="row no-gutters-mbl">
                                <div className="col-12">
                                    <div className="main-card">
                                        <div className="card">
                                            <div className="card-body pt-0">
                                                <div className="bookingResp_table table-responsive">
                                                    <table className={(bookingList && bookingList.length > 0) ? "table table-lg table-striped contacts--table smart-table" : "table table-lg table-striped contacts--table smart-table empty-booking-table"}>
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">
                                                                    {bookingList.length > 0 ?
                                                                        <div className="custom-control custom-checkbox">
                                                                            <input type="checkbox" name="check_all" onChange={(e) => checkedAllCheckbox(e.target.checked)} checked={checkedAll} className="custom-control-input" id={'checkAll'} />
                                                                            <label className="custom-control-label" htmlFor={'checkAll'}></label>
                                                                        </div>
                                                                        : ''
                                                                    }
                                                                </th>
                                                                <th >
                                                                    <div className="table--sorting">
                                                                        Date & Time
                                                                    <div className="sorting-icn">
                                                                            <a href="#desc" className={sortingField === 'start_date' ? (sortingOrder === 'DESC' ? "active up" : (sortingOrder === 'ASC' ? "active" : "")) : ''} onClick={(e) => sortTheData(e, 'start_date', sortingOrder)}>
                                                                                <svg width="14" height="8" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M9.90008 0.618506L9.39911 0.103126C9.33236 0.0343033 9.25546 0 9.16853 0C9.08181 0 9.00494 0.0343033 8.93819 0.103126L5.00005 4.15463L1.06209 0.103235C0.995301 0.0344116 0.918439 0.000108326 0.831611 0.000108326C0.744747 0.000108326 0.667886 0.0344116 0.601132 0.103235L0.100235 0.61865C0.0333416 0.687329 0 0.766407 0 0.855776C0 0.945073 0.0334469 1.02415 0.100235 1.09283L4.76957 5.89695C4.83633 5.96566 4.91322 6 5.00005 6C5.08688 6 5.16364 5.96566 5.23036 5.89695L9.90008 1.09283C9.96683 1.02411 10 0.945037 10 0.855776C10 0.766407 9.96683 0.687329 9.90008 0.618506Z" />
                                                                                </svg>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </th>
                                                                {/* <th scope="col">Customer</th> */}
                                                                <th >
                                                                    <div className="table--sorting">
                                                                        Customer
                                                                    <div className="sorting-icn">
                                                                            <a href="#desc" className={sortingField === 'first_name' ? (sortingOrder === 'DESC' ? "active up" : (sortingOrder === 'ASC' ? "active" : "")) : ''} onClick={(e) => sortTheData(e, 'first_name', sortingOrder)}>
                                                                                <svg width="14" height="8" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M9.90008 0.618506L9.39911 0.103126C9.33236 0.0343033 9.25546 0 9.16853 0C9.08181 0 9.00494 0.0343033 8.93819 0.103126L5.00005 4.15463L1.06209 0.103235C0.995301 0.0344116 0.918439 0.000108326 0.831611 0.000108326C0.744747 0.000108326 0.667886 0.0344116 0.601132 0.103235L0.100235 0.61865C0.0333416 0.687329 0 0.766407 0 0.855776C0 0.945073 0.0334469 1.02415 0.100235 1.09283L4.76957 5.89695C4.83633 5.96566 4.91322 6 5.00005 6C5.08688 6 5.16364 5.96566 5.23036 5.89695L9.90008 1.09283C9.96683 1.02411 10 0.945037 10 0.855776C10 0.766407 9.96683 0.687329 9.90008 0.618506Z" />
                                                                                </svg>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </th>
                                                                <th scope="col">Location</th>
                                                                {/* <th >
                                                                    <div className="table--sorting">
                                                                        Location
                                                                    <div className="sorting-icn">
                                                                            <a href="#desc" className={sortingField === 'location' ? (sortingOrder === 'DESC' ? "active up" : (sortingOrder === 'ASC' ? "active" : "")) : ''} onClick={(e) => sortTheData(e, 'location', sortingOrder)}>
                                                                                <svg width="14" height="8" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M9.90008 0.618506L9.39911 0.103126C9.33236 0.0343033 9.25546 0 9.16853 0C9.08181 0 9.00494 0.0343033 8.93819 0.103126L5.00005 4.15463L1.06209 0.103235C0.995301 0.0344116 0.918439 0.000108326 0.831611 0.000108326C0.744747 0.000108326 0.667886 0.0344116 0.601132 0.103235L0.100235 0.61865C0.0333416 0.687329 0 0.766407 0 0.855776C0 0.945073 0.0334469 1.02415 0.100235 1.09283L4.76957 5.89695C4.83633 5.96566 4.91322 6 5.00005 6C5.08688 6 5.16364 5.96566 5.23036 5.89695L9.90008 1.09283C9.96683 1.02411 10 0.945037 10 0.855776C10 0.766407 9.96683 0.687329 9.90008 0.618506Z" />
                                                                                </svg>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </th> */}
                                                                {/* <th scope="col">Balance (Deposit)</th> */}
                                                                <th >
                                                                    <div className="table--sorting">
                                                                        <div className="d-flex">Balance <div className="notbold ml-1"> (Advance)</div></div>
                                                                        <div className="sorting-icn">
                                                                            <a href="#desc" className={sortingField === 'amount' ? (sortingOrder === 'DESC' ? "active up" : (sortingOrder === 'ASC' ? "active" : "")) : ''} onClick={(e) => sortTheData(e, 'amount', sortingOrder)}>
                                                                                <svg width="14" height="8" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M9.90008 0.618506L9.39911 0.103126C9.33236 0.0343033 9.25546 0 9.16853 0C9.08181 0 9.00494 0.0343033 8.93819 0.103126L5.00005 4.15463L1.06209 0.103235C0.995301 0.0344116 0.918439 0.000108326 0.831611 0.000108326C0.744747 0.000108326 0.667886 0.0344116 0.601132 0.103235L0.100235 0.61865C0.0333416 0.687329 0 0.766407 0 0.855776C0 0.945073 0.0334469 1.02415 0.100235 1.09283L4.76957 5.89695C4.83633 5.96566 4.91322 6 5.00005 6C5.08688 6 5.16364 5.96566 5.23036 5.89695L9.90008 1.09283C9.96683 1.02411 10 0.945037 10 0.855776C10 0.766407 9.96683 0.687329 9.90008 0.618506Z" />
                                                                                </svg>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </th>
                                                                <th scope="col"> Quote/Invoice</th>
                                                                {/* <th >
                                                                    <div className="table--sorting">
                                                                        Quote/Invoice
                                                                    <div className="sorting-icn">
                                                                            <a href="#desc" className={sortingField === 'organization' ? (sortingOrder === 'DESC' ? "active up" : (sortingOrder === 'ASC' ? "active" : "")) : ''} onClick={(e) => sortTheData(e, 'organization', sortingOrder)}>
                                                                                <svg width="14" height="8" viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M9.90008 0.618506L9.39911 0.103126C9.33236 0.0343033 9.25546 0 9.16853 0C9.08181 0 9.00494 0.0343033 8.93819 0.103126L5.00005 4.15463L1.06209 0.103235C0.995301 0.0344116 0.918439 0.000108326 0.831611 0.000108326C0.744747 0.000108326 0.667886 0.0344116 0.601132 0.103235L0.100235 0.61865C0.0333416 0.687329 0 0.766407 0 0.855776C0 0.945073 0.0334469 1.02415 0.100235 1.09283L4.76957 5.89695C4.83633 5.96566 4.91322 6 5.00005 6C5.08688 6 5.16364 5.96566 5.23036 5.89695L9.90008 1.09283C9.96683 1.02411 10 0.945037 10 0.855776C10 0.766407 9.96683 0.687329 9.90008 0.618506Z" />
                                                                                </svg>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </th> */}
                                                                {/* <th scope="col">Related to</th> */}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {(bookingList && bookingList.length > 0) ?
                                                                _.map(bookingList, (data) => {
                                                                    let latLngUrl = '';
                                                                    if (data.lat_long && data.lat_long !== null) {
                                                                        let placeData = JSON.parse(data.lat_long);
                                                                        latLngUrl = placeData.lat + ',' + placeData.lng + '&query_place_id=' + placeData.place_id
                                                                    }
                                                                    return <tr key={data.id}>
                                                                        <td>
                                                                            <div className="custom-control custom-checkbox">
                                                                                <input type="checkbox" name={data.id} onChange={(e) => onCheckedValue(data.id, e.target.checked)} checked={_.includes(allCheckedValue, data.id)} className="custom-control-input" id={'check' + data.id} />
                                                                                <label className="custom-control-label" htmlFor={'check' + data.id}></label>
                                                                            </div>
                                                                        </td>
                                                                        <td className="booking--date"><div className="booking-list-date">{moment(data.start_date).format('ddd, MMM DD YYYY')}</div><div className="ml-1">{moment(data.start_date).format("LT") + ' PST' || '-'}</div></td>
                                                                        <td className="booking--name"><Link to={VIEW_BOOKING_BASE + data.id} className="text-link">{data.name}<div>{data.first_name + (data.last_name !== null ? ' ' + data.last_name : '')}</div></Link> </td>
                                                                        {data.virtual_event === 1 ?
                                                                            <td className="booking--location booking_location">
                                                                                <a href={/^https?:\/\//.test(data.location) ? `${data.location}` : `//${data.location}`} rel="noopener noreferrer" target="_blank" className="text-link">{data.location}</a>
                                                                                <p>Meeting Id: {data.meeting_id !== null ? data.meeting_id : 'N/A'} Passcode: {data.passcode !== null ? data.passcode : 'N/A'}</p>

                                                                            </td>
                                                                            :
                                                                            <td className="booking--location booking_location">
                                                                                {data.location || '-'}
                                                                                {latLngUrl !== '' ?
                                                                                    <a href={"https://www.google.com/maps/search/?api=1&query=" + latLngUrl} rel="noopener noreferrer" target="_blank" className="text-link ml-1">(Map)</a>
                                                                                    : <div></div>}
                                                                            </td>
                                                                        }
                                                                        <td className="booking--amount"><span><strong>{data.amount !== null ? "$" + (parseFloat(data.amount) - parseFloat(data.received_amount)) : ''}</strong>{' '}{data.received_amount !== null ? "($" + data.received_amount + ")" : ''}</span></td>
                                                                        <td className="booking--quote">
                                                                            {data.quote_id !== null ? <Link to={(data.quote_status_type_id === 1 ? VIEW_QUOTE_BASE : VIEW_QUOTE_DETAIL_BASE) + data.quote_id} className="text-link">Quote ID: {data.quote_serial_no + ', '}</Link> : ''}
                                                                            {(data.invoice).length > 0 ?
                                                                                _.map(data.invoice, (inv, k) => {
                                                                                    return <React.Fragment key={k}><Link to={(inv.invoice_status_type_id !== 1 ? VIEW_INVOICE_DETAIL_BASE : VIEW_INVOICE_BASE) + inv.id} className="text-link" >Invoice ID:{inv.invoice_serial_no}</Link>{(data.invoice).length === k + 1 ? '' : ', '}</React.Fragment>
                                                                                })
                                                                                : ''}
                                                                            {data.quote_id === null && (data.invoice).length === 0 ? '-' : ''}
                                                                        </td>
                                                                    </tr>
                                                                })
                                                                :
                                                                fetchList ?
                                                                    ''
                                                                    :
                                                                    <tr>
                                                                        <td colSpan="6" className="bg-white">
                                                                            <div className="no--contacts">
                                                                                <h5>You don’t have any upcoming bookings. </h5>
                                                                                <h5>Track all your bookings. </h5>
                                                                                <Link to={ADD_BOOKING} className="btn btn-primary mt-5">Create Booking</Link>
                                                                            </div>
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

                <Footer />
            </div>
        </>
    );
}
