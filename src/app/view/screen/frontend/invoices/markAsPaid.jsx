import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import ERROR_ICON from '../../../../assets/images/error-icn.svg'
import Modal from "react-bootstrap/Modal";
import { constants, selectStyle } from "../../../../common/constants";
import { usePrevious, setImagePath } from '../../../../common/custom';
import _ from 'lodash';
import { markPaidInvoice } from '../../../../duck/invoice/invoice.action';
import { LIST_INVOICES } from "../../../../routing/routeContants";
import moment from 'moment'
import { validateInputs } from '../../../../common/validation';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CALENDAR from "../../../../assets/images/calendar.png"
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Swal from 'sweetalert2'

export const MarkAsPaid = props => {

    const dispatch = useDispatch();
    const paidOnpickerRef = useRef();
    // Add Quote Accpet
    const [addQuoteAcceptMessage, setQuoteAcceptMessage] = useState();
    const [markPaidState, setMarkPaidStatus] = useState({
        name: '', nameErr: '', nameCls: '', markAsPaid: 1, otherAmount: '', paidOn: '', paidOnCls: '', paidOnErr: '',
        otherAmountCls: '', otherAmountErr: '', paymentMethod:'', paymentMethodErr:'', paymentMethodCls:'',
        paymentOptions: [{ value: "Cash", label: "Cash" }, { value: "Bank Check", label: "Bank Check" },
        { value: "Direct bank deposit", label: "Direct bank deposit" }, { value: "Square, Stripe or similar", label: "Square, Stripe or similar" }, { value: "Other", label: "Other" },]
    })
    const markPaidInvoiceData = useSelector(state => state.invoice.markPaidInvoiceData);
    const prevMarkPaidInvoiceData = usePrevious({ markPaidInvoiceData });

    // Mark As Paid Invoice
    const markPaidInvoiceFunc = () => {
        let error = constants.WRONG_INPUT;
        let otherAmount= markPaidState.otherAmount, otherAmountErr='', otherAmountCls='', 
            paymentMethod= markPaidState.paymentMethod, paymentMethodErr='', paymentMethodCls='',getError = false,
            paidOn = markPaidState.paidOn, paidOnCls = '', markAsPaid= markPaidState.markAsPaid, paidOnErr = '';
        
        if (validateInputs('positiveNumberWithDecimals', otherAmount) === 'empty' && markAsPaid===0) {
            otherAmountErr = 'Please enter amount.';
            otherAmountCls = error
            getError = true;
        } else if (validateInputs('positiveNumberWithDecimals', otherAmount) === false && markAsPaid===0) {
            otherAmountErr = 'Please enter valid amount.';
            otherAmountCls = error
            getError = true;
        } else if (otherAmount.length > 10 && markAsPaid===0) {
            otherAmountErr = 'Please enter maximum 10 number.';
            otherAmountCls = error
            getError = true;
        }

        if (validateInputs('required', paymentMethod) === 'empty') {
            paymentMethodErr = 'Please select payment method.';
            paymentMethodCls = error
            getError = true;
        }

        if (validateInputs('required', (paidOn !== '' ? (paidOn.getDate() + ' ' + paidOn.getMonth()) : '')) === 'empty') {
            paidOnErr = 'Please select paid on.';
            paidOnCls = error
            getError = true;
        }

        setMarkPaidStatus({ ...markPaidState, otherAmountCls, otherAmountErr, paidOnCls, paidOnErr, paymentMethodErr, paymentMethodCls })

        if (getError === false && otherAmountErr === '' && paidOnErr === '' && paymentMethodErr ==='') {
            let data = { id: props.invoiceId, amount_paid: (markPaidState.markAsPaid===1 ? props.totalDue : markPaidState.otherAmount ), paid_on : moment(markPaidState.paidOn).format("YYYY-MM-DD") }
            if(markPaidState.paymentMethod && markPaidState.paymentMethod.value){
                data.paid_by = markPaidState.paymentMethod.value
            }
            let innerHTML = "<h5>Please Confirm</h5><div class='mt-3'> <p>Are you sure you want to mark the invoice as paid ? <br /> <br /> Once submiited, you will not be able make any changes.</p></div>";
            Swal.fire({
                html: innerHTML,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                reverseButtons: true,
                showCloseButton: true,
                customClass: "mycustom-alert",
                cancelButtonClass: 'cancel-alert-note',
            }).then((result) => {
                if (result.value) {
                    props.loader(true)
                    dispatch(markPaidInvoice(data))
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // console.log('cancel')
                }
            })
        }
    }

    // Open Quote Accpet Modal
    useEffect(() => {
        setQuoteAcceptMessage('')
        setMarkPaidStatus({ ...markPaidState, otherAmount: '', otherAmountCls: '', otherAmountErr: '', })
    }, [props.openMarkPaidInvoiceModal]); // eslint-disable-line react-hooks/exhaustive-deps

    // Get props 
    useEffect(() => {
        if (prevMarkPaidInvoiceData && prevMarkPaidInvoiceData.markPaidInvoiceData !== markPaidInvoiceData && props.openMarkPaidInvoiceModal) {
            if (markPaidInvoiceData && _.has(markPaidInvoiceData, 'data') && markPaidInvoiceData.success === true) {
                props.history.push(LIST_INVOICES)
            }
            if (markPaidInvoiceData && _.has(markPaidInvoiceData, 'message') && markPaidInvoiceData.success === false) {
                props.loader(false)
                setQuoteAcceptMessage(markPaidInvoiceData.message)
            }
        }
    }, [prevMarkPaidInvoiceData, markPaidInvoiceData])// eslint-disable-line react-hooks/exhaustive-deps

    // set due date 
    const paidOnSet = (date) => {
        if (date === null) {
            setMarkPaidStatus({ ...markPaidState, paidOn: '', paidOnCls: markPaidState.wrongInput, paidOnErr: 'Please select payment due date' })
        } else {
            setMarkPaidStatus({ ...markPaidState, paidOn: date, paidOnCls: '', paidOnErr: '' })
            /* setServiceMessage('') */
        }
    }

    const dueTimeSelection = () => {
        setTimeout(function () { paidOnpickerRef.current.setOpen(true); }, 100);
    };

    // Change Payment Method 
    const changePaymentFunction = (data) => {
        setMarkPaidStatus({...markPaidState, paymentMethod:data, paymentMethodErr:'', paymentMethodCls:'', paidOnCls: '', paidOnErr: ''})
        setQuoteAcceptMessage('')
    }

    return (
        <Modal show={props.openMarkPaidInvoiceModal} onHide={() => props.closeMarkPaidInvoiceModal()} className="" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Mark as Paid: Invoice {props.invoiceSerialNo}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {addQuoteAcceptMessage ? <div className="errorCls errCommonCls mb-3"><img src={setImagePath(ERROR_ICON)} alt="" />{addQuoteAcceptMessage}</div> : ''}
                <form>
                    <div className="row">
                        <div className="col-12">Mark invoices paid if you collected payments from your customer, in person or via any other methods. </div>
                        <div className="d-flex align-items-center deposit-reqr mb-3 mt-4 pl-0 col-12">
                            <div className="form-group mx-4 mb-0">
                                <div className="custom-control custom-radio custom-control-inline">
                                    <input type="radio" id="receiveYes" onChange={() => setMarkPaidStatus({ ...markPaidState, markAsPaid: 1, otherAmount: '' })} checked={markPaidState.markAsPaid === 1 ? true : false} value="1" name="depositReq" className="custom-control-input" />
                                    <label className="custom-control-label" htmlFor="receiveYes">${props.totalDue}</label>
                                </div>
                                <div className="custom-control custom-radio custom-control-inline">
                                    <input type="radio" id="receiveNo" name="depositReq" onChange={() => setMarkPaidStatus({ ...markPaidState, markAsPaid: 0, otherAmount: '' })} checked={markPaidState.markAsPaid === 0 ? true : false} value="0" className="custom-control-input" />
                                    <label className="custom-control-label" htmlFor="receiveNo">Other</label>
                                </div>
                            </div>
                            <div className="deposit_Usd d-flex align-items-center">
                                <input name="otherAmount" disabled={markPaidState.markAsPaid === 1 ? true : false} onChange={(e) => setMarkPaidStatus({ ...markPaidState, otherAmount: e.target.value, otherAmountCls: '', otherAmountErr: '' })} value={markPaidState.otherAmount} type="number" min="0" className="form-control mr-2" aria-describedby="passwordHelpInline" /> USD
                                    {markPaidState.otherAmountErr ? <div className="quoteDepositErr"> {markPaidState.otherAmountErr}</div> : ''}
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="form-group col-md-5">
                            <div className={"floating-label " + markPaidState.paidOnCls}>
                                <DatePicker
                                    type="text"
                                    name="paidOn"
                                    className={markPaidState.paidOnCls ? "floating-input " + markPaidState.paidOnCls : "floating-input"}
                                    selected={markPaidState.paidOn}
                                    onChange={(date) => paidOnSet(date)}
                                    placeholderText="Paid On *"
                                    ref={paidOnpickerRef}
                                    autoComplete="off"
                                />
                                <div onClick={() => dueTimeSelection()} className="input-calendar-icon"><img src={CALENDAR} alt="" width="20" height="20" /></div>
                                {markPaidState.paidOnErr ? <span className="errorValidationMessage"> {markPaidState.paidOnErr}</span> : ''}
                            </div>
                        </div>
                        <div className="form-group col-md-7">
                            <div className={"floating-label " + markPaidState.paymentMethodCls}>
                                <Select
                                    styles={selectStyle}
                                    className="floating-select"
                                    components={makeAnimated()}
                                    placeholder="Payment Method"
                                    noOptionsMessage={() => "No results found"}
                                    options={markPaidState.paymentOptions}
                                    value={markPaidState.paymentMethod}
                                    onChange={(data) => changePaymentFunction(data)}
                                />
                                {markPaidState.paymentMethodErr ? <span className="errorValidationMessage"> {markPaidState.paymentMethodErr}</span> : ''}
                            </div>
                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-dark" onClick={() => props.closeMarkPaidInvoiceModal()}>Cancel</button>
                <button type="button" onClick={() => markPaidInvoiceFunc()} className="btn btn-primary">Submit</button>
            </Modal.Footer>
        </Modal>
    );
}

export const MarkPaidInvoice = withRouter(MarkAsPaid)