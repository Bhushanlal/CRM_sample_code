import React, { useEffect } from "react";

export const Footer = props => {

    useEffect(() => {
        if (window.Tawk_API !== undefined && typeof window.Tawk_API.hideWidget === 'function') {
            window.Tawk_API.showWidget();
        }else{
            window.Tawk_API = {};
            window.Tawk_LoadStart = new Date();
            (function () {
                var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
                s1.async = true;
                s1.src = 'https://embed.tawk.to/5ff2b4b1df060f156a94134a/1er613l9p';
                s1.charset = 'UTF-8';
                s1.setAttribute('crossorigin', '*');
                s1.setAttribute('tawk', 'yes'); //This line is used to mark tawk script
                s0.parentNode.insertBefore(s1, s0);
            })();
        }
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <footer className="bizzfooter">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-7">
                        <ul className="footer-links">
                            <li><a href="#howItWorks" onClick={(e) => { e.preventDefault(); props.scrollTo('howItWorksRef') }}>How it works</a></li>
                            <li><a href="#featureSection" onClick={(e) => { e.preventDefault(); props.scrollTo('featureRef') }}>Features</a></li>
                            <li><a href="#bizzHivePlans" onClick={(e) => { e.preventDefault(); props.scrollTo('planRef') }}>Plans</a></li>
                            <li><a href="#footerContact" onClick={(e) => { e.preventDefault(); props.scrollTo('contactRef') }}>Contact</a></li>
                            <li><a href="#faqSection" onClick={(e) => { e.preventDefault(); props.scrollTo('faqRef') }}>FAQ</a></li>
                            <li><a href="#email" onClick={(e) => e.preventDefault()}>Contacts</a></li>
                            <li><a href="#email" onClick={(e) => e.preventDefault()}>Leads</a></li>
                            <li><a href="#email" onClick={(e) => e.preventDefault()}>Quotes</a></li>
                            <li><a href="#email" onClick={(e) => e.preventDefault()}>Invoices</a></li>
                            <li><a href="#email" onClick={(e) => e.preventDefault()}>Bookings</a></li>
                        </ul>
                    </div>
                    <div className="col-md-5 order-md-first">
                        <div className="footer-logo">
                            <a href="#mybizzHive" onClick={(e) => e.preventDefault()} className="navbar-brand">MyBizz<span>Hive</span></a>
                            <p>© 2020 MyBizzHive. All rights reserved</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}