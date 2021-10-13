import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import Select from 'react-select';
import { selectStyle, constants, CustomValueContainer } from '../../../../common/constants';
import Modal from "react-bootstrap/Modal";
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import ORANGE_ARROW from '../../../../assets/images/orange-arrow.svg'
import { validateInputs } from '../../../../common/validation';
import { fieldValidator, usePrevious, setImagePath } from '../../../../common/custom';
import { addContact } from '../../../../duck/contact/contact.action';
import { addService, listServiceWithSource, addSource, listLeadStatus, addLead, getLeadById, updateLead } from '../../../../duck/lead/lead.action';
import _ from 'lodash';
import AsyncSelect from 'react-select/async';
import { getContactListOptionValue } from '../../../../../api/sdk/contact';
import { LIST_LEADS, VIEW_LEAD_BASE, VIEW_CONTACT_BASE } from "../../../../routing/routeContants";
import { Link, withRouter } from "react-router-dom";
import { Loader } from '../../../component/frontend/loader/loader'
import Swal from 'sweetalert2'

export const AddLeadPage = props => {

    let leadId;
    if (props.match && _.has(props.match, 'params') && _.has(props.match.params, 'id')) {
        leadId = props.match.params.id
    }
    const [loader, setLoader] = useState(false);
    const [currentPlan, setCurrentPlan] = useState('');
    const dispatch = useDispatch();
    const [isCollapse, setIsCollapse] = useState('');
    const intrestedOptions = [{ value: 'Tentative', label: 'Tentative' }, { value: 'Confirmed', label: 'Confirmed' }]
    // Set initial State Value For View Detail
    const [serviceMessage, setServiceMessage] = useState('');
    const phoneTypeOptions = [{ value: 'Mobile', label: 'Mobile' }, { value: 'Work', label: 'Work' }, { value: 'Home', label: 'Home' }];
    const [state, setState] = useState({
        firstName: '', lastName: '', email: '', phone: '', organization: '', title: '', phoneType: { value: 'Mobile', label: 'Mobile' },
        firstNameCls: '', emailCls: '', phoneCls: '', firstNameErr: '', emailErr: '', phoneErr: '',
        correctInput: '', wrongInput: constants.WRONG_INPUT, name: '', nameErr: '', nameCls: '',
        potentialRevenue: '', potentialRevenueErr: '', potentialRevenueCls: '', when: '', location: '',
        detail: '', eventType: 'Private', selectSource: '', selectService: '', selectServiceCls: '', selectServiceErr: '', new_contact: '1',
        contactSelect: '', contactSelectValue: '', interestLevel: '', website: '', sourceReferValue: '',
        contactSelectErr: '', contactSelectCls: ''
    });
    const addLeadData = useSelector(state => state.lead.addLeadData);
    const prevAddLeadData = usePrevious({ addLeadData });
    const getLeadByIdData = useSelector(state => state.lead.getLeadByIdData);
    const prevGetLeadByIdData = usePrevious({ getLeadByIdData });

    // Add Service State And Props
    const serviceTextRef = useRef();
    const [serviceModalShow, setServiceModalShow] = useState(false);
    const [serviceOptionMessage, setServiceOptionMessage] = useState('');
    const [serviceState, setServiceState] = useState({
        service: '', serviceCls: '', serviceErr: '', servicesListOptions: [],
    });
    const addServiceData = useSelector(state => state.lead.addServiceData);
    const prevAddServiceData = usePrevious({ addServiceData });
    const listServiceWithSourceData = useSelector(state => state.lead.listServiceWithSourceData);
    const prevListServiceWithSourceData = usePrevious({ listServiceWithSourceData });

    // Add Source State And Props
    const sourceTextRef = useRef();
    const [sourceModalShow, setSourceModalShow] = useState(false);
    const [sourceMessage, setSourceMessage] = useState('');
    const [sourceState, setSourceState] = useState({
        source: '', sourceCls: '', sourceErr: '', sourceListOptions: [],
    });
    const addSourceData = useSelector(state => state.lead.addSourceData);
    const prevAddSourceData = usePrevious({ addSourceData });

    // Add refer contact State And Props
    const [referContactShow, setReferContactModalShow] = useState(false);
    const [referState, setReferState] = useState({
        firstName: '', lastName: '', email: '', phone: '', organization: '', title: '', phoneType: { value: 'Mobile', label: 'Mobile' },
        firstNameCls: '', emailCls: '', phoneCls: '', firstNameErr: '', emailErr: '', phoneErr: '',
        correctInput: '', wrongInput: constants.WRONG_INPUT, referBySelect: '', referContactType: '1',
        contactSelectValue: ''
    });
    const [referServiceMessage, setReferServiceMessage] = useState('');
    const addContactData = useSelector(state => state.contact.addContactData);
    const prevAddContactData = usePrevious({ addContactData });

    // Get Selector Data For Lead Status
    const [leadStage, setLeadStage] = useState([])
    const [activeLeadStatus, setActiveLeadStatus] = useState(0)
    const listLeadStatusData = useSelector(state => state.lead.listLeadStatusData);
    const prevListLeadStatusData = usePrevious({ listLeadStatusData });

    const addExtraService = ({ innerRef, innerProps, isDisabled, children }) =>
        !isDisabled ? (
            <div ref={innerRef} {...innerProps} className="customReactSelectMenu">
                {children}
                <button
                    type="button"
                    className="btn text-link text-left btn-sm btn-block"
                    onClick={(e) => showServiceModal()}
                >Add New Service</button>
            </div>
        ) : null;

    const addExtraSource = ({ innerRef, innerProps, isDisabled, children }) =>
        !isDisabled ? (
            <div ref={innerRef} {...innerProps} className="customReactSelectMenu">
                {children}
                <button
                    type="button"
                    className="btn text-link text-left btn-sm btn-block"
                    onClick={(e) => showSourceModal()}
                >Add New Lead Source</button>
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
        // clean up function
        return () => {
            // remove resize listener
            window.removeEventListener('resize', resizeListener);
        }

    }, [])

    // On Load Get Data
    useEffect(() => {
        setLoader(true)
        dispatch(listLeadStatus())
        dispatch(listServiceWithSource())
        if (leadId) {
            dispatch(getLeadById({ id: leadId }))
        }
        if (props.history.location && props.history.location.state && props.history.location.state.contactDataState) {
            setState({ ...state, contactSelectValue: props.history.location.state.contactDataState, new_contact: '0' })
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (prevGetLeadByIdData && prevGetLeadByIdData.getLeadByIdData !== getLeadByIdData) {
            if (getLeadByIdData && _.has(getLeadByIdData, 'data') && getLeadByIdData.success === true) {
                if (getLeadByIdData.data && getLeadByIdData.data.id) {
                    let allData = getLeadByIdData.data;
                    let sourceTypeValue;
                    if (allData.referred_by && allData.referred_by.id) {
                        sourceTypeValue = { value: 'referral', label: 'Referral' }
                    }
                    if (allData.website && allData.website !== null) {
                        if (allData.website === 'My Website') {
                            sourceTypeValue = { value: 'My Website', label: 'My Website' }
                        } else {
                            sourceTypeValue = { value: 'website', label: 'External Website' }
                        }
                    }
                    if (allData.source_type && allData.source_type.id) {
                        sourceTypeValue = { value: allData.source_type.id, label: allData.source_type.name }
                    }
                    if (allData.lead_stage && allData.lead_stage.id) {
                        setActiveLeadStatus(allData.lead_stage.id)
                    }
                    if(getLeadByIdData.user_preferences && (getLeadByIdData.user_preferences).length>0){
                        setCurrentPlan(getLeadByIdData.user_preferences[0])
                    }
                    setState({
                        ...state,
                        name: allData.name || '-',
                        potentialRevenue: allData.potential_revenue || '',
                        eventType: allData.event_type || '-',
                        when: allData.when || 'TBD',
                        location: allData.location || 'TBD',
                        detail: allData.detail || '-',
                        interestLevel: allData.interest_level !== null ? { value: allData.interest_level, label: allData.interest_level } : '',
                        website: allData.website !== null ? allData.website : '',
                        selectService: allData.service_type && allData.service_type.id ? { value: allData.service_type.id, label: allData.service_type.name } : '',
                        selectSource: sourceTypeValue,
                        sourceReferValue: allData.referred_by && allData.referred_by.id ? allData.referred_by : '',
                        new_contact: allData.contact && allData.contact.id ? '0' : '1',
                        contactSelectValue: allData.contact && allData.contact.id ? allData.contact : '',
                    })
                } else {
                    props.history.push(LIST_LEADS)
                }
                setLoader(false)
            }
            if (getLeadByIdData && _.has(getLeadByIdData, 'message') && getLeadByIdData.success === false) {
                setLoader(false)
            }
        }
    }, [prevGetLeadByIdData, getLeadByIdData])// eslint-disable-line react-hooks/exhaustive-deps

    // Show Service 
    const showServiceModal = () => {
        setServiceModalShow(true);
        setServiceOptionMessage('');
        setTimeout(function () { serviceTextRef.current.focus(); }, 300);
        setServiceState({ ...serviceState, service: '', serviceCls: '', serviceErr: '', serviceId: '' })
    }

    // Check Validation Function 
    const checkValidation = (field, value, type, maxLength, minLength, fieldType) => {
        return fieldValidator(field, value, type, state.password, maxLength, minLength, fieldType)
    }

    // Set The Service Values
    const setServiceValue = (e, type, maxLength, minLength) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
        setServiceState({ ...serviceState, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        setServiceOptionMessage('');
    }

    // Set The Input Values
    const setInputValue = (e, type, maxLength, minLength) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
        setState({ ...state, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        setServiceMessage('');
    }

    // Set The Refer Input Values
    const setReferInputValue = (e, type, maxLength, minLength) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
        setReferState({ ...referState, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        setReferServiceMessage('');
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

    // List Service and source Data 
    useEffect(() => {
        if (prevAddServiceData && prevAddServiceData.addServiceData !== addServiceData) {
            if (addServiceData && _.has(addServiceData, 'data') && addServiceData.success === true) {
                if (addServiceData.data && addServiceData.data.id) {
                    let allOption = serviceState.servicesListOptions;
                    let data = { value: addServiceData.data.id, label: addServiceData.data.name }
                    allOption.push(data)
                    setServiceState({ ...serviceState, servicesListOptions: allOption })
                    setState({ ...state, selectService: data, selectServiceCls: '', selectServiceErr:'' })
                }
                setServiceModalShow(false)
                setLoader(false)
            }
            if (addServiceData && _.has(addServiceData, 'message') && addServiceData.success === false) {
                setLoader(false)
                setServiceOptionMessage(addServiceData.message)
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
    }, [listServiceWithSourceData, prevListServiceWithSourceData, addServiceData, prevAddServiceData, addSourceData, prevAddSourceData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Show Source 
    const showSourceModal = () => {
        setSourceModalShow(true);
        setSourceMessage('');
        setTimeout(function () { sourceTextRef.current.focus(); }, 300);
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

    // List Lead Status Data And Add Lead Data
    useEffect(() => {
        if (prevListLeadStatusData && prevListLeadStatusData.listLeadStatusData !== listLeadStatusData) {
            if (listLeadStatusData && _.has(listLeadStatusData, 'data') && listLeadStatusData.success === true) {
                setLoader(false)
                setLeadStage(listLeadStatusData.data)
                if (activeLeadStatus === 0) {
                    setActiveLeadStatus(listLeadStatusData.data && listLeadStatusData.data[0] && listLeadStatusData.data[0].id)
                }
            }
            if (listLeadStatusData && _.has(listLeadStatusData, 'message') && listLeadStatusData.success === false) {
                setLoader(false)
            }
        }
        if (prevAddLeadData && prevAddLeadData.addLeadData !== addLeadData) {
            if (addLeadData && _.has(addLeadData, 'data') && addLeadData.success === true) {
                setLoader(false)
                props.history.push(VIEW_LEAD_BASE + addLeadData.data.id)
            }
            if (addLeadData && _.has(addLeadData, 'message') && addLeadData.success === false) {
                setLoader(false)
                setServiceMessage(addLeadData.message)
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
    }, [listLeadStatusData, prevListLeadStatusData, addLeadData, prevAddLeadData, prevAddContactData, addContactData]);// eslint-disable-line react-hooks/exhaustive-deps

    // handle input change event
    const handleInputChange = value => {
        setState({ ...state, contactSelect: value, contactSelectErr: '', contactSelectCls: '' })
    };

    // handle selection
    const handleChange = value => {
        setServiceMessage('')
        setTimeout(() => {
            setState({ ...state, contactSelectValue: value })
        }, 0)
    }

    // Refer Handle selection
    const referHandleChange = value => {
        setReferState({ ...referState, contactSelectValue: value })
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

    // Save Lead Data 
    const saveLeadData = () => {
        let success = '';
        let error = state.wrongInput;
        let name = state.name, nameCls = '', nameErr = "", potentialRevenue = state.potentialRevenue, potentialRevenueErr = '', potentialRevenueCls = '', when = state.when, location = state.location,
            detail = state.detail, eventType = state.eventType, selectSource = state.selectSource, selectService = state.selectService, new_contact = state.new_contact,
            contactSelectValue = state.contactSelectValue, interestLevel = state.interestLevel, website = state.website,
            firstName = state.firstName, lastName = state.lastName, email = state.email, phone = state.phone, organization = state.organization,
            title = state.title, phoneType = state.phoneType.value, firstNameCls = success, emailCls = '', phoneCls = '',  selectServiceCls = "", selectServiceErr = "",
            firstNameErr = '', emailErr = '', phoneErr = '', organizationErr = '', contactSelectErr = '', contactSelectCls = '', getError = false;

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

        if (validateInputs('string', name) === 'empty') {
            nameErr = 'Please enter name.';
            nameCls = error
            getError = true;
        } else if (validateInputs('string', name) === false) {
            nameErr = 'Please enter valid name.';
            nameCls = error
            getError = true;
        } else if (name.length > 100) {
            nameErr = 'Please enter maximum 100 characters.';
            nameCls = error
            getError = true;
        }

        if (validateInputs('positiveNumberWithDecimals', potentialRevenue) === false) {
            potentialRevenueErr = 'Please enter valid potential revenue.';
            potentialRevenueCls = error
            getError = true;
        }
        if (potentialRevenue && potentialRevenue.length > 1 && potentialRevenue.length > 11) {
            potentialRevenueErr = 'Please enter maximum 10 digits.';
            potentialRevenueCls = error
            getError = true;
        }

        if (validateInputs('required', state.selectService) === 'empty') {
            selectServiceErr = "Please select Interested In.";
            selectServiceCls = error;
            getError = true;
        }

        setState({
            ...state, firstNameCls, emailCls, phoneCls, firstNameErr, emailErr, phoneErr, organizationErr,
            nameCls, nameErr, potentialRevenueErr, potentialRevenueCls, contactSelectErr, contactSelectCls,
            selectServiceCls, selectServiceErr,
        })

        if (getError === false && emailErr === '' && selectServiceErr === "" && firstNameErr === '' && phoneErr === '' && contactSelectErr === '') {
            setLoader(true)
            let leadData = {
                name, potential_revenue: potentialRevenue, event_type: eventType, when, location, detail,
                new_contact, lead_status_types_id: activeLeadStatus
            };
            if (selectSource && selectSource.value) {
                if (selectSource.value === 'referral' || selectSource.value === 'website' || selectSource.value === 'My Website') {
                    if (selectSource.value === 'My Website') {
                        leadData.lead_source_type = 'website';
                        leadData.lead_source_value = 'My Website';
                    } else {
                        leadData.lead_source_type = selectSource.value;
                    }
                    if (selectSource.value === 'website') {
                        leadData.lead_source_value = website
                    }
                    if (selectSource.value === 'referral' && state.sourceReferValue && state.sourceReferValue.id) {
                        leadData.lead_source_value = state.sourceReferValue.id
                    }
                } else {
                    leadData.lead_source_type = 'source';
                    leadData.lead_source_value = selectSource.value;
                }
            }

            if (selectService && selectService.value) {
                leadData.service_type_id = selectService.value
            }

            if (interestLevel && interestLevel.value) {
                leadData.interest_level = interestLevel.value
            }

            if (new_contact === '1') {
                leadData.first_name = firstName
                leadData.last_name = lastName
                leadData.phone_type = phoneType
                leadData.organization = organization
                leadData.phone = phone
                leadData.title = title
                leadData.email = email
            } else {
                if (contactSelectValue && contactSelectValue.id) {
                    leadData.contact_id = contactSelectValue.id;
                }
            }
            if (leadId) {
                leadData.id = leadId
                dispatch(updateLead(leadData))
            } else {
                dispatch(addLead(leadData))
            }
        } else {
            setServiceMessage('Please enter all required details.')
        }
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
                let contactData = { first_name: firstName, last_name: lastName, phone_type: phoneType, organization, phone, title };
                if (email !== '') {
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

    // On Cancel
    const CancelForm = (e) => {
        e.preventDefault();
        if (!leadId && (state.potentialRevenue !== '' || state.name !== '' || state.when !== '' || state.location !== '' || state.selectService !== '' || state.detail !== '' || state.selectSource !== '' || state.interestLevel !== '')) {
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
                    props.history.push(LIST_LEADS)
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // console.log('cancel')
                }
            })
        } else {
            if (leadId) {
                props.history.push(VIEW_LEAD_BASE + leadId)
            } else {
                props.history.push(LIST_LEADS)
            }
        }
    }

    return (
        <>
            <Loader loader={loader} />
            <div className="main-site fixed--header lead-page-hdr">
                <Header getMainRoute={'leads'} />
                <main className="site-body">
                    <section className="page-title contact--header">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-auto title--col">
                                    <div>
                                        <ol className="breadcrumb d-none d-lg-flex">
                                            <li className="breadcrumb-item"><Link to={LIST_LEADS}>Leads</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">{leadId ? 'Update' : 'Create New'} lead</li>
                                        </ol>
                                        <h2 className="title"><span className="d-none d-lg-flex">{leadId ? 'Update' : 'Create New'} Lead</span> <span className="d-lg-none">{leadId ? 'Update' : 'Create New'} Lead</span></h2>
                                    </div>
                                </div>
                                <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                    <button type="button" onClick={(e) => CancelForm(e)} className="btn d-none d-lg-flex btn-dark mr-15">Cancel</button>
                                    <button type="button" onClick={(e) => saveLeadData(e)} disabled={(currentPlan==='' || (currentPlan && currentPlan.plan_is_active===0)) && leadId ? true : false} className="btn d-none d-lg-flex btn-primary">{leadId ? 'Save' : 'Create'}</button>
                                    <button type="button" onClick={(e) => CancelForm(e)} className="btn d-lg-none btn-dark mr-15">Cancel</button>
                                    <button type="button" onClick={(e) => saveLeadData(e)} disabled={(currentPlan==='' || (currentPlan && currentPlan.plan_is_active===0)) && leadId ? true : false} className="btn d-lg-none btn-primary">{leadId ? 'Save' : 'Create'}</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="middle-section">
                        <div className="container">
                            {serviceMessage ? <div className="errorCls errCommonCls mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{serviceMessage}</div> : ''}
                            <div className="row no-gutters-mbl mb-lg-4">
                                <div className="col-12">
                                    <div className="main-card">
                                        <div className="card w-100">
                                            <div className="card-body p-0">
                                                <div className="new-lead-timeline">
                                                    <div className="timeline_row">
                                                        {_.map(leadStage, (data, key) => {
                                                            let rData;
                                                            leadStage.length === key + 1 ?
                                                                rData = <div key={key} className={"timeline-cols  " + (activeLeadStatus === data.id ? 'active' : '')}><h5><em className="d-none d-lg-flex">{data.name}</em> <i className="d-lg-none">{key + 1}</i></h5><span></span></div>
                                                                :
                                                                rData = <div key={key} data-toggle="tooltip" data-placement="bottom" data-container="body" title="Click to change lead stage" onClick={(e) => setActiveLeadStatus(data.id)} className={"timeline-cols pointer-cursor  " + (activeLeadStatus === data.id ? 'active' : '')}><h5><em className="d-none d-lg-flex">{data.name}</em> <i className="d-lg-none">{key + 1}</i></h5><span></span></div>
                                                            return rData;
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row no-gutters-mbl">
                                <div className="col-lg-12">
                                    <div className="main-card">
                                        <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#TasksCollapse" aria-expanded="true" aria-controls="TasksCollapse">Lead Details <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                        <div className={"card main-card--collapse show " + isCollapse} id="TasksCollapse">
                                            <div className="card-header py-4 d-flex justify-content-between align-items-center">
                                                <h2>Lead Details</h2>
                                            </div>
                                            <div className="card-body leadDetail_form pt-0 pb-0">

                                                <form className="p-3">
                                                    <div className="row">
                                                        <div className="form-group col-lg-4 col-md-6  mb-lg-5">
                                                            <div className={"floating-label " + state.nameCls}>
                                                                <input placeholder="Lead Name *" type="text" name="name" value={state.name || ''} onChange={(e) => setInputValue(e, 'string', 50, null)} className="floating-input" />
                                                                <label>Lead Name *</label>
                                                                {state.nameErr ? <span className="errorValidationMessage"> {state.nameErr}</span> : ''}
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-lg-3 col-md-6  mb-lg-5 pot--rev-col">
                                                            <div className={"floating-label " + state.potentialRevenueCls}>
                                                                <input placeholder="Potential Revenue ($)" name="potentialRevenue" type="text" value={state.potentialRevenue || ''} onChange={(e) => { setState({ ...state, potentialRevenue: e.target.value, potentialRevenueErr: '', potentialRevenueCls: '' }); setServiceMessage('') }} className="floating-input" />
                                                                <label>Potential Revenue ($)</label>
                                                                {state.potentialRevenueErr ? <span className="errorValidationMessage"> {state.potentialRevenueErr}</span> : ''}
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-lg-2 col-md-4  mb-lg-5 int--in-col">
                                                            <div className="floating-label">
                                                                {/* <label>Interested in </label> */}
                                                                <Select
                                                                    styles={selectStyle}
                                                                    className="floating-select"
                                                                    components={{ ValueContainer: CustomValueContainer }}
                                                                    placeholder="Interest level"
                                                                    options={intrestedOptions}
                                                                    isSearchable={false}
                                                                    value={state.interestLevel}
                                                                    onChange={(data) => setState({ ...state, interestLevel: data, selectServiceCls: '', selectServiceErr:'' })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-lg-3 col-md-4  mb-lg-5">
                                                            <label className="single-label">Event Type</label>
                                                            <div className="d-flex align-items-center flex-wrap position-relative">
                                                                <div className="custom-control custom-radio custom-control-inline">
                                                                    <input className="custom-control-input" onChange={() => setState({ ...state, eventType: 'Private' })} type="radio" name="eventType" checked={state.eventType === 'Private' ? true : false} id="Private" value="Private" />
                                                                    <label className="custom-control-label m-0" htmlFor="Private">Private</label>
                                                                </div>
                                                                <div className="custom-control custom-radio custom-control-inline">
                                                                    <input className="custom-control-input" onChange={() => setState({ ...state, eventType: 'Corporate' })} type="radio" name="eventType" checked={state.eventType === 'Corporate' ? true : false} id="Corporate" value="Corporate" />
                                                                    <label className="custom-control-label m-0" htmlFor="Corporate">Corporate</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-lg-4 col-md-4  mb-lg-5">
                                                            <div className={"floating-label "+ state.selectServiceCls}>
                                                                {/* <label>Interested in </label> */}
                                                                <Select
                                                                    styles={selectStyle}
                                                                    className="floating-select"
                                                                    placeholder="Interested In *"
                                                                    components={{ MenuList: addExtraService, ValueContainer: CustomValueContainer, NoOptionsMessage: () => null }}
                                                                    options={serviceState.servicesListOptions}
                                                                    value={state.selectService}
                                                                    /* menuIsOpen={true} */
                                                                    onChange={(data) => setState({ ...state, selectService: data })}
                                                                />
                                                                {state.selectServiceErr ? <span className="errorValidationMessage"> {state.selectServiceErr}</span> : ''}
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-lg-4 col-md-6 mb-lg-5">
                                                            <div className="floating-label">
                                                                <input placeholder="When" name="when" type="text" value={state.when || ''} onChange={(e) => { setState({ ...state, when: e.target.value }); setServiceMessage('') }} className="floating-input" />
                                                                <label>When</label>
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-lg-4 col-md-6 mb-lg-5">
                                                            <div className="floating-label">
                                                                <input placeholder="Where" name="location" type="text" value={state.location || ''} onChange={(e) => { setState({ ...state, location: e.target.value }); setServiceMessage('') }} className="floating-input" />
                                                                <label>Where</label>
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-8 mb-lg-2">
                                                            <div className="floating-label">
                                                                <textarea placeholder="Add any additional information here…" className="floating-input" name="detail" value={state.detail || ''} onChange={(e) => { setState({ ...state, detail: e.target.value }); setServiceMessage('') }} rows="5"></textarea>
                                                                <label className="fixed-information-length">{"More information about " + (state.name !== '' ? state.name : '‘Lead Name’')}</label>
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-md-4 mb-lg-2">
                                                            <div className="floating-label">
                                                                <Select
                                                                    styles={selectStyle}
                                                                    className="floating-select"
                                                                    placeholder="Lead Source"
                                                                    components={{ MenuList: addExtraSource, ValueContainer: CustomValueContainer }}
                                                                    options={sourceState.sourceListOptions}
                                                                    value={state.selectSource}
                                                                    onChange={(data) => setState({ ...state, selectSource: data, website: ''})}
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
                                                                        <input placeholder="Website Name" name="website" type="text" value={state.website} onChange={(e) => setState({ ...state, website: e.target.value })} className="floating-input" />
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
                                        <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#contactDetail" aria-expanded="false" aria-controls="contactDetail">Contact Details <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                        <div className={"card main-card--collapse " + isCollapse} id="contactDetail">
                                            <div className="card-header py-4 d-flex justify-content-between align-items-center">
                                                <h2>Contact Details</h2>
                                            </div>
                                            <div className="card-body pt-0 pb-0">

                                                <form className="px-3">
                                                    <div className="row">
                                                        <div className="form-group  col-lg-4 col-md-6 mb-lg-5">
                                                            {/* <label className="single-label">Event Type</label> */}
                                                            <div className="custom-control custom-radio custom-control-inline">
                                                                <input className="custom-control-input" onChange={() => setState({ ...state, new_contact: '1' })} checked={state.new_contact === '1' ? true : false} type="radio" name="new_contact" id="newRadio" value="1" />
                                                                <label className="custom-control-label" htmlFor="newRadio">New</label>
                                                            </div>
                                                            <div className="custom-control custom-radio custom-control-inline">
                                                                <input className="custom-control-input" onChange={() => setState({ ...state, new_contact: '0' })} checked={state.new_contact === '0' ? true : false} type="radio" name="new_contact" id="existingRadio" value="0" />
                                                                <label className="custom-control-label" htmlFor="existingRadio">Select Existing</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {state.new_contact === '1'
                                                        ?
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
                                                                    <input placeholder="Email Address" type="email" name="email" value={state.email || ''} onChange={(e) => { setState({ ...state, email: e.target.value, emailCls: '', emailErr: '' }); setServiceMessage('') }} className="floating-input" />
                                                                    <label>Email Address</label>
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
                                                                            {/* <select value={state.phoneType} onChange={(e) => { setState({ ...state, phoneType: e.target.value }); setServiceMessage('')}}  name="phoneType" className="floating-select">
                                                                                <option value="Mobile">Mobile</option>
                                                                                <option value="Work">Work</option>
                                                                                <option value="Home">Home</option>
                                                                            </select>
                                                                            <label>Phone Type</label> */}
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
                                                        :
                                                        <div className="row">
                                                            <div className="form-group col-lg-4 col-md-6 mb-lg-2">
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
                                                            <div className="form-group col-12">
                                                                <div className="form-group">
                                                                    {state.contactSelectValue && state.contactSelectValue.phone !== null ? <div className="field-text">{state.contactSelectValue.phone}</div> : ''}
                                                                    <div className="field-text">
                                                                        {state.contactSelectValue && state.contactSelectValue.id ? <Link to={VIEW_CONTACT_BASE + state.contactSelectValue.id}>{state.contactSelectValue && state.contactSelectValue.email}</Link> : ''}
                                                                    </div>
                                                                    <div className="field-text">{state.contactSelectValue && state.contactSelectValue.organization}</div>
                                                                    <div className="field-text">{state.contactSelectValue && state.contactSelectValue.title ? <small>({state.contactSelectValue.title})</small> : ''}</div>
                                                                </div>
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
                            {serviceOptionMessage ? <div className="errorCls errCommonCls  mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{serviceOptionMessage}</div> : ''}
                            <p className="p-small"><strong>Note:</strong> This service will automatically be saved for future use. </p>
                            <form>
                                <div className={"floating-label " + serviceState.serviceCls}>
                                    <textarea ref={serviceTextRef} className="floating-input floating-textarea" name="service" value={serviceState.service || ''} onChange={(e) => setServiceValue(e, 'required', null, null)} placeholder="Type service name here"></textarea>
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
                                    <textarea ref={sourceTextRef} className="floating-input floating-textarea" name="source" value={sourceState.source || ''} onChange={(e) => setSourceValue(e, 'required', null, null)} placeholder="Type lead source here"></textarea>
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
                                            <input type="radio" id="customRadioInline3" onChange={() => setReferState({ ...referState, referContactType: '1' })} checked={referState.referContactType === '1' ? true : false} name="referContactType" className="custom-control-input" value="1" />
                                            <label className="custom-control-label" htmlFor="customRadioInline3">Create New</label>
                                        </div>
                                        <div className="custom-control custom-radio custom-control-inline">
                                            <input type="radio" id="customRadioInline4" onChange={() => setReferState({ ...referState, referContactType: '0' })} checked={referState.referContactType === '0' ? true : false} name="referContactType" className="custom-control-input" value="0" />
                                            <label className="custom-control-label" htmlFor="customRadioInline4">Select Existing</label>
                                        </div>
                                    </div>
                                </div>
                                {referState.referContactType === '1'
                                    ?
                                    <div className="row">
                                        <div className="form-group col-md-6">
                                            <div className={"floating-label " + referState.firstNameCls}>
                                                <input placeholder="First Name *" type="text" name="firstName" value={referState.firstName || ''} onChange={(e) => setReferInputValue(e, 'string', 50, null)} className="floating-input" />
                                                <label>First Name *</label>
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
                                                {referState.contactSelectValue && referState.contactSelectValue.phone !== null ? <div className="field-text">{referState.contactSelectValue.phone}</div> : ''}
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
            </div>
        </>
    );
}

export const AddLead = withRouter(AddLeadPage)