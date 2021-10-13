import React, { useEffect } from "react";
import { getCurrentSession } from "../../../../common/custom"

export function Footer() {

    useEffect(() => {
        if (
            window.Tawk_API !== undefined &&
            typeof window.Tawk_API.hideWidget === 'function'
        ) {
            window.Tawk_API.hideWidget();
        }
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="row align-items-center">
                    <ul className="footer-row">
                        <li>Copyright {getCurrentSession()} MyBizzHive LLC. All Rights Reserved.</li>
                        <li><a href="#email" onClick={(e) => e.preventDefault()}>contact@mybizzhive.com</a></li>

                    </ul>
                    <ul className="footer-row footer-social-icn">
                        <li><a href="https://www.facebook.com/mybizzhive" target="_blank" className="text-light"><i className="fab fa-facebook-f facebook"></i></a></li>
                        <li> <a href="https://www.pinterest.com/mybizzhive" target="_blank" className="text-light"><i className="fab fa-pinterest pinterest"></i></a></li>
                        <li><a href="https://www.twitter.com/mybizzhive" target="_blank" className="text-light"><i className="fab fa-twitter twitter"></i></a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}