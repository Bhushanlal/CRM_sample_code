import React, { useEffect, useState, useRef } from "react";
import { Header } from "../../../component/frontend/header/header";
import { Footer } from "../../../component/frontend/auth/footer/footer";
import { useDispatch, useSelector } from "react-redux";
import { fieldValidator, usePrevious } from "../../../../common/custom";
import { withRouter } from "react-router-dom";
import {
    getSubscritpionPlan, getProfileDetail, updateBusinessProfileDetail, updateOwnerProfileDetail, updatePassword,
    makeTestPayment, deletePaymentAccount, cancelSubscritpionPlan, addProfileService
} from "../../../../duck/profile/profile.action";
import { listServiceWithSource } from '../../../../duck/lead/lead.action';
import { Loader } from "../../../component/frontend/loader/loader";
import { validateInputs } from "../../../../common/validation";
import ORANGE_ARROW from "../../../../assets/images/orange-arrow.svg";
import DELETE_SVG from "../../../../assets/images/delete-button.svg";
import BIZZ_LOGO from "../../../../assets/images/bizz-logo.jpg";
import Modal from "react-bootstrap/Modal";
import { setImagePath } from "../../../../common/custom";
import ERROR_ICON from "../../../../assets/images/error-icn.svg";
import ALERT_ICON from "../../../../assets/images/alert-icn.svg";
import CONTACT_FORM from "../../../../assets/images/mybizzhive_contact_setup_popup.png";
import CONTACT_FORM_POP from "../../../../assets/images/mybizzhive_contact_setup_popup.png";
import Select from 'react-select';
import { selectStyle, constants, CustomValueContainer, usaStates, baseUrl } from '../../../../common/constants';
import _ from "lodash";
import Swal from 'sweetalert2'
import { getUserDetails, setUserDetails } from '../../../../storage/user';
import { PayPalButton } from "react-paypal-button-v2"
import moment from 'moment'
import { SubscriptionPlan } from "./subscriptionPlans"
import { addService} from '../../../../duck/lead/lead.action';
import { RFC_2822 } from "moment";


export const ViewProfilePage = (props) => {

    const userData = getUserDetails();
    const dispatch = useDispatch();
    const paymentRef = useRef();
    const getProfileDetailData = useSelector((state) => state.profile.getProfileDetailData);
    const prevGetProfileDetailData = usePrevious({ getProfileDetailData });
    const makeTestPaymentData = useSelector(state => state.profile.makeTestPaymentData);
    const prevMakeTestPaymentData = usePrevious({ makeTestPaymentData });
    const cancelSubscriptionPlanData = useSelector(state => state.profile.cancelSubscriptionPlanData);
    const prevCancelSubscriptionPlanData = usePrevious({ cancelSubscriptionPlanData });


    const [loader, setLoader] = useState(false);
    const [currentPlan, setCurrentPlan] = useState('');
    const [subscriptionModalShow, setSubscriptionModalShow] = useState(false);
    const [paymentModalShow, setPaymentModalShow] = useState(false);
    const [testPaymentMessage, setTestPaymentMessage] = useState('');
    const [testPaymentTime, setTestPaymentTime] = useState('');
    const [isCollapse, setIsCollapse] = useState('');
    const [paypalUrl, setPaypalUrl] = useState('');
    const [paymentDetail, setPaymentDetail] = useState('');
    const [serviceMessage, setServiceMessage] = useState("");
    const [profileDetail, setProfileDetail] = useState("");
    const [subscribedData, setSubscribedData] = useState("");
    const [planPrice, setPlanPrice] = useState(0);
    const [planData, setPlanData] = useState("");

    const deletePaymentAccountData = useSelector(state => state.profile.deletePaymentAccountData);
    const prevDeletePaymentAccountData = usePrevious({ deletePaymentAccountData });

    // Owner profile detail state and props value
    const [ownerProfileModalShow, setOwnerProfileModalShow] = useState(false);
    const [ownerState, setOwnerState] = useState({
        firstName: '', lastName: '', email: '', phone: '', emailErr: '', phoneErr: '',
        firstNameCls: '', emailCls: '', phoneCls: '', firstNameErr: '',
        correctInput: '', wrongInput: constants.WRONG_INPUT, businessOwner: 1,
    });
    const [ownerServiceMessage, setOwnerServiceMessage] = useState('');
    const ownerProfileDetailData = useSelector(state => state.profile.ownerProfileDetailData);
    const prevOwnerProfileDetailData = usePrevious({ ownerProfileDetailData });

    // Change Password state and props value
    const [changePasswordModalShow, setChangePasswordModalShow] = useState(false);
    const [changePasswordState, setChangePasswordState] = useState({
        username: '', currentPassword: '', newPassword: '', confirmPassword: '',
        usernameCls: '', currentPasswordCls: '', newPasswordCls: '', confirmPasswordCls: '',
        usernameErr: '', currentPasswordErr: '', newPasswordErr: '', confirmPasswordErr: '',
        correctInput: '', wrongInput: constants.WRONG_INPUT,
    });
    const [changePasswordMessage, setChangePasswordMessage] = useState('');
    const updatePasswordData = useSelector(state => state.profile.updatePasswordData);
    const prevUpdatePasswordData = usePrevious({ updatePasswordData });

    // Add Business Information state and props value
    const countryOptions = [{ label: 'USA', value: 'USA' }];
    const [allAddress, setAllAddress] = useState('-');
    const [businessProfileModalShow, setBusinessProfileModalShow] = useState(false);
    const [businessProfileMessage, setBusinessProfileMessage] = useState('');
    const [businessProfileState, setBusinessProfileState] = useState({
        businessName: '', email: '', phone: '', city: '', streetAddress: '', state: '', zip: '', country: { value: 'USA', label: 'USA' }, website: '',
        businessNameCls: '', emailCls: '', phoneCls: '', streetAddressCls: '', cityCls: '', stateCls: '', zipCls: '', countryCls: '', companyLogo: '', companyLogoSrc: '',
        businessNameErr: '', emailErr: '', phoneErr: '', streetAddressErr: '', cityErr: '', stateErr: '', zipErr: '', countryErr: '',
        correctInput: '', wrongInput: constants.WRONG_INPUT, orgId: 1, companyLogoErr: '', companyLogoCls: '', license_no: '', bonded: 0, insured: 0
    })
    const businessProfileDetailData = useSelector(state => state.profile.businessProfileDetailData);
    const prevBusinessProfileDetailData = usePrevious({ businessProfileDetailData });

    // Contact Form Setting
    const [contactFormState, setContactFormState] = useState({
        selectService: '', selectServiceCls: '', selectServiceErr: '', servicesListOptions: [],
        service: '', serviceCls: '', serviceErr: ''
    });
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

     // Show Service 
     const showServiceModal = () => {
        setServiceModalShow(true);
        setServiceOptionMessage('');
        setTimeout(function () { serviceTextRef.current.focus(); }, 300);
        setContactFormState({ ...contactFormState,  service:'', serviceCls: '', serviceErr: '', serviceId: '' })
    } 
      // Set The Service Values
      const setServiceValue = (e, type, maxLength, minLength) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
        setContactFormState({ ...contactFormState, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        setServiceOptionMessage('');
    }
    // Add Service State And Props
    const serviceTextRef = useRef();
    const [serviceModalShow, setServiceModalShow] = useState(false);
    const [serviceOptionMessage, setServiceOptionMessage] = useState('');
    
    const addServiceData = useSelector(state => state.lead.addServiceData);
    const prevAddServiceData = usePrevious({ addServiceData });
    const listServiceWithSourceData = useSelector(state => state.lead.listServiceWithSourceData);
    const prevListServiceWithSourceData = usePrevious({ listServiceWithSourceData });
    const profileServiceData = useSelector(state => state.profile.profileServiceData);
    const prevProfileServiceData = usePrevious({ profileServiceData });

    // Get Profile Detail
    useEffect(() => {
        setLoader(true);
        dispatch(getProfileDetail())
        dispatch(listServiceWithSource())
        dispatch(getSubscritpionPlan())
        setPaypalUrl(constants.PAYPAL_BASE_URL + "&client_id=" + constants.PAYPAL_CLIENT_ID + "&response_type=code&scope=openid profile email https://uri.paypal.com/services/paypalattributes&redirect_uri=" + window.location.origin + "/user/connect-with-paypal&state=user/view-profile")
        if (props.history.location && props.history.location.state && props.history.location.state.paypalError) {
            setServiceMessage(props.history.location.state.paypalError)
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

    // Profile Detail Props
    useEffect(() => {
        if (prevGetProfileDetailData && prevGetProfileDetailData.getProfileDetailData !== getProfileDetailData) {
            if (getProfileDetailData && _.has(getProfileDetailData, 'data') && getProfileDetailData.success === true) {
                setLoader(false)
                if (props.location && props.location.hash === '#Payment') {
                    setTimeout(function () { paymentRef.current.scrollIntoView(); }, 100);
                }
                if (getProfileDetailData.user_preferences && (getProfileDetailData.user_preferences).length > 0) {
                    setCurrentPlan(getProfileDetailData.user_preferences[0])
                }
                let allData = getProfileDetailData.data;
                let allAddress = [];
                if (allData && allData.organization && allData.organization.id !== 1) {
                    if (allData.organization.street_address !== null) {
                        allAddress.push(allData.organization.street_address)
                    }
                    if (allData.organization.city !== null) {
                        allAddress.push(allData.organization.city)
                    }
                    if (allData.organization.state !== null) {
                        allAddress.push(allData.organization.state)
                    }
                    if (allData.organization.country !== null) {
                        allAddress.push(allData.organization.country)
                    }
                    if (allData.organization.zip !== null) {
                        allAddress.push(allData.organization.zip)
                    }
                }
                if (allAddress.length > 0) {
                    setAllAddress(allAddress.join(', '))
                }
                if (allData && allData.subscribe_pricing_plan && allData.subscribe_pricing_plan.plan_price) {
                    let plan_price = allData.subscribe_pricing_plan.plan_price
                    let state_tax = allData.subscribed_user && allData.subscribed_user.state_tax && allData.subscribed_user.state_tax.tax_rate ? allData.subscribed_user.state_tax.tax_rate : 0
                    let totalTaxRate = state_tax * plan_price / 100
                    setPlanPrice((parseFloat(totalTaxRate) + parseFloat(plan_price)).toFixed(2))
                }
                setPaymentDetail(allData.payment_account)
                setProfileDetail(getProfileDetailData.data)
                setSubscribedData(allData && allData.subscribed_user ? allData.subscribed_user : '')
                setPlanData(allData && allData.subscribe_pricing_plan ? allData.subscribe_pricing_plan : '')
                setTestPaymentTime(allData.test_payment && allData.test_payment.transaction_time ? allData.test_payment.transaction_time : '')
            }
            if (getProfileDetailData && _.has(getProfileDetailData, 'message') && getProfileDetailData.success === false) {
                setLoader(false)
                setServiceMessage(getProfileDetailData.message)
            }
        }
        if (prevOwnerProfileDetailData && prevOwnerProfileDetailData.ownerProfileDetailData !== ownerProfileDetailData) {
            if (ownerProfileDetailData && _.has(ownerProfileDetailData, 'data') && ownerProfileDetailData.success === true) {
                userData.firstName = ownerProfileDetailData.data.first_name;
                userData.lastName = ownerProfileDetailData.data.last_name;
                setUserDetails(userData)
                dispatch(getProfileDetail())
                setOwnerProfileModalShow(false)
            }
            if (ownerProfileDetailData && _.has(ownerProfileDetailData, 'message') && ownerProfileDetailData.success === false) {
                setLoader(false)
                setOwnerServiceMessage(ownerProfileDetailData.message)
            }
        }
        if (prevUpdatePasswordData && prevUpdatePasswordData.updatePasswordData !== updatePasswordData) {
            if (updatePasswordData && _.has(updatePasswordData, 'data') && updatePasswordData.success === true) {
                setLoader(false)
                setChangePasswordModalShow(false)
            }
            if (updatePasswordData && _.has(updatePasswordData, 'message') && updatePasswordData.success === false) {
                setLoader(false)
                setChangePasswordMessage(updatePasswordData.message)
            }
        }
        if (prevBusinessProfileDetailData && prevBusinessProfileDetailData.businessProfileDetailData !== businessProfileDetailData) {
            if (businessProfileDetailData && _.has(businessProfileDetailData, 'data') && businessProfileDetailData.success === true) {
                dispatch(getProfileDetail())
                setBusinessProfileModalShow(false)
            }
            if (businessProfileDetailData && _.has(businessProfileDetailData, 'message') && businessProfileDetailData.success === false) {
                setLoader(false)
                setOwnerServiceMessage(businessProfileDetailData.message)
            }
        }
        if (prevMakeTestPaymentData && prevMakeTestPaymentData.makeTestPaymentData !== makeTestPaymentData) {
            if (makeTestPaymentData && _.has(makeTestPaymentData, 'data') && makeTestPaymentData.success === true) {
                setLoader(false)
                setPaymentModalShow(false)
                setTestPaymentTime(makeTestPaymentData.data.transaction_time)
                let innerHTML = "<p>Payment submitted but might be put on hold if you are new to PayPal. Please login to your PayPal account and <a href='https://www.paypal.com/us/smarthelp/article/how-can-i-release-my-payment(s)-on-hold-faq3743' rel='noopener noreferrer' target='_blank'>remove the hold</a></p>";
                Swal.fire({
                    title: 'Confirmation',
                    html: innerHTML,
                    showCancelButton: false,
                    confirmButtonText: 'Ok',
                    reverseButtons: true,
                    showCloseButton: false,
                    customClass: "mycustom-alert",
                    cancelButtonClass: 'cancel-alert-note',
                }).then((result) => {

                })
            }
            if (makeTestPaymentData && _.has(makeTestPaymentData, 'message') && makeTestPaymentData.success === false) {
                setLoader(false)
                setTestPaymentMessage(makeTestPaymentData.message)
            }
        }
        if (prevDeletePaymentAccountData && prevDeletePaymentAccountData.deletePaymentAccountData !== deletePaymentAccountData) {
            if (deletePaymentAccountData && _.has(deletePaymentAccountData, 'data') && deletePaymentAccountData.success === true) {
                setLoader(false)
                setPaymentDetail('')
            }
            if (deletePaymentAccountData && _.has(deletePaymentAccountData, 'message') && deletePaymentAccountData.success === false) {
                setLoader(false)
                setServiceMessage(deletePaymentAccountData.message)
            }
        }
        if (prevCancelSubscriptionPlanData && prevCancelSubscriptionPlanData.cancelSubscriptionPlanData !== cancelSubscriptionPlanData) {
            if (cancelSubscriptionPlanData && _.has(cancelSubscriptionPlanData, 'data') && cancelSubscriptionPlanData.success === true) {
                dispatch(getProfileDetail())
            }
            if (cancelSubscriptionPlanData && _.has(cancelSubscriptionPlanData, 'message') && cancelSubscriptionPlanData.success === false) {
                setLoader(false)
                setServiceMessage(cancelSubscriptionPlanData.message)
            }
        }
        // For Contact Form Setting
        if (prevListServiceWithSourceData && prevListServiceWithSourceData.listServiceWithSourceData !== listServiceWithSourceData) {
            if (listServiceWithSourceData && _.has(listServiceWithSourceData, 'data') && listServiceWithSourceData.success === true) {
                setLoader(false)
                let serviceOption = _.map(listServiceWithSourceData.data.service_types, (data) => { return { value: data.id, label: data.name } })
                _.remove(serviceOption, function (opt) {
                    return opt.label === "Magic and Comedy Show (sample)";
                });
                let selectedService = _.find(listServiceWithSourceData.data.service_types, { 'is_default': 1 })
                setContactFormState({ ...contactFormState, servicesListOptions: serviceOption, selectService: selectedService && selectedService.id ? { value: selectedService.id, label: selectedService.name } : '' })
            }
            if (listServiceWithSourceData && _.has(listServiceWithSourceData, 'message') && listServiceWithSourceData.success === false) {
                setLoader(false)
                setServiceMessage(listServiceWithSourceData.message)
            }
        }
        // Add contact Service
        if (prevProfileServiceData && prevProfileServiceData.profileServiceData !== profileServiceData) {
            if (profileServiceData && _.has(profileServiceData, 'data') && profileServiceData.success === true) {
                dispatch(listServiceWithSource())
            }
            if (profileServiceData && _.has(profileServiceData, 'message') && profileServiceData.success === false) {
                setLoader(false)
                setServiceMessage(profileServiceData.message)
            }
        }
    }, [prevGetProfileDetailData, getProfileDetailData, prevOwnerProfileDetailData, ownerProfileDetailData, prevUpdatePasswordData, updatePasswordData, prevMakeTestPaymentData, makeTestPaymentData, deletePaymentAccountData, prevDeletePaymentAccountData, prevCancelSubscriptionPlanData, cancelSubscriptionPlanData, prevListServiceWithSourceData, listServiceWithSourceData, profileServiceData, prevProfileServiceData]); // eslint-disable-line react-hooks/exhaustive-deps


    // Check Validation Function 
    const checkValidation = (field, value, type, maxLength, minLength, fieldType) => {
        return fieldValidator(field, value, type, changePasswordState.newPassword, maxLength, minLength, fieldType)
    }

    // List Service and source Data 
    useEffect(() => {
        if (prevAddServiceData && prevAddServiceData.addServiceData !== addServiceData) {
            if (addServiceData && _.has(addServiceData, 'data') && addServiceData.success === true) {
                if (addServiceData.data && addServiceData.data.id) {
                    let allOption = contactFormState.servicesListOptions;
                    let data = { value: addServiceData.data.id, label: addServiceData.data.name }
                    allOption.push(data)
                    setContactFormState({...contactFormState , selectService:data})
                }
                setServiceModalShow(false)
                setLoader(false)
            }
            if (addServiceData && _.has(addServiceData, 'message') && addServiceData.success === false) {
                setLoader(false)
                setServiceOptionMessage(addServiceData.message)
            }
        }
      
       
    }, [ addServiceData, prevAddServiceData]);// eslint-disable-line react-hooks/exhaustive-deps


    // Set Change Password Values
    const setChangePasswordValue = (e, type, maxLength, minLength) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
        if (error.errorMsg === 'Please enter confirm password.') {
            error.errorMsg = 'Please confirm password.'
        }
        if (error.errorMsg === 'Please enter valid confirm password.') {
            error.errorMsg = 'Please make sure your passwords match. '
        }
        setChangePasswordState({ ...changePasswordState, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        setChangePasswordMessage('');
    }

    // Set Business Profile Values
    const setBusinessProfileValue = (e, type, maxLength, minLength) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
        setBusinessProfileState({ ...businessProfileState, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        setBusinessProfileMessage('');
    }

    // Open Owner Detal Modal
    const openOwnerDetalModal = (e) => {
        e.currentTarget.blur();
        setOwnerState({
            ...ownerState, firstName: profileDetail && profileDetail.first_name !== null ? profileDetail.first_name : '',
            lastName: profileDetail && profileDetail.last_name !== null ? profileDetail.last_name : '',
            email: profileDetail && profileDetail.email !== null ? profileDetail.email : '',
            phone: profileDetail && profileDetail.profile && profileDetail.profile.phone !== null ? profileDetail.profile.phone : '',
            businessOwner: profileDetail && profileDetail.profile && profileDetail.profile.business_owner !== null ? profileDetail.profile.business_owner : 1,
        })
        setOwnerProfileModalShow(true)
        setOwnerServiceMessage('')
    }

    // Open Change Password Modal
    const openChangePasswordModal = (e) => {
        e.currentTarget.blur();
        setChangePasswordState({
            ...changePasswordState, username: profileDetail && profileDetail.email !== null ? profileDetail.email : '', currentPassword: '', newPassword: '', confirmPassword: ''
        })
        setChangePasswordModalShow(true)
    }

    // Open Business Profile Modal
    const openBusinessProfileModal = (e) => {
        e.currentTarget.blur();
        if (profileDetail && profileDetail.organization && profileDetail.organization.name !== "Default") {
            setBusinessProfileState({
                ...businessProfileState,
                businessName: profileDetail && profileDetail.organization.name !== null ? profileDetail.organization.name : '',
                email: profileDetail && profileDetail.organization.email !== null ? profileDetail.organization.email : '',
                phone: profileDetail && profileDetail.organization.phone !== null ? profileDetail.organization.phone : '',
                streetAddress: profileDetail && profileDetail.organization.street_address !== null ? profileDetail.organization.street_address : '',
                city: profileDetail && profileDetail.organization.city !== null ? profileDetail.organization.city : '',
                zip: profileDetail && profileDetail.organization.zip !== null ? profileDetail.organization.zip : '',
                website: profileDetail && profileDetail.organization.website !== null ? profileDetail.organization.website : '',
                license_no: profileDetail && profileDetail.organization.license_no !== null ? profileDetail.organization.license_no : '',
                state: profileDetail && profileDetail.organization.state !== null ? { value: profileDetail.organization.state, label: profileDetail.organization.state } : '',
                orgId: profileDetail && profileDetail.organization.id !== null ? profileDetail.organization.id : 1,
                companyLogoSrc: profileDetail && profileDetail.organization.company_logo !== null ? baseUrl[0] + profileDetail.organization.company_logo : '',
                bonded: profileDetail && profileDetail.organization.bonded !== null ? profileDetail.organization.bonded : 0,
                insured: profileDetail && profileDetail.organization.insured !== null ? profileDetail.organization.insured : 0,
            })
        } else {
            setBusinessProfileState({
                ...businessProfileState, businessName: '', email: '', phone: '', city: '', streetAddress: '', state: '', zip: '', country: { value: 'USA', label: 'USA' }, website: '',
                businessNameCls: '', emailCls: '', phoneCls: '', streetAddressCls: '', cityCls: '', stateCls: '', zipCls: '', countryCls: '', companyLogo: '', companyLogoSrc: '',
                businessNameErr: '', emailErr: '', phoneErr: '', streetAddressErr: '', cityErr: '', stateErr: '', zipErr: '', countryErr: '', bonded: 0, insured: 0,
                correctInput: '', wrongInput: constants.WRONG_INPUT, orgId: 1
            })
        }
        setBusinessProfileModalShow(true)
    }

    // Save Owner Detal
    const saveOwnerDetail = (e) => {
        let error = ownerState.wrongInput;
        let firstName = ownerState.firstName, lastName = ownerState.lastName, email = ownerState.email, phone = ownerState.phone, businessOwner = ownerState.businessOwner,
            firstNameCls = '', emailCls = '', phoneCls = '', lastNameCls = '', firstNameErr = '', emailErr = '',
            phoneErr = '', lastNameErr = '', getError = false;

        if (validateInputs('string', firstName) === false) {
            firstNameErr = 'Please enter valid first name.';
            firstNameCls = error
            getError = true;
        } else if (firstName.length > 50) {
            firstNameErr = 'Please enter maximum 50 characters.';
            firstNameCls = error
            getError = true;
        }

        if (validateInputs('string', lastName) === false) {
            lastNameErr = 'Please enter valid last name.';
            lastNameCls = error
            getError = true;
        } else if (lastName.length > 50) {
            lastNameErr = 'Please enter maximum 50 characters.';
            lastNameCls = error
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

        setOwnerState({
            ...ownerState, firstNameCls, emailCls, phoneCls, firstNameErr, emailErr, phoneErr, lastNameCls, lastNameErr
        })

        if (getError === false && emailErr === '' && firstNameErr === '' && phoneErr === '') {
            let ownerData = { first_name: firstName, last_name: lastName, email, phone, business_owner: businessOwner }
            setLoader(true);
            dispatch(updateOwnerProfileDetail(ownerData))
        }
    }

    // Change Password
    const changePassword = (e) => {
        let error = changePasswordState.wrongInput;
        let currentPassword = changePasswordState.currentPassword, newPassword = changePasswordState.newPassword, confirmPassword = changePasswordState.confirmPassword,
            currentPasswordCls = '', newPasswordCls = '', confirmPasswordCls = '', currentPasswordErr = '', newPasswordErr = '', confirmPasswordErr = '', getError = false;


        if (validateInputs('password', currentPassword) === 'empty') {
            currentPasswordErr = 'Please enter current password.';
            currentPasswordCls = error;
            getError = true;
        } else if (validateInputs('password', currentPassword) === false) {
            currentPasswordErr = 'A special character, an upper case, a lower case, a number & minimum 8 character are required';
            currentPasswordCls = error;
            getError = true;
        }

        if (validateInputs('password', newPassword) === 'empty') {
            newPasswordErr = 'Please enter new password.';
            newPasswordCls = error;
            getError = true;
        } else if (validateInputs('password', newPassword) === false) {
            newPasswordErr = 'A special character, an upper case, a lower case, a number & minimum 8 character are required';
            newPasswordCls = error;
            getError = true;
        }

        if (confirmPassword === '') {
            confirmPasswordErr = 'Please confirm password.';
            confirmPasswordCls = error;
            getError = true;
        } else if (newPassword !== confirmPassword) {
            confirmPasswordErr = 'Please make sure your passwords match.';
            confirmPasswordCls = error;
            getError = true;
        }

        setChangePasswordState({ ...changePasswordState, currentPasswordCls, currentPasswordErr, newPasswordCls, newPasswordErr, confirmPasswordCls, confirmPasswordErr })

        if (getError === false && currentPasswordErr === '' && newPasswordErr === '' && confirmPasswordErr === '') {
            setLoader(true)
            dispatch(updatePassword({ current_password: currentPassword, password: newPassword, password_confirmation: confirmPassword }))
        }
    }

    const onSelectFile = e => {
        if (e && e.target.value.length !== 0) {
            setBusinessProfileState({ ...businessProfileState, companyLogo: e.target.files[0], companyLogoSrc: URL.createObjectURL(e.target.files[0]), companyLogoErr: '', companyLogoCls: '' })
        }
    };

    // Save Business Profile Data 
    const saveBusinessProfileData = (e) => {
        let error = businessProfileState.wrongInput;
        let zip = businessProfileState.zip, companyLogo = businessProfileState.companyLogo, country = businessProfileState.country.value, state = businessProfileState.state.value, businessName = businessProfileState.businessName,
            streetAddress = businessProfileState.streetAddress, city = businessProfileState.city, email = businessProfileState.email, phone = businessProfileState.phone, businessNameCls = '', countryCls = '', countryErr = '', emailCls = '',
            zipCls = '', stateCls = '', stateErr = '', zipErr = '', phoneCls = '', cityCls = '', businessNameErr = '', emailErr = '', streetAddressCls = '', streetAddressErr = '',
            phoneErr = '', cityErr = '', getError = false, website = businessProfileState.website, companyLogoErr = '', companyLogoCls = '';

        if (validateInputs('string', businessName) === 'empty') {
            businessNameErr = 'Please enter business name.';
            businessNameCls = error
            getError = true;
        } else if (validateInputs('string', businessName) === false) {
            businessNameErr = 'Please enter valid business name.';
            businessNameCls = error
            getError = true;
        } else if (businessName.length > 50) {
            businessNameErr = 'Please enter maximum 50 characters.';
            businessNameCls = error
            getError = true;
        }

        if (validateInputs('required', state) === 'empty') {
            stateErr = "Please select state.";
            stateCls = error;
            getError = true;
        }
        if (validateInputs('required', country) === 'empty') {
            countryErr = "Please select country.";
            countryCls = error;
            getError = true;
        }

        if (validateInputs('string', zip) === 'empty') {
            zipErr = 'Please enter zip.';
            zipCls = error
            getError = true;
        } else if (validateInputs('string', zip) === false) {
            zipErr = 'Please enter valid zip.';
            zipCls = error
            getError = true;
        } else if (zip.length > 10) {
            zipErr = 'Please enter maximum 10 characters.';
            zipCls = error
            getError = true;
        }


        if (validateInputs('string', streetAddress) === 'empty') {
            streetAddressErr = 'Please enter street Address.';
            streetAddressCls = error
            getError = true;
        } else if (validateInputs('string', streetAddress) === false) {
            streetAddressErr = 'Please enter valid street Address.';
            streetAddressCls = error
            getError = true;
        }

        if (validateInputs('string', city) === 'empty') {
            cityErr = 'Please enter city.';
            cityCls = error
            getError = true;
        } else if (validateInputs('string', city) === false) {
            cityErr = 'Please enter valid city.';
            cityCls = error
            getError = true;
        } else if (city.length > 50) {
            cityErr = 'Please enter maximum 50 characters.';
            cityCls = error
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

        if (validateInputs('phoneNumberHyphon', phone) === 'empty') {
            phoneErr = 'Please enter phone.';
            phoneCls = error
            getError = true;
        } else if (validateInputs('phoneNumberHyphon', phone) === false) {
            phoneErr = 'Please enter valid phone.';
            phoneCls = error
            getError = true;
        }
        if (phone && phone.length > 1 && phone.length > 15) {
            phoneErr = 'Please enter maximum 15 digits.';
            phoneCls = error
            getError = true;
        }

        if (companyLogo && !companyLogo.name.match(/\.(jpg|jpeg|png)$/)) {
            companyLogoErr = 'Please select valid image.';
            companyLogoCls = error
            getError = true;
        } else if (companyLogo && companyLogo.size / 1024 / 1024 > 10) {
            companyLogoErr = 'Image size is grater than 10 MB.';
            companyLogoCls = error
            getError = true;
        }

        setBusinessProfileState({
            ...businessProfileState, zipCls, zipErr, countryCls, countryErr, stateCls, stateErr, businessNameCls, streetAddressCls, streetAddressErr, emailCls, phoneCls, businessNameErr, emailErr, phoneErr, cityCls, cityErr, companyLogoCls, companyLogoErr
        })

        if (getError === false && emailErr === '' && stateErr === '' && countryErr === '' && zipErr === '' && businessNameErr === '' && phoneErr === '' && streetAddressErr === '') {
            //console.log(businessProfileState)
            const businessProfileData = new FormData()
            businessProfileData.append('city', city);
            businessProfileData.append('state', state);
            businessProfileData.append('country', country);
            businessProfileData.append('zip', zip);
            businessProfileData.append('email', email);
            businessProfileData.append('phone', phone);
            businessProfileData.append('name', businessName);
            businessProfileData.append('street_address', streetAddress);
            businessProfileData.append('website', website);
            businessProfileData.append('license_no', businessProfileState.license_no);
            businessProfileData.append('bonded', businessProfileState.bonded);
            businessProfileData.append('insured', businessProfileState.insured);
            if (companyLogo && companyLogo !== '') {
                businessProfileData.append('company_logo', companyLogo);
            }
            let innerHTML = "<h5><img src=" + setImagePath(ALERT_ICON) + "> Confirm Business Name</h5><div className='mt-3'> <p>Business name you entered <strong>" + businessName + "</strong></p><p>Please confirm if your business name is accurate, once <strong>submitted you will not be able to change the business name.</strong> </p></div>";
            /* console.log(businessProfileData, 'businessProfileData') */
            /* let businessProfile = { name: businessName, street_address: streetAddress, city, state, country, zip, email, phone } */
            if (businessProfileState.orgId !== 1) {
                setLoader(true)
                dispatch(updateBusinessProfileDetail(businessProfileData))
            } else {
                Swal.fire({
                    html: innerHTML,
                    showCancelButton: true,
                    confirmButtonText: 'Submit',
                    cancelButtonText: 'Edit Name',
                    reverseButtons: true,
                    showCloseButton: true,
                    customClass: "mycustom-alert",
                    cancelButtonClass: 'cancel-alert-note',
                }).then((result) => {
                    if (result.value) {
                        setLoader(true)
                        dispatch(updateBusinessProfileDetail(businessProfileData))
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        // console.log('cancel')
                    }
                })
            }
        }
    }

    // Delete company logo
    const deleteCompanyLogo = (e) => {
        e.preventDefault();
        setBusinessProfileState({ ...businessProfileState, companyLogo: '', companyLogoSrc: '', companyLogoErr: '', companyLogoCls: '' })
    }

    // Test Paypal Account
    const testPaypalAccount = (e) => {
        e.preventDefault();
        setPaymentModalShow(true)
        setLoader(true)
    }

    // Remove Paypal Account Function 
    const removePaypalAccount = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: ' You want to remove paypal account.',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it',
            cancelButtonText: 'No, keep it',
            reverseButtons: true,
            showCloseButton: true,
            customClass: "mycustom-alert",
            cancelButtonClass: 'cancel-alert-note',
        }).then((result) => {
            if (result.value) {
                setLoader(true)
                dispatch(deletePaymentAccount({ id: paymentDetail.id }))
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // console.log('cancel')
            }
        })
    }

    // Cancel Subscription Plan Function 
    const cancelSubscriptionPlanfunc = (e) => {
        e.preventDefault();
        let msg;
        if (userData && userData.planData && userData.planData.plan_interval === 'year') {
            msg = "Send us an email at <a href='#email'>cancellation@mybizzhive.com</a> and we will process the refund. There are no partial refunds for monthly subscriptions. For yearly subscriptions, the refund amount will be calculated as follows:<br /><br /> <strong>Total Amount paid for a yearly subscription - [ Number of months you have used the app for * regular month to month subscription charges of the plan you picked]</strong>"
        } else {
            msg = "<div>Unfortunately, there are no partial refunds for monthly subscriptions. You will have access to your plan until <strong>" + moment(userData.planData.plan_expiration_date).format('LL') + "</strong> i.e. until end of current subscrption and won’t renew further.<br /><br />Do you want to proceed with the cancellation?</div>"
        }

        Swal.fire({
            title: 'Cancel Subscription?',
            html: msg,
            showCancelButton: true,
            confirmButtonText: 'Yes, cancel it',
            cancelButtonText: 'No, keep it',
            reverseButtons: true,
            showCloseButton: true,
            customClass: "mycustom-alert",
            cancelButtonClass: 'cancel-alert-note',
        }).then((result) => {
            if (result.value) {
                setLoader(true)
                dispatch(cancelSubscritpionPlan({}))
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // console.log('cancel')
            }
        })
    }

    const saveContactServiceData = (e) => {
        e.preventDefault();
        let error = ownerState.wrongInput;
        let selectService = contactFormState.selectService, selectServiceCls = '', selectServiceErr = '', getError = false;

        if (validateInputs('required', contactFormState.selectService) === 'empty') {
            selectServiceErr = "Please select Service.";
            selectServiceCls = error;
            getError = true;
        }

        setContactFormState({
            ...contactFormState, selectService, selectServiceCls, selectServiceErr,
        })

        if (getError === false && selectServiceErr === "") {
            setLoader(true)
            dispatch(addProfileService({ id: contactFormState.selectService.value }))
        }
    }
      // Save Service Data
      const saveServiceData = () => {
        let success = '';
        let error = ownerState.wrongInput;
        let service = contactFormState.service, serviceErr = '',serviceCls = success, getError = false;

        if (validateInputs('required', service) === 'empty') {
        serviceErr = 'Please enter service.';
        serviceCls = error
            getError = true;
        }

        setContactFormState({
            ...contactFormState, serviceCls,serviceErr
        })

        if (getError === false && serviceErr === '') {
            setLoader(true)
            dispatch(addService({ name: service }))
        }
    }
    return (
        <>
            <Loader loader={loader} />
            <div className="main-site fixed--header profie-page">
                <Header getMainRoute={'profile'} />
                <main className="site-body site-footer-m0">
                    <section className="page-title contact--header">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-auto title--col">
                                    <div>
                                        <h2 className="title">My Profile</h2>
                                    </div>
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
                                        <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#AccountCollapse" aria-expanded="true" aria-controls="AccountCollapse">Account Owner <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                        <div className={"card main-card--collapse show " + isCollapse} id="AccountCollapse">
                                            <div className="card-header py-4 d-flex justify-content-between align-items-center">
                                                <h2>Account Owner</h2>
                                                <div className="card-header_btns d-flex justify-content-end align-items-center">
                                                    <button onClick={(e) => openChangePasswordModal(e)} className="btn btn-secondary ml-15">Change Password</button>
                                                    <button onClick={(e) => openOwnerDetalModal(e)} className="btn btn-secondary ml-15">Edit</button>
                                                </div>
                                            </div>
                                            <div className="card-body pt-1">
                                                <div className="contact-detail--wrap">
                                                    <div className="row no-gutters-mbl">
                                                        <div className="col-lg-3 col-md-5">
                                                            <div className="form-group">
                                                                <label>Name</label>
                                                                <div className="field-text">{profileDetail.first_name && profileDetail.first_name !== null ? (profileDetail.first_name + (profileDetail.last_name && profileDetail.last_name !== null ? ' ' + profileDetail.last_name : '')) : '-'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-5">
                                                            <div className="form-group">
                                                                <label>Phone Number</label>
                                                                <div className="field-text">{profileDetail.profile && profileDetail.profile !== null ? (profileDetail.profile && profileDetail.profile.phone !== null ? profileDetail.profile.phone : '-') : '-'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-5">
                                                            <div className="form-group">
                                                                <label>Business Owner</label>
                                                                <div className="field-text">{profileDetail.profile && profileDetail.profile !== null ? (profileDetail.profile && profileDetail.profile.business_owner === 0 ? 'No' : 'Yes') : 'Yes'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-5">
                                                            <div className="form-group">
                                                                <label>Email Address</label>
                                                                <div className="field-text">{profileDetail.email && profileDetail.email !== null ? profileDetail.email : '-'}</div>
                                                            </div>
                                                        </div>
                                                        {/* <div className="col-lg-3 col-md-5">
                                                                <div className="form-group">
                                                                    <label>Password</label>
                                                                    <div className="field-text">************</div>
                                                                </div>
                                                            </div> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row no-gutters-mbl mb-lg-4">
                                <div className="col-12">
                                    <div className="main-card">
                                        <div className="main-card">
                                            <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#BusinessCollapse" aria-expanded="false" aria-controls="BusinessCollapse">Business Profile<img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                            <div className={"card main-card--collapse " + isCollapse} id="BusinessCollapse">
                                                <div className="card-header py-4 d-flex justify-content-between align-items-center">
                                                    <h2>Business Profile</h2>
                                                    <div className="card-header_btns d-flex justify-content-end align-items-center">
                                                        <button onClick={(e) => openBusinessProfileModal(e)} className="btn btn-secondary ml-15">Edit</button>
                                                    </div>
                                                </div>
                                                <div className="card-body pt-1">
                                                    <div className="contact-detail--wrap">
                                                        <div className="row no-gutters-mbl" ref={paymentRef}>
                                                            <div className="col-lg-3">
                                                                <div className="form-group">
                                                                    <label>Name</label>
                                                                    <div className="field-text">{profileDetail.organization && profileDetail.organization.name !== 'Default' ? profileDetail.organization.name : '-'} </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-3">
                                                                <div className="form-group">
                                                                    <label>Email Address</label>
                                                                    <div className="field-text">{profileDetail.organization && profileDetail.organization.name !== 'Default' ? profileDetail.organization.email : '-'}</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-3">
                                                                <div className="form-group">
                                                                    <label>Phone Number</label>
                                                                    <div className="field-text">{profileDetail.organization && profileDetail.organization.name !== 'Default' ? profileDetail.organization.phone : '-'}</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-3">
                                                                <div className="form-group">
                                                                    <label>Website</label>
                                                                    <div className="field-text">{profileDetail.organization && profileDetail.organization.name !== 'Default' ? profileDetail.organization.website || '-' : '-'}</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-3">
                                                                <div className="form-group">
                                                                    <label>Street Address</label>
                                                                    <div className="field-text">{profileDetail.organization && profileDetail.organization.name !== 'Default' ?
                                                                        <>
                                                                            {allAddress}
                                                                            <a href={"https://www.google.com/maps/search/?api=1&query=" + allAddress} rel="noopener noreferrer" target="_blank" className="text-link ml-1">(Map)</a>
                                                                        </>
                                                                        : '-'} </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-3">
                                                                <div className="form-group">
                                                                    <label>Company Logo</label>
                                                                    <div className="field-text">{profileDetail.organization && profileDetail.organization.name !== 'Default' ? <div className="logo_imgg"><img src={profileDetail.organization.company_logo ? setImagePath(baseUrl[0] + profileDetail.organization.company_logo) : setImagePath(BIZZ_LOGO)} alt="" style={{ height: 50, width: 50 }} /></div> : '-'}</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-3" >
                                                                <div className="form-group">
                                                                    <label>License #</label>
                                                                    <div className="field-text">{profileDetail.organization && profileDetail.organization.name !== 'Default' ? (profileDetail.organization.license_no !== null ? profileDetail.organization.license_no : '-') || '-' : '-'}</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-3">
                                                                <div className="form-group pt-4">
                                                                    <div className="custom-control profile-flag custom-checkbox">
                                                                        <input type="checkbox" name="bonded" disabled checked={profileDetail.organization && profileDetail.organization.bonded === 1 ? true : false} className="custom-control-input" id='flag-bonded' />
                                                                        <label className="custom-control-label" htmlFor='flag-bonded'>Bonded</label>
                                                                    </div>
                                                                    <div className="custom-control profile-flag custom-checkbox pl-5">
                                                                        <input type="checkbox" name="insured" disabled checked={profileDetail.organization && profileDetail.organization.insured === 1 ? true : false} className="custom-control-input" id='flag-insured' />
                                                                        <label className="custom-control-label" htmlFor='flag-insured'>Insured</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row no-gutters-mbl mb-lg-4">
                                <div className="col-12" >
                                    {paymentDetail && paymentDetail.id ?
                                        <div className="main-card">
                                            <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#PaymentCollapse" aria-expanded="false" aria-controls="PaymentCollapse">Collect Payments using PayPal Account <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                            <div className={"card main-card--collapse " + isCollapse} id="PaymentCollapse">
                                                <div className="card-header py-4 d-flex justify-content-between align-items-center">
                                                    <h2>Collect Payments using PayPal Account</h2>
                                                    <div>
                                                        <a href="#remove-plan" onClick={(e) => removePaypalAccount(e)} className="btn text-danger p-0 mr-3"><img src={DELETE_SVG} alt="" /> Remove PayPal</a>
                                                        <a href={paypalUrl} className="btn btn-secondary">Use different PayPal ID</a>
                                                    </div>
                                                </div>
                                                <div className="card-body pt-1">
                                                    <div className="contact-detail--wrap">
                                                        <p>Add your <strong>PayPal account</strong> info to collect deposit/payments from your customers. Your customer can pay with any credit card or PayPal. <br />The payments will be directly deposited to your PayPal account. There is no additional processing fees. <a href="https://www.paypal.com/us/business/how-paypal-works" rel="noopener noreferrer" target="_blank" >(Don’t have a PayPal account?)</a></p>
                                                        <div className="row">
                                                            <div className="col-lg-5">
                                                                <div className="yourid-wrap">
                                                                    <div className="youridtxt">
                                                                        <h5>Your PayPal ID</h5>
                                                                        <p>{paymentDetail.paypal_email}</p>
                                                                        <p className="field-text"><small className="mt-1 d-block">Added on: {moment(paymentDetail.updated_at).format('h:mm A, MMM Do')}</small></p>
                                                                    </div>
                                                                    {/* <div className="yourchangeid">
                                                                            <a href={paypalUrl}>Change ID</a>
                                                                        </div> */}
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-7">
                                                                <div className="paymentnotice-wrap">
                                                                    <p className="noticecol"><strong>Important:</strong> Send a test payment of $1 to yourself to confirm your PayPal is set to accept payments. You can use a valid credit card (or any other PayPal ID)  </p>
                                                                    <div className="paymentbtn">
                                                                        <div><button type="button" onClick={(e) => testPaypalAccount(e)} className="btn btn-secondary">Send $1 to your PayPal </button></div>
                                                                        {testPaymentTime !== '' ? <p>Test payment sent on: {moment(testPaymentTime).format('h:mm A, MMM Do')}</p> : ''}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        :
                                        <div className="main-card">
                                            <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#PaymentCollapse" aria-expanded="false" aria-controls="PaymentCollapse">Collect Payments using PayPal Account <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                            <div className={"card main-card--collapse " + isCollapse} id="PaymentCollapse">
                                                <div className="card-header py-4 d-flex justify-content-between align-items-center">
                                                    <h2>Collect Payments using PayPal Account</h2>
                                                    <a href={paypalUrl} className="btn btn-secondary">Add PayPal ID</a>
                                                </div>
                                                <div className="card-body pt-1">
                                                    <div className="contact-detail--wrap">
                                                        <p>Add your <strong>PayPal account</strong> info to collect deposit/payments from your customers. Your customer can pay with any credit card or PayPal.
                                                    The payments will be directly deposited to your PayPal account. There is no additional processing fees. <a href="https://www.paypal.com/us/business/how-paypal-works" rel="noopener noreferrer" target="_blank" >(Don’t have a PayPal account?)</a></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                </div>
                            </div>

                            <div className="row no-gutters-mbl mb-lg-4">
                                <div className="col-12">
                                    <div className="main-card">
                                        <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#ContactCollapse" aria-expanded="false" aria-controls="ContactCollapse">Website Contact Form Setup <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                        <div className={"card main-card--collapse " + isCollapse} id="ContactCollapse">
                                            <div className="card-header py-4 d-flex justify-content-between align-items-center">
                                                <h2>Website Contact Form Setup</h2>
                                            </div>
                                            <div className="card-body pt-1">
                                                <div className="contact-detail--wrap">

                                                    <p className="mb-4">Automatically create leads (and contacts) on your Leads board when your customers submit requests on your website.</p>
                                                    <div className="row">
                                                        <div className="col-lg-6 order-lg-last mb-3">
                                                            <div className="contactformguidimg pl-lg-4"><img  data-toggle="modal" data-target="#contact-setting-modal"  className="img-fluid" src={setImagePath(CONTACT_FORM)} alt="" /></div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                        <ol className="pl-3" >
                                                                <div className = "contactformli">
                                                                <li><strong>Edit the contact form.</strong>. Go to Contact > Contact Forms page from the left-side WordPress Admin Panel menu</li>
                                                                <li ><strong>Open the Mail tab</strong> on Edit Contact Form page</li>
                                                                <li > <strong className="text-danger mt-4 mb-1">Important:</strong> The <strong> 'Form'</strong> field email address should be same as your MyBizzHive login email ID</li>
                                                                <li ><strong>Add Cc: create@lead.mybizzhive.com</strong> in Additional headers field</li>
                                                                <li >Scroll down to click on save</li>
                                                                <li >We will capture your customer Name, Email Address, Phone Number and any addition info will be under 'More Information' field</li>    
                                                                </div>
                                                            </ol>

                                                            <div className="row align-items-center mb-3 mt-4">
                                                                <div className="col-lg-auto col-12 mb-lg-0 mb-2"><strong>Assign Online Leads to</strong> </div>
                                                                <div className="col asignleadselect">
                                                                    <div className="contact-service-set">
                                                                        <div className={"floating-label " + contactFormState.selectServiceCls}>
                                                                            <Select
                                                                                styles={selectStyle}
                                                                                className="floating-select"
                                                                                placeholder="Select service name/package*"
                                                                                components={{ MenuList: addExtraService, ValueContainer: CustomValueContainer, NoOptionsMessage: () => null }}
                                                                                options={contactFormState.servicesListOptions}
                                                                                value={contactFormState.selectService}
                                                                                /* menuIsOpen={true} */
                                                                                onChange={(data) => setContactFormState({ ...contactFormState, selectService: data, selectServiceErr: '', selectServiceCls: '' })}
                                                                            />
                                                                            {contactFormState.selectServiceErr ? <span className="errorValidationMessage"> {contactFormState.selectServiceErr}</span> : ''}
                                                                        </div>
                                                                        <button type="button" className="btn btn-secondary ml-auto" onClick={(e) => saveContactServiceData(e)}>Save</button>
                                                                    </div>
                                                                    <p className="rvwqt-note mt-4">All online leads will be created under this service/category.<br /> You can change it at anytime. </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <p className="rvwqt-note mt-5"><strong>Note:</strong> You can also copy/paste request details from your website and email it to <a href="mailto:create@lead.mybizzhive.com">create@lead.mybizzhive.com</a>. The email must be sent from the email address used as login ID<br /> and in the text format. (Not sure? Learn how to check <a href="https://support.google.com/mail/answer/8260?co=GENIE.Platform%3DDesktop&hl=en" rel="noopener noreferrer" target="_blank">Gmail</a> or <a href="https://support.microsoft.com/en-us/office/change-the-message-format-to-html-rich-text-format-or-plain-text-338a389d-11da-47fe-b693-cf41f792fefa" rel="noopener noreferrer" target="_blank">Outlook</a> email formats)</p>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row no-gutters-mbl mb-lg-4">
                                <div className="col-12">
                                    <div className="main-card">
                                        <button className="btn btn-block btn--card-collapse" type="button" data-toggle="collapse" data-target="#SubsCollapse" aria-expanded="false" aria-controls="SubsCollapse">Subscription Details <img src={setImagePath(ORANGE_ARROW)} alt="" /></button>
                                        <div className={"card main-card--collapse " + isCollapse} id="SubsCollapse">
                                            <div className="card-header py-4 d-flex justify-content-between align-items-center">
                                                <h2>Subscription Details</h2>
                                                <div className="plan-status">
                                                    {subscribedData && subscribedData.subscription_status === 'active' && currentPlan && currentPlan.subscription_product_id !== 1 ?
                                                        <a href="#remove-paypal" onClick={(e) => cancelSubscriptionPlanfunc(e)} className="btn text-danger p-0 mr-3"><img src={DELETE_SVG} alt="" /> Cancel Plan</a>
                                                        : ''}
                                                    {currentPlan && currentPlan.plan_is_active === 1 ?
                                                        currentPlan.subscription_product_id === 1 ?
                                                            <div className="plan-status-txt">
                                                                <div className="plan-status-box">FREE Trial: {currentPlan && currentPlan.trial_product_type === 4 ? 'Platinum' : 'Gold'}</div>
                                                                <p>Expires on: {moment(subscribedData.plan_expiration_date).format('MMM DD YYYY')}</p>
                                                            </div> : ''
                                                        :
                                                        currentPlan && currentPlan.stripe_product_name ?
                                                            <div className="plan-status-txt expired">
                                                                <div className="plan-status-box">{currentPlan.subscription_product_id === 1 ? 'Trial Expired' : currentPlan.stripe_product_name + ' Plan Expired'}</div>
                                                                {currentPlan.subscription_product_id === 1 ? <p>Expired on: {moment(subscribedData.plan_expiration_date).format('MMM DD YYYY')}</p> : ''}
                                                            </div> : ''

                                                    }
                                                    <button type="button" onClick={() => { setSubscriptionModalShow(true) }} className="btn btn-secondary">{(planData && (planData.stripe_price_id === 'trail_plan')) || planData === '' ? 'View Plans ' : (subscribedData && subscribedData.is_active === 1 ? 'Change Plan' : 'Renew Plan')}</button>
                                                </div>
                                            </div>
                                            <div className="card-body pt-1">
                                                <div className="contact-detail--wrap">
                                                    <div className="row no-gutters-mbl" ref={paymentRef}>
                                                        <div className="col-lg-3">
                                                            <div className="form-group">
                                                                <label>Plan</label>
                                                                <div className="field-text">{planData && planData.subscription_product ? planData.stripe_price_id === 'trail_plan' ? (currentPlan && currentPlan.trial_product_type === 4 ? 'Platinum' : 'Gold') : planData.subscription_product.stripe_product_name /* + ' ( $' + planData.final_price + '/' + planData.interval + ')' */ : '-'} </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3">
                                                            <div className="form-group">
                                                                <label>{subscribedData && subscribedData.subscription_status === 'active' && currentPlan && currentPlan.subscription_product_id !== 1 ? 'Auto-renews on' : 'Expires on'}</label>
                                                                <div className={currentPlan && currentPlan.plan_is_active === 0 && currentPlan.subscription_product_id !== 1 ? "field-text text-danger" : "field-text"}>{subscribedData && subscribedData.plan_expiration_date ? moment(subscribedData.plan_expiration_date).format('ddd, MMM DD YYYY') : '-'}</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3">
                                                            <div className="form-group">
                                                                <label>Term</label>
                                                                <div className="field-text">{planData && planData.stripe_price_id === 'trail_plan' ? '-' : (planData && planData.interval ? (planData.interval === 'month' ? 'Monthly' : planData.interval === 'year' ? 'Yearly' : planData.interval) : '-')}</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3">
                                                            <div className="form-group">
                                                                <label>Price (Including Taxes)</label>
                                                                <div className="field-text">${planPrice} <span className="font-weight-normal">{(subscribedData.state_tax && subscribedData.state_tax.state_name ? '(' + subscribedData.state_tax.state_name + ')' : '')}</span> </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3">
                                                            <div className="form-group">
                                                                <label>Member Since</label>
                                                                <div className="field-text">{moment(profileDetail.created_at).format('YYYY')}</div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3">
                                                            <div className="form-group">
                                                                <label>Purchased on</label>
                                                                <div className="field-text">{subscribedData && subscribedData.plan_start_date ? moment(subscribedData.plan_start_date).format('ddd, MMM DD YYYY') : '-'}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </main>

                {/* Owner Profile Modal*/}
                <Modal show={ownerProfileModalShow} onHide={() => setOwnerProfileModalShow(false)} size="lg" className="" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Edit Account Details
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {ownerServiceMessage ? <div className="errorCls errCommonCls mb-3"> <img src={ERROR_ICON} alt="" /> {ownerServiceMessage} </div> : ""}
                        <form>
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <div className={"floating-label " + ownerState.firstNameCls}>
                                        <input placeholder="First Name" type="text" name="firstName" value={ownerState.firstName || ''} onChange={(e) => { setOwnerState({ ...ownerState, firstName: e.target.value, firstNameCls: '', firstNameErr: '' }); setOwnerServiceMessage('') }} className="floating-input" />
                                        <label>First Name</label>
                                        {ownerState.firstNameErr ? <span className="errorValidationMessage"> {ownerState.firstNameErr}</span> : ''}
                                    </div>
                                </div>
                                <div className="form-group col-md-6">
                                    <div className={"floating-label " + ownerState.lastNameCls}>
                                        <input placeholder="Last Name" type="text" name="lastName" value={ownerState.lastName || ''} onChange={(e) => { setOwnerState({ ...ownerState, lastName: e.target.value, lastNameCls: '', lastNameErr: '' }); setOwnerServiceMessage('') }} className="floating-input" />
                                        <label>Last Name</label>
                                        {ownerState.lastNameErr ? <span className="errorValidationMessage"> {ownerState.lastNameErr}</span> : ''}
                                    </div>
                                </div>
                                <div className="form-group col-md-6">
                                    <div className={"floating-label " + ownerState.emailCls}>
                                        <input placeholder="Email Address (Username)" disabled type="email" name="email" value={ownerState.email || ''} onChange={(e) => { setOwnerState({ ...ownerState, email: e.target.value, emailCls: '', emailErr: '' }); setOwnerServiceMessage('') }} className="floating-input" />
                                        <label>Email Address (Username)</label>
                                        {ownerState.emailErr ? <span className="errorValidationMessage"> {ownerState.emailErr}</span> : ''}
                                    </div>
                                </div>
                                <div className="form-group col-md-6">
                                    <div className={"floating-label " + ownerState.phoneCls}>
                                        <input placeholder="Phone Number" type="text" name="phone" value={ownerState.phone || ''} onChange={(e) => { setOwnerState({ ...ownerState, phone: e.target.value, phoneCls: '', phoneErr: '' }); setOwnerServiceMessage('') }} className="floating-input" />
                                        <label>Phone Number</label>
                                        {ownerState.phoneErr ? <span className="errorValidationMessage"> {ownerState.phoneErr}</span> : ''}
                                    </div>
                                </div>
                                <div className="form-group col-md-8">
                                    <div className="">
                                        <label className="font-weight-bold">Business Owner</label>
                                        <div className="form-row">
                                            <div className="col-md-12">
                                                <div className="custom-control custom-radio custom-control-inline">
                                                    <input className="custom-control-input" onChange={() => setOwnerState({ ...ownerState, businessOwner: 1 })} type="radio" name="businessOwner" checked={ownerState.businessOwner === 1 ? true : false} id="Yes" value="1" />
                                                    <label className="custom-control-label" htmlFor="Yes">Yes, I am the owner (or partner) of the business</label>
                                                </div>
                                                <div className="custom-control custom-radio custom-control-inline mt-2">
                                                    <input className="custom-control-input" onChange={() => setOwnerState({ ...ownerState, businessOwner: 0 })} type="radio" name="businessOwner" checked={ownerState.businessOwner === 0 ? true : false} id="No" value="0" />
                                                    <label className="custom-control-label" htmlFor="No">No, I am an employee</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-dark" onClick={() => setOwnerProfileModalShow(false)}>Cancel</button>
                        <button type="button" onClick={(e) => saveOwnerDetail(e)} className="btn btn-primary">Save</button>
                    </Modal.Footer>
                </Modal>

                {/* Change Password Modal*/}
                <Modal show={changePasswordModalShow} onHide={() => setChangePasswordModalShow(false)} className="" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Change Password
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {changePasswordMessage ? <div className="errorCls errCommonCls mb-3"> <img src={ERROR_ICON} alt="" /> {changePasswordMessage} </div> : ""}
                        <form>
                            <div className="row">
                                <div className="form-group col-md-12">
                                    <div className="floating-label ">
                                        <input placeholder="Username" disabled type="text" name="username" value={changePasswordState.username || ''} onChange={(e) => setChangePasswordValue(e, 'email', 50, null)} className="floating-input" />
                                        <label>Username</label>
                                    </div>
                                </div>
                                <div className="form-group col-md-12">
                                    <div className={"floating-label " + changePasswordState.currentPasswordCls}>
                                        <input placeholder="Current Password *" type="password" name="currentPassword" value={changePasswordState.currentPassword || ''} onChange={(e) => setChangePasswordValue(e, 'password', null)} className="floating-input" />
                                        <label>Current Password *</label>
                                        {changePasswordState.currentPasswordErr ? <span className="errorValidationMessage"> {changePasswordState.currentPasswordErr}</span> : ''}
                                    </div>
                                </div>
                                <div className="form-group col-md-12">
                                    <div className={"floating-label " + changePasswordState.newPasswordCls}>
                                        <input placeholder="New Password *" type="password" name="newPassword" value={changePasswordState.newPassword || ''} onChange={(e) => setChangePasswordValue(e, 'password', null)} className="floating-input" />
                                        <label>New Password *</label>
                                        {changePasswordState.newPasswordErr ? <span className="errorValidationMessage"> {changePasswordState.newPasswordErr}</span> : ''}
                                    </div>
                                </div>
                                <div className="form-group col-md-12">
                                    <div className={"floating-label " + changePasswordState.confirmPasswordCls}>
                                        <input placeholder="Confirm Password *" type="password" name="confirmPassword" value={changePasswordState.confirmPassword || ''} onChange={(e) => setChangePasswordValue(e, 'password', null)} className="floating-input" />
                                        <label>Confirm Password *</label>
                                        {changePasswordState.confirmPasswordErr ? <span className="errorValidationMessage"> {changePasswordState.confirmPasswordErr}</span> : ''}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-dark" onClick={() => setChangePasswordModalShow(false)}>Cancel</button>
                        <button type="button" onClick={(e) => changePassword(e)} className="btn btn-primary">Save</button>
                    </Modal.Footer>
                </Modal>

                {/* Business Profile Modal*/}
                <Modal show={businessProfileModalShow} onHide={() => setBusinessProfileModalShow(false)} size="lg" className="" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {businessProfileState.orgId !== 1 ? businessProfileState.businessName : 'Add Business Information'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {businessProfileMessage ? <div className="errorCls errCommonCls mb-3"> <img src={ERROR_ICON} alt="" /> {businessProfileMessage} </div> : ""}
                        <form>
                            {businessProfileState.orgId !== 1 ?
                                '' : <div className="row">
                                    <div className="col-md-8">
                                        <div className={"floating-label " + businessProfileState.businessNameCls}>
                                            <input placeholder="Business Name" type="text" disabled={businessProfileState.orgId !== 1 ? true : false} name="businessName" value={businessProfileState.businessName || ''} onChange={(e) => setBusinessProfileValue(e, 'string', 50, null)} className="floating-input" />
                                            <label>Business Name</label>
                                            {businessProfileState.businessNameErr ? <span className="errorValidationMessage"> {businessProfileState.businessNameErr}</span> : ''}
                                        </div>
                                    </div>
                                </div>}
                            <div className="row">
                                <div className="col-md-6">
                                    <div className={"floating-label " + businessProfileState.emailCls}>
                                        <input placeholder="Email Address" type="email" name="email" value={businessProfileState.email || ''} onChange={(e) => setBusinessProfileValue(e, 'email', null, null)} className="floating-input" />
                                        <label>Email Address</label>
                                        {businessProfileState.emailErr ? <span className="errorValidationMessage"> {businessProfileState.emailErr}</span> : ''}
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className={"floating-label " + businessProfileState.phoneCls}>
                                        <input placeholder="Phone Number" type="text" name="phone" value={businessProfileState.phone || ''} onChange={(e) => setBusinessProfileValue(e, 'phoneNumberHyphon', 15, null)} className="floating-input" />
                                        <label>Phone Number</label>
                                        {businessProfileState.phoneErr ? <span className="errorValidationMessage"> {businessProfileState.phoneErr}</span> : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className={"floating-label " + businessProfileState.streetAddressCls}>
                                        <input placeholder="Street Address" type="text" name="streetAddress" value={businessProfileState.streetAddress || ''} onChange={(e) => setBusinessProfileValue(e, 'string', null, null)} className="floating-input" />
                                        <label>Street Address</label>
                                        {businessProfileState.streetAddressErr ? <span className="errorValidationMessage"> {businessProfileState.streetAddressErr}</span> : ''}
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className={"floating-label " + businessProfileState.cityCls}>
                                        <input placeholder="City" type="text" name="city" value={businessProfileState.city || ''} onChange={(e) => setBusinessProfileValue(e, 'string', 50, null)} className="floating-input" />
                                        <label>City</label>
                                        {businessProfileState.cityErr ? <span className="errorValidationMessage"> {businessProfileState.cityErr}</span> : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-row">
                                        <div className="col-8">
                                            <div className={"floating-label " + businessProfileState.stateCls}>
                                                <Select
                                                    styles={selectStyle}
                                                    className="floating-select"
                                                    components={{ ValueContainer: CustomValueContainer }}
                                                    options={usaStates}
                                                    isSearchable={false}
                                                    value={businessProfileState.state}
                                                    placeholder="State"
                                                    onChange={(data) => setBusinessProfileState({ ...businessProfileState, state: data, stateCls: '', stateErr: '' })}
                                                />
                                                {businessProfileState.stateErr ? <span className="errorValidationMessage"> {businessProfileState.stateErr}</span> : ''}
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className={"floating-label " + businessProfileState.zipCls}>
                                                <input placeholder="Zip" type="text" name="zip" value={businessProfileState.zip || ''} onChange={(e) => setBusinessProfileValue(e, 'string', 10, null)} className="floating-input" />
                                                <label>Zip</label>
                                                {businessProfileState.zipErr ? <span className="errorValidationMessage"> {businessProfileState.zipErr}</span> : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className={"floating-label " + businessProfileState.countryCls}>
                                        <Select
                                            styles={selectStyle}
                                            className="floating-select"
                                            components={{ ValueContainer: CustomValueContainer }}
                                            options={countryOptions}
                                            isSearchable={false}
                                            value={businessProfileState.country}
                                            placeholder="Country"
                                        />
                                        {businessProfileState.countryErr ? <span className="errorValidationMessage"> {businessProfileState.countryErr}</span> : ''}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="floating-label">
                                        <input placeholder="Website (Optional)" value={businessProfileState.website || ''} onChange={(e) => setBusinessProfileState({ ...businessProfileState, website: e.target.value })} type="text" className="floating-input" />
                                        <label>Website <span>(Optional)</span></label>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="floating-label">
                                        <input placeholder="license #" value={businessProfileState.license_no || ''} onChange={(e) => setBusinessProfileState({ ...businessProfileState, license_no: e.target.value })} type="text" className="floating-input" />
                                        <label>license #</label>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" name="bonded" onChange={(e) => setBusinessProfileState({ ...businessProfileState, bonded: e.target.checked === true ? 1 : 0 })} checked={businessProfileState.bonded} className="custom-control-input" id='flag1' />
                                        <label className="custom-control-label" htmlFor='flag1'>Bonded</label>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" name="insured" onChange={(e) => setBusinessProfileState({ ...businessProfileState, insured: e.target.checked === true ? 1 : 0 })} checked={businessProfileState.insured} className="custom-control-input" id='flag2' />
                                        <label className="custom-control-label" htmlFor='flag2'>Insured</label>
                                    </div>
                                </div>
                                <div className="col-md-9 mt-3">
                                    <div className="company--logo">
                                        <label className="logo-label">Company Logo <span>(Optional)</span></label>
                                        <div className="logo_wrapp">
                                            <div className="logo_imgg"><img src={businessProfileState.companyLogoSrc ? setImagePath(businessProfileState.companyLogoSrc) : setImagePath(BIZZ_LOGO)} alt="" style={{ height: 50, width: 50 }} /></div>
                                            <div className="logo_upload ">
                                                <div className="logo_upload-file">
                                                    <div className="custom-file">
                                                        <input type="file" onChange={(e) => onSelectFile(e)} className="custom-file-input " id="browse-file" accept='image/*' />
                                                        {/* <input type="file" className="custom-file-input" id="customFile" /> */}
                                                        <label className="custom-file-label" htmlFor="customFile">Upload File</label>
                                                    </div>
                                                    {businessProfileState.companyLogo !== '' ?
                                                        <a href="#delete" onClick={(e) => deleteCompanyLogo(e)} className="delete_file"><img src={DELETE_SVG} alt="" /> Delete</a>
                                                        : ''}
                                                </div>
                                                <div className="logo_upload-file-instruction">
                                                    Upload .png, .jpeg, .jpg file with max 10MB size
                                                 </div>
                                                <div className={businessProfileState.companyLogoCls}>
                                                    {businessProfileState.companyLogoErr ? <span className="errorValidationMessage"> {businessProfileState.companyLogoErr}</span> : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer className="mt-3">
                        <button type="button" className="btn btn-dark" onClick={() => setBusinessProfileModalShow(false)}>Cancel</button>
                        <button type="button" onClick={(e) => saveBusinessProfileData(e)} className="btn btn-primary">Save</button>
                    </Modal.Footer>
                </Modal>

                {/** Payment Modal */}
                {paymentDetail && paymentDetail.merchant_id ?
                    <Modal show={paymentModalShow} onHide={() => setPaymentModalShow(false)} className="" centered>
                        <Modal.Header className="payment-modal-header" closeButton>
                            <Modal.Title>
                                Test My Paypal
                                </Modal.Title>
                            <div className="modal-amount">Test Amount: 1.00 USD</div>
                        </Modal.Header>
                        <Modal.Body>
                            {testPaymentMessage ? <div className="errorCls errCommonCls mb-3"> <img src={ERROR_ICON} alt="" /> {testPaymentMessage} </div> : ""}
                            <div className="form-group col-md-12">
                                <PayPalButton
                                    amount="1"
                                    shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                    onButtonReady={() => {
                                        setLoader(false)
                                    }}
                                    onSuccess={(details, data) => {
                                        console.log("Transaction completed by " + JSON.stringify(details), data, details.payer, details.purchase_units);
                                        setLoader(true)
                                        dispatch(makeTestPayment({ payment_response: JSON.stringify(details) }))
                                    }}
                                    onError={(error) => {
                                        setLoader(false)
                                        console.log(error);
                                    }}
                                    options={{
                                        merchantId: paymentDetail.merchant_id,
                                        clientId: constants.PAYPAL_CLIENT_ID,
                                        disableFunding: 'venmo,credit',
                                    }}
                                />
                            </div>
                        </Modal.Body>
                    </Modal>
                    
                    : ''}
                <Footer />

                {/* Subscription Modal*/}
                <SubscriptionPlan loader={(data) => setLoader(data)}
                    openSubscriptionModal={subscriptionModalShow}
                    closeSubscriptionModal={() => setSubscriptionModalShow(false)}
                    updatePlanDetail={() => dispatch(getProfileDetail())}
                    currentPlan={currentPlan}
                />
                
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
                                <div className={"floating-label " + contactFormState.serviceCls}>
                                    <textarea ref={serviceTextRef} className="floating-input floating-textarea" name="service" value={contactFormState.service || ''} onChange={(e) => setServiceValue(e, 'required', null, null)} placeholder="Type service name here"></textarea>
                                    <label>Service Name</label>
                                    {contactFormState.serviceErr ? <span className="errorValidationMessage"> {contactFormState.serviceErr}</span> : ''}
                                </div>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <button type="button" className="btn btn-dark" onClick={() => setServiceModalShow(false)}>Cancel</button>
                            <button type="button" onClick={() => saveServiceData()} className="btn btn-primary">Add</button>
                        </Modal.Footer>
                    </Modal>
                {/* Contact Form Image */}
                <div class="modal fade" id="contact-setting-modal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header p-0">
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body text-center">
                                <img className="contact-set-img" src={setImagePath(CONTACT_FORM_POP)} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const ViewProfile = withRouter(ViewProfilePage)