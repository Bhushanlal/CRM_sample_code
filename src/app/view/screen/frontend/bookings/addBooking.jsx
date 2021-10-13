import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Header } from "../../../component/frontend/header/header";
import { Footer } from "../../../component/frontend/auth/footer/footer";
import { LIST_BOOKINGS, VIEW_BOOKING_BASE, VIEW_CONTACT_BASE } from "../../../../routing/routeContants";
import { fieldValidator, usePrevious } from "../../../../common/custom";
import { constants, selectStyle, CustomValueContainer } from "../../../../common/constants";
import { validateInputs } from "../../../../common/validation";
import { addBooking, getBookingById, updateBooking } from "../../../../duck/booking/booking.action";
import { addContact } from '../../../../duck/contact/contact.action';
import history from "../../../../routing/history";
import ERROR_ICON from "../../../../assets/images/error-icn.svg";
import ORANGE_ARROW from "../../../../assets/images/orange-arrow.svg";
import CALENDAR from "../../../../assets/images/calendar.png"
import _ from "lodash";
import Swal from "sweetalert2";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { getContactListOptionValue } from '../../../../../api/sdk/contact';
import AsyncSelect from 'react-select/async';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import { addService, listServiceWithSource, addSource } from '../../../../duck/lead/lead.action';
import Modal from "react-bootstrap/Modal";
import { setImagePath } from '../../../../common/custom'
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import { Loader } from '../../../component/frontend/loader/loader'

export const AddBooking = (props) => {
    let bookingId;
    if (props.match && _.has(props.match, "params") && _.has(props.match.params, "id")) {
        bookingId = props.match.params.id;
    }
    const handleChangeGoogle = address => {
        setState({ ...state, address: address })
    };

    const handleSelectGoogle = async (address) => {
        /* geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => console.log('Success', latLng))
            .catch(error => console.error('Error', error)); */
        const results = await geocodeByAddress(address);
        const latLng = await getLatLng(results[0]);
        let data = { lat: latLng.lat, lng: latLng.lng, place_id: results[0].place_id };
        setState({ ...state, address: address, lat_long: JSON.stringify(data) })
    };

    const dispatch = useDispatch();
    const datepickerRef = useRef();
    const [isCollapse, setIsCollapse] = useState('');
    const addBookingData = useSelector((state) => state.booking.addBookingData);
    const getBookingByIdData = useSelector((state) => state.booking.getBookingByIdData);

    const prevGetBookingByIdData = usePrevious({ getBookingByIdData });
    const prevAddBookingData = usePrevious({ addBookingData });

    // Set initial State Value
    const phoneTypeOptions = [{ value: 'Mobile', label: 'Mobile' }, { value: 'Work', label: 'Work' }, { value: 'Home', label: 'Home' }];
    const [state, setState] = useState({
        address: '', firstName: '', bookingName: '', lastName: '', email: '', phone: '', organization: '', title: '', phoneType: { value: 'Mobile', label: 'Mobile' },
        firstNameCls: '', firstNameErr: '', bookingNameCls: '', bookingNameErr: '', emailCls: '', emailErr: '', phoneCls: '', phoneErr: '', total: '', totalErr: '', totalCls: '', contactId: '',
        depositReceived: '', depositReceivedErr: '', depositReceivedCls: '', eventType: 'Private', eventTypeCls: '', eventTypeErr: '', date: '', dateErr: '', dateCls: '', selectSource: '', selectService: '', selectServiceCls: '', selectServiceErr: '',
        new_contact: '1', contactSelect: '', contactSelectValue: '', correctInput: '', wrongInput: constants.WRONG_INPUT, timeValue: '', moreInformation: '', location: '',
        timeShiftValue: { value: 'AM', label: "AM" }, timeShiftOptions: [{ value: "AM", label: "AM" }, { value: "PM", label: "PM" }], sourceReferValue: '',
        durationValue: { value: "1 Hours", label: "1 Hours" }, durationOptions: [
            { value: "1 Hours", label: "1 Hours" },
            { value: "2 Hours", label: "2 Hours" },
            { value: "3 Hours", label: "3 Hours" },
            { value: "Half Day", label: "Half Day" },
            { value: "Full Day", label: "Full Day" },
            { value: "Custom", label: "Custom" },
            { value: "N/A", label: "N/A" }
        ],
        customDuration: '', lat_long: '', showTime: false, virtualEvent: false, meetingId: '', passcode: ''
    });
    const [loader, setLoader] = useState(false);
    const [serviceMessage, setServiceMessage] = useState("");


    // Add Service State And Props
    const [serviceModalShow, setServiceModalShow] = useState(false);
    const [serviceState, setServiceState] = useState({
        service: '', serviceCls: '', serviceErr: '', servicesListOptions: [],
    });
    const addServiceData = useSelector(state => state.lead.addServiceData);
    const prevAddServiceData = usePrevious({ addServiceData });
    const listServiceWithSourceData = useSelector(state => state.lead.listServiceWithSourceData);
    const prevListServiceWithSourceData = usePrevious({ listServiceWithSourceData });

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

    const addExtraService = ({ innerRef, innerProps, isDisabled, children }) =>
        !isDisabled ? (
            <div ref={innerRef} {...innerProps} className="customReactSelectMenu">
                {children}
                <button type="button" className="btn text-link text-left btn-sm btn-block"
                    onClick={(e) => showServiceModal()} >Add New Services</button>
            </div>
        ) : null;


    // Add Source State And Props
    const [sourceModalShow, setSourceModalShow] = useState(false);
    const [sourceMessage, setSourceMessage] = useState('');
    const [sourceState, setSourceState] = useState({
        source: '', sourceCls: '', sourceErr: '', sourceListOptions: [],
    });
    const addSourceData = useSelector(state => state.lead.addSourceData);
    const prevAddSourceData = usePrevious({ addSourceData });

    const addExtraSource = ({ innerRef, innerProps, isDisabled, children }) =>
        !isDisabled ? (
            <div ref={innerRef} {...innerProps} className="customReactSelectMenu">
                {children}
                <button type="button" className="btn text-link text-left btn-sm btn-block"
                    onClick={(e) => showSourceModal()} >Add New Lead Sources</button>
            </div>
        ) : null;


    // Add refer contact State And Props
    const [referContactShow, setReferContactModalShow] = useState(false);
    const [referState, setReferState] = useState({
        firstName: '', lastName: '', email: '', phone: '', organization: '', title: '', phoneType: { value: 'Mobile', label: 'Mobile' },
        firstNameCls: '', emailCls: '', phoneCls: '', firstNameErr: '', emailErr: '', phoneErr: '', service_type_id: '',
        correctInput: '', wrongInput: constants.WRONG_INPUT, referBySelect: '', referContactType: '1', radiotype: ''
    });

    const [referServiceMessage, setReferServiceMessage] = useState('');
    const addContactData = useSelector(state => state.contact.addContactData);
    const prevAddContactData = usePrevious({ addContactData });
    // Check Validation Function
    const checkValidation = (field, value, type, maxLength, minLength) => {
        return fieldValidator(field, value, type, null, maxLength, minLength);
    };

    // Set The Login Input Values
    const setInputValue = (e, type, maxLength, minLength) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
        setState({ ...state, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        setServiceMessage('');
    }

    // Set The Login Input Values
    const setReferInputValue = (e, type, maxLength, minLength) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
        setReferState({ ...referState, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        setServiceMessage('');
    }

    // set date for booking 
    const dateForBooking = (date) => {
        if (date === null) {
            setState({ ...state, date: '', dateCls: state.wrongInput, dateErr: 'Please select date', showTime: false })
        } else {
            setState({ ...state, date: date, dateCls: '', dateErr: '', showTime: false })
        }
        setServiceMessage('');
    }

    // On Load Get Data
    useEffect(() => {
        setLoader(true)
        dispatch(listServiceWithSource())
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // List Service and source Data 
    useEffect(() => {
        if (prevAddServiceData && prevAddServiceData.addServiceData !== addServiceData) {
            if (addServiceData && _.has(addServiceData, 'data') && addServiceData.success === true) {
                if (addServiceData.data && addServiceData.data.id) {
                    let allOption = serviceState.servicesListOptions;
                    let data = { value: addServiceData.data.id, label: addServiceData.data.name }
                    allOption.push(data)
                    setServiceState({ ...serviceState, servicesListOptions: allOption })
                    setState({ ...state, selectService: data })
                }
                setServiceModalShow(false)
                setLoader(false)
            }
            if (addServiceData && _.has(addServiceData, 'message') && addServiceData.success === false) {
                setLoader(false)
                // setServiceOptionMessage(addServiceData.message)
            }
        }
        if (prevAddSourceData && prevAddSourceData.addSourceData !== addSourceData) {
            if (addSourceData && _.has(addSourceData, 'data') && addSourceData.success === true) {
                if (addSourceData.data && addSourceData.data.id) {
                    let allOption = sourceState.sourceListOptions;
                    let data = { value: addSourceData.data.id, label: addSourceData.data.name }
                    allOption.push(data)
                    setSourceState({ ...sourceState, sourceListOptions: allOption })
                    setState({ ...state, selectSource: data })
                }
                setSourceModalShow(false)
                setLoader(false)
            }
            if (addSourceData && _.has(addSourceData, 'message') && addSourceData.success === false) {
                setLoader(false)
                setSourceMessage(addSourceData.message)
            }
        }
        if (prevListServiceWithSourceData && prevListServiceWithSourceData.listServiceWithSourceData !== listServiceWithSourceData) {
            if (listServiceWithSourceData && _.has(listServiceWithSourceData, 'data') && listServiceWithSourceData.success === true) {
                setLoader(false)
                setServiceModalShow(false)
                setSourceModalShow(false)
                let serviceOption = _.map(listServiceWithSourceData.data.service_types, (data) => { return { value: data.id, label: data.name } })
                let sourceOption = _.map(listServiceWithSourceData.data.source_types, (data) => { return { value: data.id, label: data.name } })
                sourceOption.push({ value: 'referral', label: 'Referral' }, { value: 'website', label: 'External Website' }, { value: 'My Website', label: 'My Website' })
                _.remove(serviceOption, function (opt) {
                    return opt.label === "Magic and Comedy Show (sample)";
                });
                setServiceState({ ...serviceState, servicesListOptions: serviceOption })
                setSourceState({ ...sourceState, sourceListOptions: sourceOption })

            }
            if (listServiceWithSourceData && _.has(listServiceWithSourceData, 'message') && listServiceWithSourceData.success === false) {
                setLoader(false)
                setServiceModalShow(false)
                setSourceModalShow(false)
            }
        }
        if (prevAddContactData && prevAddContactData.addContactData !== addContactData) {
            if (addContactData && _.has(addContactData, 'data') && addContactData.success === true) {
                setServiceMessage('')
                setLoader(false)
                setState({ ...state, sourceReferValue: addContactData.data })
                setReferContactModalShow(false)

            }
            if (addContactData && _.has(addContactData, 'message') && addContactData.success === false) {
                setReferServiceMessage(addContactData.message)
                setLoader(false)
            }
        }

    }, [listServiceWithSourceData, prevListServiceWithSourceData, addServiceData, prevAddServiceData, addSourceData, prevAddSourceData, prevAddContactData, addContactData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Show Service 
    const showServiceModal = () => {
        setServiceModalShow(true);
        setServiceMessage('');
        //setTimeout(function () { textAreaRef.current.focus(); }, 300);
        setServiceState({ ...serviceState, service: '', serviceCls: '', serviceErr: '', serviceId: '' })
    }

    // Set The Service Values
    const setServiceValue = (e, type, maxLength, minLength) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
        setServiceState({ ...serviceState, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        setServiceMessage('');
    }

    // Save Service Data
    const saveServiceData = () => {
        let success = '';
        let error = state.wrongInput;
        let service = serviceState.service, serviceErr = '', serviceCls = success, getError = false;

        if (validateInputs('required', service) === 'empty') {
            serviceErr = 'Please enter service.';
            serviceCls = error
            getError = true;
        }

        setServiceState({
            ...serviceState, serviceCls, serviceErr
        })

        if (getError === false && serviceErr === '') {
            setLoader(true)
            dispatch(addService({ name: service }))
        }
    }


    // Show Source 
    const showSourceModal = () => {
        setSourceModalShow(true);
        setSourceMessage('');
        //setTimeout(function () { textAreaRef.current.focus(); }, 300);
        setSourceState({ ...sourceState, source: '', sourceCls: '', sourceErr: '' })
    }

    // Set The Source Values
    const setSourceValue = (e, type, maxLength, minLength) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
        setSourceState({ ...sourceState, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        setSourceMessage('');
    }

    // Save Source Data
    const saveSourceData = () => {
        let success = '';
        let error = state.wrongInput;
        let source = sourceState.source, sourceErr = '', sourceCls = success, getError = false;

        if (validateInputs('required', source) === 'empty') {
            sourceErr = 'Please enter source.';
            sourceCls = error
            getError = true;
        }

        setSourceState({
            ...sourceState, sourceCls, sourceErr
        })

        if (getError === false && sourceErr === '') {
            setLoader(true)
            dispatch(addSource({ name: source }))
        }
    }


    useEffect(() => {
        if (bookingId) {
            dispatch(getBookingById({ id: bookingId }));
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // get booking by id
    useEffect(() => {
        if (prevGetBookingByIdData && prevGetBookingByIdData.getBookingByIdData !== getBookingByIdData) {
            if (getBookingByIdData && _.has(getBookingByIdData, "data") && getBookingByIdData.success === true) {
                setLoader(false);
                let sourceTypeValue;
                if (getBookingByIdData.data.referred_by && getBookingByIdData.data.referred_by.id) {
                    sourceTypeValue = { value: 'referral', label: 'Referral' }
                }
                if (getBookingByIdData.data.website && getBookingByIdData.data.website !== null) {
                    if (getBookingByIdData.data.website === 'My Website') {
                        sourceTypeValue = { value: 'My Website', label: 'My Website' }
                    } else {
                        sourceTypeValue = { value: 'website', label: 'External Website' }
                    }
                }

                if (getBookingByIdData.data.source_type && getBookingByIdData.data.source_type.id) {
                    sourceTypeValue = { value: getBookingByIdData.data.source_type.id, label: getBookingByIdData.data.source_type.name }
                }
                let durationValue, customDuration;
                if (_.some(state.durationOptions, { value: getBookingByIdData.data.duration, label: getBookingByIdData.data.duration })) {
                    durationValue = { value: getBookingByIdData.data.duration, label: getBookingByIdData.data.duration };
                    customDuration = ''
                } else {
                    if (getBookingByIdData.data.duration !== null) {
                        durationValue = { value: 'Custom', label: 'Custom' }
                        customDuration = getBookingByIdData.data.duration
                    } else {
                        durationValue = ''
                    }
                }

                setState({
                    ...state,
                    eventType: getBookingByIdData.data.event_type, moreInformation: getBookingByIdData.data.detail,
                    website: getBookingByIdData.data.website !== null ? getBookingByIdData.data.website : '',
                    address: getBookingByIdData.data.location, date: new Date(getBookingByIdData.data.start_date), timeValue: new Date(getBookingByIdData.data.start_date),
                    total: getBookingByIdData.data.amount, depositReceived: getBookingByIdData.data.received_amount, contactId: getBookingByIdData.data.contact.id,
                    new_contact: getBookingByIdData.data.contact && getBookingByIdData.data.contact.id ? '0' : '1',
                    contactSelectValue: getBookingByIdData.data.contact && getBookingByIdData.data.contact.id ? getBookingByIdData.data.contact : '',
                    selectService: getBookingByIdData.data.service_type && getBookingByIdData.data.service_type.id ? { value: getBookingByIdData.data.service_type.id, label: getBookingByIdData.data.service_type.name } : '',
                    referBySelectValue: (getBookingByIdData.data && getBookingByIdData.data.referred_by !== null ? getBookingByIdData.data.referred_by : ''),
                    selectSource: sourceTypeValue, bookingName: getBookingByIdData.data.name,
                    sourceReferValue: getBookingByIdData.data.referred_by && getBookingByIdData.data.referred_by.id ? getBookingByIdData.data.referred_by : '',
                    lat_long: getBookingByIdData.data.lat_long !== null ? getBookingByIdData.data.lat_long : '',
                    virtualEvent: getBookingByIdData.data.virtual_event === 0 ? false : true,
                    meetingId: getBookingByIdData.data.meeting_id !== null ? getBookingByIdData.data.meeting_id : '',
                    passcode: getBookingByIdData.data.passcode !== null ? getBookingByIdData.data.passcode : '',
                    durationValue, customDuration,
                    // firstNameInformation: (getContactByIdData.data && getContactByIdData.data.first_name_information !== null ? getContactByIdData.data.first_name_information : ''),
                    // title: (getContactByIdData.data && getContactByIdData.data.title !== null ? getContactByIdData.data.title : ''),
                })
            }
            if (getBookingByIdData && _.has(getBookingByIdData, "message") && getBookingByIdData.success === false) {
                setLoader(false);
            }
        }
    }, [getBookingByIdData, prevGetBookingByIdData]); // eslint-disable-line react-hooks/exhaustive-deps


    // After Save Check Booking Data
    useEffect(() => {
        if (prevAddBookingData && prevAddBookingData.addBookingData !== addBookingData) {
            if (addBookingData && _.has(addBookingData, "data") && addBookingData.success === true) {
                setServiceMessage("");
                setLoader(false);
                if (bookingId) {
                    props.history.push(VIEW_BOOKING_BASE + bookingId)
                } else {
                    history.push(VIEW_BOOKING_BASE + addBookingData.data.id);
                }
            }
            if (addBookingData && _.has(addBookingData, "message") && addBookingData.success === false) {
                setServiceMessage(addBookingData.message);
                setLoader(false);
            }
        }
    }, [addBookingData, prevAddBookingData]); // eslint-disable-line react-hooks/exhaustive-deps

    // Submit Booking Function
    const saveBookingData = () => {
        let success = "";
        let error = state.wrongInput;
        let firstName = state.firstName, bookingName = state.bookingName, lastName = state.lastName, email = state.email, phone = state.phone, organization = state.organization,
            title = state.title, phoneType = state.phoneType && state.phoneType.value, firstNameCls = success, emailCls = "", phoneCls = "", firstNameErr = "", emailErr = "", phoneErr = "",
            organizationErr = "", getError = false,  date = state.date, dateErr = '', dateCls = '', selectServiceCls = "", selectServiceErr = "", selectService = state.selectService && state.selectService.value ? state.selectService.value : "", depositReceived = state.depositReceived, total = state.total,
            totalCls = '', totalErr = '', durationValue = state.durationValue, timeValue = state.timeValue, timeShiftValue = state.timeShiftValue && state.timeShiftValue.value ? state.timeShiftValue.value : '', new_contact = state.new_contact, depositReceivedCls = "", depositReceivedErr = "",
            bookingNameCls = '', bookingNameErr = '', address = state.address, addressErr = '', addressCls = '';
        let getdate = moment(date).format("YYYY-MM-DD")
        let time = timeValue ? moment(timeValue).format("HH:mm:ss") : moment().format("00:00:00")
        let datetimeA = moment(getdate + " " + time);

        if (state.virtualEvent) {
            if (validateInputs('required', address) === 'empty') {
                addressErr = 'Please enter virtual event url.';
                addressCls = error
                getError = true;
            } else if (validateInputs('required', address) === false) {
                addressErr = 'Please enter valid virtual event url.';
                addressCls = error
                getError = true;
            } else if (address.length > 100) {
                addressErr = 'Please enter maximum 100 characters.';
                addressCls = error
                getError = true;
            }
        }

        if (new_contact === "1") {
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

            if (validateInputs('string', bookingName) === 'empty') {
                bookingNameErr = 'Please enter booking name.';
                bookingNameCls = error
                getError = true;
            } else if (validateInputs('string', bookingName) === false) {
                bookingNameErr = 'Please enter valid booking name.';
                bookingNameCls = error
                getError = true;
            } else if (bookingName.length > 50) {
                bookingNameErr = 'Please enter maximum 50 characters.';
                bookingNameCls = error
                getError = true;
            }


            if (validateInputs('phoneNumberHyphon', phone) === false) {
                phoneErr = 'Please enter valid phone.';
                phoneCls = error
                getError = true;
            }
            if (phone && phone.length > 1 && phone.length > 15) {
                phoneErr = "Please enter maximum 15 digits.";
                phoneCls = error;
                getError = true;
            }
        }

        if (validateInputs("email", email) === false) {
            emailErr = "Please enter valid email.";
            emailCls = error;
            getError = true;
        }

        if (validateInputs('required', (date !== '' ? (date.getDate() + ' ' + date.getMonth()) : '')) === 'empty') {
            dateErr = 'Please select  date.';
            dateCls = error
            getError = true;
        }
        if (validateInputs('required', state.selectService) === 'empty') {
            selectServiceErr = "Please select one.";
            selectServiceCls = error;
            getError = true;
        }
        if (state.total && state.total !== "") {
            if (validateInputs('positiveNumberWithDecimals', state.total) === false) {
                totalErr = 'Please enter valid total value.';
                totalCls = error
                getError = true;
            }
            if (state.total && state.total.length > 1 && state.total.length > 11) {
                totalErr = 'Please enter maximum 10 digits.';
                totalErr = error
                getError = true;
            }
        }
        if (state.depositReceived && state.depositReceived !== "") {
            if (validateInputs('positiveNumberWithDecimals', state.depositReceived) === false) {
                depositReceivedErr = 'Please enter valid Deposit Received value.';
                depositReceivedCls = error
                getError = true;
            }
            if (state.depositReceived && state.depositReceived.length > 1 && state.depositReceived.length > 11) {
                depositReceivedErr = 'Please enter maximum 10 digits.';
                depositReceivedErr = error
                getError = true;
            }
        }

        setState({
            ...state, firstNameCls, emailCls, phoneCls, firstNameErr, emailErr, phoneErr, organizationErr, dateErr,
            dateCls, selectServiceCls, selectServiceErr, totalCls, totalErr, depositReceivedCls,
            depositReceivedErr, bookingNameCls, bookingNameErr, addressErr, addressCls
        });

        if (
            getError === false && emailErr === "" && firstNameErr === "" && phoneErr === "" && dateErr === "" &&
            selectServiceErr === "" && totalErr === "" && depositReceivedErr === "" && bookingNameErr === ""
        ) {
            setLoader(true);
            let bookingData = {
                name: bookingName,
                start_date: moment(datetimeA).format("YYYY-MM-DD HH:mm:ss"),
                service_type_id: selectService,
                event_type: state.eventType,
                received_amount: depositReceived,
                amount: total,
                location: state.address,
                detail: state.moreInformation,
                timeShiftValue: timeShiftValue,
                new_contact: new_contact,
                booking_source_type: state.booking_source_type,
                booking_source_value: state.booking_source_value,
                lat_long: state.lat_long,
                virtual_event: state.virtualEvent ? 1 : 0,
                meeting_id: state.meetingId,
                passcode: state.passcode,
            };

            if (durationValue && durationValue.value !== 'Custom') {
                bookingData.duration = durationValue.value
            } else {
                bookingData.duration = state.customDuration
            }

            if (state.selectSource && state.selectSource.value) {
                if (state.selectSource.value === 'referral' || state.selectSource.value === 'website' || state.selectSource.value === 'My Website') {
                    if (state.selectSource.value === 'My Website') {
                        bookingData.booking_source_type = 'website';
                        bookingData.booking_source_value = 'My Website';
                    } else {
                        bookingData.booking_source_type = state.selectSource.value;
                    }
                    if (state.selectSource.value === 'website') {
                        bookingData.booking_source_value = state.website
                    }
                    if (state.selectSource.value === 'referral' && state.sourceReferValue && state.sourceReferValue.id) {
                        bookingData.booking_source_value = state.sourceReferValue.id
                    }
                } else {
                    bookingData.booking_source_type = 'source';
                    bookingData.booking_source_value = state.selectSource.value;
                }
            }


            if (state.referBySelectValue && state.referBySelectValue.id) {
                bookingData.referred_by = state.referBySelectValue.id;
            }

            if (new_contact === '1') {
                bookingData.first_name = firstName
                bookingData.last_name = lastName
                bookingData.phone_type = phoneType
                bookingData.organization = organization
                bookingData.phone = phone
                bookingData.title = title
                bookingData.email = email

            } else {
                if (state.contactSelectValue && state.contactSelectValue.id) {
                    bookingData.contact_id = state.contactSelectValue.id;
                }
            }
            if (bookingId) {
                bookingData.id = bookingId;
                dispatch(updateBooking(bookingData));
            } else {
                dispatch(addBooking(bookingData));
            }
        } else {
            setServiceMessage('Please enter all required details.')
        }
    };

    const handleInputChange = value => {
        setState({ ...state, contactSelect: value })
    };


    // Refer Handle selection
    const referHandleChange = value => {
        setReferState({ ...referState, contactSelectValue: value })
    }

    const saveReferContactData = () => {
        let success = '';
        let error = referState.wrongInput;
        let referContactType = referState.referContactType, contactSelectValue = referState.contactSelectValue, firstName = referState.firstName, lastName = referState.lastName, email = referState.email, phone = referState.phone, organization = referState.organization,
            title = referState.title, phoneType = referState.phoneType.value, firstNameCls = success, emailCls = '', phoneCls = '',
            firstNameErr = '', emailErr = '', phoneErr = '', organizationErr = '', getError = false;

        if (referContactType === "1") {
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
        }

        setReferState({
            ...referState, firstNameCls, emailCls, phoneCls, firstNameErr, emailErr, phoneErr, organizationErr,
        })

        if (getError === false && emailErr === '' && firstNameErr === '' && phoneErr === '') {
            if (referContactType === '1') {
                setLoader(true)
                let contactData = {
                    first_name: firstName,
                    last_name: lastName ? lastName : '',
                    phone_type: phoneType,
                    organization,
                    phone,
                    title
                }
                if (email !== "") {
                    contactData.email = email
                }
                dispatch(addContact(contactData))
            } else {
                if (contactSelectValue && contactSelectValue.id) {
                    setState({ ...state, sourceReferValue: contactSelectValue })
                }
                setReferContactModalShow(false)
            }

        }
    }

    const openReferContactModal = () => {

        if (state.sourceReferValue && state.sourceReferValue.id) {
            setReferState({
                ...referState, firstName: '', lastName: '', email: '', phone: '', organization: '', title: '', phoneType: { value: 'Mobile', label: 'Mobile' },
                firstNameCls: '', emailCls: '', phoneCls: '', firstNameErr: '', emailErr: '', phoneErr: '',
                correctInput: '', wrongInput: constants.WRONG_INPUT, referBySelect: '', referContactType: '0',
                contactSelectValue: state.sourceReferValue
            })
        } else {
            setReferState({
                ...referState, firstName: '', lastName: '', email: '', phone: '', organization: '', title: '', phoneType: { value: 'Mobile', label: 'Mobile' },
                firstNameCls: '', emailCls: '', phoneCls: '', firstNameErr: '', emailErr: '', phoneErr: '',
                correctInput: '', wrongInput: constants.WRONG_INPUT, referBySelect: '', referContactType: '1',
                contactSelectValue: ''
            })
        }
        setReferContactModalShow(true)
    }

    const handleChange = value => {
        setTimeout(() => {
            setState({ ...state, contactSelectValue: value })
        }, 0)
        // setState({ ...state, contactSelectValue: value })
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

    const CancelForm = (e) => {
        e.preventDefault();
        if (
            !bookingId &&
            (state.firstName !== "" ||
                state.lastName !== "" ||
                state.email !== "" ||
                state.referBySelectValue !== "" ||
                state.title !== "" ||
                state.organization !== "" ||
                state.phone !== "" ||
                state.firstNameInformation !== "")
        ) {
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
                    history.push(LIST_BOOKINGS);
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // console.log('cancel')
                }
            });
        } else {
            if (bookingId) {
                history.push(VIEW_BOOKING_BASE + bookingId);
            } else {
                history.push(LIST_BOOKINGS);
            }
        }
    };

    const showTimeSelection = () => {
        setTimeout(function () { datepickerRef.current.setOpen(true); }, 100);
    };

    return (
        <>
            <Loader loader={loader} />
            <div className="main-site fixed--header lead-page-hdr">
                <Header getMainRoute={"bookings"} />
                <main className="site-body">
                    <section className="page-title contact--header">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-auto title--col">
                                    <div>
                                        <ol className="breadcrumb d-none d-lg-flex">
                                            <li className="breadcrumb-item"> <Link to={LIST_BOOKINGS}>Bookings</Link> </li>
                                            <li className="breadcrumb-item active" aria-current="page">{bookingId ? "Edit" : "Create"} Booking </li>
                                        </ol>
                                        <h2 className="title">
                                            <span className="d-none d-lg-flex"> {bookingId ? "Edit" : "Create"} Booking </span>
                                            <span className="d-lg-none">{bookingId ? "Edit" : "Create"} Booking</span>
                                        </h2>
                                    </div>
                                </div>
                                <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                    <button type="button" onClick={(e) => CancelForm(e)} className="btn btn-dark mr-15"> Cancel </button>
                                    <button type="button" onClick={() => saveBookingData()} className="btn btn-primary"> {bookingId ? "Save" : "Create"}  </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="middle-section">
                        <div className="container">
                            {serviceMessage ? <div className="errorCls errCommonCls"> <img src={ERROR_ICON} alt="" /> {serviceMessage} </div> : ""}
                            <div className="row no-gutters-mbl">
                                <div className="col-lg-12">
                                    <div className="main-card">
                                        <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#booking"
                                            aria-expanded="true" aria-controls="booking" >
                                            Booking Details
                                        <img src={setImagePath(ORANGE_ARROW)} alt="Not Found" />
                                        </button>
                                        <div className={"card main-card--collapse show " + isCollapse} id="booking">
                                            <div className="card-header py-4 d-flex justify-content-between align-items-center">
                                                <h2>Booking Details</h2>
                                            </div>
                                            <div className="card-body pt-0 pb-0">
                                                <form className="p-3">
                                                    <div className="row justify-content-between">
                                                        <div className="form-group col-md-5 col-lg-5">
                                                            <div className={"floating-label " + state.bookingNameCls}>
                                                                <input placeholder="Booking Name *" type="text" name="bookingName" value={state.bookingName || ''} onChange={(e) => setInputValue(e, 'string', 50, null)} className="floating-input" />
                                                                <label>Booking Name *</label>
                                                                {state.bookingNameErr ? <span className="errorValidationMessage"> {state.bookingNameErr}</span> : ''}
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-5 col-lg-4">
                                                            <label className="single-label">Type</label>
                                                            <div className="d-flex align-items-center flex-wrap position-relative">
                                                                <div className="custom-control custom-radio custom-control-inline">
                                                                    <input className="custom-control-input" onChange={() => setState({ ...state, eventType: 'Private' })} type="radio" name="eventType" checked={state.eventType === 'Private' ? true : false} id="Private" value="Private" />
                                                                    <label className="custom-control-label m-0" htmlFor="Private" >Private</label>
                                                                </div>
                                                                <div className="custom-control custom-radio custom-control-inline">
                                                                    <input className="custom-control-input" onChange={() => setState({ ...state, eventType: 'Corporate' })} type="radio" name="eventType" checked={state.eventType === 'Corporate' ? true : false} id="Corporate" value="Corporate" />
                                                                    <label className="custom-control-label m-0" htmlFor="Corporate"> Corporate </label>
                                                                </div>
                                                                <div className="custom-control custom-checkbox">
                                                                    <input type="checkbox" checked={state.virtualEvent} onChange={(e) => setState({ ...state, virtualEvent: e.target.checked, address: '', lat_long: '' })} className="custom-control-input" id="customCheck1" />
                                                                    <label className="custom-control-label mt-0" htmlFor="customCheck1"><strong>Virtual Event</strong></label>
                                                                </div>
                                                            </div>
                                                            {state.eventTypeErr ? <span className="errorValidationMessage"> {state.eventTypeErr}</span> : ''}
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-group col-md-4 mb-lg-5">

                                                            <div className={"floating-label " + state.selectServiceCls}>
                                                                {/* <label>Interested in </label> */}
                                                                <Select
                                                                    styles={selectStyle}
                                                                    className="floating-select"
                                                                    placeholder="Interested In *"
                                                                    components={{ MenuList: addExtraService, ValueContainer: CustomValueContainer, NoOptionsMessage: () => null }}
                                                                    options={serviceState.servicesListOptions}
                                                                    value={state.selectService}
                                                                    onChange={(data) => setState({ ...state, selectService: data, selectServiceErr: '', selectServiceCls: '' })}
                                                                />
                                                                {state.selectServiceErr ? <span className="errorValidationMessage"> {state.selectServiceErr}</span> : ''}
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-2 mb-lg-5">
                                                            <div className={state.totalCls ? "floating-label " + state.totalCls : "floating-label"}>
                                                                <input placeholder="Total" name="total" value={state.total || ""}
                                                                    onChange={(e) => { setState({ ...state, total: e.target.value }); setServiceMessage('') }} className="floating-input" />
                                                                <label>Total</label>
                                                                {state.totalErr ? <span className="errorValidationMessage"> {state.totalErr}</span> : ''}
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-2 mb-lg-5">
                                                            <div className={state.depositReceivedCls ? "floating-label " + state.depositReceivedCls : "floating-label"}>
                                                                <input placeholder="Advance Received" name="depositReceived" value={state.depositReceived || ""}
                                                                    onChange={(e) => { setState({ ...state, depositReceived: e.target.value }); setServiceMessage('') }} className="floating-input" />
                                                                <label>Advance Received</label>
                                                                {state.depositReceivedErr ? <span className="errorValidationMessage"> {state.depositReceivedErr}</span> : ''}
                                                            </div>
                                                        </div>

                                                        <div className="form-group col-md-4 mb-lg-5">
                                                            {state.virtualEvent ?
                                                                <div className={state.addressCls ? "floating-label " + state.addressCls : "floating-label"}>
                                                                    <input placeholder="Zoom, Google, WebEx, etc. link" name="address" value={state.address || ""}
                                                                        onChange={(e) => { setState({ ...state, address: e.target.value, addressErr: '', addressCls: '' }); setServiceMessage('') }} className="floating-input" />
                                                                    <label>Location *</label>
                                                                    {state.addressErr ? <span className="errorValidationMessage"> {state.addressErr}</span> : ''}
                                                                </div>
                                                                :
                                                                <PlacesAutocomplete
                                                                    value={state.address}
                                                                    onChange={handleChangeGoogle}
                                                                    onSelect={handleSelectGoogle}
                                                                >
                                                                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                                        <div className="floating-label " >
                                                                            <input
                                                                                {...getInputProps({
                                                                                    placeholder: 'Location (Address or Name)',
                                                                                    className: 'location-search-input floating-input',
                                                                                })}
                                                                            />
                                                                            <label>Location (Address or Name)</label>
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
                                                            }
                                                        </div>



                                                        <div className="form-group col-md-2 mb-lg-5">

                                                            <div className={"floating-label " + state.dateCls}>
                                                                <DatePicker
                                                                    type="text"
                                                                    name="date"
                                                                    className={state.dateCls ? "floating-input " + state.dateCls : "floating-input"}
                                                                    selected={state.date}
                                                                    onChange={(date) => dateForBooking(date)}
                                                                    minDate={moment().toDate()}
                                                                    placeholderText="Start Date *"
                                                                    ref={datepickerRef}

                                                                />
                                                                <div onClick={() => showTimeSelection()} className="input-calendar-icon"><img src={CALENDAR} alt="" width="20" height="20" /></div>
                                                                {state.dateErr ? <span className="errorValidationMessage"> {state.dateErr}</span> : ''}
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-2 mb-lg-5">
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
                                                                {/* <label>Start Time</label> */}
                                                                {/* <div className="floating-label">

                                                                <Select
                                                                    styles={selectStyle}
                                                                    className="floating-select"
                                                                    components={makeAnimated()}
                                                                    value={state.timeShiftValue}
                                                                    options={state.timeShiftOptions}
                                                                    onChange={(data) => {
                                                                        setState({ ...state, timeShiftValue: data });
                                                                        setServiceMessage("");
                                                                    }}
                                                                />
                                                            </div> */}
                                                            </div>
                                                        </div>

                                                        <div className="form-group col-md-2 mb-lg-5">
                                                            <div className="floating-label">
                                                                <Select
                                                                    styles={selectStyle}
                                                                    className="floating-select"
                                                                    components={makeAnimated()}
                                                                    value={state.durationValue}
                                                                    options={state.durationOptions}
                                                                    onChange={(data) => {
                                                                        setState({ ...state, durationValue: data });
                                                                        setServiceMessage("");
                                                                    }}
                                                                />
                                                                {/* <label>Duration</label> */}
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-2 mb-0">
                                                            {state.durationValue && state.durationValue.value === "Custom" ?
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
                                                                : ''}
                                                        </div>
                                                        {state.virtualEvent ?
                                                            <>
                                                                <div className="form-group col-md-2 mb-lg-5">
                                                                    <div className="floating-label">
                                                                        <input placeholder="Meeting Id" name="meetingId" value={state.meetingId || ""}
                                                                            onChange={(e) => { setState({ ...state, meetingId: e.target.value }); setServiceMessage('') }} className="floating-input" />
                                                                        <label>Meeting Id</label>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group col-md-2 mb-lg-5">
                                                                    <div className="floating-label">
                                                                        <input placeholder="Passcode" name="passcode" value={state.passcode || ""}
                                                                            onChange={(e) => { setState({ ...state, passcode: e.target.value }); setServiceMessage('') }} className="floating-input" />
                                                                        <label>Passcode</label>
                                                                    </div>
                                                                </div>
                                                            </>
                                                            : ''}

                                                        <div className="form-group col-md-8 mb-lg-2">
                                                            <div className="floating-label">
                                                                <textarea placeholder="Add any additional information here…" className="floating-input" name="detail" value={state.moreInformation || ''} onChange={(e) => { setState({ ...state, moreInformation: e.target.value }); setServiceMessage('') }} rows="5"></textarea>
                                                                <label>More information about  {state.bookingName !== '' ? state.bookingName : '‘Booking Name’'}</label>
                                                            </div>
                                                        </div>

                                                        <div className="form-group col-md-4">
                                                            <div className="floating-label">
                                                                <Select
                                                                    styles={selectStyle}
                                                                    className="floating-select"
                                                                    placeholder="Lead Source"
                                                                    components={{ MenuList: addExtraSource, ValueContainer: CustomValueContainer }}
                                                                    options={sourceState.sourceListOptions}
                                                                    value={state.selectSource}
                                                                    onChange={(data) => setState({ ...state, selectSource: data, website: '' })}
                                                                />
                                                                {/* <label>Lead Source</label> */}
                                                            </div>
                                                            <div className="floating-label mt-3">
                                                                {state.selectSource && state.selectSource.value === 'referral' ?
                                                                    state.sourceReferValue && state.sourceReferValue.id
                                                                        ?
                                                                        <div className="d-flex align-items-center justify-content-start">
                                                                            <div className="field-text mr-3"><a href="#phone" onClick={(e) => e.preventDefault()}>{state.sourceReferValue.first_name + ' ' + (state.sourceReferValue && state.sourceReferValue.last_name !== null ? state.sourceReferValue.last_name : '')}</a></div>
                                                                            <button type="button" onClick={() => openReferContactModal()} className="btn btn-dark">Change</button>
                                                                        </div>
                                                                        :
                                                                        <button type="button" onClick={() => openReferContactModal()} className="btn btn-secondary">Select Contact</button>
                                                                    : ''}
                                                                {state.selectSource && state.selectSource.value === 'website' ?
                                                                    <div className="floating-label">
                                                                        <input placeholder="Website" name="website" type="text" value={state.website} onChange={(e) => setState({ ...state, website: e.target.value })} className="floating-input" />
                                                                        <label>Website Name</label>
                                                                    </div>
                                                                    : ''}
                                                            </div>
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
                                        <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse"
                                            data-target="#contact" aria-expanded="true" aria-controls="contact" >
                                            Contact Details
                                        <img src={setImagePath(ORANGE_ARROW)} alt="Not Found" />
                                        </button>
                                        <div className={"card main-card--collapse show" + isCollapse} id="contact">
                                            <div className="card-header py-4 d-flex justify-content-between align-items-center">
                                                <h2>Contact Details</h2>
                                            </div>
                                            <div className="card-body pt-0 pb-0">

                                                <form className="px-3">

                                                    <div className="row">
                                                        <div className="form-group col-md-4 ">
                                                            {/* <label className="single-label">Event Type</label> */}
                                                            <div className="">
                                                                <div className="custom-control custom-radio custom-control-inline mb-lg-3">
                                                                    <input className="custom-control-input" onChange={() => setState({ ...state, new_contact: '1', contactSelect: '' })} checked={state.new_contact === '1' ? true : false} type="radio" name="new_contact" id="newRadio" value="1" />
                                                                    <label className="custom-control-label" htmlFor="newRadio">New</label>
                                                                </div>
                                                                <div className="custom-control custom-radio custom-control-inline mb-lg-3">
                                                                    <input className="custom-control-input" onChange={() => setState({ ...state, new_contact: '0' })} checked={state.new_contact === '0' ? true : false} type="radio" name="new_contact" id="existingRadio" value="0" />
                                                                    <label className="custom-control-label" htmlFor="existingRadio">Select Existing</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {state.new_contact === '1'
                                                        ?
                                                        <div className="row">
                                                            <div className="form-group col-md-4 mb-lg-5">
                                                                <div className={"floating-label " + state.firstNameCls}>
                                                                    <input placeholder="First Name *" type="text" name="firstName" value={state.firstName || ''} onChange={(e) => setInputValue(e, 'string', 50, null)} className="floating-input" />
                                                                    <label>First Name *</label>
                                                                    {state.firstNameErr ? <span className="errorValidationMessage"> {state.firstNameErr}</span> : ''}
                                                                </div>
                                                            </div>
                                                            <div className="form-group col-md-4 mb-lg-5">
                                                                <div className="floating-label">
                                                                    <input placeholder="Last Name" type="text" name="lastName" value={state.lastName || ''} onChange={(e) => { setState({ ...state, lastName: e.target.value }); setServiceMessage('') }} className="floating-input" />
                                                                    <label>Last Name</label>
                                                                </div>
                                                            </div>
                                                            <div className="form-group col-md-4 mb-lg-5">
                                                                <div className={"floating-label " + state.emailCls}>
                                                                    <input placeholder="Email Address" type="email" name="email" value={state.email || ''} onChange={(e) => { setState({ ...state, email: e.target.value, emailCls: '', emailErr: '' }); setServiceMessage('') }} className="floating-input" />
                                                                    <label>Email Address</label>
                                                                    {state.emailErr ? <span className="errorValidationMessage"> {state.emailErr}</span> : ''}
                                                                </div>
                                                            </div>
                                                            <div className="form-group col-md-4 mb-lg-5">
                                                                <div className="form-row">
                                                                    <div className="col-5">
                                                                        <div className="floating-label">
                                                                            <Select
                                                                                styles={selectStyle}
                                                                                className="floating-select"
                                                                                components={{ ValueContainer: CustomValueContainer }}
                                                                                value={state.phoneType}
                                                                                isSearchable={false}
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
                                                            <div className="form-group col-md-4 mb-lg-5">
                                                                <div className="floating-label">
                                                                    <input placeholder="Organization Name" type="text" name="organization" value={state.organization || ''} onChange={(e) => { setState({ ...state, organization: e.target.value }); setServiceMessage('') }} className="floating-input" />
                                                                    <label>Organization Name</label>
                                                                </div>
                                                            </div>
                                                            <div className="form-group col-md-4 mb-lg-5">
                                                                <div className="floating-label">
                                                                    <input placeholder="Title" type="text" name="title" value={state.title || ''} onChange={(e) => { setState({ ...state, title: e.target.value }); setServiceMessage('') }} className="floating-input" />
                                                                    <label>Title</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className="row">
                                                            <div className="form-group col-lg-4 col-md-6 mb-lg-2">
                                                                <div className="floating-label">
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
                                                                        /* onChange={(value) => setState({ ...state, contactSelectValue: value })} */
                                                                        onInputChange={(e) => handleInputChange(e)}
                                                                        onChange={(e) => handleChange(e)}
                                                                    />
                                                                    <label>Type here to search</label>
                                                                </div>
                                                            </div>
                                                            <div className="form-group col-12">
                                                                {state.contactSelectValue && state.contactSelectValue.phone !== null ? <div className="field-text">{state.contactSelectValue.phone}</div> : ''}
                                                                <div className="field-text">
                                                                    {state.contactSelectValue && state.contactSelectValue.id ? <Link to={VIEW_CONTACT_BASE + state.contactSelectValue.id}>{state.contactSelectValue && state.contactSelectValue.email}</Link> : ''}
                                                                </div>
                                                                <div className="field-text">{state.contactSelectValue && state.contactSelectValue.organization}</div>
                                                                <div className="field-text">{state.contactSelectValue && state.contactSelectValue.title ? <small>({state.contactSelectValue.title})</small> : ''}</div>
                                                            </div>
                                                        </div>
                                                    }
                                                </form>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </section>
                    {/* Add Service Modal*/}
                    <Modal show={serviceModalShow} onHide={() => setServiceModalShow(false)} className="" centered>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Add Service
                        </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {serviceMessage ? <div className="errorCls errCommonCls  mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{serviceMessage}</div> : ''}
                            <p className="p-small"><strong>Note:</strong> This service will automatically be saved for future use. </p>
                            <form>
                                <div className={"floating-label " + serviceState.serviceCls}>
                                    <textarea className="floating-input floating-textarea" name="service" value={serviceState.service || ''} onChange={(e) => setServiceValue(e, 'required', null, null)} placeholder="Type service name here"></textarea>
                                    <label>Service Name</label>
                                    {serviceState.serviceErr ? <span className="errorValidationMessage"> {serviceState.serviceErr}</span> : ''}
                                </div>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="button" className="btn btn-dark" onClick={() => setServiceModalShow(false)}>Cancel</button>
                            <button type="button" onClick={() => saveServiceData()} className="btn btn-primary">Add</button>
                        </Modal.Footer>
                    </Modal>

                    {/* Add Source Modal*/}
                    <Modal show={sourceModalShow} onHide={() => setSourceModalShow(false)} className="" centered>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Add Lead Source
                        </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {sourceMessage ? <div className="errorCls errCommonCls  mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{sourceMessage}</div> : ''}
                            <p className="p-small"><strong>Note:</strong> This lead source will automatically be saved for future use. </p>
                            <form>
                                <div className={"floating-label " + sourceState.sourceCls}>
                                    <textarea className="floating-input floating-textarea" name="source" value={sourceState.source || ''} onChange={(e) => setSourceValue(e, 'required', null, null)} placeholder="Type lead source here"></textarea>
                                    <label>Lead Source</label>
                                    {sourceState.sourceErr ? <span className="errorValidationMessage"> {sourceState.sourceErr}</span> : ''}
                                </div>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="button" className="btn btn-dark" onClick={() => setSourceModalShow(false)}>Cancel</button>
                            <button type="button" onClick={() => saveSourceData()} className="btn btn-primary">Add</button>
                        </Modal.Footer>
                    </Modal>
                    {/* Add Reffer Contact Modal*/}
                    <Modal show={referContactShow} onHide={() => setReferContactModalShow(false)} className="" size="lg" centered>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Select Contact
                        </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {referServiceMessage ? <div className="errorCls errCommonCls mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{referServiceMessage}</div> : ''}
                            <form>
                                <div className="row mb-3">
                                    <div className="form-group col-md-12">
                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="NewContact" onChange={() => setReferState({ ...referState, referContactType: '1' })} checked={referState.referContactType === '1' ? true : false} name="referContactType" className="custom-control-input" value="1" />
                                            <label className="custom-control-label" htmlFor="NewContact">Create New </label>
                                        </div>
                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="ExistingContact" onChange={() => setReferState({ ...referState, referContactType: '0' })} checked={referState.referContactType === '0' ? true : false} name="referContactType" className="custom-control-input" value="0" />
                                            <label className="custom-control-label" htmlFor="ExistingContact">Select Existing </label>
                                        </div>
                                    </div>
                                </div>
                                {referState.referContactType === '1'
                                    ?
                                    <div className="row">
                                        <div className="form-group col-md-6">
                                            <div className={"floating-label " + referState.firstNameCls}>
                                                <input placeholder="First Name*" type="text" name="firstName" value={referState.firstName || ''} onChange={(e) => setReferInputValue(e, 'string', 50, null)} className="floating-input" />
                                                <label>First Name*</label>
                                                {referState.firstNameErr ? <span className="errorValidationMessage"> {referState.firstNameErr}</span> : ''}
                                            </div>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <div className="floating-label">
                                                <input placeholder="Last Name" type="text" name="lastName" value={referState.lastName || ''} onChange={(e) => { setReferState({ ...referState, lastName: e.target.value }); setReferServiceMessage('') }} className="floating-input" />
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
                                                            value={referState.phoneType}
                                                            isSearchable={false}
                                                            defaultValue={referState.phoneType}
                                                            options={phoneTypeOptions}
                                                            placeholder="Phone Type"
                                                            onChange={data => { setReferState({ ...referState, phoneType: data }); setReferServiceMessage('') }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-7">
                                                    <div className={"floating-label " + referState.phoneCls}>
                                                        <input placeholder="Phone Number" type="text" name="phone" value={referState.phone || ''} onChange={(e) => { setReferState({ ...referState, phone: e.target.value, phoneCls: '', phoneErr: '' }); setReferServiceMessage('') }} className="floating-input" />
                                                        <label>Phone Number</label>
                                                        {referState.phoneErr ? <span className="errorValidationMessage"> {referState.phoneErr}</span> : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <div className={"floating-label " + referState.emailCls}>
                                                <input placeholder="Email Address" type="email" name="email" value={referState.email || ''} onChange={(e) => { setReferState({ ...referState, email: e.target.value, emailCls: '', emailErr: '' }); setReferServiceMessage('') }} className="floating-input" />
                                                <label>Email Address</label>
                                                {referState.emailErr ? <span className="errorValidationMessage"> {referState.emailErr}</span> : ''}
                                            </div>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <div className="floating-label">
                                                <input placeholder="Organization Name" type="text" name="organization" value={referState.organization || ''} onChange={(e) => { setReferState({ ...referState, organization: e.target.value }); setReferServiceMessage('') }} className="floating-input" />
                                                <label>Organization Name</label>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <div className="floating-label">
                                                <input placeholder="Title" type="text" name="title" value={referState.title || ''} onChange={(e) => { setReferState({ ...referState, title: e.target.value }); setReferServiceMessage('') }} className="floating-input" />
                                                <label>Title</label>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className="row">
                                        <div className="form-group col-md-6 mb-lg-2">
                                            <div className="floating-label">
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
                                                    value={referState.contactSelectValue}
                                                    getOptionLabel={e => e.first_name + (e && e.last_name ? " " + e.last_name : '')}
                                                    getOptionValue={e => e.id}
                                                    loadOptions={(e) => loadOptions(e)}
                                                    onInputChange={(e) => handleInputChange(e)}
                                                    onChange={(e) => referHandleChange(e)}
                                                />
                                                <label>Type here to search</label>
                                            </div>
                                        </div>
                                        <div className="form-group col-12">
                                            <div className="form-group">
                                                <div className="field-text">{referState.contactSelectValue && referState.contactSelectValue.phone}</div>
                                                <div className="field-text"><a href="#lead" onClick={(e) => e.preventDefault()}>{referState.contactSelectValue && referState.contactSelectValue.email}</a></div>
                                                <div className="field-text">{referState.contactSelectValue && referState.contactSelectValue.organization}</div>
                                                <div className="field-text">{referState.contactSelectValue && referState.contactSelectValue.title ? <small>({referState.contactSelectValue.title})</small> : ''}</div>
                                            </div>
                                        </div>
                                    </div>}
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="button" className="btn btn-dark" onClick={() => setReferContactModalShow(false)}>Cancel</button>
                            <button type="button" onClick={() => saveReferContactData()} className="btn btn-primary">Add</button>
                        </Modal.Footer>
                    </Modal>
                </main>
                <Footer />
            </div >
        </>
    );
};
