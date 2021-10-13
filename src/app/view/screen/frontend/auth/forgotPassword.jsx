import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../../component/frontend/auth/header/header';
import { Footer } from '../../../component/frontend/auth/footer/footer';
import { Link } from "react-router-dom";
import { REGISTER, LOGIN } from '../../../../routing/routeContants';
import { constants } from '../../../../common/constants';
import { fieldValidator, usePrevious } from '../../../../common/custom';
import { validateInputs } from '../../../../common/validation';
import { forgotPassword } from '../../../../duck/auth/auth.action';
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import _ from 'lodash';
import { setImagePath } from '../../../../common/custom'


export const ForgotPassword = props => {
    const dispatch = useDispatch();
    const forgotPasswordData = useSelector(state => state.auth.forgotPasswordData);
    const prevForgotPasswordData = usePrevious({ forgotPasswordData });

    const [state, setState] = useState({
        email: "", emailCls: '', emailErr: '', correctInput: constants.RIGHT_INPUT, wrongInput: constants.WRONG_INPUT
    });
    const [serviceMessage, setServiceMessage] = useState('');
    const [loader, setLoader] = useState(false);

    const resetForgotPasswordForm = () => {
        setState({ email: "", emailCls: '', emailErr: '', correctInput: constants.RIGHT_INPUT, wrongInput: constants.WRONG_INPUT })
    }

    // Check The Forgot Password Data 
    useEffect(() => {
        if (prevForgotPasswordData && prevForgotPasswordData.forgotPasswordData !== forgotPasswordData) {
            if (forgotPasswordData && _.has(forgotPasswordData, 'data') && forgotPasswordData.success === true) {
                resetForgotPasswordForm();
                setServiceMessage('')
                setLoader(false)
            }
            if (forgotPasswordData && _.has(forgotPasswordData, 'message') && forgotPasswordData.success === false) {
                setServiceMessage(forgotPasswordData.message)
                setLoader(false)
            }
        }
    }, [forgotPasswordData, prevForgotPasswordData]);

    // Check Validation Function 
    const checkValidation = (field, value, type, maxLength, minLength) => {
        return fieldValidator(field, value, type, null, maxLength, minLength)
    }

    // Set The Forgot Input Values
    const setInputValue = (e, type, maxLength, minLength) => {
        let error = checkValidation(e.target.name, e.target.value, type, maxLength, minLength)
        setState({ ...state, [e.target.name]: e.target.value, [error.fieldNameErr]: error.errorMsg, [error.fieldCls]: error.setClassName });
        setServiceMessage('');
    }

    // Forgot Passsword Function
    const forgotPasswordSubmit = () => {
        let success = '';
        let error = state.wrongInput;
        let email = state.email, emailCls = success, emailErr = '', getError = false;

        if (validateInputs('email', email) === 'empty') {
            emailErr = 'Please enter email.';
            emailCls = error
            getError = true;
        } else if (validateInputs('email', email) === false) {
            emailErr = 'Please enter valid email.';
            emailCls = error
            getError = true;
        }

        setState({ ...state, emailCls, emailErr })

        if (getError === false && emailErr === '') {
            setLoader(true)
            dispatch(forgotPassword({ email }))
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
                                        <h5>Forgot Password</h5>
                                        <p className="mb-0 mt-4">We will email you a link that you can use to reset your password. Please enter the email you used to create the account</p>
                                        {serviceMessage ? <div className="errorCls errCommonCls"><img src={setImagePath(ERROR_ICON)} alt="" />{serviceMessage}</div> : ''}
                                    </div>
                                    <div className="card-body">
                                        <form>
                                            <div className={"form-group floating-label " + state.emailCls}>
                                                <input name="email" type="email" value={state.email} onChange={(e) => setInputValue(e, 'email', null, null)} className="floating-input" placeholder="Email" />
                                                <label htmlFor="exampleFormControlInput1">Email</label>
                                                {state.emailErr ? <span className="errorValidationMessage"> {state.emailErr}</span> : ''}
                                            </div>
                                            <div className="form-group">
                                                <button type="button" onClick={() => forgotPasswordSubmit()} className="btn btn-block btn-primary">Submit</button>
                                            </div>
                                            <p className=" text-center">Already a MyBizzHive member? <Link to={LOGIN}> Sign In</Link></p>
                                            <p className=" text-center">Don’t have a MyBizzHive account?<Link to={REGISTER}> FREE Sign Up</Link></p>
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
