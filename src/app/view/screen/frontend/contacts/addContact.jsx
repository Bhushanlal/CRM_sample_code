import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../../component/frontend/header/header'
import { Footer } from '../../../component/frontend/footer/footer'
import { LIST_CONTACTS, VIEW_CONTACT_BASE } from "../../../../routing/routeContants";
import { fieldValidator, usePrevious } from '../../../../common/custom';
import { constants, selectStyle, CustomValueContainer } from '../../../../common/constants';
import { validateInputs } from '../../../../common/validation';
import { addContact, listContact, getContactById, updateContact } from '../../../../duck/contact/contact.action';
import { Link, withRouter } from "react-router-dom";
import { getContactListOptionValue } from '../../../../../api/sdk/contact';
import history from '../../../../routing/history'
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import _ from 'lodash';
import AsyncSelect from 'react-select/async';
import { setImagePath } from '../../../../common/custom'
import Swal from 'sweetalert2'
import Select from 'react-select';

export const NewAddContact = props => {
    let contactId;
    if (props.match && _.has(props.match, 'params') && _.has(props.match.params, 'id')) {
        contactId = props.match.params.id
    }
    const phoneTypeOptions = [{ value: 'Mobile', label: 'Mobile' }, { value: 'Work', label: 'Work' }, { value: 'Home', label: 'Home' }];
    const dispatch = useDispatch();
    const addContactData = useSelector(state => state.contact.addContactData);
    /* const listContactData = useSelector(state => state.contact.listContactData); */
    const getContactByIdData = useSelector(state => state.contact.getContactByIdData);
    const prevGetContactByIdData = usePrevious({ getContactByIdData });
    const prevAddContactData = usePrevious({ addContactData });
    /* const prevListContactData = usePrevious({ listContactData }); */

    // Set initial State Value  
    const [state, setState] = useState({
        firstName: '', lastName: '', email: '', phone: '', organization: '', title: '', firstNameInformation: '', phoneType: { value: 'Mobile', label: 'Mobile' },
        firstNameCls: '', emailCls: '', phoneCls: '', firstNameErr: '', emailErr: '', phoneErr: '',
        correctInput: constants.RIGHT_INPUT, wrongInput: constants.WRONG_INPUT, referBySelect: '', referBySelectValue: '',
    });
    const [loader, setLoader] = useState(false);
    const [currentPlan, setCurrentPlan] = useState('');
    /* const [referByList, setReferByList] = useState([]); */
    const [serviceMessage, setServiceMessage] = useState('');

    useEffect(() => {
        if (contactId) {
            //setLoader(true)
            dispatch(getContactById({ id: contactId }))
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // List Contact Data
    useEffect(() => {
        if (prevGetContactByIdData && prevGetContactByIdData.getContactByIdData !== getContactByIdData) {
            if (getContactByIdData && _.has(getContactByIdData, 'data') && getContactByIdData.success === true) {
                setLoader(false)
                setState({
                    ...state, email: getContactByIdData.data.email, phone: getContactByIdData.data.phone, organization: (getContactByIdData.data.organization || ''),
                    firstName: getContactByIdData.data.first_name, lastName: (getContactByIdData.data && getContactByIdData.data.last_name !== null ? getContactByIdData.data.last_name : ''),
                    phoneType: (getContactByIdData.data && getContactByIdData.data.phone_type !== null ? { value: getContactByIdData.data.phone_type, label: getContactByIdData.data.phone_type } : ''),
                    referBySelect: '',
                    referBySelectValue: (getContactByIdData.data && getContactByIdData.data.referred_by !== null ? getContactByIdData.data.referred_by : ''),
                    firstNameInformation: (getContactByIdData.data && getContactByIdData.data.first_name_information !== null ? getContactByIdData.data.first_name_information : ''),
                    title: (getContactByIdData.data && getContactByIdData.data.title !== null ? getContactByIdData.data.title : ''),
                })
                if(getContactByIdData.user_preferences && (getContactByIdData.user_preferences).length>0){
                    setCurrentPlan(getContactByIdData.user_preferences[0])
                }
            }
            if (getContactByIdData && _.has(getContactByIdData, 'message') && getContactByIdData.success === false) {
                setLoader(false)
            }
        }
    }, [getContactByIdData, prevGetContactByIdData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Check Validation Function 
    const checkValidation = (field, value, type, maxLength, minLength) => {
        return fieldValidator(field, value, type, state.password, maxLength, minLength)
    }

    // Set The Login Input Values
    const setInputValue = (e, type, maxLength, minLength) => {
        if (e.target.name === 'referByValue') {
            dispatch(listContact({ fields: 'id,first_name,last_name', filter: e.target.value }))
            setState({ ...state, [e.target.name]: e.target.value });
        } else {
            let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
            setState({ ...state, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        }
        setServiceMessage('');
    }

    // After Save Check Contact Data
    useEffect(() => {
        if (prevAddContactData && prevAddContactData.addContactData !== addContactData) {
            if (addContactData && _.has(addContactData, 'data') && addContactData.success === true) {
                setServiceMessage('')
                if(contactId){
                    props.history.push(VIEW_CONTACT_BASE+contactId)
                }else{
                    setLoader(false)
                    props.history.push(VIEW_CONTACT_BASE+addContactData.data.id)
                }
            }
            if (addContactData && _.has(addContactData, 'message') && addContactData.success === false) {
                setServiceMessage(addContactData.message)
                setLoader(false)
            }
        }
    }, [addContactData, prevAddContactData]);// eslint-disable-line react-hooks/exhaustive-deps

    // List Contact Data
    /* useEffect(() => {
        if (prevListContactData && prevListContactData.listContactData !== listContactData) {
            if (listContactData && _.has(listContactData, 'data') && listContactData.success === true) {
                setServiceMessage('')
                setLoader(false)
                let referOptions;
                if ((listContactData.data).length === 0) {
                    referOptions = [{ value: '', label: 'No data found for "' + state.referBySelect + '"' }]
                } else {
                    if (contactId) {
                        let contactListArr = _.filter(listContactData.data, (data) => `${data.id}` !== contactId);
                        referOptions = _.map(contactListArr, (data) => { return { value: data.id, label: data.first_name + ' ' + (data && data.last_name ? data.last_name : '') } })
                    } else {
                        referOptions = _.map(listContactData.data, (data) => { return { value: data.id, label: data.first_name + ' ' + (data && data.last_name ? data.last_name : '') } })
                    }
                }

                setReferByList(referOptions)
            }
            if (listContactData && _.has(listContactData, 'message') && listContactData.success === false) {
                setServiceMessage(listContactData.message)
                setLoader(false)
            }
        }
    }, [listContactData, prevListContactData, contactId]); */// eslint-disable-line react-hooks/exhaustive-deps

    // Submit Contact Function
    const saveContactData = () => {
        let success = '';
        let error = state.wrongInput;
        let firstName = state.firstName, lastName = state.lastName, email = state.email, phone = state.phone, organization = state.organization,
            title = state.title, firstNameInformation = state.firstNameInformation, phoneType = state.phoneType.value, firstNameCls = success, emailCls = '', phoneCls = '',
            firstNameErr = '', emailErr = '', phoneErr = '', organizationErr = '', getError = false;

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

        setState({
            ...state, firstNameCls, emailCls, phoneCls, firstNameErr, emailErr, phoneErr, organizationErr,
        })

        if (getError === false && emailErr === '' && firstNameErr === '' && phoneErr === '') {
            setLoader(true)
            let contactData = {
                first_name: firstName, last_name: lastName, phone_type: phoneType, organization, phone, title, first_name_information: firstNameInformation,
            };
            if (state.referBySelectValue && state.referBySelectValue.id) {
                contactData.referred_by = state.referBySelectValue.id
            }
            if (contactId) {
                contactData.id = contactId
                if (email !== '') {
                    contactData.email = email
                }
                dispatch(updateContact(contactData))
            } else {
                if (email !== '') {
                    contactData.email = email
                }
                dispatch(addContact(contactData))
            }
        }else{
            setServiceMessage('Please enter all required details.')
        }
    }

    /* const onChangeReferBySelect = (e) => {
        setState({ ...state, referBySelect: e.target.value, referBySelectValue: '' })
        dispatch(listContact({ fields: 'id,first_name,last_name', filter: e.target.value }))
    }

    const onSelectReferBy = (data) => {
        if (data.value === '') {
            setState({ ...state, referBySelect: '', referBySelectValue: '' })
        } else {
            setState({ ...state, referBySelect: data.label, referBySelectValue: data.value })
        }
        setReferByList([]);
    }

    const checkReferByOnFocus = () => {
        if (referByList.length === 1 && referByList[0].value === '') {
            setState({ ...state, referBySelect: '', referBySelectValue: '' })
            setReferByList([]);
        }
    }

    const emptyReferBy = () => {
        if (state.referBySelectValue === '') {
            setState({ ...state, referBySelect: '', referBySelectValue: '' })
            setReferByList([]);
        }
    } */

    // handle input change event
    const handleInputChange = value => {
        setState({ ...state, referBySelect: value })
    };

    // handle selection
    const handleChange = value => {
        setTimeout(() => {
            setState({ ...state, referBySelectValue: value })
        }, 0)
    }

    // load options using API call
    const loadOptions = async () => {
        let data = [];
        let listOption = await getContactListOptionValue({ searchField: 'first_name,last_name', fields: 'id,first_name,last_name', filter: state.referBySelect })
        if (listOption && listOption.data && _.has(listOption.data, 'data') && listOption.success === true) {
            if (contactId) {
                data = _.filter(listOption.data.data, (data) => `${data.id}` !== contactId);
            } else {
                data = listOption.data.data
            }

        }
        return data;
    };

    // On Cancel
    const CancelForm = (e) => {
        e.preventDefault();
        if (!contactId && (state.firstName !== '' || state.lastName !== '' || state.email !== '' || state.referBySelectValue !== '' || state.title !== '' || state.organization !== '' || state.phone !== '' || state.firstNameInformation !== '')) {
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
                    history.push(LIST_CONTACTS)
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // console.log('cancel')
                }
            })
        } else {
            if (contactId) {
                history.push(VIEW_CONTACT_BASE + contactId)
            } else {
                history.push(LIST_CONTACTS)
            }
        }
    }

    return (
        <div className="main-site fixed--header">
            <Header loader={loader} getMainRoute={'contacts'} />
            <main className="site-body">

                <section className="page-title contact--header">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-auto title--col">
                                <div>
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><Link to={LIST_CONTACTS}>Contacts</Link></li>
                                        <li className="breadcrumb-item active" aria-current="page">{contactId ? 'Edit' : 'Create'} Contact</li>
                                    </ol>
                                    <h2 className="title">{contactId ? 'Edit' : 'Create'} Contact</h2>
                                </div>
                            </div>
                            <div className="col-auto ml-auto d-flex align-items-center title-elems">
                                <button type="button" onClick={(e) => CancelForm(e)} className="btn btn-dark mr-15">Cancel</button>
                                <button type="button" disabled={(currentPlan==='' || (currentPlan && currentPlan.plan_is_active===0)) && contactId ? true : false} onClick={() => saveContactData()} className="btn btn-primary">{contactId ? 'Save' : 'Create'}</button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="middle-section">
                    <div className="container">
                        {serviceMessage ? <div className="errorCls errCommonCls"><img src={setImagePath(ERROR_ICON)} alt="" />{serviceMessage}</div> : ''}
                        <div className="row no-gutters-mbl">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form className="p-3">
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
                                                <div className="form-group col-lg-4 col-md-6 mb-lg-5">
                                                    <div className="form-row">
                                                        <div className="col-5">
                                                            <div className="floating-label">
                                                                {/*  <select className="floating-select" value={state.phoneType || ''} onChange={(e) => { setState({ ...state, phoneType: e.target.value }); setServiceMessage('') }}  >
                                                                    <option value="Mobile">Mobile</option>
                                                                    <option value="Work">Work</option>
                                                                    <option value="Home">Home</option>
                                                                </select> */}
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
                                                <div className="form-group col-lg-4 col-md-6 mb-lg-5">
                                                    <div className="floating-label">
                                                        <input placeholder="Organization Name" type="text" name="organization" value={state.organization || ''} onChange={(e) => { setState({ ...state, organization: e.target.value }); setServiceMessage('') }} className="floating-input" />
                                                        <label>Organization Name</label>
                                                    </div>
                                                </div>
                                                <div className="form-group col-lg-4 col-md-6 mb-lg-5">
                                                    <div className="floating-label">
                                                        <input placeholder="Title" type="text" name="title" value={state.title || ''} onChange={(e) => { setState({ ...state, title: e.target.value }); setServiceMessage('') }} className="floating-input" />
                                                        <label>Title</label>
                                                    </div>
                                                </div>
                                                <div className="form-group col-lg-4 col-md-5 mb-lg-2">
                                                    <div className="floating-label">
                                                        {/* <div className="outerLocGetCls">
                                                            <input name="referBy" onChange={(e) => onChangeReferBySelect(e)} value={state.referBySelect} onBlur={() => checkReferByOnFocus()} type="text" className="floating-select" id="input_2" placeholder="Referred By" autoComplete="off" />
                                                            {referByList && referByList.length > 0 ?
                                                                <div className="locGetCls">
                                                                    {_.map(referByList, (rf) => {
                                                                        return <span key={rf.value} className="innerLocGetCls" onClick={() => onSelectReferBy(rf)}>
                                                                            {rf.label ? rf.label : ''}
                                                                        </span>
                                                                    })}
                                                                </div>
                                                                : ''}
                                                            <label>Referred By</label>
                                                        </div> */}
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
                                                            value={state.referBySelectValue}
                                                            getOptionLabel={e => e.first_name + (e && e.last_name ? " " + e.last_name : '')}
                                                            getOptionValue={e => e.id}
                                                            loadOptions={(e) => loadOptions(e)}
                                                            onInputChange={(e) => handleInputChange(e)}
                                                            onChange={(e) => handleChange(e)}
                                                        />
                                                         <label>Referred By</label>
                                                    </div>
                                                </div>
                                                <div className="form-group col-lg-8 col-md-7 mb-lg-2">
                                                    <div className="floating-label">
                                                        <textarea placeholder="Add any additional information here…" className="floating-input" id="exampleFormControlTextarea1"
                                                            name="firstNameInformation" value={state.firstNameInformation || ''} onChange={(e) => { setState({ ...state, firstNameInformation: e.target.value }); setServiceMessage('') }} rows="5"></textarea>
                                                        <label>More information about {state.firstName !== '' ? state.firstName : '‘First Name’'}</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div >
    );
}

export const AddContact = withRouter(NewAddContact)