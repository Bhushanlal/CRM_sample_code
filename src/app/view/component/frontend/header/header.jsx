import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, getEntityData, setEntityData } from '../../../../storage/user';
import { userLogout } from '../../../../../app/duck/auth/auth.action';
import MENU_ICON from '../../../../assets/images/menu-icn.svg'
import USER_ICON from '../../../../assets/images/user-icn.svg'
/* import ALERT_CROSS from '../../../../assets/images/alert_cross.png' */
import { Tokens, User } from '../../../../storage/index'
import { LOGIN, VIEW_PROFILE, DASHBOARD } from '../../../../routing/routeContants'
import { withRouter, Link } from 'react-router-dom'
import { setImagePath, usePrevious } from '../../../../common/custom'
import { Loader } from '../loader/loader'
import { Navbar } from '../navbar/navbar'
import { getMenuCount } from "../../../../duck/profile/profile.action";
import _ from 'lodash';
import moment from 'moment'
import Swal from 'sweetalert2'
import { SubscriptionPlan } from "../../../screen/frontend/profile/subscriptionPlans"

export const NewHeader = props => {

    const userData = getUserDetails();
    const [entityDetail, setEntityDetail] = useState(getEntityData());
    const dispatch = useDispatch();
    const [subscriptionModalShow, setSubscriptionModalShow] = useState(false);
    const [loaderOn, setLoaderOn] = useState(false);
    const logoutData = useSelector(state => state.auth.logoutData);
    const prevLogoutData = usePrevious({ logoutData });
    const getMenuCountData = useSelector(state => state.profile.getMenuCountData);
    const prevGetMenuCountData = usePrevious({ getMenuCountData });

    // Check The Logout User Data 
    useEffect(() => {
        if (prevLogoutData && prevLogoutData.logoutData !== logoutData) {
            if (logoutData.success === true || logoutData.success === false) {
                Tokens.removeLocalData();
                props.history.push(LOGIN);
            }
        }
    }, [logoutData, prevLogoutData]);// eslint-disable-line react-hooks/exhaustive-deps

    // Check Free Trial Before 2 Day 
    useEffect(() => {
        if (userData && userData.planData && userData.planData.plan_expiration_date) {
            const curr = moment();
            const date = moment(userData.planData.plan_expiration_date);
            let dayDiffrence = date.diff(curr, 'days');
            if (dayDiffrence === 1 && userData.planComing===0) {
                if (userData.planData.subscription_product_id === 1) {
                    Swal.fire({
                        title: 'Free trial expiring soon',
                        text: 'Your free trial will expire in 2 days. Please subscribe to a plan to continued access.',
                        showCancelButton: true,
                        confirmButtonText: 'View Plans',
                        cancelButtonText: 'Close',
                        reverseButtons: true,
                        showCloseButton: true,
                        customClass: "mycustom-alert",
                        cancelButtonClass: 'cancel-alert-note',
                    }).then((result) => {
                        userData.planComing=1;
                        if (result.value) {
                            setSubscriptionModalShow(true)
                            User.setUserDetails(userData);
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            // console.log('cancel')
                            User.setUserDetails(userData);
                        }
                    })
                }
            }
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    // Get All Entity Data 
    const getEntityDataFunction = () => {
        dispatch(getMenuCount())
    }

    // Get Entity Data 
    useEffect(() => {
        if (prevGetMenuCountData && prevGetMenuCountData.getMenuCountData !== getMenuCountData) {
            if (getMenuCountData && _.has(getMenuCountData, 'data') && getMenuCountData.success === true) {
                setEntityData(getMenuCountData.data.entity_count)
                setEntityDetail(getMenuCountData.data.entity_count)
            }
        }
    }, [getMenuCountData, prevGetMenuCountData]);

    return (
        <>
            <Loader loader={loaderOn ? loaderOn : props.loader} />
            <section id="main-header">

                <header className="site-header">
                    <div className="container">
                        <div className="site-header_wrap">
                            <button onClick={() => getEntityDataFunction()} className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <img src={setImagePath(MENU_ICON)} alt="" />
                            </button>
                            <Link to={DASHBOARD} className="navbar-brand">MyBizz<span>Hive</span></Link>
                            <div className="user-login_nav d-flex align-items-center">
                                {userData && userData.planData && userData.planData.stripe_product_name ?
                                    userData.planData.plan_is_active === 0 ?
                                        <div className="plan-status-header d-none d-lg-flex">
                                            <div className="plan-status">
                                                <div className="plan-status-txt expired">
                                                    <div className="plan-status-box">{userData.planData.subscription_product_id === 1 ? 'Trial Expired' : userData.planData.stripe_product_name + ' Plan Expired'}</div>
                                                    <p>Expired on: {moment(userData.planData.plan_expiration_date).format('MMM DD YYYY')}</p>
                                                </div>
                                                <a href="#openModal" onClick={(e) => { e.preventDefault(); setSubscriptionModalShow(true) }} className="text-link"> {userData.planData.subscription_product_id === 1 ? 'View' : 'Renew'} Plans</a>
                                            </div>
                                        </div>
                                        : userData.planData.plan_is_active === 1 && userData.planData.subscription_product_id === 1 ?
                                            <div className="plan-status-header d-none d-lg-flex">
                                                <div className="plan-status">
                                                    <div className="plan-status-txt">
                                                        <div className="plan-status-box">FREE Trial: {userData.planData && userData.planData.trial_product_type === 4 ? 'Platinum' : 'Gold'}</div>
                                                        <p>Expires on: {moment(userData.planData.plan_expiration_date).format('MMM DD YYYY')}</p>
                                                    </div>
                                                    <a href="#openModal" onClick={(e) => { e.preventDefault(); setSubscriptionModalShow(true) }} className="text-link"> View Plans</a>
                                                </div>
                                            </div>
                                            : ''
                                    : ''}
                                <div className="btn-group user-login_dropdown">
                                    <button type="button" className="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <img src={setImagePath(USER_ICON)} className="avatar-img" alt="" /> <span>{userData && userData.firstName && userData.firstName !== null && (userData.firstName).trim() !== '' ? (userData.firstName + (userData.lastName !== null ? ' ' + userData.lastName : '')) : (userData && userData.email)}</span>
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-right">
                                        <Link to={VIEW_PROFILE} className="dropdown-item">Profile</Link>
                                        {/* <Link to={VIEW_PROFILE} className="dropdown-item">Account Settings</Link> */}
                                        <button type="button" onClick={() => dispatch(userLogout())} className="dropdown-item">Sign out</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                {/* <div className="plan-expire-alert">
                    <div className="alert alert-info plan-alert" role="alert">
                        Your free trial will expire in 2 days/soon. Please subscribe to a plan to continued access.
                        <div className="alert-btns">
                            <a href="#google" className="text-link">View Plans</a>
                            <a href="#google" className="close-link"><img src={setImagePath(ALERT_CROSS)} alt="" /></a>
                        </div>
                    </div>
                </div> */}
                <Navbar getMainRoute={props.getMainRoute} entityData={entityDetail} />
            </section>
            {/* Subscription Modal*/}
            <SubscriptionPlan loader={(data) => setLoaderOn(data)}
                openSubscriptionModal={subscriptionModalShow}
                closeSubscriptionModal={() => setSubscriptionModalShow(false)}
                updatePlanDetail={() => { setSubscriptionModalShow(false); setLoaderOn(false) }}
                currentPlan={userData && userData.planData}
            />
        </>
    );
}

export const Header = withRouter(NewHeader)