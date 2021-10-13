import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import DELETE_SVG from "../../../../assets/images/delete-button.svg";
import { constants, selectStyle, CustomValueContainer, usaStates } from "../../../../common/constants";
import { fieldValidator, usePrevious, setImagePath } from '../../../../common/custom';
import Select from "react-select";
import Swal from 'sweetalert2'
import _ from 'lodash';
import Modal from "react-bootstrap/Modal";
import ALERT_ICON from "../../../../assets/images/alert-icn.svg";
import BIZZ_LOGO from "../../../../assets/images/bizz-logo.jpg";
import { validateInputs } from '../../../../common/validation';
import { updateBusinessProfileDetail } from "../../../../duck/profile/profile.action";

export const NewAddOrganization = props => {
    const dispatch = useDispatch();
    // Add Business Information state and props value
    const countryOptions = [{ label: 'USA', value: 'USA' }];
    const [businessProfileMessage, setBusinessProfileMessage] = useState('');
    const [businessProfileState, setBusinessProfileState] = useState({
        businessName: '', email: '', phone: '', city: '', streetAddress: '', state: '', zip: '', country: { value: 'USA', label: 'USA' }, website: '',
        businessNameCls: '', emailCls: '', phoneCls: '', streetAddressCls: '', cityCls: '', stateCls: '', zipCls: '', countryCls: '', companyLogo: '', companyLogoSrc: '',
        businessNameErr: '', emailErr: '', phoneErr: '', streetAddressErr: '', cityErr: '', stateErr: '', zipErr: '', countryErr: '',
        correctInput: '', wrongInput: constants.WRONG_INPUT, orgId: 1, companyLogoErr: '', companyLogoCls: '', license_no: '', bonded: 0, insured: 0
    })
    const businessProfileDetailData = useSelector(state => state.profile.businessProfileDetailData);
    const prevBusinessProfileDetailData = usePrevious({ businessProfileDetailData });
    
    // Set Business Profile Values
      const setBusinessProfileValue = (e, type, maxLength, minLength) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
        setBusinessProfileState({ ...businessProfileState, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        setBusinessProfileMessage('');
    }

    // Check Validation Function 
    const checkValidation = (field, value, type, maxLength, minLength, fieldType) => {
        return fieldValidator(field, value, type, null, maxLength, minLength, fieldType)
    }

    // Get props quote by id and add organization 
    useEffect(() => {
        if (prevBusinessProfileDetailData && prevBusinessProfileDetailData.businessProfileDetailData !== businessProfileDetailData) {
            if (businessProfileDetailData && _.has(businessProfileDetailData, 'data') && businessProfileDetailData.success === true) {
                props.loader(false)
                props.closeOrg()
                props.sentToCustomerCall(businessProfileDetailData.data)
            }
            if (businessProfileDetailData && _.has(businessProfileDetailData, 'message') && businessProfileDetailData.success === false) {
                props.loader(false)
                setBusinessProfileMessage(businessProfileDetailData.message)
            }
        }
       
    }, [prevBusinessProfileDetailData, businessProfileDetailData])// eslint-disable-line react-hooks/exhaustive-deps

  

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
        }else if (zip.length > 10) {
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
            let innerHTML = "<h5><img src=" + setImagePath(ALERT_ICON) + "> Confirm Business Name</h5><div class='mt-3'> <p>Business name you entered <strong>" + businessName + "</strong></p><p>Please confirm if your business name is accurate, once <strong>submitted you will not be able to change the business name.</strong> </p></div>";
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
                    props.loader(true)
                    dispatch(updateBusinessProfileDetail(businessProfileData))
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // console.log('cancel')
                }
            })
        }
    }

    // Delete company logo
    const deleteCompanyLogo = (e) => {
        e.preventDefault();
        setBusinessProfileState({ ...businessProfileState, companyLogo: '', companyLogoSrc: '', companyLogoErr: '', companyLogoCls: '' })
    }

    return (
       
        <Modal show={props.openOrg} onHide={() => props.closeOrg()} size="lg" className="" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Add Business Information
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {businessProfileMessage ? <div className="errorCls errCommonCls mb-3"> <img src={ERROR_ICON} alt="" /> {businessProfileMessage} </div> : ""}
                <form>
                    <div className="row">
                        <div className="col-md-8">
                            <div className={"floating-label " + businessProfileState.businessNameCls}>
                                <input placeholder="Business Name" type="text" disabled={businessProfileState.orgId !== 1 ? true : false} name="businessName" value={businessProfileState.businessName || ''} onChange={(e) => setBusinessProfileValue(e, 'string', 50, null)} className="floating-input" />
                                <label>Business Name</label>
                                {businessProfileState.businessNameErr ? <span className="errorValidationMessage"> {businessProfileState.businessNameErr}</span> : ''}
                            </div>
                        </div>
                    </div>
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
                                <input type="checkbox" name="bonded" onChange={(e) => setBusinessProfileState({...businessProfileState, bonded: e.target.checked === true ? 1 : 0 })} checked={businessProfileState.bonded} className="custom-control-input" id='flag1' /> 
                                <label className="custom-control-label" htmlFor='flag1'>Bonded</label>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" name="insured" onChange={(e) => setBusinessProfileState({...businessProfileState, insured: e.target.checked === true ? 1 : 0 })} checked={businessProfileState.insured} className="custom-control-input" id='flag2'/>
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
                <button type="button" className="btn btn-dark" onClick={() => props.closeOrg()}>Cancel</button>
                <button type="button" onClick={(e) => saveBusinessProfileData(e)} className="btn btn-primary">Save</button>
            </Modal.Footer>
        </Modal>
    );
}

export const AddOrganization = withRouter(NewAddOrganization)