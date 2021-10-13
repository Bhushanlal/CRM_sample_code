import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import Modal from "react-bootstrap/Modal";
import { constants, selectStyle } from "../../../../common/constants";
import { usePrevious, setImagePath } from '../../../../common/custom';
import moment from 'moment'
import _ from 'lodash';
import { getStateTax, createSubscritpionPlan, getSubscritpionPlan, updateSubscritpionPlan, planApplyCoupon } from '../../../../duck/profile/profile.action';
import { validateInputs } from '../../../../common/validation';
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getUserDetails, setUserDetails } from '../../../../storage/user';
import Swal from 'sweetalert2'

export const NewSubscriptionPlans = props => {

    const dispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();

    const [subscriptionMessage, setSubscriptionMessage] = useState();
    const textPlan = { 2: <p><strong>Silver plan helps you get organized</strong> with Contacts, Leads, Tasks, Notes & Bookings modules.</p>, 3: <p><strong>Gold plan helps you get organized & look professional</strong> with Contacts, Leads, Bookings, Tasks, Notes & Quotes modules.</p>, 4: <p><strong>Platinum plan helps you get organized & grow your business</strong> with Contacts, Leads, Bookings,Tasks, Notes Quotes & Invoices modules.</p> };
    const [subscriptionState, setsubscriptionState] = useState({
        subscriptionPlan: [], planDuration: [], selectedPlanPrice: 0, formStep: 0, selectedPlan: '',
        selectedDuration: '', name: '', nameErr: '', nameCls: '', selectedTaxState: '', taxStateOptions: [],
        selectedDurationErr: '', selectedDurationCls: '', selectedPlanCls: '', selectedPlanErr: '', selectedTaxStateErr: '',
        selectedTaxStateCls: '', subscriptionData: [], totalPrice: 0, disableButton: true, taxTotal: 0, orgData: '',
        couponCode: '', showApplyCoupon: false, selectedCouponCode: '', selectedCouponPercent: '', couponCodeCls: '', couponCodeErr: '',
        selectedCouponPrice: ''
    })

    const getStateTaxData = useSelector(state => state.profile.getStateTaxData);
    const prevGetStateTaxData = usePrevious({ getStateTaxData });

    const getSubscriptionPlanData = useSelector(state => state.profile.getSubscriptionPlanData);
    const prevGetSubscriptionPlanData = usePrevious({ getSubscriptionPlanData });

    const createSubscriptionPlanData = useSelector(state => state.profile.createSubscriptionPlanData);
    const prevCreateSubscriptionPlanData = usePrevious({ createSubscriptionPlanData });

    const planApplyCouponData = useSelector(state => state.profile.planApplyCouponData);
    const prevPlanApplyCouponData = usePrevious({ planApplyCouponData });

    const CARD_ELEMENT_OPTIONS = {
        iconStyle: "solid",
        hidePostalCode: true,
        style: {
            base: {
                color: '#817F80',
                '::placeholder': {
                    color: '#817F80',
                },
            },
        },
    };

    // Open Subscription modal
    useEffect(() => {
        let selectedPlan = '';
        setSubscriptionMessage('')
        if (props.currentPlan && props.currentPlan.subscription_product_id) {
            selectedPlan = { value: props.currentPlan.subscription_product_id, label: props.currentPlan.stripe_product_name }
        }

        setsubscriptionState({
            ...subscriptionState, selectedPlanPrice: 0, formStep: 0, selectedPlan,
            selectedDuration: '', name: '', nameErr: '', nameCls: '', selectedTaxState: '',
            selectedDurationErr: '', selectedDurationCls: '', selectedPlanCls: '', selectedPlanErr: '', selectedTaxStateErr: '',
            selectedTaxStateCls: '', totalPrice: 0, taxTotal: 0, disableButton: true, showApplyCoupon: false, selectedCouponCode: '', selectedCouponPercent: '',
            couponCodeCls: '', couponCodeErr: '', selectedCouponPrice: ''
        })
        if (props.openSubscriptionModal) {
            props.loader(true)
            dispatch(getSubscritpionPlan());
            dispatch(getStateTax());
        }
    }, [props.openSubscriptionModal]); // eslint-disable-line react-hooks/exhaustive-deps

    // Get State Props
    useEffect(() => {
        if (prevGetStateTaxData && prevGetStateTaxData.getStateTaxData !== getStateTaxData) {
            if (getStateTaxData && _.has(getStateTaxData, 'data') && getStateTaxData.success === true) {
                props.loader(false)
                let stateOptions = _.map(getStateTaxData.data, (val) => { return { value: val.id, label: val.state_name, tax: val.tax_rate } })
                let selectTax = _.find(stateOptions, { 'label': (subscriptionState.orgData && subscriptionState.orgData.state) })
                setsubscriptionState({ ...subscriptionState, taxStateOptions: stateOptions, selectedTaxState: selectTax !== undefined ? selectTax : '' })
            }
            if (getStateTaxData && _.has(getStateTaxData, 'message') && getStateTaxData.success === false) {
                props.loader(false)
                setSubscriptionMessage(getStateTaxData.message)
            }
        }
        if (prevCreateSubscriptionPlanData && prevCreateSubscriptionPlanData.createSubscriptionPlanData !== createSubscriptionPlanData) {
            if (createSubscriptionPlanData && _.has(createSubscriptionPlanData, 'data') && createSubscriptionPlanData.success === true) {
                let userPlan = createSubscriptionPlanData.data
                let userData = getUserDetails();
                userData.plan = createSubscriptionPlanData.data.subscription_princing_plan
                userData.userPlan = { id: userPlan.id, is_active: userPlan.is_active, is_trail: userPlan.is_trail, response: userPlan.response, plan_expiration_date: userPlan.plan_expiration_date, }
                setUserDetails(userData)
                if (createSubscriptionPlanData.user_preferences && (createSubscriptionPlanData.user_preferences).length > 0) {
                    props.updatePlanDetail(createSubscriptionPlanData.user_preferences[0])
                } else {
                    props.updatePlanDetail('')
                }
                props.closeSubscriptionModal()
            }
            if (createSubscriptionPlanData && _.has(createSubscriptionPlanData, 'message') && createSubscriptionPlanData.success === false) {
                props.loader(false)
                setSubscriptionMessage(createSubscriptionPlanData.message)
            }
        }

        if (prevGetSubscriptionPlanData && prevGetSubscriptionPlanData.getSubscriptionPlanData !== getSubscriptionPlanData) {
            if (getSubscriptionPlanData && _.has(getSubscriptionPlanData, 'data') && getSubscriptionPlanData.success === true) {
                let subscriptionAllPlan = getSubscriptionPlanData.data && getSubscriptionPlanData.data.subscription_plans;
                let orgData = getSubscriptionPlanData.data && getSubscriptionPlanData.data.user_organization;
                let subPlan = _.map(subscriptionAllPlan, (data) => { return { value: data.id, label: data.stripe_product_name } })
                let allDuration;
                if (props.currentPlan && props.currentPlan.subscription_product_id) {
                    let productFind = _.find(subscriptionAllPlan, { 'id': subscriptionState.selectedPlan.value });
                    allDuration = _.map(productFind && productFind.pricing_plans, (data) => { return { value: data.id, label: '$' + data.final_price, price: data.final_price, duration: data.interval, stripe_price_id: data.stripe_price_id, planDescription: data.plan_description } })
                }
                setsubscriptionState({ ...subscriptionState, subscriptionPlan: subPlan, subscriptionData: subscriptionAllPlan, planDuration: allDuration, orgData })
            }
            if (getSubscriptionPlanData && _.has(getSubscriptionPlanData, 'message') && getSubscriptionPlanData.success === false) {
                props.loader(false)
                setSubscriptionMessage(getSubscriptionPlanData.message)
            }
        }

        if (prevPlanApplyCouponData && prevPlanApplyCouponData.planApplyCouponData !== planApplyCouponData) {
            if (planApplyCouponData && _.has(planApplyCouponData, 'data') && planApplyCouponData.success === true) {
                let total = 0, taxTotal = 0;
                if (subscriptionState.selectedTaxState && subscriptionState.selectedTaxState.tax) {
                    total = parseFloat(subscriptionState.selectedTaxState.tax * planApplyCouponData.data.discounted_price / 100) + parseFloat(planApplyCouponData.data.discounted_price)
                    taxTotal = parseFloat(subscriptionState.selectedTaxState.tax * planApplyCouponData.data.discounted_price / 100)
                }
                props.loader(false)
                setsubscriptionState({ ...subscriptionState, selectedCouponCode: planApplyCouponData.data.code, selectedCouponPercent: planApplyCouponData.data.percent_off, selectedPlanPrice: planApplyCouponData.data.discounted_price, totalPrice: total, taxTotal, selectedCouponPrice: (parseFloat(planApplyCouponData.data.pricing_plan_price) - parseFloat(planApplyCouponData.data.discounted_price)) })
            }
            if (planApplyCouponData && _.has(planApplyCouponData, 'message') && planApplyCouponData.success === false) {
                props.loader(false)
                setSubscriptionMessage(planApplyCouponData.message)
            }
        }
    }, [prevGetStateTaxData, getStateTaxData, prevCreateSubscriptionPlanData, createSubscriptionPlanData, prevGetSubscriptionPlanData, getSubscriptionPlanData, prevPlanApplyCouponData, planApplyCouponData]); // eslint-disable-line react-hooks/exhaustive-deps

    // On Plan Change 
    const onChangePlan = (data) => {
        let dis = true
        if (subscriptionState.selectedDuration && subscriptionState.selectedDuration.value && subscriptionState.selectedTaxState && subscriptionState.selectedTaxState.tax) {
            dis = false
        }
        let productFind = _.find(subscriptionState.subscriptionData, { 'id': data.value });
        let allDuration = _.map(productFind.pricing_plans, (data) => { return { value: data.id, label: '$' + data.final_price, price: data.final_price, duration: data.interval, stripe_price_id: data.stripe_price_id, planDescription: data.plan_description } })
        setsubscriptionState({
            ...subscriptionState, planDuration: allDuration, selectedPlan: data, selectedDuration: '', selectedDurationCls: '', selectedDurationErr: '', selectedPlanCls: '', selectedPlanErr: '', selectedPlanPrice: 0, totalPrice: 0, disableButton: dis, couponCode: '', showApplyCoupon: false,
            selectedCouponCode: '', selectedCouponPercent: '', couponCodeCls: '', couponCodeErr: '', selectedCouponPrice: ''
        })
    }

    // On Duration Change
    const onChangeDuration = (data) => {
        let total = 0, taxTotal = 0, dis = true
        if (subscriptionState.selectedTaxState && subscriptionState.selectedTaxState.tax) {
            total = parseFloat(subscriptionState.selectedTaxState.tax * data.price / 100) + parseFloat(data.price)
            taxTotal = parseFloat(subscriptionState.selectedTaxState.tax * data.price / 100)
        }
        if (subscriptionState.selectedPlan && subscriptionState.selectedPlan.value && subscriptionState.selectedTaxState && subscriptionState.selectedTaxState.tax) {
            dis = false
        }
        if (props.currentPlan && props.currentPlan.plan_is_active === 1 && props.currentPlan.subscription_product_id !== 1 && props.currentPlan.subscription_status === 'active') {
            setsubscriptionState({ ...subscriptionState, selectedPlanPrice: data.price, selectedDuration: data, selectedDurationCls: '', selectedDurationErr: '', totalPrice: total, disableButton: dis, taxTotal })
        } else {
            setsubscriptionState({ ...subscriptionState, selectedPlanPrice: data.price, selectedDuration: data, selectedDurationCls: '', selectedDurationErr: '', totalPrice: total, disableButton: dis, taxTotal, couponCode:'', showApplyCoupon: true, selectedCouponCode: '', selectedCouponPercent: '', couponCodeCls: '', couponCodeErr: '', selectedCouponPrice: '' })
        }
    }

    // On Create Subscription
    const createSubscription = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            setSubscriptionMessage('Stripe is not working. Refresh the page.');
        } else {
            props.loader(true)
            const card = elements.getElement(CardElement);
            const result = await stripe.createToken(card);
            if (result.error) {
                setSubscriptionMessage(result.error && result.error.message);
                props.loader(false)
            } else {
                setSubscriptionMessage('')
                let data = { plan_id: (subscriptionState.selectedPlan && (subscriptionState.selectedPlan).value), pricing_plan_id: (subscriptionState.selectedDuration && (subscriptionState.selectedDuration).value), card_token: result.token.id, state_id: subscriptionState.selectedTaxState.value }
                if (props.currentPlan && props.currentPlan.plan_is_active === 1 && props.currentPlan.subscription_product_id !== 1 && props.currentPlan.subscription_status === 'active') {
                    dispatch(updateSubscritpionPlan(data))
                } else {
                    if (subscriptionState.selectedCouponCode !== '') {
                        data.coupon_code = subscriptionState.selectedCouponCode
                    }
                    dispatch(createSubscritpionPlan(data))
                }
            }
        }
    }

    // Continue to payment
    const continueToPayment = () => {
        let error = constants.WRONG_INPUT;
        let selectedPlan = subscriptionState.selectedPlan, selectedDuration = subscriptionState.selectedDuration, selectedDurationCls = '', selectedDurationErr = '',
            selectedPlanCls = '', selectedPlanErr = '', selectedTaxState = subscriptionState.selectedTaxState,
            selectedTaxStateErr = '', selectedTaxStateCls = '', getError = false;

        if (validateInputs('required', selectedPlan) === 'empty') {
            selectedPlanErr = "Please select plan.";
            selectedPlanCls = error;
            getError = true;
        }
        if (validateInputs('required', selectedDuration) === 'empty') {
            selectedDurationErr = "Please select duration.";
            selectedDurationCls = error;
            getError = true;
        }
        if (validateInputs('required', selectedTaxState) === 'empty') {
            selectedTaxStateErr = "Please select state.";
            selectedTaxStateCls = error;
            getError = true;
        }

        setsubscriptionState({
            ...subscriptionState, selectedDurationErr, selectedDurationCls, selectedPlanErr, selectedPlanCls, selectedTaxStateErr, selectedTaxStateCls
        })

        if (getError === false && selectedDurationErr === '' && selectedPlanErr === '' && selectedTaxStateErr === '') {
            if (props.currentPlan && props.currentPlan.subscription_product_id !== 1) {
                let msg = "Are you sure you want to change your subscription from <strong>" + (props.currentPlan.stripe_product_name + ' $' + props.currentPlan.plan_price + '/' + props.currentPlan.plan_interval) + "</strong> to <strong>" + (subscriptionState.selectedPlan.label + ' ' + subscriptionState.selectedDuration.label) + "</strong>? <br /><br /> You will be moved to the new plan immidiately. Any unused amount from the previous subscription will be credited to your next billing cycle.<br /><br /> Do you want to proceed with the change?"
                Swal.fire({
                    title: 'Change Plan',
                    html: msg,
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    reverseButtons: true,
                    showCloseButton: true,
                    customClass: "mycustom-alert",
                    cancelButtonClass: 'cancel-alert-note',
                }).then((result) => {
                    if (result.value) {
                        setSubscriptionMessage('')
                        setsubscriptionState({ ...subscriptionState, formStep: 1 })
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        // console.log('cancel')
                    }
                })
            } else {
                setsubscriptionState({ ...subscriptionState, formStep: 1 })
            }
        }
    }

    // On Change Tax State
    const onChangeState = (data) => {
        let total = 0, taxTotal = 0, dis = true
        if (subscriptionState.selectedPlan && subscriptionState.selectedPlan.value && subscriptionState.selectedDuration && subscriptionState.selectedDuration.value) {
            dis = false
        }
        if (subscriptionState.selectedPlanPrice !== '') {
            taxTotal = parseFloat(data.tax * subscriptionState.selectedPlanPrice / 100)
            total = parseFloat(data.tax * subscriptionState.selectedPlanPrice / 100) + parseFloat(subscriptionState.selectedPlanPrice)
        }
        setsubscriptionState({ ...subscriptionState, selectedTaxState: data, selectedTaxStateCls: '', selectedTaxStateErr: '', totalPrice: total, disableButton: dis, taxTotal })
    }

    // Apply Coupon Function 
    const applyCouponFunction = (e) => {
        e.preventDefault();
        let error = constants.WRONG_INPUT;
        let couponCode = subscriptionState.couponCode, couponCodeCls = '', couponCodeErr = '', getError = false;

        if (validateInputs('required', couponCode) === 'empty') {
            couponCodeErr = "Please enter coupon code.";
            couponCodeCls = error;
            getError = true;
        }

        setsubscriptionState({
            ...subscriptionState, couponCodeErr, couponCodeCls,
        })

        if (getError === false && couponCodeErr === '') {
            props.loader(true)
            setSubscriptionMessage('')
            dispatch(planApplyCoupon({ pricing_plan_id: (subscriptionState.selectedDuration && (subscriptionState.selectedDuration).value), coupon_code: subscriptionState.couponCode }))
        }
    }

    // Cancel Coupon Function 
    const cancelCouponFuntion = (e) => {
        e.preventDefault();
        setSubscriptionMessage('')
        let total = 0, taxTotal = 0;
        if (subscriptionState.selectedTaxState && subscriptionState.selectedTaxState.tax) {
            total = parseFloat(subscriptionState.selectedTaxState.tax * subscriptionState.selectedDuration.price / 100) + parseFloat(subscriptionState.selectedDuration.price)
            taxTotal = parseFloat(subscriptionState.selectedTaxState.tax * subscriptionState.selectedDuration.price / 100)
        }
        setsubscriptionState({ ...subscriptionState, selectedCouponCode: '', selectedCouponPercent: '', selectedPlanPrice: subscriptionState.selectedDuration && subscriptionState.selectedDuration.price, totalPrice: total, taxTotal, couponCode: '', selectedCouponPrice: '' })
    }

    return (
        <>
            <Modal show={props.openSubscriptionModal} id="SubscriptionPopUp" onHide={() => props.closeSubscriptionModal()} className="modal-md-lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {props.currentPlan && props.currentPlan.plan_is_active === 1 && props.currentPlan.subscription_product_id !== 1 && props.currentPlan.subscription_status === 'active' ? 'Change Plan' : 'Subscribe to MyBizzHive'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {subscriptionMessage ? <div className="errorCls errCommonCls mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{subscriptionMessage}</div> : ''}
                    <div className=" subscribe--plans">
                        {subscriptionState.formStep === 0 ?
                            <>
                                <div className="row">
                                    <div className="col-12">
                                        <label className="planlabel">Select Plan & Term</label>
                                        <div className="selectgroup w-100">
                                            {_.map(subscriptionState.subscriptionPlan, (sub, k) => {
                                                return <label className="selectgroup-item" key={k}>
                                                    <input type="radio" name="product" value={sub.id} onChange={() => onChangePlan(sub)} checked={subscriptionState.selectedPlan.value === sub.value ? true : false} className="selectgroup-input" />
                                                    <span className="selectgroup-button">{sub.label}</span>
                                                </label>
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="plan-descptn">
                                            {subscriptionState.selectedPlan && subscriptionState.selectedPlan.value ?
                                                <>
                                                    {textPlan && textPlan[subscriptionState.selectedPlan.value] ? textPlan[subscriptionState.selectedPlan.value] : ''}
                                                    <div className="selectgroup w-100">
                                                        {_.map(subscriptionState.planDuration, (plan, p) => {
                                                            return <label className={props.currentPlan && props.currentPlan.subscription_product_id !== 1 && plan.stripe_price_id === props.currentPlan.stripe_price_id ? "selectgroup-item current--plan" : "selectgroup-item"} key={p}>
                                                                {props.currentPlan && props.currentPlan.subscription_product_id !== 1 && plan.stripe_price_id === props.currentPlan.stripe_price_id ? <div className="current">Current</div> : ''}
                                                                <input type="radio" value={plan.id} disabled={props.currentPlan && props.currentPlan.subscription_product_id !== 1 && plan.stripe_price_id === props.currentPlan.stripe_price_id ? true : false} onChange={() => onChangeDuration(plan)} checked={subscriptionState.selectedDuration === plan ? true : false} className="selectgroup-input" />
                                                                <span className="selectgroup-button">{plan.label}<span>/{plan.duration} <strong>{(plan.planDescription !== null ? plan.planDescription : '')}</strong></span></span>
                                                            </label>
                                                        })}
                                                    </div>
                                                </>
                                                : ''
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="plan-descptndetails">
                                            <div className='plan-select-tate'>
                                                <Select
                                                    styles={selectStyle}
                                                    className="floating-select"
                                                    components={makeAnimated()}
                                                    placeholder="Select State"
                                                    value={subscriptionState.selectedTaxState}
                                                    noOptionsMessage={() => "No results found"}
                                                    options={subscriptionState.taxStateOptions}
                                                    onChange={(data) => onChangeState(data)}
                                                />
                                            </div>
                                            <div className="plan-txss">Taxes <span>${(subscriptionState.taxTotal).toFixed(2)} USD</span></div>
                                        </div>
                                        {subscriptionState.showApplyCoupon ?
                                            <div className="plan-descptndetails apply-coupon">
                                                <div className={"totalduetoday " + subscriptionState.couponCodeCls}>
                                                    <input type="text" onChange={(e) => setsubscriptionState({ ...subscriptionState, couponCode: e.target.value, couponCodeCls: '', couponCodeErr: '' })} value={subscriptionState.couponCode} placeholder="Coupon Name" className="form-control" />
                                                    {subscriptionState.couponCodeErr ? <span className="errorValidationMessage"> {subscriptionState.couponCodeErr}</span> : ''}
                                                </div>
                                                {subscriptionState.selectedCouponCode === '' ?
                                                    <button className="btn" type="button" onClick={(e) => applyCouponFunction(e)}>Apply</button>
                                                    :
                                                    <button className="btn" type="button" onClick={(e) => cancelCouponFuntion(e)}>Cancel</button>
                                                }
                                            </div> : ''
                                        }
                                        {subscriptionState.selectedCouponPercent !== '' ?
                                            <div className="plan-descptndetails">
                                                <div className="d-flex align-items-center coupon-discount">
                                                    <div className="totalduetoday">
                                                        Discount
                                                    </div>
                                                    <div className="plan-txss"><span>-${(subscriptionState.selectedCouponPrice).toFixed(2)} USD</span></div>
                                                </div>
                                            </div>
                                            : ''}
                                        <div className="plan-descptndetails">
                                            <div className="totalduetoday">
                                                Total Due Today
                                            </div>
                                            <div className="plan-totalprices"><span>${(subscriptionState.totalPrice).toFixed(2)}</span> USD</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12 text-right my-4">
                                        <button type="button" onClick={() => props.closeSubscriptionModal()} className="btn btn-dark">Cancel</button>
                                        <button type="button" onClick={() => continueToPayment()} disabled={subscriptionState.disableButton} className="btn btn-primary ml-2">{props.currentPlan && props.currentPlan.subscription_product_id !== 1 ? 'Continue' : 'Continue to Payment'}</button>
                                    </div>
                                </div>
                            </>
                            :
                            <div className="subscription-collapse-row">
                                <div className="subsc-collapse-btn pb-4 pt-0" >
                                    <div className="collapsetilte">{subscriptionState.selectedPlan && subscriptionState.selectedPlan.label} <span>({subscriptionState.selectedDuration && subscriptionState.selectedDuration.duration === 'year' ? 'Yearly' : subscriptionState.selectedDuration.duration === 'month' ? 'Monthly' : subscriptionState.selectedDuration.duration})</span><p>Auto-renews on <strong> {moment().add(1, subscriptionState.selectedDuration && subscriptionState.selectedDuration.duration === 'year' ? 'Y' : subscriptionState.selectedDuration && subscriptionState.selectedDuration.duration === 'month' ? 'M' : 'd').format('ll')} </strong> </p> </div>  <div className="subscription-tab-price">${(subscriptionState.totalPrice).toFixed(2)} <span>USD</span></div>
                                </div>
                                <div className="subsc-collapse-btn pt-0" >
                                    <div className="collapsetilte">Payment Details</div>
                                </div>

                                <form onSubmit={createSubscription}>
                                    <div className="collapse show" id="subscription-tab2" data-parent="#SubscriptionAccordion">
                                        <div className="form-group">
                                            <CardElement className="form-control" onChange={() => setSubscriptionMessage('')} options={CARD_ELEMENT_OPTIONS} />
                                        </div>
                                    </div>
                                    <p className="d-block sub-term-cond">By clicking on the <strong>Submit</strong> button below. I agree to the MyBizzHive <a href={constants.FRONT_URL + '/terms-and-conditions.html'} rel="noopener noreferrer" target="_blank">Terms & Conditions</a></p>
                                    <div className="row">
                                        <div className="col-12 text-right mt-4 mb-4">
                                            <button type="button" onClick={() => { setsubscriptionState({ ...subscriptionState, formStep: 0 }); setSubscriptionMessage('') }} className="btn btn-dark">Back</button>
                                            <button type="submit" className="btn btn-primary ml-2">Submit</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        }
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export const SubscriptionPlan = withRouter(NewSubscriptionPlans)