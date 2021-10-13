import React, {useState, useEffect} from "react";
import { Header } from '../../../component/frontend/auth/header/header';
import { Footer } from '../../../component/frontend/auth/footer/footer';
import { LOGIN } from '../../../../routing/routeContants';
import CHECKED_ICON from '../../../../assets/images/checked.svg'
import WARNING_ICON from '../../../../assets/images/warning.svg'
import { setImagePath } from '../../../../common/custom'
import { constants } from '../../../../common/constants'


export const AcceptQuoteMessagePage = props => {

    const [state, setState] = useState({
        quoteStatus: '', quoteMessage: ''
    });

    // On Load Get Data
    useEffect(() => {
        if (props.history.location && props.history.location.state && props.history.location.state.quoteAcceptState) {
            setState({ ...state, quoteStatus: props.history.location.state.quoteAcceptState, quoteMessage : props.history.location.state.quoteMessage })
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="login_signup main-site">
            <Header />
            <main className="site-body">
                <section className="middle-section">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-xl-5 col-lg-5 col-md-6 col-sm-8">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-center align-items-center my-4 service--message">
                                            <img src={state.quoteStatus ? setImagePath(CHECKED_ICON) : setImagePath(WARNING_ICON)} alt="" />
                                            <h5 className="text-center">{state.quoteStatus ? state.quoteMessage : '404 Page Not Found.'}</h5>
                                            <a className="btn btn-primary mt-2" href={state.quoteStatus ? constants.FRONT_URL : LOGIN}>{state.quoteStatus ? 'OK' : 'Continue to Login'}</a>
                                        </div>
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
