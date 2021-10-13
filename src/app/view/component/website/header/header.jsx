import React from "react";
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { REGISTER, LOGIN } from '../../../../routing/routeContants'

export const NewHeader = props => {

    return (
        <header className="main-header">
            <div className="container">
                <div className="header-row">
                    <div className="header-logo"><a href="#mybizzHive" onClick={(e) => {e.preventDefault(); props.scrollTo('top') }} className="navbar-brand">MyBizz<span>Hive</span></a></div>
                    <nav className="header-nav navbar navbar-expand-lg navbar-light">
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent" ref={props.headRef}>
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0" id="scrolNav">
                                <li className={props.classAtive==='howItWorks' ? "nav-item active" : "nav-item"}>
                                    <a className="nav-link" href="#howItWorks" onClick={(e) => {e.preventDefault(); props.scrollTo('howItWorksRef') }}>How it works</a>
                                </li>
                                <li className={props.classAtive==='feature' ? "nav-item active" : "nav-item"}>
                                    <a className="nav-link" href="#featureSection" onClick={(e) => {e.preventDefault(); props.scrollTo('featureRef') }}>Features</a>
                                </li>
                                <li className={props.classAtive==='plan' ? "nav-item active" : "nav-item"}>
                                    <a className="nav-link" href="#bizzHivePlans" onClick={(e) => {e.preventDefault(); props.scrollTo('planRef') }}>Plans</a>
                                </li>
                                <li className={props.classAtive==='faq' ? "nav-item active" : "nav-item"}>
                                    <a className="nav-link" href="#faqSection" onClick={(e) => {e.preventDefault(); props.scrollTo('faqRef') }}>FAQs</a>
                                </li>
                                <li className={props.classAtive==='contact' ? "nav-item active" : "nav-item"}>
                                    <a className="nav-link" href="#footerContact" onClick={(e) => {e.preventDefault(); props.scrollTo('contactRef') }}>Contact</a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <div className="header--start-trialbtn"><Link to={LOGIN} className="py-2 px-4 mr-2 font-weight-bold text-link">Sign In</Link><Link to={REGISTER} className="btn btn-primary font-weight-bold">Start Free Trial</Link></div>
                </div>
            </div>
        </header>
    );
}

export const Header = withRouter(NewHeader)