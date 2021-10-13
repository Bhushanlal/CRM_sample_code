import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import { Link, withRouter } from "react-router-dom";
import { ADD_QUOTE_BASE, VIEW_QUOTE_BASE, VIEW_QUOTE_DETAIL_BASE, LIST_ACCEPTED_QUOTE, ADD_BASIC_QUOTE } from "../../../../routing/routeContants";
import Modal from "react-bootstrap/Modal";
import Select from 'react-select';
import { selectStyle, constants, CustomValueContainer } from '../../../../common/constants';
import { fieldValidator, usePrevious, setImagePath } from '../../../../common/custom';
import AsyncSelect from 'react-select/async';
import { validateInputs } from '../../../../common/validation';
import { Loader } from '../../../component/frontend/loader/loader'
import { getContactListOptionValue } from '../../../../../api/sdk/contact';
import { addQuote, listQuote } from '../../../../duck/quote/quote.action';
import _ from 'lodash';
import ORANGE_ARROW from '../../../../assets/images/orange-arrow.svg'
import ARROW_RIGHT from '../../../../assets/images/arrow-rgt-teal.svg'
import moment from 'moment'
import { getUserDetails } from '../../../../storage/user';
import { SubscriptionPlan } from "../profile/subscriptionPlans"
import Swal from 'sweetalert2'

export const ListQuotePage = props => {

    const dispatch = useDispatch();
    const userData = getUserDetails();
    const currentPlan = userData && userData.planData
    const [subscriptionModalShow, setSubscriptionModalShow] = useState(false);
    const [loader, setLoader] = useState(false);
    const [fetchList, setfetchList] = useState(true);
    const [isCollapse, setIsCollapse] = useState('');

    // Add refer contact State And Props
    const phoneTypeOptions = [{ value: 'Mobile', label: 'Mobile' }, { value: 'Work', label: 'Work' }, { value: 'Home', label: 'Home' }];
    const [addQuoteShow, setAddQuoteModalShow] = useState(false);
    const [quoteState, setQuoteState] = useState({
        firstName: '', lastName: '', email: '', phone: '', organization: '', title: '', phoneType: { value: 'Mobile', label: 'Mobile' },
        firstNameCls: '', emailCls: '', phoneCls: '', firstNameErr: '', emailErr: '', phoneErr: '',
        correctInput: '', wrongInput: constants.WRONG_INPUT, contact_type: '1',
        contactSelectValue: '', quoteName: ''
    });
    const [addQuoteMessage, setAddQuoteMessage] = useState('');
    const addQuoteData = useSelector(state => state.quote.addQuoteData);
    const prevAddQuoteData = usePrevious({ addQuoteData });

    // List Quoes 
    const [allQuotes, setAllQuotes] = useState([])
    const [totalQuote, setTotalQuote] = useState(0)
    const [showTotalQuote, setShowTotalQuote] = useState(0)
    const listQuoteData = useSelector(state => state.quote.listQuoteData);
    const prevListQuoteData = usePrevious({ listQuoteData });

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
        dispatch(listQuote())
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // handle input change event
    const handleInputChange = value => {
        setQuoteState({ ...quoteState, contactSelect: value, contactSelectErr: '', contactSelectCls: '' })
    };

    // Refer Handle selection
    const referHandleChange = value => {
        setTimeout(() => {
            setQuoteState({ ...quoteState, contactSelectValue: value })
        }, 0)
    }

    // load options using API call
    const loadOptions = async () => {
        let data = [];
        let listOption = await getContactListOptionValue({ searchField: 'first_name,last_name', fields: 'id,first_name,last_name,organization,title,email,phone', filter: quoteState.contactSelect })
        if (listOption && listOption.data && _.has(listOption.data, 'data') && listOption.success === true) {
            data = listOption.data.data
        }
        return data;
    };

    // Check Validation Function 
    const checkValidation = (field, value, type, maxLength, minLength, fieldType) => {
        return fieldValidator(field, value, type, null, maxLength, minLength, fieldType)
    }

    // Set The Quote Input Values
    const setQuoteInputValue = (e, type, maxLength, minLength) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
        setQuoteState({ ...quoteState, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        setAddQuoteMessage('');
    }

    // Create Quote Function
    const saveAddQuoteData = () => {
        let success = '';
        let error = quoteState.wrongInput;
        let contact_type = quoteState.contact_type, contactSelectValue = quoteState.contactSelectValue, firstName = quoteState.firstName, lastName = quoteState.lastName, email = quoteState.email, phone = quoteState.phone, organization = quoteState.organization,
            title = quoteState.title, quoteName = quoteState.quoteName, phoneType = quoteState.phoneType.value, firstNameCls = success, emailCls = '', phoneCls = '', quoteNameCls = '',
            firstNameErr = '', emailErr = '', quoteNameErr = '', phoneErr = '', organizationErr = '', contactSelectErr = '', contactSelectCls = '', getError = false;

        if (validateInputs('string', quoteName) === 'empty') {
            quoteNameErr = 'Please enter quote name.';
            quoteNameCls = error
            getError = true;
        } else if (validateInputs('string', quoteName) === false) {
            quoteNameErr = 'Please enter valid quote name.';
            quoteNameCls = error
            getError = true;
        } else if (quoteName.length > 50) {
            quoteNameErr = 'Please enter maximum 50 characters.';
            quoteNameCls = error
            getError = true;
        }

        if (contact_type === "1") {
            if (validateInputs('string', firstName) === 'empty') {
                firstNameErr = 'Please enter first name.';
                firstNameCls = error
                getError = true;
            } else if (validateInputs('string', firstName) === false) {
                firstNameErr = 'Please enter valid first name.';
                firstNameCls = error
                getError = true;
            } else if (firstName.length > 50) {
                firstNameErr = 'Please enter maximum 50 characters.';
                firstNameCls = error
                getError = true;
            }


            if (validateInputs('email', email) === false) {
                emailErr = 'Please enter valid email.';
                emailCls = error
                getError = true;
            }

            if (validateInputs('phoneNumberHyphon', phone) === false) {
                phoneErr = 'Please enter valid phone.';
                phoneCls = error
                getError = true;
            }
            if (phone && phone.length > 1 && phone.length > 15) {
                phoneErr = 'Please enter maximum 15 digits.';
                phoneCls = error
                getError = true;
            }
        } else {
            if (!(contactSelectValue && contactSelectValue.id)) {
                contactSelectErr = 'Please select contact.';
                contactSelectCls = error
                getError = true;
            }
        }

        setQuoteState({
            ...quoteState, quoteNameCls, quoteNameErr, firstNameCls, emailCls, phoneCls, firstNameErr, emailErr, phoneErr, organizationErr, contactSelectCls, contactSelectErr
        })

        if (getError === false && emailErr === '' && firstNameErr === '' && phoneErr === '' && quoteNameErr === '' && contactSelectErr === '') {
            setLoader(true)
            if (contact_type === '1') {
                let contactData = { new_contact: contact_type, name: quoteName, first_name: firstName, last_name: lastName, phone_type: phoneType, organization, phone, title };
                if (email !== '') {
                    contactData.email = email
                }
                dispatch(addQuote(contactData))
            } else {
                if (contactSelectValue && contactSelectValue.id) {
                    dispatch(addQuote({ name: quoteName, contact_id: contactSelectValue.id, new_contact: contact_type }))
                }
            }

        }
    }

    useEffect(() => {
        if (prevAddQuoteData && prevAddQuoteData.addQuoteData !== addQuoteData) {
            if (addQuoteData && _.has(addQuoteData, 'data') && addQuoteData.success === true) {
                props.history.push(ADD_QUOTE_BASE + addQuoteData.data.id)
                setAddQuoteModalShow(false)
                setLoader(false)
            }
            if (addQuoteData && _.has(addQuoteData, 'message') && addQuoteData.success === false) {
                setLoader(false)
                setAddQuoteMessage(addQuoteData.message)
            }
        }
        if (prevListQuoteData && prevListQuoteData.listQuoteData !== listQuoteData) {
            if (listQuoteData && _.has(listQuoteData, 'data') && listQuoteData.success === true) {
                let totalQuote = 0, showTotalQuote=0;
                _.map(listQuoteData.data, (val, ind) => {
                    if(val.name!=='Accepted/Rejected'){
                        showTotalQuote = showTotalQuote + val.count
                    }
                    totalQuote = totalQuote + val.count
                })
                setAllQuotes(listQuoteData.data)
                setTotalQuote(totalQuote)
                setShowTotalQuote(showTotalQuote)
                setLoader(false)
                setfetchList(false);
            }
            if (listQuoteData && _.has(listQuoteData, 'message') && listQuoteData.success === false) {
                setLoader(false)
                setfetchList(false);
            }
        }
    }, [prevAddQuoteData, addQuoteData, prevListQuoteData, listQuoteData])// eslint-disable-line react-hooks/exhaustive-deps

    // Create Quote 
    const createQuote = (e) => {
        e.preventDefault()
        if (currentPlan && currentPlan.plan_is_active === 0) {
            let buttonMsg = currentPlan.subscription_product_id === 1 ? 'View Plans' : 'Renew Plan'
            let warMsg = currentPlan.subscription_product_id === 1 ? 'Free Trial Expired' : 'Subscription Expired'
            let msg = currentPlan.subscription_product_id === 1 ? 'Your free trial has expired. Please subscribe to a plan to access the application. ' : 'Your subscription has expired. Please renew your subscription or upgrade your plan to access the application. ';
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
            props.history.push(ADD_QUOTE_BASE)
        }
    }

    return (
        <>
            <Loader loader={loader} />
            <div className="main-site fixed--header">
                <Header getMainRoute={'quotes'} />
                <main className="site-body">
                    <section className="page-title contact--header">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-auto title--col">
                                    <div>
                                        <h2 className="title">Quotes ({showTotalQuote})</h2>
                                    </div>
                                </div>
                                <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                    <button onClick={(e) => createQuote(e)} className="btn btn-primary">Create Quote</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="middle-section">
                        <div className="container">
                            {totalQuote !== 0 ?
                                <div className="row no-gutters-mbl">
                                    <div className="col-12">
                                        <div className="leads-container quotes-section">
                                            <div className="leads-container_row leads-container_scroller lead-stage-adjust ">
                                                {_.map(allQuotes, (data, key) => {
                                                    return <div key={key} className="leads-col">
                                                        <div className="leads-col_header">
                                                            <button className="btn btn-block d-lg-none btn--card-collapse" type="button" data-toggle="collapse" data-target={'#lead-' + data.id} aria-expanded="false" aria-controls={'lead-' + data.id}><span>{data.name} ({data.count})</span> <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                                            <div className="header--web d-none d-lg-flex"><h4>{data.name} </h4><img src={setImagePath(ARROW_RIGHT)} alt="" /></div>
                                                        </div>
                                                        <div className={"leads-col_body " + isCollapse} id={'lead-' + data.id}>
                                                            <div className="leads-col_body--wrap">
                                                                {_.map(data.quotes, (quote, quoteKey) => {
                                                                    return <div className={"dragable--card " + (quote.is_expired === 1 ? 'expired' : data.name === 'Accepted/Rejected' ? (quote.reject_reason === null || quote.reject_reason === '' ? 'completed' : 'lost') : '')} key={quoteKey}>
                                                                        <div className="title"><Link to={(data.name === 'New/Draft' ? VIEW_QUOTE_BASE : VIEW_QUOTE_DETAIL_BASE) + quote.id}>{quote.name}</Link></div>
                                                                        <div className="info">
                                                                            {quote.contact && quote.contact.id ?
                                                                                <>
                                                                                    {data.name === 'Accepted/Rejected' ?
                                                                                        quote.is_expired === 1 ?
                                                                                            <>
                                                                                                <p className="mb-0"><strong>${quote.amount_total}</strong> {quote.amount_deposit > 0 ? '($' + quote.amount_deposit + ' Advance)' : ''}</p>
                                                                                                <p className="mb-0"> Expired On: {moment(quote.timeline.expired_on).format('ll')}</p>
                                                                                            </>
                                                                                            :
                                                                                            quote.reject_reason === null || quote.reject_reason === '' ?
                                                                                                <>
                                                                                                    <p className="mb-0"><strong>${quote.amount_total}</strong> {quote.amount_deposit > 0 ? '($' + quote.amount_deposit + ' Advance)' : ''}</p>
                                                                                                    <p className="mb-0"> Accepted On: {moment(quote.timeline.signed_at).format('ll')}</p>
                                                                                                </>
                                                                                                :
                                                                                                <>
                                                                                                    <p className="mb-0"><strong>${quote.amount_total}</strong> {quote.amount_deposit > 0 ? '($' + quote.amount_deposit + ' Advance)' : ''}</p>
                                                                                                    <p className="mb-0"> Rejected On: {moment(quote.timeline.reject_at).format('ll')}</p>
                                                                                                </>
                                                                                        :
                                                                                        <>
                                                                                            <p className="mb-0">{quote.contact.first_name + ' ' + (quote.contact.last_name !== null ? quote.contact.last_name : '')}
                                                                                                {quote.contact.phone !== null ? (<><br />{quote.contact.phone}</>) : ''} </p>
                                                                                            <p className="mb-0">Quote ID : {quote.quote_serial_no}</p>
                                                                                            <p className="mb-0">${quote.amount_total}</p>
                                                                                            {
                                                                                                quote.quote_status_type_id === 2 ?
                                                                                                    <p className="mb-0 quote-last-update">Sent at: {quote.timeline && quote.timeline.sent_at !== null ? moment(quote.timeline.sent_at).format('h:mmA, MMM DD') : moment(quote.timeline.signed_at).format('h:mmA, MMM DD')}</p>
                                                                                                    :
                                                                                                    quote.quote_status_type_id === 3 ?
                                                                                                        <p className="mb-0 quote-last-update">Viewed at: {quote.timeline && quote.timeline.viewed_at !== null ? moment(quote.timeline.viewed_at).format('h:mmA, MMM DD') : moment(quote.timeline.signed_at).format('h:mmA, MMM DD')}</p>
                                                                                                        :
                                                                                                        <p className="mb-0 quote-last-update">Last Updated: {moment(quote.updated_at).format('h:mmA, MMM DD')}</p>
                                                                                            }
                                                                                        </>
                                                                                    }
                                                                                </>
                                                                                : ''}
                                                                        </div>
                                                                    </div>
                                                                })}
                                                            </div>
                                                            {data.name === 'Accepted/Rejected' && (data.quotes).length > 3 ?
                                                                <div className="d-block view-closed-leads text-center"><Link to={LIST_ACCEPTED_QUOTE} className="text-link">View All Quotes</Link></div>
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
                                                    {_.map(allQuotes, (data, key) => {
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
                                                            <p>You don’t have any quotes yet! </p>
                                                            {/*  <p>Create new leads and track your business in one view. </p>
                                                            <p>Create your own view by editing the stage names or adding new ones.</p> */}
                                                            <Link to={ADD_BASIC_QUOTE} className="btn btn-primary">Create Quote</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>}
                                </>
                            }
                        </div>
                    </section>
                    {/* Add Quote Modal*/}
                    <Modal show={addQuoteShow} onHide={() => setAddQuoteModalShow(false)} className="" size="lg" centered>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Create New Quote
                        </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {addQuoteMessage ? <div className="errorCls errCommonCls mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{addQuoteMessage}</div> : ''}
                            <form>
                                <div className="form-group col-md-6">
                                    <div className={"floating-label " + quoteState.quoteNameCls}>
                                        <input placeholder="Event, Service, Customer name etc." type="text" name="quoteName" value={quoteState.quoteName || ''} onChange={(e) => setQuoteInputValue(e, 'string', 50, null)} className="floating-input" />
                                        <label>Quote Name *</label>
                                        {quoteState.quoteNameErr ? <span className="errorValidationMessage"> {quoteState.quoteNameErr}</span> : ''}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="form-group col-md-12">
                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="customRadioInline3" onChange={() => setQuoteState({ ...quoteState, contact_type: '1', contactSelectCls: '', contactSelectErr: '', firstNameErr: '', firstNameCls: '' })} checked={quoteState.contact_type === '1' ? true : false} name="contact_type" className="custom-control-input" value="1" />
                                            <label className="custom-control-label" htmlFor="customRadioInline3">Create New Contact</label>
                                        </div>
                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="customRadioInline4" onChange={() => setQuoteState({ ...quoteState, contact_type: '0', contactSelectCls: '', contactSelectErr: '', firstNameErr: '', firstNameCls: '' })} checked={quoteState.contact_type === '0' ? true : false} name="contact_type" className="custom-control-input" value="0" />
                                            <label className="custom-control-label" htmlFor="customRadioInline4">Select Existing Contact</label>
                                        </div>
                                    </div>
                                </div>
                                {quoteState.contact_type === '1'
                                    ?
                                    <div className="row">
                                        <div className="form-group col-md-6">
                                            <div className={"floating-label " + quoteState.firstNameCls}>
                                                <input placeholder="First Name *" type="text" name="firstName" value={quoteState.firstName || ''} onChange={(e) => setQuoteInputValue(e, 'string', 50, null)} className="floating-input" />
                                                <label>First Name *</label>
                                                {quoteState.firstNameErr ? <span className="errorValidationMessage"> {quoteState.firstNameErr}</span> : ''}
                                            </div>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <div className="floating-label">
                                                <input placeholder="Last Name" type="text" name="lastName" value={quoteState.lastName || ''} onChange={(e) => { setQuoteState({ ...quoteState, lastName: e.target.value }); setAddQuoteMessage('') }} className="floating-input" />
                                                <label>Last Name</label>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <div className="form-row">
                                                <div className="col-5">
                                                    <div className="floating-label">
                                                        <Select
                                                            styles={selectStyle}
                                                            className="floating-select"
                                                            components={{ ValueContainer: CustomValueContainer }}
                                                            value={quoteState.phoneType}
                                                            isSearchable={false}
                                                            defaultValue={quoteState.phoneType}
                                                            options={phoneTypeOptions}
                                                            placeholder="Phone Type"
                                                            onChange={data => { setQuoteState({ ...quoteState, phoneType: data }); setAddQuoteMessage('') }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-7">
                                                    <div className={"floating-label " + quoteState.phoneCls}>
                                                        <input placeholder="Phone Number" type="text" name="phone" value={quoteState.phone || ''} onChange={(e) => { setQuoteState({ ...quoteState, phone: e.target.value, phoneCls: '', phoneErr: '' }); setAddQuoteMessage('') }} className="floating-input" />
                                                        <label>Phone Number</label>
                                                        {quoteState.phoneErr ? <span className="errorValidationMessage"> {quoteState.phoneErr}</span> : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <div className={"floating-label " + quoteState.emailCls}>
                                                <input placeholder="Email Address" type="email" name="email" value={quoteState.email || ''} onChange={(e) => { setQuoteState({ ...quoteState, email: e.target.value, emailCls: '', emailErr: '' }); setAddQuoteMessage('') }} className="floating-input" />
                                                <label>Email Address</label>
                                                {quoteState.emailErr ? <span className="errorValidationMessage"> {quoteState.emailErr}</span> : ''}
                                            </div>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <div className="floating-label">
                                                <input placeholder="Organization Name" type="text" name="organization" value={quoteState.organization || ''} onChange={(e) => { setQuoteState({ ...quoteState, organization: e.target.value }); setAddQuoteMessage('') }} className="floating-input" />
                                                <label>Organization Name</label>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <div className="floating-label">
                                                <input placeholder="Title" type="text" name="title" value={quoteState.title || ''} onChange={(e) => { setQuoteState({ ...quoteState, title: e.target.value }); setAddQuoteMessage('') }} className="floating-input" />
                                                <label>Title</label>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className="row">
                                        <div className="form-group col-md-6 mb-lg-2">
                                            <div className={"floating-label " + quoteState.contactSelectCls}>
                                                <AsyncSelect
                                                    styles={selectStyle}
                                                    onFocus={e => {
                                                        if (e.target.autocomplete) {
                                                            e.target.autocomplete = "nope";
                                                        }
                                                    }}
                                                    isClearable
                                                    placeholder="Search Contact"
                                                    noOptionsMessage={() => "No results found"}
                                                    value={quoteState.contactSelectValue}
                                                    getOptionLabel={e => e.first_name + (e && e.last_name ? " " + e.last_name : '')}
                                                    getOptionValue={e => e.id}
                                                    loadOptions={(e) => loadOptions(e)}
                                                    onInputChange={(e) => handleInputChange(e)}
                                                    onChange={(e) => referHandleChange(e)}
                                                />
                                                {quoteState.contactSelectErr ? <span className="errorValidationMessage"> {quoteState.contactSelectErr}</span> : ''}
                                            </div>
                                        </div>
                                        <div className="form-group col-12">
                                            <div className="form-group">
                                                {quoteState.contactSelectValue && quoteState.contactSelectValue.phone !== null ? <div className="field-text">{quoteState.contactSelectValue.phone}</div> : ''}
                                                <div className="field-text"><a href="#lead" onClick={(e) => e.preventDefault()}>{quoteState.contactSelectValue && quoteState.contactSelectValue.email}</a></div>
                                                <div className="field-text">{quoteState.contactSelectValue && quoteState.contactSelectValue.organization}</div>
                                                <div className="field-text">{quoteState.contactSelectValue && quoteState.contactSelectValue.title ? <small>({quoteState.contactSelectValue.title})</small> : ''}</div>
                                            </div>
                                        </div>
                                    </div>}
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="button" className="btn btn-dark" onClick={() => setAddQuoteModalShow(false)}>Cancel</button>
                            <button type="button" onClick={() => saveAddQuoteData()} className="btn btn-primary">Add</button>
                        </Modal.Footer>
                    </Modal>
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

export const ListQuote = withRouter(ListQuotePage)