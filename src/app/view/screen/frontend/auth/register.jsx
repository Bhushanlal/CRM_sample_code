import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../../component/frontend/auth/header/header';
import { Footer } from '../../../component/frontend/auth/footer/footer';
import { Link, withRouter } from "react-router-dom";
import { LOGIN, DASHBOARD } from '../../../../routing/routeContants';
import { fieldValidator, usePrevious } from '../../../../common/custom';
import { constants } from '../../../../common/constants';
import { validateInputs } from '../../../../common/validation';
import { registration } from '../../../../duck/auth/auth.action';
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import _ from 'lodash';
import { setImagePath } from '../../../../common/custom'
import { Tokens, User } from '../../../../storage/index'
import history from '../../../../routing/history'

export const NewRegister = props => {
    const dispatch = useDispatch();
    const registerData = useSelector(state => state.auth.registerData);
    const prevRegisterData = usePrevious({ registerData });

    // Set initial State Value  
    const [state, setState] = useState({
        email: "", password: "", confirmPassword: "", emailCls: '', emailErr: '', passwordCls: "", passwordErr: "", confirmPasswordCls: "", confirmPasswordErr: "",
        correctInput: constants.RIGHT_INPUT, wrongInput: constants.WRONG_INPUT
    });
    const [loader, setLoader] = useState(false);
    const [serviceMessage, setServiceMessage] = useState('');

    // After Save Check The Register Data
    useEffect(() => {
        if (prevRegisterData && prevRegisterData.registerData !== registerData) {
            if (registerData && _.has(registerData, 'data') && registerData.success === true) {
                async function setTokenAfterRegistration() {
                    await Tokens.setToken(registerData.access_token);
                    let userData = {
                        planComing:0,
                        name: registerData.data && registerData.data.firstName ? registerData.data.firstName : '',
                        email: registerData.data && registerData.data.email ? registerData.data.email : '',
                        id: registerData.data && registerData.data.id ? registerData.data.id : '',
                        firstName: registerData.data && registerData.data.first_name ? registerData.data.first_name : '',
                        lastName: registerData.data && registerData.data.last_name ? registerData.data.last_name : '',
                        welcome: registerData.data && registerData.data.welcome===0 ? registerData.data.welcome : 1,
                    }
                    User.setUserDetails(userData);
                    User.setEntityData(registerData.entity_count);
                    setServiceMessage('');
                    history.push(DASHBOARD);
                }
                setTokenAfterRegistration()
            }
            if (registerData && _.has(registerData, 'message') && registerData.success === false) {
                setServiceMessage(registerData.message)
                setLoader(false)
            }
        }
    }, [registerData, prevRegisterData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Check Validation Function 
    const checkValidation = (field, value, type, maxLength, minLength) => {
        return fieldValidator(field, value, type, state.password, maxLength, minLength)
    }

    // Set The Login Input Values
    const setInputValue = (e, type, maxLength, minLength) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
        if (error.errorMsg === 'Please enter confirm password.') {
            error.errorMsg = 'Please confirm password.'
        }
        if (error.errorMsg === 'Please enter valid confirm password.') {
            error.errorMsg = 'Please make sure your passwords match. '
        }
        setState({ ...state, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        setServiceMessage('');
    }

    // Submit Registration Function
    const saveUserData = () => {
        let success = '';
        let error = state.wrongInput;
        let email = state.email, password = state.password, confirmPassword = state.confirmPassword, emailCls = success,
            passwordCls = success, emailErr = '', passwordErr = '', confirmPasswordCls = success, confirmPasswordErr = '', getError = false;

        if (validateInputs('email', email) === 'empty') {
            emailErr = 'Please enter email.';
            emailCls = error
            getError = true;
        } else if (validateInputs('email', email) === false) {
            emailErr = 'Please enter valid email.';
            emailCls = error
            getError = true;
        }

        if (validateInputs('password', password) === 'empty') {
            passwordErr = 'Please enter password.';
            passwordCls = error;
            getError = true;
        } else if (validateInputs('password', password) === false) {
            passwordErr = 'A special character, an upper case, a lower case, a number & minimum 8 character are required';
            passwordCls = error;
            getError = true;
        }

        if (confirmPassword === '') {
            confirmPasswordErr = 'Please confirm password.';
            confirmPasswordCls = error;
            getError = true;
        } else if (password !== confirmPassword) {
            confirmPasswordErr = 'Please make sure your passwords match.';
            confirmPasswordCls = error;
            getError = true;
        }

        setState({ ...state, emailCls, emailErr, passwordCls, passwordErr, confirmPasswordCls, confirmPasswordErr })

        if (getError === false && emailErr === '' && passwordErr === '' && confirmPasswordErr === '') {
            setLoader(true)
            dispatch(registration({ email, password, password_confirmation: confirmPassword }))
        }
    }

    return (
        <div className="login_signup main-site">
            <Header loader={loader} />
            <main className="site-body">
                <section className="middle-section">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-5 col-lg-5 col-md-6 col-sm-8">
                                <div className="card">
                                    <div className="card-header">
                                        <h5>FREE Sign-up with MyBizzHive</h5>
                                        {serviceMessage ? <div className="errorCls errCommonCls"><img src={setImagePath(ERROR_ICON)} alt="" />{serviceMessage}</div> : ''}
                                    </div>
                                    <div className="card-body">
                                        <div className={"form-group floating-label " + state.emailCls}>
                                            <input type="email" name="email" value={state.email} onChange={(e) => setInputValue(e, 'email', null, null)} className="floating-input" placeholder="Email" />
                                            <label htmlFor="exampleFormControlInput1">Email</label>
                                            {state.emailErr ? <span className="errorValidationMessage"> {state.emailErr}</span> : ''}
                                        </div>
                                        <div className={"form-group floating-label " + state.passwordCls}>
                                            <input type="password" name="password" value={state.password} onChange={(e) => setInputValue(e, 'password', null, null)} className="floating-input" placeholder="Password" />
                                            <label htmlFor="exampleFormControlInput1">Password</label>
                                            {state.passwordErr ? <span className="errorValidationMessage"> {state.passwordErr}</span> : ''}
                                        </div>
                                        <div className={"form-group floating-label " + state.confirmPasswordCls}>
                                            <input type="password" name="confirmPassword" value={state.confirmPassword} onChange={(e) => setInputValue(e, 'password', null, null)} className="floating-input" placeholder="Confirm Password" />
                                            <label htmlFor="exampleFormControlInput1">Confirm Password</label>
                                            {state.confirmPasswordErr ? <span className="errorValidationMessage"> {state.confirmPasswordErr}</span> : ''}
                                        </div>
                                        <p>By signing up, you agree to MyBizzHive <a href={constants.FRONT_URL+'/terms-and-conditions.html'} rel="noopener noreferrer" target="_blank">Terms & Conditions</a></p>
                                        <div className="form-group">
                                            <button type="button" onClick={() => saveUserData()} className="btn btn-block btn-primary">Sign up</button>
                                        </div>
                                        <p className=" text-center">Already a MyBizzHive member?  <Link to={LOGIN}>Sign In</Link></p>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export const Register = withRouter(NewRegister)