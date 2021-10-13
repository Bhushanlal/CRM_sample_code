import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../../component/frontend/auth/header/header';
import { Footer } from '../../../component/frontend/auth/footer/footer';
import { constants } from '../../../../common/constants';
import { fieldValidator, usePrevious } from '../../../../common/custom';
import { validateInputs } from '../../../../common/validation';
import { resetPassword } from '../../../../duck/auth/auth.action';

import { Link, withRouter } from "react-router-dom";
import { LOGIN } from '../../../../routing/routeContants';

import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import _ from 'lodash';
import { setImagePath } from '../../../../common/custom'


export const NewResetPassword = props => {
    let token;
    const dispatch = useDispatch();
    const resetPasswordData = useSelector(state => state.auth.resetPasswordData);
    const prevResetPasswordData = usePrevious({ resetPasswordData });

    if (props.match && _.has(props.match, 'params') && _.has(props.match.params, 'token')) {
        token = props.match.params.token;
    }
    const [state, setState] = useState({
        password: "", confirmPassword: "", passwordCls: "", passwordErr: "", confirmPasswordCls: "", confirmPasswordErr: "", correctInput: constants.RIGHT_INPUT, wrongInput: constants.WRONG_INPUT
    });
    const [serviceMessage, setServiceMessage] = useState('');
    const [loader, setLoader] = useState(false);

    const resetForm = () => {
        setState({ password: "", confirmPassword: "", passwordCls: "", passwordErr: "", confirmPasswordCls: "", confirmPasswordErr: "", correctInput: constants.RIGHT_INPUT, wrongInput: constants.WRONG_INPUT })
    }

    // Check The Reset Data 
    useEffect(() => {
        if (prevResetPasswordData && prevResetPasswordData.resetPasswordData !== resetPasswordData) {
            if (resetPasswordData && _.has(resetPasswordData, 'data') && resetPasswordData.success === true) {
                resetForm();
                setServiceMessage('')
                setLoader(false)
                props.history.push(LOGIN)
            }
            if (resetPasswordData && _.has(resetPasswordData, 'message') && resetPasswordData.success === false) {
                setServiceMessage(resetPasswordData.message)
                setLoader(false)
            }
        }
    }, [resetPasswordData, prevResetPasswordData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Check Validation Function 
    const checkValidation = (field, value, type, maxLength, minLength) => {
        return fieldValidator(field, value, type, state.password, maxLength, minLength)
    }

    // Set The Reset Input Values
    const setInputValue = (e, type, maxLength, minLength) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
        setState({ ...state, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        setServiceMessage('')
    }

    // Reset Passsword Function
    const resetPasswordSubmit = () => {
        let success = '';
        let error = state.wrongInput;
        let password = state.password, confirmPassword = state.confirmPassword,
            passwordCls = success, passwordErr = '', confirmPasswordCls = success, confirmPasswordErr = '', getError = false;

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
            confirmPasswordErr = 'Please enter confirm password.';
            confirmPasswordCls = error;
            getError = true;
        } else if (password !== confirmPassword) {
            confirmPasswordErr = 'Password and confirm password does not match.';
            confirmPasswordCls = error;
            getError = true;
        }

        setState({ ...state, passwordCls, passwordErr, confirmPasswordCls, confirmPasswordErr })

        if (getError === false && passwordErr === '' && confirmPasswordErr === '') {
            setLoader(true)
            dispatch(resetPassword({ password, token }))
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
                                        <h5>Reset Password</h5>
                                        {serviceMessage ? <div className="errorCls errCommonCls"><img src={setImagePath(ERROR_ICON)} alt="" />{serviceMessage}</div> : ''}
                                    </div>
                                    <div className="card-body">
                                        <form>
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
                                            <div className="form-group">
                                                <button type="button" onClick={() => resetPasswordSubmit()} className="btn btn-block btn-primary">Submit</button>
                                            </div>
                                            <p className=" text-center">Already a BizzHive member?  <Link to={LOGIN}>Sign in.</Link></p>
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

export const ResetPassword = withRouter(NewResetPassword)