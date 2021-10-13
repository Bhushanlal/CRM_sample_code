import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../../component/frontend/auth/header/header';
import { Footer } from '../../../component/frontend/auth/footer/footer';
import { Link, withRouter } from "react-router-dom";
import { REGISTER, FORGOT_PASSWORD, LOGIN } from '../../../../routing/routeContants';
import { fieldValidator, usePrevious } from '../../../../common/custom';
import { constants } from '../../../../common/constants';
import { validateInputs } from '../../../../common/validation';
import { userLogin, resendEmailVerification } from '../../../../duck/auth/auth.action';
import { Tokens, User } from '../../../../storage/index'
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import _ from 'lodash';
import { setImagePath } from '../../../../common/custom'

export const NewLogin = props => {

    const dispatch = useDispatch();
    const loginData = useSelector(state => state.auth.loginData);
    const prevLoginData = usePrevious({ loginData });
    const emailVerificationData = useSelector(state => state.auth.emailVerificationData);
    const prevEmailVerificationData = usePrevious({ emailVerificationData });

    // Set initial State Value  
    const [state, setState] = useState({
        email: "", password: "", emailCls: '', emailErr: '', passwordCls: "", passwordErr: "",
        correctInput: constants.RIGHT_INPUT, wrongInput: constants.WRONG_INPUT
    });
    const [serviceMessage, setServiceMessage] = useState('');
    const [rememberme, setRememberme] = useState(false);
    const [loader, setLoader] = useState(false);

    // Remember me functionality
    const setCookie = (cname, cvalue, exdays) => {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    const getCookie = (cname) => {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    const deleteCookie = (cname) => {
        document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
    };

    // Set The Remember Me Value On Load
    useEffect(() => {
        const email = getCookie("email");
        const pass = getCookie("pass");
        if (email !== '' && pass !== '') {
            var email_decrypted = atob(email);
            var password_decrypted = atob(pass);
            setState(state => ({ ...state, email: email_decrypted, password: password_decrypted }));
            setRememberme(true);
        }
    }, []);

    // Check The Login User Data 
    useEffect(() => {
        if (prevLoginData && prevLoginData.loginData !== loginData) {
            if (loginData && _.has(loginData, 'data') && loginData.success === true) {
                Tokens.setToken(loginData.access_token);
                const getUserData = User.getUserDetails();
                let userData = {
                    planComing:0,
                    name: loginData.data && loginData.data.firstName ? loginData.data.firstName : '',
                    email: loginData.data && loginData.data.email ? loginData.data.email : '',
                    id: loginData.data && loginData.data.id ? loginData.data.id : '',
                    firstName: loginData.data && loginData.data.first_name ? loginData.data.first_name : '',
                    lastName: loginData.data && loginData.data.last_name ? loginData.data.last_name : '',
                    welcome: loginData.data && loginData.data.welcome===0 ? loginData.data.welcome : 1,
                }
                if(getUserData && getUserData.planData){
                    userData.planData = getUserData.planData
                }
                User.setUserDetails(userData);
                User.setEntityData(loginData.entity_count);
                //Remeber Me 
                if (rememberme === true) {
                    var email_encrypted = btoa(state.email);
                    var password_encrypted = btoa(state.password);
                    setCookie("email", email_encrypted, 7);
                    setCookie("pass", password_encrypted, 7);
                } else {
                    deleteCookie("email")
                    deleteCookie("pass")
                }
                setServiceMessage('');
                props.history.push(LOGIN);
            }
            if (loginData && _.has(loginData, 'message') && loginData.success === false) {
                if (loginData.message === 'EmailVerificationRequired') {
                    let message = <div>Email is not verified. To resend the email verification <a href="#emailVerification" onClick={(e) => emailVerification(e)} >Click Here</a></div>;
                    setServiceMessage(message)
                } else {
                    setServiceMessage(loginData.message)
                }
                setLoader(false)
            }
        }
    }, [loginData, prevLoginData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Check Validation Function 
    const checkValidation = (field, value, type, maxLength, minLength) => {
        return fieldValidator(field, value, type, state.password, maxLength, minLength)
    }

    // Set The Login Input Values
    const setInputValue = (e, type, maxLength, minLength) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
        setState({ ...state, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        setServiceMessage('');
    }

    // Login Function
    const login = () => {
        let success = '';
        let error = state.wrongInput;
        let email = state.email, password = state.password, emailCls = success,
            passwordCls = success, emailErr = '', passwordErr = '', getError = false;

        if (validateInputs('email', email) === 'empty') {
            emailErr = 'Please enter email.';
            emailCls = error
            getError = true;
        } else if (validateInputs('email', email) === false) {
            emailErr = 'Please enter valid email.';
            emailCls = error
            getError = true;
        }

        if (validateInputs('required', password) === 'empty') {
            passwordErr = 'Please enter password.';
            passwordCls = error;
            getError = true;
        }

        setState({ ...state, emailCls, emailErr, passwordCls, passwordErr })

        if (getError === false && emailErr === '' && passwordErr === '') {
            setLoader(true)
            dispatch(userLogin({ email, password }))
        }
    }

    // Email Verification 
    const emailVerification = (e) => {
        let email = state.email;
        setLoader(true);
        dispatch(resendEmailVerification({ email }));

    }

    // Check The Email Verification User Data 
    useEffect(() => {
        if (prevEmailVerificationData && prevEmailVerificationData.emailVerificationData !== emailVerificationData) {
            if (emailVerificationData && _.has(emailVerificationData, 'data') && emailVerificationData.success === true) {
                setLoader(false)
                setServiceMessage('')
            }
            if (emailVerificationData && _.has(emailVerificationData, 'message') && emailVerificationData.success === false) {
                setServiceMessage(emailVerificationData.message)
                setLoader(false)
            }
        }
    }, [emailVerificationData, prevEmailVerificationData]);// eslint-disable-line react-hooks/exhaustive-deps

    // On Enter Sign In 
    const keyPressDownEvent = (e) => {
        if (e.key === 'Enter') {
            login();
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
                                        <h5>Sign In</h5>
                                        {serviceMessage ? <div className="errorCls errCommonCls"><img src={setImagePath(ERROR_ICON)} alt="" />{serviceMessage}</div> : ''}
                                    </div>
                                    <div className="card-body">
                                        <form>
                                            <div className={"form-group floating-label " + state.emailCls}>
                                                <input type="email" onKeyDown={(e) => keyPressDownEvent(e)} name="email" value={state.email} onChange={(e) => setInputValue(e, 'email', null, null)} className="floating-input" placeholder="Email" />
                                                <label htmlFor="exampleFormControlInput1">Email</label>
                                                {state.emailErr ? <span className="errorValidationMessage"> {state.emailErr}</span> : ''}
                                            </div>
                                            <div className={"form-group floating-label " + state.passwordCls}>
                                                <input onKeyDown={(e) => keyPressDownEvent(e)} className="floating-input" type="password" name="password" value={state.password} onChange={(e) => setInputValue(e, 'required', null, null)} placeholder="Password" id="Password" />
                                                <label htmlFor="Password">Password</label>
                                                {state.passwordErr ? <span className="errorValidationMessage"> {state.passwordErr}</span> : ''}
                                            </div>
                                            <div className="form-row align-items-center">
                                                <div className="form-group col-6">
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox" checked={rememberme} onChange={(e) => setRememberme(e.target.checked)} className="custom-control-input" id="customCheck3" />
                                                        <label className="custom-control-label" htmlFor="customCheck3">Remember me</label>
                                                    </div>
                                                </div>
                                                <div className="form-group text-right col-6">
                                                    <Link to={FORGOT_PASSWORD}>Forgot Password?</Link>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <button type="button" onClick={() => login()} className="btn btn-block btn-primary">Sign In</button>
                                            </div>
                                            <p className=" text-center">Don’t have a MyBizzHive account? <Link to={REGISTER}>FREE Sign Up</Link></p>
                                        </form>

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

export const Login = withRouter(NewLogin)