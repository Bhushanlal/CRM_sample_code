import React from "react";
import CROSS_ICON from '../../../../assets/images/cross-icn.svg'
import { NavLink } from "react-router-dom";
import {
    DASHBOARD, LIST_BOOKINGS, LIST_LEADS, LIST_CONTACTS, VIEW_PROFILE, LIST_QUOTES, LIST_INVOICES
} from "../../../../routing/routeContants";
import { setImagePath } from '../../../../common/custom'

export const Navbar = props => {
    const menuCountData = props.entityData;
    return (
        <nav className="site-navbar navbar-expand-lg navbar navbar-light">
            <div className="container">
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className={(props && props.getMainRoute === 'dashboard') ? "nav-item active" : "nav-item"}>
                            <NavLink to={DASHBOARD} className="nav-link">Dashboard</NavLink>
                        </li>
                        <li className={(props && props.getMainRoute === 'contacts') ? "nav-item active" : "nav-item"}>
                            <NavLink to={LIST_CONTACTS} className="nav-link">Contacts <span className="count">({menuCountData && menuCountData.contacts ? menuCountData.contacts : 0 })</span></NavLink>
                        </li>
                        <li className={(props && props.getMainRoute === 'leads') ? "nav-item active" : "nav-item"}>
                            <NavLink to={LIST_LEADS} className="nav-link">Leads {<span className="count">({menuCountData && menuCountData.leads ? menuCountData.leads : 0 })</span>}</NavLink>
                        </li>
                        <li className={(props && props.getMainRoute === 'quotes') ? "nav-item active" : "nav-item"}>
                            <NavLink to={LIST_QUOTES} className="nav-link">Quotes { <span className="count">({menuCountData && menuCountData.quotes ? menuCountData.quotes : 0 })</span>}</NavLink>
                        </li>
                        <li className={(props && props.getMainRoute === 'invoices') ? "nav-item active" : "nav-item"}>
                            <NavLink to={LIST_INVOICES} className="nav-link">Invoices { <span className="count">({menuCountData && menuCountData.invoices ? menuCountData.invoices : 0 })</span>}</NavLink>
                        </li>
                        <li className={(props && props.getMainRoute === 'bookings') ? "nav-item active" : "nav-item"}>
                            <NavLink to={LIST_BOOKINGS} className="nav-link">Bookings {<span className="count">({menuCountData && menuCountData.bookings ? menuCountData.bookings : 0 })</span>}</NavLink>
                        </li>
                        <li className={(props && props.getMainRoute === 'profile') ? "nav-item active" : "nav-item"}>
                            <NavLink to={VIEW_PROFILE} className="nav-link">My Profile</NavLink>
                        </li>
                    </ul>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <img src={setImagePath(CROSS_ICON)} alt="" />
                    </button>
                </div>
            </div>
        </nav>
    );
}