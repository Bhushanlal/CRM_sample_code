import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import { Link, withRouter } from "react-router-dom";
import { Loader } from '../../../component/frontend/loader/loader'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CALENDAR from "../../../../assets/images/calendar.png"
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import { constants, selectStyle, CustomValueContainer } from "../../../../common/constants";
import { fieldValidator, usePrevious, setImagePath } from '../../../../common/custom';
import { addQuote, updateBasicQuote, deleteQuote } from '../../../../duck/quote/quote.action';
import { listServiceWithSource } from '../../../../duck/lead/lead.action';
import { LIST_QUOTES, ADD_QUOTE_BASE } from "../../../../routing/routeContants";
import ORANGE_ARROW from '../../../../assets/images/orange-arrow.svg'
import { validateInputs } from '../../../../common/validation';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import AsyncSelect from 'react-select/async';
import { getContactListOptionValue } from '../../../../../api/sdk/contact';
import Swal from 'sweetalert2'
import moment from 'moment'
import _ from 'lodash';
import Select from "react-select";
import { AddOrganization } from './addOrganization'
import { AddService } from './addService'

export const NewAddBasicQuote = props => {

    const dispatch = useDispatch();
    const datepickerRef = useRef();
    const [loader, setLoader] = useState(false);
    const [isCollapse, setIsCollapse] = useState('');
    const [serviceMessage, setServiceMessage] = useState('');
    const phoneTypeOptions = [{ value: 'Mobile', label: 'Mobile' }, { value: 'Work', label: 'Work' }, { value: 'Home', label: 'Home' }];
    const [state, setState] = useState({
        correctInput: '', wrongInput: constants.WRONG_INPUT, quoteName: 'quote:', timeValue: '', location: '', internalNotes: '',
        timeShiftValue: { value: 'AM', label: "AM" }, timeShiftOptions: [{ value: "AM", label: "AM" }, { value: "PM", label: "PM" }],
        durationValue: '', durationOptions: [{ value: "1 Hours", label: "1 Hours" }, { value: "2 Hours", label: "2 Hours" },
        { value: "3 Hours", label: "3 Hours" }, { value: "Half Day", label: "Half Day" }, { value: "Full Day", label: "Full Day" }, { value: "Custom", label: "Custom" },
        { value: "N/A", label: "N/A" }], customDuration: '', lat_long: '', totalAmount: 0, deposite: 0, date: '', dateErr: '', dateCls: '',
        validThrough: { value: 7, label: "7 Days" }, validThrouhOptions: [{ value: 3, label: "3 Days" }, { value: 7, label: "7 Days" },
        { value: 15, label: "15 Days" }, { value: 30, label: "30 Days" }], validThroughErr: '', validThroughCls: '',
        firstName: '', lastName: '', email: '', phone: '', organization: '', title: '', phoneType: { value: 'Mobile', label: 'Mobile' },
        firstNameCls: '', emailCls: '', phoneCls: '', firstNameErr: '', emailErr: '', phoneErr: '',
        quoteSerialNo: '', selectTemplate: '', redirectPage: false, itemHeadingDisabled: true, itemNameDisabled: true, itemDiscriptionDisabled: true,
        itemChargeDisabled: true, depositRequired: 0, depositOnline: 0, quoteNameCls: '', quoteNameErr: '',
        servicesListOptions: [], selectService: '', selectServiceErr: '', selectServiceCls: '', new_contact: '1',
        quoteId: '', leadId: '', tentative: false
    });

    const addQuoteData = useSelector(state => state.quote.addQuoteData);
    const prevAddQuoteData = usePrevious({ addQuoteData });
    const deleteQuoteData = useSelector(state => state.quote.deleteQuoteData);
    const prevDeleteQuoteData = usePrevious({ deleteQuoteData });
    const listServiceWithSourceData = useSelector(state => state.lead.listServiceWithSourceData);
    const prevListServiceWithSourceData = usePrevious({ listServiceWithSourceData });
    // Organization Check 
    const [businessProfileModalShow, setBusinessProfileModalShow] = useState(false);

    // Add Template
    const [serviceModalShow, setServiceModalShow] = useState(false);

    const addExtraService = ({ innerRef, innerProps, isDisabled, children }) =>
        !isDisabled ? (
            <div ref={innerRef} {...innerProps} className="customReactSelectMenu">
                {children}
                <button
                    type="button"
                    className="btn text-link text-left btn-sm btn-block"
                    onClick={(e) => setServiceModalShow(true)}
                >Add New Service</button>
            </div>
        ) : null;


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
        if (props.history.location && props.history.location.state && props.history.location.state.quoteDataState) {
            const QuoteData = props.history.location.state.quoteDataState.quote;
            const ServiceType = props.history.location.state.quoteDataState.service_types;
            let services = _.map(ServiceType, (data) => { return { value: data.id, label: data.name } })
            _.remove(services, function (opt) {
                return opt.label === "Magic and Comedy Show (sample)";
            });
            let durationValue, customDuration;
            if (_.some(state.durationOptions, { value: QuoteData.event_duration, label: QuoteData.event_duration })) {
                durationValue = { value: QuoteData.event_duration, label: QuoteData.event_duration };
                customDuration = ''
            } else {
                if (QuoteData.event_duration !== null) {
                    durationValue = { value: 'Custom', label: 'Custom' }
                    customDuration = QuoteData.event_duration
                } else {
                    durationValue = ''
                }
            }
            setState({
                ...state, new_contact: '0', contactSelectValue: QuoteData.contact, quoteName: QuoteData.name,
                location: QuoteData.event_location !== null ? QuoteData.event_location : '',
                lat_long: QuoteData.event_lat_long !== null ? QuoteData.event_lat_long : '',
                validThrough: QuoteData.valid_through_days !== 0 ? { value: QuoteData.valid_through_days, label: QuoteData.valid_through_days + ' Days' } : '',
                date: QuoteData.start_date !== null ? moment(QuoteData.start_date).toDate() : '',
                timeValue: QuoteData.start_date !== null ? moment(QuoteData.start_date).toDate() : '',
                durationValue, customDuration, quoteId: QuoteData.id,
                firstName: QuoteData.contact && QuoteData.contact.first_name ? QuoteData.contact.first_name : '',
                lastName: QuoteData.contact && QuoteData.contact.last_name ? QuoteData.contact.last_name : '',
                email: QuoteData.contact && QuoteData.contact.email ? QuoteData.contact.email : '',
                phone: QuoteData.contact && QuoteData.contact.phone ? QuoteData.contact.phone : '',
                phoneType: QuoteData.contact && QuoteData.contact.phone_type ? { value: QuoteData.contact.phone_type, label: QuoteData.contact.phone_type } : '',
                organization: QuoteData.contact && QuoteData.contact.organization ? QuoteData.contact.organization : '',
                title: QuoteData.contact && QuoteData.contact.title ? QuoteData.contact.title : '',
                servicesListOptions: services,
                tentative: QuoteData.tentative === 1 ? true : false,
                selectService: QuoteData.service_type && QuoteData.service_type.id ? { value: QuoteData.service_type.id, label: QuoteData.service_type.name } : '',
            })
        } else if (props.history.location && props.history.location.state && props.history.location.state.quoteLeadData) {
            const leadData = props.history.location.state.quoteLeadData;
            const ServiceType = props.history.location.state.quoteLeadData.service_type;
            let services = _.map(ServiceType, (data) => { return { value: data.id, label: data.name } })
            _.remove(services, function (opt) {
                return opt.label === "Magic and Comedy Show (sample)";
            });
            setState({
                ...state, new_contact: '0', contactSelectValue: leadData.contact, leadId: leadData.id, quoteName: 'quote:' + leadData.name,
                firstName: leadData.contact && leadData.contact.first_name ? leadData.contact.first_name : '',
                lastName: leadData.contact && leadData.contact.last_name ? leadData.contact.last_name : '',
                email: leadData.contact && leadData.contact.email ? leadData.contact.email : '',
                phone: leadData.contact && leadData.contact.phone ? leadData.contact.phone : '',
                phoneType: leadData.contact && leadData.contact.phone_type ? { value: leadData.contact.phone_type, label: leadData.contact.phone_type } : '',
                organization: leadData.contact && leadData.contact.organization ? leadData.contact.organization : '',
                title: leadData.contact && leadData.contact.title ? leadData.contact.title : '',
                servicesListOptions: services,
                selectService: leadData.service_type && leadData.service_type.id ? { value: leadData.service_type.id, label: leadData.service_type.name } : '',
            })
            setLoader(true)
            dispatch(listServiceWithSource())
        } else {
            setLoader(true)
            dispatch(listServiceWithSource())
        }
        // clean up function
        return () => {
            // remove resize listener
            window.removeEventListener('resize', resizeListener);
        }
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (prevListServiceWithSourceData && prevListServiceWithSourceData.listServiceWithSourceData !== listServiceWithSourceData) {
            if (listServiceWithSourceData && _.has(listServiceWithSourceData, 'data') && listServiceWithSourceData.success === true) {
                setLoader(false)
                let serviceOption = _.map(listServiceWithSourceData.data.service_types, (data) => { return { value: data.id, label: data.name } })
                _.remove(serviceOption, function (opt) {
                    return opt.label === "Magic and Comedy Show (sample)";
                });
                setState({ ...state, servicesListOptions: serviceOption })
            }
            if (listServiceWithSourceData && _.has(listServiceWithSourceData, 'message') && listServiceWithSourceData.success === false) {
                setLoader(false)
                setServiceMessage(listServiceWithSourceData.message)
            }
        }
        if (prevAddQuoteData && prevAddQuoteData.addQuoteData !== addQuoteData) {
            if (addQuoteData && _.has(addQuoteData, 'data') && addQuoteData.success === true) {
                props.history.push(ADD_QUOTE_BASE + addQuoteData.data.id)
                setLoader(false)
            }
            if (addQuoteData && _.has(addQuoteData, 'message') && addQuoteData.success === false) {
                setLoader(false)
                if (addQuoteData.message === 'Please add organization first.') {
                    setBusinessProfileModalShow(true)
                } else {
                    setServiceMessage(addQuoteData.message)
                }
            }
        }
        if (prevDeleteQuoteData && prevDeleteQuoteData.deleteQuoteData !== deleteQuoteData) {
            if (deleteQuoteData && _.has(deleteQuoteData, 'data') && deleteQuoteData.success === true) {
                setLoader(false)
                props.history.push(LIST_QUOTES)
            }
            if (deleteQuoteData && _.has(deleteQuoteData, 'message') && deleteQuoteData.success === false) {
                setLoader(false)
                setServiceMessage(deleteQuoteData.message)
            }
        }
    }, [listServiceWithSourceData, prevListServiceWithSourceData, prevAddQuoteData, addQuoteData, prevDeleteQuoteData, deleteQuoteData])// eslint-disable-line react-hooks/exhaustive-deps

    //Set Address 
    const handleChangeGoogle = address => {
        setState({ ...state, location: address })
    };

    const handleSelectGoogle = async (address) => {
        const results = await geocodeByAddress(address);
        const latLng = await getLatLng(results[0]);
        let data = { lat: latLng.lat, lng: latLng.lng, place_id: results[0].place_id };
        //setState({ ...state, location: results[0].formatted_address, lat_long: JSON.stringify(data) })
        setState({ ...state, location: address, lat_long: JSON.stringify(data) })
    };

    // Set The Input Values
    const setInputValue = (e, type, maxLength, minLength) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
        setState({ ...state, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        setServiceMessage('');
    }

    // Check Validation Function 
    const checkValidation = (field, value, type, maxLength, minLength, fieldType) => {
        return fieldValidator(field, value, type, null, maxLength, minLength, fieldType)
    }


    // set date for booking 
    const dateForBooking = (date) => {
        if (date === null) {
            setState({ ...state, date: '', dateCls: state.wrongInput, dateErr: 'Please select date' })
        } else {
            setState({ ...state, date: date, dateCls: '', dateErr: '' })
            setServiceMessage('')
        }
    }

    const showTimeSelection = () => {
        setTimeout(function () { datepickerRef.current.setOpen(true); }, 100);
    };

    // Save Quote Function 
    const saveQuoteData = () => {
        let error = state.wrongInput;
        let date = state.date, dateErr = '', dateCls = '', validThroughCls = '', validThroughErr = '',
            validThrough = state.validThrough, quoteName = state.quoteName, quoteNameErr = '', quoteNameCls = '',
            new_contact = state.new_contact, contactSelectValue = state.contactSelectValue, firstName = state.firstName, lastName = state.lastName, email = state.email,
            phone = state.phone, organization = state.organization, title = state.title, phoneType = state.phoneType.value, firstNameCls = '', emailCls = '', phoneCls = '',
            firstNameErr = '', emailErr = '', phoneErr = '', organizationErr = '', contactSelectErr = '', contactSelectCls = '',
            selectServiceCls = "", selectServiceErr = "", selectService = state.selectService, getError = false;

        if (validateInputs('required', (date !== '' ? (date.getDate() + ' ' + date.getMonth()) : '')) === 'empty') {
            dateErr = 'Please select  date.';
            dateCls = error
            getError = true;
        }
        if (!(validThrough && validThrough.value)) {
            validThroughErr = 'Please select  valid for.';
            validThroughCls = error
            getError = true;
        }
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


        if (validateInputs('email', email) === 'empty') {
            emailErr = 'Please enter email.';
            emailCls = error
            getError = true;
        } else if (validateInputs('email', email) === false) {
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
        if (new_contact === "1") {

        } else {
            if (!(contactSelectValue && contactSelectValue.id)) {
                contactSelectErr = 'Please select contact.';
                contactSelectCls = error
                getError = true;
            }
        }

        if (validateInputs('required', state.selectService) === 'empty') {
            selectServiceErr = "Please select Interested In.";
            selectServiceCls = error;
            getError = true;
        }

        setState({
            ...state, dateErr, dateCls, validThroughErr, validThroughCls, quoteNameErr, quoteNameCls, selectServiceCls, selectServiceErr,
            firstNameCls, emailCls, phoneCls, firstNameErr, emailErr, phoneErr, organizationErr, contactSelectCls, contactSelectErr
        })

        if (getError === false && dateErr === "" && validThroughErr === "" && emailErr === '' && firstNameErr === '' && phoneErr === '' && quoteNameErr === '' && contactSelectErr === '' && selectServiceErr === "") {
            setLoader(true);
            let getdate = moment(state.date).format("YYYY-MM-DD")
            let time = state.timeValue ? moment(state.timeValue).format("HH:mm:ss") : moment().format("00:00:00")
            let datetimeA = moment(getdate + " " + time);
            const quoteData = {
                name: quoteName, new_contact, event_location: state.location, event_lat_long: state.lat_long, valid_through: (state.validThrough && state.validThrough.value ? state.validThrough.value : ''),
                first_name: firstName, last_name: lastName, phone_type: phoneType, organization: organization, phone: phone, title: title, email: email, tentative: state.tentative
            };
            if (new_contact === '1') {

            } else {
                if (contactSelectValue && contactSelectValue.id) {
                    quoteData.contact_id = contactSelectValue.id
                }
            }

            if (selectService && selectService.value) {
                quoteData.service_type_id = selectService.value
            }

            if (state.date !== '') {
                quoteData.start_date = moment(datetimeA).format("YYYY-MM-DD HH:mm:ss")
            }
            if (state.selectTemplate && state.selectTemplate.value) {
                quoteData.quote_template_id = state.selectTemplate.value
            }
            if (state.durationValue && state.durationValue.value !== 'Custom') {
                quoteData.event_duration = state.durationValue.value
            } else {
                quoteData.event_duration = state.customDuration
            }
            if (state.quoteId !== '') {
                quoteData.id = state.quoteId
                dispatch(updateBasicQuote(quoteData))
            } else {
                if (state.leadId !== '') {
                    quoteData.lead_id = state.leadId
                }
                dispatch(addQuote(quoteData))
            }
        } else {
            setServiceMessage('Please enter all required details.')
        }
    }

    // On Cancel
    const CancelForm = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: ' You will lose all the changes if you navigate away',
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel it',
            cancelButtonText: 'No, keep it',
            reverseButtons: true,
            showCloseButton: true,
            customClass: "mycustom-alert",
            cancelButtonClass: 'cancel-alert-note',
        }).then((result) => {
            if (result.value) {
                props.history.push(LIST_QUOTES)
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // console.log('cancel')
            }
        })
    }

    // handle selection
    const handleChange = value => {
        setServiceMessage('')
        setTimeout(() => {
            setState({
                ...state, contactSelectValue: value,
                firstName: value && value.first_name ? value.first_name : '',
                lastName: value && value.last_name ? value.last_name : '',
                email: value && value.email ? value.email : '',
                phone: value && value.phone ? value.phone : '',
                organization: value && value.organization ? value.organization : '',
                title: value && value.title ? value.title : '',
                firstNameCls: '', emailCls: '', phoneCls: '', firstNameErr: '', emailErr: '', phoneErr: '',
            })
        }, 0)
    }

    // load options using API call
    const loadOptions = async () => {
        let data = [];
        let listOption = await getContactListOptionValue({ searchField: 'first_name,last_name', fields: 'id,first_name,last_name,organization,title,email,phone', filter: state.contactSelect })
        if (listOption && listOption.data && _.has(listOption.data, 'data') && listOption.success === true) {
            data = listOption.data.data
        }
        return data;
    };

    // handle input change event
    const handleInputChange = value => {
        setState({ ...state, contactSelect: value, contactSelectErr: '', contactSelectCls: '' })
    };

    // Delete Quote Data 
    const deleteQuoteFunction = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this quote?',
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
                dispatch(deleteQuote({ id: state.quoteId }))
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // console.log('cancel')
            }
        })
    }

    // On Change Contact 
    const onchangeContact = (status) => {
        if (status === '1') {
            setState({ ...state, new_contact: status, firstName: '', lastName: '', email: '', phone: '', organization: '', title: '', firstNameCls: '', emailCls: '', phoneCls: '', firstNameErr: '', emailErr: '', phoneErr: '', })
        } else {
            setState({
                ...state, new_contact: status,
                firstName: state.contactSelectValue && state.contactSelectValue.first_name ? state.contactSelectValue.first_name : '',
                lastName: state.contactSelectValue && state.contactSelectValue.last_name ? state.contactSelectValue.last_name : '',
                email: state.contactSelectValue && state.contactSelectValue.email ? state.contactSelectValue.email : '',
                phone: state.contactSelectValue && state.contactSelectValue.phone ? state.contactSelectValue.phone : '',
                phoneType: state.contactSelectValue && state.contactSelectValue.phone_type ? { value: state.contactSelectValue.phone_type, label: state.contactSelectValue.phone_type } : '',
                organization: state.contactSelectValue && state.contactSelectValue.organization ? state.contactSelectValue.organization : '',
                title: state.contactSelectValue && state.contactSelectValue.title ? state.contactSelectValue.title : '',
                firstNameCls: '', emailCls: '', phoneCls: '', firstNameErr: '', emailErr: '', phoneErr: '',
            })

        }
    }

    // Add New Service Data 
    const addNewServiceData = (data) => {
        let allOption = state.servicesListOptions;
        allOption.push(data)
        setState({ ...state, servicesListOptions: allOption })
        setState({ ...state, selectService: data, selectServiceCls: '', selectServiceErr: '' })
    }

    return (
        <>
            <Loader loader={loader} />
            <div className="main-site fixed--header lead-page-hdr unfixed-page-title">
                <Header getMainRoute={'quotes'} />
                <main className="site-body">

                    <section className="page-title contact--header">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-auto title--col">
                                    <div>
                                        <ol className="breadcrumb d-none d-lg-flex">
                                            <li className="breadcrumb-item"><Link to={LIST_QUOTES}>Quotes</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">Create New Quote</li>
                                        </ol>
                                        <h2 className="title">New Quote</h2>
                                    </div>
                                </div>
                                {state.quoteId !== '' ?
                                    <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                        <button type="button" onClick={(e) => deleteQuoteFunction(e)} className="btn btn-danger mr-15">Delete</button>
                                        <button onClick={(e) => CancelForm(e)} className="btn btn-dark mr-15">Cancel</button>
                                        <div className="btn-divider mr-15"></div>
                                        {/* <button onClick={() => saveQuoteData()} className="btn btn-secondary mr-15">Save as Draft</button> */}
                                        <button onClick={() => saveQuoteData()} className="btn btn-primary">Continue</button>
                                        {/*  <div className="dropdown d-lg-none custom-dropdown dropdown-toggle--mbl">
                                            <button className="btn dropdown-toggle " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <img src={setImagePath(MENU_DOTTED)} alt="" />
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                                <a className="dropdown-item" href="#cancel" onClick={(e) => CancelForm(e)}>Cancel</a>
                                                <a className="dropdown-item" href="#delete" onClick={(e) => deleteQuoteFunction(e)}>Delete</a>
                                            </div>
                                        </div> */}
                                    </div>
                                    :
                                    <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                        <button onClick={(e) => CancelForm(e)} className="btn btn-dark mr-15">Cancel</button>
                                        <button onClick={() => saveQuoteData()} className="btn btn-primary">Continue</button>
                                        {/* <div className="dropdown d-lg-none custom-dropdown dropdown-toggle--mbl">
                                            <button className="btn dropdown-toggle " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <img src={setImagePath(MENU_DOTTED)} alt="" />
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                                <a className="dropdown-item" href="#cancel" onClick={(e) => CancelForm(e)}>Cancel</a>
                                            </div>
                                        </div> */}
                                    </div>
                                }
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
                                                        <div className="timeline-cols active"><h5><em className="d-none d-lg-flex">1. Basic Details</em> <i className="d-lg-none">1</i></h5><span></span></div>
                                                        <div className="timeline-cols"><h5><em className="d-none d-lg-flex">2. Quote Details</em> <i className="d-lg-none">2</i></h5><span></span></div>
                                                        <div className="timeline-cols"><h5><em className="d-none d-lg-flex">3. Preview Quote</em> <i className="d-lg-none">3</i></h5><span></span></div>
                                                        <div className="timeline-cols"><h5><em className="d-none d-lg-flex">4. Message to Customer</em> <i className="d-lg-none">4</i></h5><span></span></div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row no-gutters-mbl mt-3">
                                <div className="col-lg-6">
                                    <div className="main-card create-qoute--cards">
                                        <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#QuoteCollapse" aria-expanded="true" aria-controls="QuoteCollapse">Quote Details <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                        <div className={"card main-card--collapse show " + isCollapse} id="QuoteCollapse">
                                            <div className="card-header py-3 d-none d-lg-flex justify-content-between align-items-center">
                                                <h5>Quote</h5>
                                            </div>
                                            <div className="card-body pt-lg-0 pb-0">

                                                <form className="p-lg-2  px-4 py-lg-2">
                                                    <div className="row">
                                                        <div className="form-group col-md-10">
                                                            <div className={"floating-label " + state.quoteNameCls}>
                                                                <input placeholder="Event, Service, Customer name etc." type="text" name="quoteName" value={state.quoteName || ''} onChange={(e) => setInputValue(e, 'string', 50, null)} className="floating-input" />
                                                                <label>Quote Name *</label>
                                                                {state.quoteNameErr ? <span className="errorValidationMessage"> {state.quoteNameErr}</span> : ''}
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-8">
                                                            <div className={"floating-label " + state.selectServiceCls}>
                                                                {/* <label>Interested in </label> */}
                                                                <Select
                                                                    styles={selectStyle}
                                                                    className="floating-select"
                                                                    placeholder="Service/Package Name *"
                                                                    components={{ MenuList: addExtraService, ValueContainer: CustomValueContainer, NoOptionsMessage: () => null }}
                                                                    options={state.servicesListOptions}
                                                                    value={state.selectService}
                                                                    /* menuIsOpen={true} */
                                                                    onChange={(data) => setState({ ...state, selectService: data, selectServiceCls: '', selectServiceErr: '' })}
                                                                />
                                                                {state.selectServiceErr ? <span className="errorValidationMessage"> {state.selectServiceErr}</span> : ''}
                                                            </div>
                                                            <p className="mb-0"><strong>Note:</strong> For your purpose only, not shared with customer.</p>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <div className={"floating-label " + state.validThroughCls}>
                                                                <Select
                                                                    styles={selectStyle}
                                                                    className="floating-select"
                                                                    components={{ ValueContainer: CustomValueContainer }}
                                                                    placeholder="Valid For *"
                                                                    value={state.validThrough}
                                                                    isSearchable={false}
                                                                    options={state.validThrouhOptions}
                                                                    onChange={(data) => {
                                                                        setState({ ...state, validThrough: data, validThroughCls: '', validThroughErr: '' });
                                                                        setServiceMessage('')
                                                                    }}
                                                                />
                                                                {state.validThroughErr ? <div className="quoteDepositErr"> {state.validThroughErr}</div> : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="main-card create-qoute--cards">
                                        <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#EventCollapse" aria-expanded="true" aria-controls="EventCollapse">Service Date & Locatio <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                        <div className={"card main-card--collapse show " + isCollapse} id="EventCollapse">
                                            <div className="card-header py-3 d-none d-lg-flex justify-content-between align-items-center">
                                                <h5>Service Date & Location </h5>
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" onChange={(e) => setState({...state, tentative: e.target.checked})} checked={state.tentative} className="custom-control-input" id="customCheck3" />
                                                    <label className="custom-control-label" htmlFor="customCheck3"> <strong>Tentative</strong></label>
                                                </div>
                                            </div>
                                            <div className="card-body pt-lg-0 pb-0">

                                                <form className="p-lg-2 px-4 py-lg-2">
                                                    <div className="row">
                                                        <div className="form-group col-md-4">
                                                            <div className={"floating-label " + state.dateCls}>
                                                                <DatePicker
                                                                    type="text"
                                                                    name="date"
                                                                    className={state.dateCls ? "floating-input " + state.dateCls : "floating-input"}
                                                                    selected={state.date}
                                                                    onChange={(date) => dateForBooking(date)}
                                                                    minDate={moment().toDate()}
                                                                    placeholderText="Date *"
                                                                    ref={datepickerRef}
                                                                    autoComplete="off"
                                                                />
                                                                <div onClick={() => showTimeSelection()} className="input-calendar-icon"><img src={CALENDAR} alt="" width="20" height="20" /></div>
                                                                {state.dateErr ? <span className="errorValidationMessage"> {state.dateErr}</span> : ''}
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <div className="floating-label my-custom-time-input">
                                                                <DatePicker
                                                                    selected={state.timeValue}
                                                                    onChange={date => setState({ ...state, timeValue: date })}
                                                                    showTimeSelect
                                                                    showTimeSelectOnly
                                                                    fixedHeight
                                                                    timeIntervals={30}
                                                                    dateFormat="h:mm a"
                                                                    className="floating-input"
                                                                    onKeyDown={e => e.preventDefault()}
                                                                    placeholderText="Start Time"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="form-group col-md-4">
                                                            <div className="floating-label">
                                                                <Select
                                                                    styles={selectStyle}
                                                                    className="floating-select"
                                                                    components={{ ValueContainer: CustomValueContainer }}
                                                                    value={state.durationValue}
                                                                    isSearchable={false}
                                                                    options={state.durationOptions}
                                                                    placeholder="Duration"
                                                                    onChange={(data) => {
                                                                        setState({ ...state, durationValue: data });
                                                                    }}
                                                                />
                                                                {/* <label>Duration</label> */}
                                                            </div>
                                                        </div>

                                                        {state.durationValue && state.durationValue.value === "Custom" ?
                                                            <div className="form-group col-md-5">
                                                                <div className={"floating-label " + state.customDurationCls}>
                                                                    <input
                                                                        placeholder="Custom Duration"
                                                                        type="text"
                                                                        name="customDuration"
                                                                        className="floating-input"
                                                                        value={state.customDuration || ""}
                                                                        onChange={(e) => setState({ ...state, customDuration: e.target.value })}
                                                                    />
                                                                    <label>Custom Duration</label>
                                                                </div>
                                                            </div> : ''}

                                                        <div className={state.durationValue && state.durationValue.value === "Custom" ? "form-group col-md-7" : "form-group col-md-12"}>
                                                            <PlacesAutocomplete
                                                                value={state.location}
                                                                onChange={handleChangeGoogle}
                                                                onSelect={handleSelectGoogle}
                                                            >
                                                                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                                    <div className="floating-label " >
                                                                        <input
                                                                            {...getInputProps({
                                                                                placeholder: 'Name of the location, Extract address etc.',
                                                                                className: 'location-search-input floating-input',
                                                                            })}
                                                                        />
                                                                        <label>Location</label>
                                                                        <div className="autocomplete-dropdown-container">
                                                                            {loading && <div>Loading...</div>}
                                                                            {suggestions.map((suggestion, key) => {
                                                                                const className = suggestion.active
                                                                                    ? 'suggestion-item--active'
                                                                                    : 'suggestion-item';
                                                                                // inline style for demonstration purpose
                                                                                const style = suggestion.active
                                                                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                                                return (
                                                                                    <div
                                                                                        {...getSuggestionItemProps(suggestion, {
                                                                                            className,
                                                                                            style,
                                                                                        })}
                                                                                        key={key}
                                                                                    >
                                                                                        <span>{suggestion.description}</span>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </PlacesAutocomplete>
                                                        </div>

                                                    </div>
                                                </form>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="row no-gutters-mbl mt-lg-4">
                                <div className="col-lg-12">
                                    <div className="main-card">
                                        <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#contactDetail" aria-expanded="true" aria-controls="contactDetail">Contact Details <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                        <div className={"card main-card--collapse show " + isCollapse} id="contactDetail">
                                            <div className="card-header py-4  padd0 d-flex justify-content-between align-items-center">
                                                <h2>Customer</h2>
                                            </div>
                                            <div className="card-body pt-0 pb-0">

                                                <form className="px-3">
                                                    <div className="row">
                                                        <div className="form-group  col-lg-4 col-md-6 mb-lg-5">
                                                            {/* <label className="single-label">Event Type</label> */}
                                                            <div className="custom-control custom-radio custom-control-inline">
                                                                <input className="custom-control-input" onChange={() => onchangeContact('1')} checked={state.new_contact === '1' ? true : false} type="radio" name="new_contact" id="newRadio" value="1" />
                                                                <label className="custom-control-label" htmlFor="newRadio">New</label>
                                                            </div>
                                                            <div className="custom-control custom-radio custom-control-inline">
                                                                <input className="custom-control-input" onChange={() => onchangeContact('0')} checked={state.new_contact === '0' ? true : false} type="radio" name="new_contact" id="existingRadio" value="0" />
                                                                <label className="custom-control-label" htmlFor="existingRadio">Select Existing</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {state.new_contact === '1'
                                                        ?
                                                        ''
                                                        :
                                                        <div className="row">
                                                            <div className="form-group col-lg-4 col-md-6 mb-lg-5">
                                                                <div className={"floating-label " + state.contactSelectCls}>
                                                                    <AsyncSelect
                                                                        className="floating-input"
                                                                        styles={selectStyle}
                                                                        onFocus={e => {
                                                                            if (e.target.autocomplete) {
                                                                                e.target.autocomplete = "nope";
                                                                            }
                                                                        }}
                                                                        isClearable
                                                                        placeholder=""
                                                                        noOptionsMessage={() => "No results found"}
                                                                        value={state.contactSelectValue}
                                                                        getOptionLabel={e => e.first_name + (e && e.last_name ? " " + e.last_name : '')}
                                                                        getOptionValue={e => e.id}
                                                                        loadOptions={(e) => loadOptions(e)}
                                                                        onInputChange={(e) => handleInputChange(e)}
                                                                        onChange={(e) => handleChange(e)}
                                                                        
                                                                    />
                                                                    <label>Type here to search</label>
                                                                    {state.contactSelectErr ? <span className="errorValidationMessage"> {state.contactSelectErr}</span> : ''}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                    <div className="row">
                                                        <div className="form-group col-lg-4 col-md-6 mb-lg-5">
                                                            <div className={"floating-label " + state.firstNameCls}>
                                                                <input placeholder="First Name *" type="text" name="firstName" value={state.firstName || ''} onChange={(e) => setInputValue(e, 'string', 50, null)} className="floating-input" />
                                                                <label>First Name *</label>
                                                                {state.firstNameErr ? <span className="errorValidationMessage"> {state.firstNameErr}</span> : ''}
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-lg-4 col-md-6 mb-lg-5">
                                                            <div className="floating-label">
                                                                <input placeholder="Last Name" type="text" name="lastName" value={state.lastName || ''} onChange={(e) => { setState({ ...state, lastName: e.target.value }); setServiceMessage('') }} className="floating-input" />
                                                                <label>Last Name</label>
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-lg-4 col-md-6 mb-lg-5">
                                                            <div className={"floating-label " + state.emailCls}>
                                                                <input placeholder="Email Address *" type="email" name="email" value={state.email || ''} onChange={(e) => setInputValue(e, 'email', null, null)} className="floating-input" />
                                                                <label>Email Address *</label>
                                                                {state.emailErr ? <span className="errorValidationMessage"> {state.emailErr}</span> : ''}
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-lg-4 col-md-6 mb-lg-2">
                                                            <div className="form-row">
                                                                <div className="col-5">
                                                                    <div className="floating-label">
                                                                        <Select
                                                                            styles={selectStyle}
                                                                            className="floating-select"
                                                                            value={state.phoneType}
                                                                            isSearchable={false}
                                                                            components={{ ValueContainer: CustomValueContainer }}
                                                                            defaultValue={state.phoneType}
                                                                            options={phoneTypeOptions}
                                                                            placeholder="Phone Type"
                                                                            onChange={data => { setState({ ...state, phoneType: data }); setServiceMessage('') }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className={"floating-label " + state.phoneCls}>
                                                                        <input placeholder="Phone Number" type="text" name="phone" value={state.phone || ''} onChange={(e) => { setState({ ...state, phone: e.target.value, phoneCls: '', phoneErr: '' }); setServiceMessage('') }} className="floating-input" />
                                                                        <label>Phone Number</label>
                                                                        {state.phoneErr ? <span className="errorValidationMessage"> {state.phoneErr}</span> : ''}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-lg-4 col-md-6 mb-lg-2">
                                                            <div className="floating-label">
                                                                <input placeholder="Organization Name" type="text" name="organization" value={state.organization || ''} onChange={(e) => { setState({ ...state, organization: e.target.value }); setServiceMessage('') }} className="floating-input" />
                                                                <label>Organization Name</label>
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-lg-4 col-md-6 mb-lg-2">
                                                            <div className="floating-label">
                                                                <input placeholder="Title" type="text" name="title" value={state.title || ''} onChange={(e) => { setState({ ...state, title: e.target.value }); setServiceMessage('') }} className="floating-input" />
                                                                <label>Title</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Add Organization*/}
                    <AddOrganization loader={(data) => setLoader(data)}
                        openOrg={businessProfileModalShow}
                        sentToCustomerCall={(data) => saveQuoteData()}
                        closeOrg={() => setBusinessProfileModalShow(false)}
                    />

                    {/* Add Service Modal*/}
                    <AddService loader={(data) => setLoader(data)}
                        openService={serviceModalShow}
                        addServiceInList={(data) => addNewServiceData(data)}
                        closeService={() => setServiceModalShow(false)}
                    />
                </main>
                <Footer />
            </div >
        </>
    );
}

export const AddBasicQuote = withRouter(NewAddBasicQuote)