import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../../component/frontend/auth/header/header';
import { Footer } from '../../../component/frontend/auth/footer/footer';
import { verifyToken } from '../../../../duck/auth/auth.action';
import { usePrevious } from '../../../../common/custom';
import { Link } from "react-router-dom";
import { LOGIN } from '../../../../routing/routeContants';
import CHECKED_ICON from '../../../../assets/images/checked.svg'
import WARNING_ICON from '../../../../assets/images/warning.svg'
import _ from 'lodash';
import { setImagePath } from '../../../../common/custom'


export const VerifyToken = props => {
    let token;
    const [serviceMessage, setServiceMessage] = useState('');
    const [loader, setLoader] = useState(false);
    const [status, setStatus] = useState(200);
    const dispatch = useDispatch();
    const verifyTokenData = useSelector(state => state.auth.verifyTokenData);
    const prevVerifyTokenData = usePrevious({ verifyTokenData });
    if (props.location && _.has(props.location, 'search')) {
        token = props.location.search;
    }

    useEffect(() => {
        setLoader(true)
        dispatch(verifyToken(token))
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Check The Login User Data 
    useEffect(() => {
        if (prevVerifyTokenData && prevVerifyTokenData.verifyTokenData !== verifyTokenData) {
            if (verifyTokenData && verifyTokenData.success === true) {
                setServiceMessage(verifyTokenData.message)
                setStatus(200)
                setLoader(false)
            } else if (verifyTokenData && verifyTokenData.success === false) {
                setServiceMessage(verifyTokenData.message)
                setStatus(400)
                setLoader(false)
            }
        }
    }, [verifyTokenData, prevVerifyTokenData]);



    return (
        <div className="login_signup main-site">
            <Header loader={loader} />
            <main className="site-body">
                <section className="middle-section">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-5 col-lg-5 col-md-6 col-sm-8">
                                {serviceMessage ?
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-center align-items-center my-4 service--message">
                                                <img src={status === 200 ? setImagePath(CHECKED_ICON) : setImagePath(WARNING_ICON)} alt="" />
                                                <h5>{serviceMessage}</h5>
                                                <Link className="btn btn-primary mt-2" to={LOGIN}>Sign In</Link>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                                }
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
